'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    title: 'Total Employees',
    value: '156',
    icon: Users,
    href: '/dashboard/admin/employees',
  },
  {
    title: 'Pending Payslips',
    value: '12',
    icon: FileText,
    href: '/dashboard/admin/payslips',
  },
  {
    title: 'Pending Approvals',
    value: '8',
    icon: AlertCircle,
    href: '/dashboard/admin/approvals',
  },
  {
    title: 'This Month Revenue',
    value: '$45.2K',
    icon: TrendingUp,
    href: '/dashboard/admin/reports',
  },
];

const recentActivities = [
  {
    id: '1',
    type: 'Leave Request',
    employee: 'John Doe',
    action: 'Applied for annual leave',
    date: '2026-04-25',
    status: 'pending',
  },
  {
    id: '2',
    type: 'Payslip Generated',
    employee: 'Jane Smith',
    action: 'Payslip generated for April 2026',
    date: '2026-04-24',
    status: 'completed',
  },
  {
    id: '3',
    type: 'Salary Advance',
    employee: 'Mike Johnson',
    action: 'Requested salary advance of $10,000',
    date: '2026-04-23',
    status: 'pending',
  },
  {
    id: '4',
    type: 'Leave Approved',
    employee: 'Sarah Williams',
    action: 'Leave request approved for May 1-5',
    date: '2026-04-22',
    status: 'completed',
  },
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-300 dark:hover:bg-yellow-950/50';
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50';
    default:
      return 'bg-muted text-foreground hover:bg-muted';
  }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage employees, payslips, and company-wide HR operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group h-full cursor-pointer border border-border bg-card p-5 shadow-none transition-all hover:border-blue-300 hover:shadow-sm dark:hover:border-blue-700">
                <div className="flex items-start justify-between">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
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
          <Link href="/dashboard/admin/employees">
            <Button>Add Employee</Button>
          </Link>
          <Link href="/dashboard/admin/payslips">
            <Button variant="outline">Generate Payslips</Button>
          </Link>
          <Link href="/dashboard/admin/reports">
            <Button variant="outline">View Reports</Button>
          </Link>
          <Link href="/dashboard/admin/settings">
            <Button variant="outline">Settings</Button>
          </Link>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">Recent Activities</h3>
        </div>
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
                  Action
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
              {recentActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                >
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-muted text-foreground hover:bg-muted">
                      {activity.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {activity.employee}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{activity.action}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{activity.date}</td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusBadgeColor(activity.status)}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
