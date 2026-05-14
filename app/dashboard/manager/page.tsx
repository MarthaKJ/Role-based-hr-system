'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  PlaneTakeoff,
  Star,
  UserCheck,
  UsersRound,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useEmployees } from '@/context/employees-context';
import { useRequests } from '@/context/requests-context';
import { useAppraisals } from '@/context/appraisals-context';
import { useAttendance } from '@/context/attendance-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const TODAY = new Date('2026-05-14');

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isWithinRange = (date: Date, start: Date, end: Date) => {
  const t = date.getTime();
  return t >= start.getTime() && t <= end.getTime();
};

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { leaveRequests } = useRequests();
  const { appraisals } = useAppraisals();
  const { attendance } = useAttendance();

  const team = useMemo(
    () => (user ? employees.filter((e) => e.managerId === user.id) : []),
    [employees, user],
  );
  const teamIds = useMemo(() => new Set(team.map((t) => t.id)), [team]);

  const teamLeave = useMemo(
    () => leaveRequests.filter((r) => teamIds.has(r.employeeId)),
    [leaveRequests, teamIds],
  );

  const onLeaveToday = useMemo(
    () =>
      teamLeave.filter(
        (r) => r.status === 'approved' && isWithinRange(TODAY, r.startDate, r.endDate),
      ),
    [teamLeave],
  );

  const pendingLeave = useMemo(
    () => teamLeave.filter((r) => r.status === 'pending'),
    [teamLeave],
  );

  const upcomingAppraisals = useMemo(
    () =>
      appraisals
        .filter((a) => teamIds.has(a.employeeId) && a.status === 'draft')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [appraisals, teamIds],
  );

  const attendanceSummary = useMemo(() => {
    const last7Start = new Date(TODAY);
    last7Start.setDate(TODAY.getDate() - 6);

    const recent = attendance.filter(
      (a) =>
        teamIds.has(a.employeeId) && isWithinRange(new Date(a.date), last7Start, TODAY),
    );

    const today = attendance.filter(
      (a) => teamIds.has(a.employeeId) && isSameDay(new Date(a.date), TODAY),
    );

    const presentToday = today.filter((r) => r.status === 'present').length;
    const lateToday = today.filter((r) => r.status === 'late').length;
    const absentToday = today.filter((r) => r.status === 'absent').length;
    const overtimeWeek = recent.reduce((sum, r) => sum + (r.overtimeHours ?? 0), 0);

    return {
      presentToday,
      lateToday,
      absentToday,
      overtimeWeek: Math.round(overtimeWeek * 10) / 10,
    };
  }, [attendance, teamIds]);

  if (!user) return null;

  const firstName = user.name.split(' ')[0];

  const stats = [
    {
      title: 'Team Members',
      value: team.length.toString(),
      icon: UsersRound,
      href: '/dashboard/manager/team',
      tone: 'default' as const,
    },
    {
      title: 'On Leave Today',
      value: onLeaveToday.length.toString(),
      icon: PlaneTakeoff,
      href: '/dashboard/manager/approvals',
      tone: 'default' as const,
    },
    {
      title: 'Pending Approvals',
      value: pendingLeave.length.toString(),
      icon: ClipboardCheck,
      href: '/dashboard/manager/approvals',
      tone: 'highlight' as const,
      highlight: pendingLeave.length > 0,
    },
    {
      title: 'Open Appraisals',
      value: upcomingAppraisals.length.toString(),
      icon: Star,
      href: '/dashboard/manager/appraisals',
      tone: 'default' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Welcome, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your team’s leave, attendance, and performance — all in one place.
          </p>
        </div>
        <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950/50">
          {user.department} · {team.length} team {team.length === 1 ? 'member' : 'members'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group h-full cursor-pointer border border-border bg-card p-5 shadow-none transition-all hover:border-blue-300 hover:shadow-sm dark:hover:border-blue-700">
                <div className="flex items-start justify-between">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  {stat.highlight ? (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50">
                      Action needed
                    </Badge>
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{stat.value}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Attendance summary */}
      <Card className="border border-border bg-card p-6 shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Attendance — Today</h3>
            <p className="mt-1 text-xs text-muted-foreground">{formatDate(TODAY)}</p>
          </div>
          <Link
            href="/dashboard/manager/attendance"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View attendance
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="rounded-md bg-green-100 p-2 text-green-700 dark:bg-green-950/50 dark:text-green-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Present</p>
              <p className="text-lg font-semibold text-foreground">
                {attendanceSummary.presentToday}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="rounded-md bg-amber-100 p-2 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Late</p>
              <p className="text-lg font-semibold text-foreground">
                {attendanceSummary.lateToday}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="rounded-md bg-red-100 p-2 text-red-700 dark:bg-red-950/50 dark:text-red-300">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Absent</p>
              <p className="text-lg font-semibold text-foreground">
                {attendanceSummary.absentToday}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="rounded-md bg-blue-100 p-2 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overtime (7 days)</p>
              <p className="text-lg font-semibold text-foreground">
                {attendanceSummary.overtimeWeek}h
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="border border-border bg-card p-6 shadow-none">
        <h3 className="mb-4 text-base font-semibold text-foreground">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/manager/approvals">
            <Button className="gap-2">
              <ClipboardCheck size={16} />
              Review leave requests
              {pendingLeave.length > 0 && (
                <Badge className="ml-1 bg-white/20 text-white hover:bg-white/20">
                  {pendingLeave.length}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/dashboard/manager/team">
            <Button variant="outline" className="gap-2">
              <UsersRound size={16} />
              View team
            </Button>
          </Link>
          <Link href="/dashboard/manager/appraisals">
            <Button variant="outline" className="gap-2">
              <Star size={16} />
              Manage appraisals
            </Button>
          </Link>
          <Link href="/dashboard/manager/attendance">
            <Button variant="outline" className="gap-2">
              <Clock size={16} />
              Attendance overview
            </Button>
          </Link>
        </div>
      </Card>

      {/* On Leave Today */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-base font-semibold text-foreground">On Leave Today</h3>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        {onLeaveToday.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No team members are on leave today.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {onLeaveToday.map((leave) => {
              const employee = employees.find((e) => e.id === leave.employeeId);
              return (
                <li key={leave.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
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
                      <p className="text-xs capitalize text-muted-foreground">
                        {leave.type} leave · {leave.days}{' '}
                        {leave.days === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Until</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(leave.endDate)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
