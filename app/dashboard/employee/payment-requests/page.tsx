'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText } from 'lucide-react';

const mockPaymentRequests = [
  {
    id: '1',
    title: 'Advance Salary Request',
    amount: 50000,
    date: '2026-04-20',
    status: 'pending',
    description: 'Medical expenses',
  },
  {
    id: '2',
    title: 'Reimbursement - Office Supplies',
    amount: 5000,
    date: '2026-04-15',
    status: 'approved',
    description: 'Office equipment and supplies',
  },
  {
    id: '3',
    title: 'Travel Reimbursement',
    amount: 15000,
    date: '2026-04-10',
    status: 'approved',
    description: 'Project travel to branch office',
  },
];

export default function PaymentRequestsPage() {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
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
          <h1 className="text-3xl font-bold text-gray-900">Payment Requests</h1>
          <p className="mt-2 text-gray-600">
            Manage your advance salary and reimbursement requests.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Request
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{mockPaymentRequests.length}</p>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="mt-2 text-3xl font-bold text-yellow-900">
            {mockPaymentRequests.filter((r) => r.status === 'pending').length}
          </p>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 p-6">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="mt-2 text-3xl font-bold text-green-900">
            {mockPaymentRequests.filter((r) => r.status === 'approved').length}
          </p>
        </Card>
      </div>

      <Card className="border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockPaymentRequests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.description}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    ${request.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(request.date)}</td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <FileText size={16} />
                      View
                    </Button>
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
