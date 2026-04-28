'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Bell, Calendar, CreditCard, Inbox, Package, Star } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useRequests } from '@/context/requests-context';
import { useStore } from '@/context/store-context';
import { useAppraisals } from '@/context/appraisals-context';

const formatRelative = (date: Date | string) => {
  const target = new Date(date).getTime();
  const diff = Date.now() - target;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const statusDot = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-amber-500';
  }
};

export function Notifications() {
  const { user } = useAuth();
  const { leaveRequests, paymentRequests } = useRequests();
  const { catalog, requests: storeRequests } = useStore();
  const { appraisals } = useAppraisals();

  const itemName = (id: string) => catalog.find((c) => c.id === id)?.name ?? 'Item';

  const items = useMemo(() => {
    if (!user) return [];

    if (user.role === 'admin' || user.role === 'hr') {
      const pendingLeave = leaveRequests
        .filter((r) => r.status === 'pending')
        .map((r) => ({
          key: `L-${r.id}`,
          icon: Calendar,
          title: 'Leave request pending',
          subtitle: `${r.days} ${r.days === 1 ? 'day' : 'days'} of ${r.type} leave`,
          date: r.appliedOn,
          status: 'pending',
          href: '/dashboard/admin/approvals',
        }));
      const pendingPayment = paymentRequests
        .filter((r) => r.status === 'pending')
        .map((r) => ({
          key: `P-${r.id}`,
          icon: CreditCard,
          title: 'Payment request pending',
          subtitle: `${r.title} — $${r.amount.toLocaleString()}`,
          date: r.date,
          status: 'pending',
          href: '/dashboard/admin/approvals',
        }));
      const pendingStore = storeRequests
        .filter((r) => r.status === 'pending')
        .map((r) => ({
          key: `S-${r.id}`,
          icon: Package,
          title: 'Store request pending',
          subtitle: `${r.quantity} × ${itemName(r.itemId)}`,
          date: r.requestedAt,
          status: 'pending',
          href: '/dashboard/admin/approvals',
        }));
      return [...pendingLeave, ...pendingPayment, ...pendingStore]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);
    }

    const myLeave = leaveRequests
      .filter((r) => r.employeeId === user.id && r.status !== 'pending')
      .map((r) => ({
        key: `L-${r.id}`,
        icon: Calendar,
        title: `Leave request ${r.status}`,
        subtitle: `${r.days} ${r.days === 1 ? 'day' : 'days'} of ${r.type} leave`,
        date: r.appliedOn,
        status: r.status,
        href: '/dashboard/employee/leave',
      }));
    const myPayments = paymentRequests
      .filter((r) => r.employeeId === user.id && r.status !== 'pending')
      .map((r) => ({
        key: `P-${r.id}`,
        icon: CreditCard,
        title: `Payment request ${r.status}`,
        subtitle: `${r.title} — $${r.amount.toLocaleString()}`,
        date: r.date,
        status: r.status,
        href: '/dashboard/employee/payment-requests',
      }));
    const myStore = storeRequests
      .filter((r) => r.employeeId === user.id && r.status !== 'pending')
      .map((r) => ({
        key: `S-${r.id}`,
        icon: Package,
        title: `Store request ${r.status}`,
        subtitle: `${r.quantity} × ${itemName(r.itemId)}`,
        date: r.requestedAt,
        status: r.status,
        href: '/dashboard/employee/store-requests',
      }));
    const myAppraisals = appraisals
      .filter((a) => a.employeeId === user.id && a.status === 'published' && a.publishedAt)
      .map((a) => ({
        key: `A-${a.id}`,
        icon: Star,
        title: 'New appraisal published',
        subtitle: `${a.period} — ${a.rating}/5`,
        date: a.publishedAt as Date,
        status: 'approved' as const,
        href: '/dashboard/employee/appraisals',
      }));
    return [...myLeave, ...myPayments, ...myStore, ...myAppraisals]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [user, leaveRequests, paymentRequests, storeRequests, appraisals, catalog]);

  const unreadCount = items.length;
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-muted text-foreground hover:bg-muted"
            >
              {unreadCount}
            </Badge>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {isAdmin ? 'No pending approvals.' : 'No recent activity.'}
            </p>
          </div>
        ) : (
          <ul className="max-h-80 divide-y divide-border overflow-y-auto">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="relative mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <Icon className="h-4 w-4" />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card ${statusDot(item.status)}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatRelative(item.date)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {isAdmin && unreadCount > 0 && (
          <div className="border-t border-border px-4 py-2">
            <Link
              href="/dashboard/admin/approvals"
              className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Review all approvals
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
