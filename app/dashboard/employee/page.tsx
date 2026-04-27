'use client';

import { pendingApprovals, quickActions, actionCards, mockLeaveBalances } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { getInitials } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CalendarDays,
  Clock,
  CreditCard,
  FileText,
  FileIcon,
  Star,
  ShoppingCart,
  ShoppingBag,
  Plane,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ReactNode> = {
  Calendar: <Calendar size={24} className="text-blue-500" />,
  CalendarDays: <CalendarDays size={24} className="text-purple-500" />,
  Clock: <Clock size={24} className="text-green-500" />,
  CreditCard: <CreditCard size={24} className="text-orange-500" />,
  FileText: <FileText size={24} className="text-indigo-500" />,
  Star: <Star size={24} className="text-yellow-500" />,
  ShoppingCart: <ShoppingCart size={24} className="text-pink-500" />,
  ShoppingBag: <ShoppingBag size={24} className="text-cyan-500" />,
  Plane: <Plane size={24} className="text-teal-500" />,
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="mt-2 text-gray-600">
            Here&apos;s what happening with your HR portal today.
          </p>
        </div>
        <Avatar className="h-16 w-16 bg-blue-200">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback className="bg-blue-200 text-xl font-semibold text-blue-800">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* User Info Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">ID</p>
              <p className="font-medium text-gray-900">{user.employeeId}</p>
            </div>
            <div>
              <p className="text-gray-600">Department</p>
              <p className="font-medium text-gray-900">{user.department}</p>
            </div>
            <div>
              <p className="text-gray-600">Designation</p>
              <p className="font-medium text-gray-900">{user.designation}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Pending Approvals */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Other Pending Approvals</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{pendingApprovals.otherApprovals}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Leave Requests Pending Approval</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{pendingApprovals.leaveRequests}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Time Sheets Pending Approval</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{pendingApprovals.timeSheets}</p>
        </div>
      </div>

      {/* You Can Now Section */}
      <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50 p-8">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">You can now:</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-blue-500">
                {iconMap[action.icon] || <FileIcon size={24} />}
              </div>
              <span className="font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Action Cards Grid */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Access</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actionCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group rounded-lg border bg-white p-6 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{card.title}</h4>
                  <p className="mt-2 text-2xl font-bold text-blue-600">{card.count}</p>
                </div>
                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  {iconMap[card.icon] || <FileIcon size={24} />}
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:gap-2 transition-all">
                <span>View Details</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Leave Balance Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Leave Balance</h3>
        <Card className="border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Entitled</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Balance</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaveBalances.map((leave, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{leave.type}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">{leave.entitled}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary">{leave.balance}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
