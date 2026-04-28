'use client';

import { useMemo } from 'react';
import { actionCards, mockLeaveBalances, mockLeaveRequests } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { getInitials } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  FileText,
  FileIcon,
  Star,
  ShoppingCart,
  ShoppingBag,
  Plane,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-5 w-5" />,
  Star: <Star className="h-5 w-5" />,
  ShoppingCart: <ShoppingCart className="h-5 w-5" />,
  ShoppingBag: <ShoppingBag className="h-5 w-5" />,
  CreditCard: <CreditCard className="h-5 w-5" />,
  Plane: <Plane className="h-5 w-5" />,
};

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const pendingLeave = mockLeaveRequests.filter((r) => r.status === 'pending').length;
    const approvedLeave = mockLeaveRequests.filter((r) => r.status === 'approved').length;
    const totalLeaveBalance = mockLeaveBalances.reduce((sum, l) => sum + l.balance, 0);
    return { pendingLeave, approvedLeave, totalLeaveBalance };
  }, []);

  const cards = useMemo(
    () =>
      actionCards.map((card) =>
        card.title === 'Leave Requests' ? { ...card, count: stats.pendingLeave } : card,
      ),
    [stats.pendingLeave],
  );

  if (!user) return null;

  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Welcome back, {firstName}.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your HR portal today.
          </p>
        </div>
        <Avatar className="h-14 w-14">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback className="bg-blue-100 text-base font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Identity strip */}
      <Card className="border border-border bg-card p-5 shadow-none">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</p>
            <p className="mt-1 text-sm font-medium text-foreground">{user.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Employee ID
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{user.employeeId}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Department
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{user.department}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Designation
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{user.designation}</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Pending Leave Requests</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.pendingLeave}</p>
          <p className="mt-1 text-xs text-muted-foreground">Awaiting approval</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Approved Leave</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.approvedLeave}</p>
          <p className="mt-1 text-xs text-muted-foreground">This year</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Available Leave Days</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.totalLeaveBalance}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across all leave types</p>
        </Card>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-blue-300 hover:shadow-sm dark:hover:border-blue-700"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  {iconMap[card.icon] ?? <FileIcon className="h-5 w-5" />}
                </div>
                {card.count > 0 && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50">
                    {card.count} pending
                  </Badge>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Leave Balance */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Leave Balance</h2>
        <Card className="overflow-hidden border border-border bg-card shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Category
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Entitled
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockLeaveBalances.map((leave, index) => (
                  <tr
                    key={index}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 text-sm text-foreground">{leave.type}</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                      {leave.entitled}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant="secondary"
                        className="bg-muted text-foreground hover:bg-muted"
                      >
                        {leave.balance}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
