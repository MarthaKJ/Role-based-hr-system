'use client';

import { mockLeaveRequests, mockLeaveBalances } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function LeavePage() {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="mt-2 text-gray-600">
            View your leave balance and manage leave requests.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance */}
      <Card className="border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">Leave Balance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Entitled</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Used</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Balance</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaveBalances.map((leave, index) => {
                const used = leave.entitled - leave.balance;
                return (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{leave.type}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">{leave.entitled}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">{used}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary">{leave.balance}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Leave Requests */}
      <Card className="border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Leave Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">From Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">To Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Days</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reason</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaveRequests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {request.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(request.startDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(request.endDate)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    {request.days}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
