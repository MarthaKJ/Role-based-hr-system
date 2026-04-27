'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    title: 'Total Employees',
    value: '156',
    icon: Users,
    color: 'blue',
    href: '/dashboard/admin/employees',
  },
  {
    title: 'Pending Payslips',
    value: '12',
    icon: FileText,
    color: 'yellow',
    href: '/dashboard/admin/payslips',
  },
  {
    title: 'Pending Approvals',
    value: '8',
    icon: AlertCircle,
    color: 'red',
    href: '/dashboard/admin/approvals',
  },
  {
    title: 'This Month Revenue',
    value: '$45.2K',
    icon: TrendingUp,
    color: 'green',
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

const colorClasses: Record<string, string> = {
  blue: 'from-blue-50 to-blue-100 text-blue-900',
  yellow: 'from-yellow-50 to-yellow-100 text-yellow-900',
  red: 'from-red-50 to-red-100 text-red-900',
  green: 'from-green-50 to-green-100 text-green-900',
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage employees, payslips, and company-wide HR operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className={`border-0 bg-gradient-to-br ${colorClasses[stat.color]} p-6 cursor-pointer hover:shadow-lg transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-75">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon size={32} className="opacity-50" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
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
      <Card className="border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{activity.type}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {activity.employee}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{activity.date}</td>
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
