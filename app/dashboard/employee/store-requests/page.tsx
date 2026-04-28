'use client';

import { useState } from 'react';
import { useStore } from '@/context/store-context';
import { useAuth } from '@/context/auth-context';
import { StoreItem } from '@/lib/types';
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
} from '@/components/ui/dialog';
import { Package, ShoppingCart, AlertCircle } from 'lucide-react';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950/50';
    case 'issued':
      return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-300 dark:hover:bg-yellow-950/50';
    case 'rejected':
      return 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/50';
    default:
      return 'bg-muted text-foreground hover:bg-muted';
  }
};

const stockBadge = (stock: number) => {
  if (stock === 0)
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/50">
        Out of stock
      </Badge>
    );
  if (stock < 5)
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50">
        {stock} left
      </Badge>
    );
  return (
    <Badge variant="secondary" className="bg-muted text-foreground hover:bg-muted">
      {stock} in stock
    </Badge>
  );
};

export default function StoreRequestsPage() {
  const { user } = useAuth();
  const { catalog, requests, addRequest } = useStore();
  const [item, setItem] = useState<StoreItem | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  const myRequests = requests.filter((r) => r.employeeId === (user?.id ?? '1'));

  const itemName = (id: string) => catalog.find((c) => c.id === id)?.name ?? 'Unknown item';

  const resetForm = () => {
    setItem(null);
    setQuantity('1');
    setReason('');
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!item) return;
    const qty = Number(quantity);
    if (!qty || qty < 1) {
      setFormError('Please enter a valid quantity (at least 1).');
      return;
    }
    if (qty > item.stock) {
      setFormError(`Only ${item.stock} in stock; you requested ${qty}.`);
      return;
    }
    if (!reason.trim()) {
      setFormError('Please provide a brief reason.');
      return;
    }

    addRequest({
      employeeId: user?.id ?? '1',
      itemId: item.id,
      quantity: qty,
      reason: reason.trim(),
    });
    resetForm();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Store Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Request supplies and equipment from the company store.
        </p>
      </div>

      {/* Catalog */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Available Items</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catalog.map((entry) => (
            <Card
              key={entry.id}
              className="flex flex-col border border-border bg-card p-5 shadow-none"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Package className="h-5 w-5" />
                </div>
                {stockBadge(entry.stock)}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{entry.name}</h3>
              <p className="mt-1 flex-1 text-xs text-muted-foreground">{entry.description}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4 w-full gap-2"
                disabled={entry.stock === 0}
                onClick={() => {
                  setItem(entry);
                  setQuantity('1');
                  setReason('');
                  setFormError('');
                }}
              >
                <ShoppingCart size={14} />
                Request
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Request dialog */}
      <Dialog open={item !== null} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request {item?.name}</DialogTitle>
            <DialogDescription>
              Requests are reviewed by HR. You&apos;ll be notified when approved or issued.
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
              <Label htmlFor="sr-qty">Quantity</Label>
              <Input
                id="sr-qty"
                type="number"
                min="1"
                max={item?.stock ?? 1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              {item && (
                <p className="text-xs text-muted-foreground">{item.stock} available in stock.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sr-reason">Reason</Label>
              <Textarea
                id="sr-reason"
                rows={3}
                placeholder="Why do you need this?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* My requests */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">Your Requests</h3>
        </div>
        {myRequests.length === 0 ? (
          <div className="px-8 py-12 text-center text-sm text-muted-foreground">
            You haven&apos;t made any store requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
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
                </tr>
              </thead>
              <tbody>
                {myRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {itemName(request.itemId)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                      {request.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{request.reason}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(request.requestedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
