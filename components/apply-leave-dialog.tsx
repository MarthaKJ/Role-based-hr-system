'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRequests } from '@/context/requests-context';
import { LeaveRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

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

interface ApplyLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStart?: string;
  defaultEnd?: string;
}

export function ApplyLeaveDialog({
  open,
  onOpenChange,
  defaultStart,
  defaultEnd,
}: ApplyLeaveDialogProps) {
  const { user } = useAuth();
  const { addLeaveRequest } = useRequests();
  const [leaveType, setLeaveType] = useState<LeaveType | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (open) {
      setLeaveType('');
      setStartDate(defaultStart ?? '');
      setEndDate(defaultEnd ?? defaultStart ?? '');
      setReason('');
      setFormError('');
    }
  }, [open, defaultStart, defaultEnd]);

  const days = computeDays(startDate, endDate);

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
    addLeaveRequest({
      employeeId: user?.id ?? '1',
      type: leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days,
      reason: reason.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
          <DialogDescription>Submit a new leave request for approval.</DialogDescription>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
