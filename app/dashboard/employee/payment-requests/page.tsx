'use client';

import { useState } from 'react';
import { useRequests } from '@/context/requests-context';
import { useAuth } from '@/context/auth-context';
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
import { Plus, FileText, AlertCircle } from 'lucide-react';

type RequestType = 'advance-salary' | 'reimbursement';

const REQUEST_TYPE_OPTIONS: { value: RequestType; label: string; defaultTitle: string }[] = [
  { value: 'advance-salary', label: 'Advance Salary', defaultTitle: 'Advance Salary Request' },
  { value: 'reimbursement', label: 'Reimbursement', defaultTitle: 'Reimbursement Request' },
];

export default function PaymentRequestsPage() {
  const { user } = useAuth();
  const { paymentRequests, addPaymentRequest } = useRequests();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestType | ''>('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const allRequests = paymentRequests.filter((r) => r.employeeId === (user?.id ?? '1'));

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
    setRequestType('');
    setTitle('');
    setAmount('');
    setDescription('');
    setFormError('');
  };

  const handleTypeChange = (value: RequestType) => {
    setRequestType(value);
    if (!title.trim()) {
      const option = REQUEST_TYPE_OPTIONS.find((o) => o.value === value);
      if (option) setTitle(option.defaultTitle);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!requestType) {
      setFormError('Please select a request type.');
      return;
    }
    if (!title.trim()) {
      setFormError('Please enter a title.');
      return;
    }
    const amountNumber = Number(amount);
    if (!amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please describe the reason for this request.');
      return;
    }

    addPaymentRequest({
      employeeId: user?.id ?? '1',
      category: requestType,
      title: title.trim(),
      amount: amountNumber,
      description: description.trim(),
    });

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
          <h1 className="text-3xl font-semibold text-foreground">Payment Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your advance salary and reimbursement requests.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Payment Request</DialogTitle>
              <DialogDescription>
                Submit an advance salary or reimbursement request for approval.
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
                <Label htmlFor="request-type">Request Type</Label>
                <Select
                  value={requestType}
                  onValueChange={(value) => handleTypeChange(value as RequestType)}
                >
                  <SelectTrigger id="request-type">
                    <SelectValue placeholder="Select a request type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g. Travel Reimbursement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe the purpose of this request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{allRequests.length}</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {allRequests.filter((r) => r.status === 'pending').length}
          </p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {allRequests.filter((r) => r.status === 'approved').length}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {allRequests.map((request) => (
                <tr key={request.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{request.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{request.description}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                    ${request.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(request.date)}</td>
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
