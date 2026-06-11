'use client';

import { useMemo, useState } from 'react';
import { Check, X, Inbox, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useEmployees } from '@/context/employees-context';
import { useRequests } from '@/context/requests-context';
import { LeaveRequest } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getInitials } from '@/lib/utils';

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const statusBadge = (status: string) => {
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

type Decision = 'approved' | 'rejected';
type DialogState =
  | { kind: 'closed' }
  | { kind: 'decide'; request: LeaveRequest; decision: Decision };

export default function ManagerApprovalsPage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { leaveRequests, decideLeaveRequest } = useRequests();

  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' });
  const [comment, setComment] = useState('');

  const team = useMemo(
    () => (user ? employees.filter((e) => e.managerId === user.id) : []),
    [employees, user],
  );
  const teamIds = useMemo(() => new Set(team.map((t) => t.id)), [team]);

  const teamLeave = useMemo(
    () =>
      leaveRequests
        .filter((r) => teamIds.has(r.employeeId))
        .sort((a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()),
    [leaveRequests, teamIds],
  );

  const currentTab = useMemo(() => {
    return {
      current:
        filter === 'all' ? teamLeave : teamLeave.filter((r) => r.status === filter),
      history: teamLeave.filter((r) => r.status !== 'pending'),
    };
  }, [teamLeave, filter]);

  const counts = useMemo(
    () => ({
      pending: teamLeave.filter((r) => r.status === 'pending').length,
      approved: teamLeave.filter((r) => r.status === 'approved').length,
      rejected: teamLeave.filter((r) => r.status === 'rejected').length,
    }),
    [teamLeave],
  );

  const openDecision = (request: LeaveRequest, decision: Decision) => {
    setComment('');
    setDialog({ kind: 'decide', request, decision });
  };

  const closeDialog = () => {
    setDialog({ kind: 'closed' });
    setComment('');
  };

  const confirmDecision = () => {
    if (dialog.kind !== 'decide') return;
    decideLeaveRequest(dialog.request.id, {
      status: dialog.decision,
      comment: comment.trim(),
      decidedBy: user?.id,
    });
    closeDialog();
  };

  const employeeData = (id: string) => employees.find((e) => e.id === id);

  const renderRow = (request: LeaveRequest) => {
    const employee = employeeData(request.employeeId);
    return (
      <tr
        key={request.id}
        className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {employee?.avatarUrl && (
                <AvatarImage src={employee.avatarUrl} alt={employee.name} />
              )}
              <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {employee ? getInitials(employee.name) : '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">
                {employee?.name ?? 'Unknown'}
              </p>
              <p className="text-xs text-muted-foreground">{employee?.designation ?? ''}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm capitalize text-foreground">{request.type}</td>
        <td className="px-6 py-4 text-sm text-muted-foreground">
          {formatDate(request.startDate)} → {formatDate(request.endDate)}
        </td>
        <td className="px-6 py-4 text-center text-sm font-medium text-foreground">
          {request.days}
        </td>
        <td className="px-6 py-4 text-sm text-muted-foreground">{request.reason ?? '—'}</td>
        <td className="px-6 py-4 text-sm text-muted-foreground">
          {formatDate(request.appliedOn)}
        </td>
        <td className="px-6 py-4">
          <Badge className={statusBadge(request.status)}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </td>
        <td className="px-6 py-4">
          {request.status === 'pending' ? (
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/40 dark:hover:text-green-300"
                onClick={() => openDecision(request, 'approved')}
              >
                <Check size={14} />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                onClick={() => openDecision(request, 'rejected')}
              >
                <X size={14} />
                Reject
              </Button>
            </div>
          ) : request.managerComment ? (
            <div className="flex items-start justify-end gap-1.5 text-right text-xs text-muted-foreground">
              <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
              <span className="max-w-[18rem]">{request.managerComment}</span>
            </div>
          ) : (
            <div className="text-right text-xs text-muted-foreground">—</div>
          )}
        </td>
      </tr>
    );
  };

  const dialogEmployee =
    dialog.kind === 'decide' ? employeeData(dialog.request.employeeId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Leave Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and act on leave requests from your direct reports.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{counts.pending}</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{counts.approved}</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{counts.rejected}</p>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="history">Leave History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((value) => (
              <Button
                key={value}
                variant={filter === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(value)}
                className="capitalize"
              >
                {value}
              </Button>
            ))}
          </div>

          <Card className="overflow-hidden border border-border bg-card shadow-none">
            {currentTab.current.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Inbox className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  No {filter === 'all' ? '' : filter} leave requests from your team.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>{currentTab.current.map(renderRow)}</tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="overflow-hidden border border-border bg-card shadow-none">
            {currentTab.history.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Inbox className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  No leave history yet for your team.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody>{currentTab.history.map(renderRow)}</tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialog.kind === 'decide'} onOpenChange={(open) => (open ? null : closeDialog())}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog.kind === 'decide' && dialog.decision === 'approved'
                ? 'Approve leave request?'
                : 'Reject leave request?'}
            </DialogTitle>
            <DialogDescription>
              {dialog.kind === 'decide' && dialogEmployee
                ? `${dialogEmployee.name} requested ${dialog.request.days} ${
                    dialog.request.days === 1 ? 'day' : 'days'
                  } of ${dialog.request.type} leave from ${formatDate(dialog.request.startDate)} to ${formatDate(dialog.request.endDate)}.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="leave-comment">Comment (optional)</Label>
            <Textarea
              id="leave-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a note the employee will see…"
              rows={3}
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              className={
                dialog.kind === 'decide' && dialog.decision === 'rejected'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : ''
              }
              onClick={confirmDecision}
            >
              {dialog.kind === 'decide' && dialog.decision === 'approved'
                ? 'Approve'
                : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
