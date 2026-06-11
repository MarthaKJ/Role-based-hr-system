'use client';

import { useMemo } from 'react';
import { useRequests } from '@/context/requests-context';
import { useEmployees } from '@/context/employees-context';
import { usePayslips } from '@/context/payslips-context';
import { useStore } from '@/context/store-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FileText,
  ClipboardCheck,
  DollarSign,
  ArrowUpRight,
  Calendar,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-300 dark:hover:bg-yellow-950/50';
    case 'rejected':
      return 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/50';
    default:
      return 'bg-muted text-foreground hover:bg-muted';
  }
};

export default function AdminDashboard() {
  const { leaveRequests, paymentRequests } = useRequests();
  const { employees } = useEmployees();
  const { payslips } = usePayslips();
  const { requests: storeRequests } = useStore();

  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const pendingLeave = leaveRequests.filter((r) => r.status === 'pending').length;
    const pendingPayments = paymentRequests.filter((r) => r.status === 'pending').length;
    const pendingStore = storeRequests.filter((r) => r.status === 'pending').length;
    const pendingApprovals = pendingLeave + pendingPayments + pendingStore;
    const monthlyPayroll = payslips.reduce((sum, p) => sum + p.netSalary, 0);
    return { totalEmployees, pendingApprovals, monthlyPayroll, payslipCount: payslips.length };
  }, [leaveRequests, paymentRequests, storeRequests, employees, payslips]);

  const recentActivity = useMemo(() => {
    const leaveActivity = leaveRequests.map((r) => ({
      id: `L-${r.id}`,
      type: 'Leave Request' as const,
      icon: Calendar,
      employeeId: r.employeeId,
      summary: `${r.type.charAt(0).toUpperCase() + r.type.slice(1)} leave for ${r.days} ${r.days === 1 ? 'day' : 'days'}`,
      date: r.appliedOn,
      status: r.status,
    }));
    const paymentActivity = paymentRequests.map((r) => ({
      id: `P-${r.id}`,
      type: 'Payment Request' as const,
      icon: CreditCard,
      employeeId: r.employeeId,
      summary: `${r.title} — $${r.amount.toLocaleString()}`,
      date: r.date,
      status: r.status,
    }));
    return [...leaveActivity, ...paymentActivity]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [leaveRequests, paymentRequests]);

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees.toString(),
      icon: Users,
      href: '/dashboard/admin/employees',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toString(),
      icon: ClipboardCheck,
      href: '/dashboard/admin/approvals',
      highlight: stats.pendingApprovals > 0,
    },
    {
      title: 'Payslips Generated',
      value: stats.payslipCount.toString(),
      icon: FileText,
      href: '/dashboard/admin/payslips',
    },
    {
      title: 'Monthly Payroll',
      value: `$${stats.monthlyPayroll.toLocaleString()}`,
      icon: DollarSign,
      href: '/dashboard/admin/payslips',
    },
  ];

  const employeeName = (employeeId: string) =>
    employees.find((e) => e.id === employeeId)?.name ?? 'Unknown';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage employees, payslips, and company-wide HR operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group h-full cursor-pointer border border-border bg-card p-5 shadow-none transition-all hover:border-blue-300 hover:shadow-sm dark:hover:border-blue-700">
                <div className="flex items-start justify-between">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  {stat.highlight ? (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50">
                      Action needed
                    </Badge>
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stat.value}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border border-border bg-card p-6 shadow-none">
        <h3 className="mb-4 text-base font-semibold text-foreground">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/admin/approvals">
            <Button className="gap-2">
              <ClipboardCheck size={16} />
              Review Approvals
              {stats.pendingApprovals > 0 && (
                <Badge className="ml-1 bg-white/20 text-white hover:bg-white/20">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/dashboard/admin/employees">
            <Button variant="outline">Manage Employees</Button>
          </Link>
          <Link href="/dashboard/admin/payslips">
            <Button variant="outline">Generate Payslips</Button>
          </Link>
          <Link href="/dashboard/admin/reports">
            <Button variant="outline">View Reports</Button>
          </Link>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
          <Link
            href="/dashboard/admin/approvals"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all
          </Link>
        </div>
        {recentActivity.length === 0 ? (
          <div className="px-8 py-12 text-center text-sm text-muted-foreground">
            No recent activity yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <tr
                      key={activity.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {activity.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {employeeName(activity.employeeId)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {activity.summary}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(activity.date)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
