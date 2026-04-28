'use client';

import { useMemo, useState } from 'react';
import { mockLeaveRequests, mockLeaveBalances } from '@/lib/mock-data';
import { LeaveRequest } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, AlertCircle } from 'lucide-react';

type LeaveType = LeaveRequest['type'];

const LEAVE_TYPE_OPTIONS: { value: LeaveType; label: string }[] = [
  { value: 'annual', label: 'Annual' },
  { value: 'sick', label: 'Sick' },
  { value: 'compassionate', label: 'Compassionate' },
  { value: 'maternity', label: 'Maternity' },
];

const computeDays = (start: string, end: string) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;
  const diff = endDate.getTime() - startDate.getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

export default function LeavePage() {
  const [submittedRequests, setSubmittedRequests] = useState<LeaveRequest[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  const allRequests = useMemo(
    () => [...submittedRequests, ...mockLeaveRequests],
    [submittedRequests],
  );

  const days = computeDays(startDate, endDate);

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

  const resetForm = () => {
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!leaveType) {
      setFormError('Please select a leave type.');
      return;
    }
    if (!startDate || !endDate) {
      setFormError('Please choose both a start and end date.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setFormError('End date cannot be before start date.');
      return;
    }

    const newRequest: LeaveRequest = {
      id: `LR${Date.now()}`,
      employeeId: '1',
      type: leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days,
      reason: reason.trim() || undefined,
      status: 'pending',
      appliedOn: new Date(),
    };

    setSubmittedRequests((prev) => [newRequest, ...prev]);
    resetForm();
    setDialogOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Leave Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View your leave balance and manage leave requests.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>
                Submit a new leave request for approval.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="leave-type">Leave Type</Label>
                <Select
                  value={leaveType}
                  onValueChange={(value) => setLeaveType(value as LeaveType)}
                >
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="Select a leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {days > 0 && (
                <p className="text-sm text-muted-foreground">
                  Total: <span className="font-semibold text-foreground">{days}</span>{' '}
                  {days === 1 ? 'day' : 'days'}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Briefly describe your reason for leave..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
              {allRequests.map((request) => (
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
