'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockLeaveBalances } from '@/lib/mock-data';
import { useRequests } from '@/context/requests-context';
import { useAuth } from '@/context/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplyLeaveDialog } from '@/components/apply-leave-dialog';
import { Plus, CalendarDays } from 'lucide-react';

export default function LeavePage() {
  const { user } = useAuth();
  const { leaveRequests } = useRequests();
  const [dialogOpen, setDialogOpen] = useState(false);

  const myRequests = leaveRequests.filter((r) => r.employeeId === (user?.id ?? '1'));

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
        return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-300 dark:hover:bg-yellow-950/50';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/50';
      default:
        return 'bg-muted text-foreground hover:bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Leave Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View your leave balance and manage leave requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/employee/leave-calendar">
            <Button variant="outline" className="gap-2">
              <CalendarDays size={16} />
              Team Calendar
            </Button>
          </Link>
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus size={16} />
            Apply for Leave
          </Button>
        </div>
      </div>

      <ApplyLeaveDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Leave Balance */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">Leave Balance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Entitled</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Used</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Balance</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaveBalances.map((leave, index) => {
                const used = leave.entitled - leave.balance;
                return (
                  <tr key={index} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{leave.type}</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">{leave.entitled}</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">{used}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary" className="bg-muted text-foreground hover:bg-muted">{leave.balance}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Leave Requests */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">Your Leave Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">From Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">To Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Reason</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((request) => (
                <tr key={request.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4 text-sm font-medium text-foreground capitalize">
                    {request.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(request.startDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(request.endDate)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-foreground">
                    {request.days}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{request.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
