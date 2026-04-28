'use client';

import { useMemo, useState } from 'react';
import { useRequests } from '@/context/requests-context';
import { useEmployees } from '@/context/employees-context';
import { useStore } from '@/context/store-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Inbox, PackageCheck } from 'lucide-react';
import { getInitials } from '@/lib/utils';

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

const getStoreStatusColor = (status: string) => {
  if (status === 'approved')
    return 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950/50';
  if (status === 'issued')
    return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50';
  return getStatusColor(status);
};

function EmployeeCell({ employeeId }: { employeeId: string }) {
  const { employees } = useEmployees();
  const employee = employees.find((e) => e.id === employeeId);
  if (!employee) {
    return <span className="text-sm text-muted-foreground">Unknown ({employeeId})</span>;
  }
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {employee.avatarUrl && <AvatarImage src={employee.avatarUrl} alt={employee.name} />}
        <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {getInitials(employee.name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium text-foreground">{employee.name}</p>
        <p className="text-xs text-muted-foreground">{employee.designation}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default function ApprovalsPage() {
  const { leaveRequests, paymentRequests, updateLeaveStatus, updatePaymentStatus } = useRequests();
  const { catalog, requests: storeRequests, approveRequest, rejectRequest, issueRequest } =
    useStore();
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [storeError, setStoreError] = useState('');

  const filteredLeave = useMemo(
    () => (filter === 'all' ? leaveRequests : leaveRequests.filter((r) => r.status === filter)),
    [leaveRequests, filter],
  );

  const filteredPayments = useMemo(
    () =>
      filter === 'all' ? paymentRequests : paymentRequests.filter((r) => r.status === filter),
    [paymentRequests, filter],
  );

  const filteredStore = useMemo(() => {
    if (filter === 'all') return storeRequests;
    if (filter === 'approved')
      return storeRequests.filter((r) => r.status === 'approved' || r.status === 'issued');
    return storeRequests.filter((r) => r.status === filter);
  }, [storeRequests, filter]);

  const pendingCounts = useMemo(
    () => ({
      leave: leaveRequests.filter((r) => r.status === 'pending').length,
      payment: paymentRequests.filter((r) => r.status === 'pending').length,
      store: storeRequests.filter((r) => r.status === 'pending').length,
    }),
    [leaveRequests, paymentRequests, storeRequests],
  );

  const itemName = (id: string) => catalog.find((c) => c.id === id)?.name ?? 'Unknown item';

  const handleIssue = (id: string) => {
    const result = issueRequest(id);
    if (!result.ok) {
      setStoreError(result.error ?? 'Could not issue this request.');
      return;
    }
    setStoreError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and act on pending leave, payment, and store requests from employees.
        </p>
      </div>

      {/* Filter */}
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

      <Tabs defaultValue="leave" className="w-full">
        <TabsList>
          <TabsTrigger value="leave" className="gap-2">
            Leave Requests
            {pendingCounts.leave > 0 && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50">
                {pendingCounts.leave}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            Payment Requests
            {pendingCounts.payment > 0 && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50">
                {pendingCounts.payment}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-2">
            Store Requests
            {pendingCounts.store > 0 && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50">
                {pendingCounts.store}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Leave Requests */}
        <TabsContent value="leave" className="mt-4">
          <Card className="overflow-hidden border border-border bg-card shadow-none">
            {filteredLeave.length === 0 ? (
              <EmptyState message={`No ${filter === 'all' ? '' : filter} leave requests.`} />
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
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        To
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeave.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-4">
                          <EmployeeCell employeeId={request.employeeId} />
                        </td>
                        <td className="px-6 py-4 text-sm capitalize text-foreground">
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
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {request.reason ?? '—'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(request.status)}>
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
                                onClick={() => updateLeaveStatus(request.id, 'approved')}
                              >
                                <Check size={14} />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                                onClick={() => updateLeaveStatus(request.id, 'rejected')}
                              >
                                <X size={14} />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <div className="text-right text-xs text-muted-foreground">—</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Payment Requests */}
        <TabsContent value="payment" className="mt-4">
          <Card className="overflow-hidden border border-border bg-card shadow-none">
            {filteredPayments.length === 0 ? (
              <EmptyState message={`No ${filter === 'all' ? '' : filter} payment requests.`} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-4">
                          <EmployeeCell employeeId={request.employeeId} />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {request.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {request.description}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                          ${request.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(request.date)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(request.status)}>
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
                                onClick={() => updatePaymentStatus(request.id, 'approved')}
                              >
                                <Check size={14} />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                                onClick={() => updatePaymentStatus(request.id, 'rejected')}
                              >
                                <X size={14} />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <div className="text-right text-xs text-muted-foreground">—</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Store Requests */}
        <TabsContent value="store" className="mt-4">
          {storeError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
              <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-300">{storeError}</p>
            </div>
          )}
          <Card className="overflow-hidden border border-border bg-card shadow-none">
            {filteredStore.length === 0 ? (
              <EmptyState message={`No ${filter === 'all' ? '' : filter} store requests.`} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Item
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Requested
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStore.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-4">
                          <EmployeeCell employeeId={request.employeeId} />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {itemName(request.itemId)}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-foreground">
                          {request.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {request.reason}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(request.requestedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStoreStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/40 dark:hover:text-green-300"
                                  onClick={() => approveRequest(request.id)}
                                >
                                  <Check size={14} />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                                  onClick={() => rejectRequest(request.id)}
                                >
                                  <X size={14} />
                                  Reject
                                </Button>
                              </>
                            )}
                            {request.status === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                                onClick={() => handleIssue(request.id)}
                              >
                                <PackageCheck size={14} />
                                Mark Issued
                              </Button>
                            )}
                            {(request.status === 'issued' ||
                              request.status === 'rejected') && (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
