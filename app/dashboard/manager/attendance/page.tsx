'use client';

import { useMemo, useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Inbox,
  TrendingUp,
  UserX,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useEmployees } from '@/context/employees-context';
import { useAttendance } from '@/context/attendance-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getInitials } from '@/lib/utils';

const TODAY = new Date('2026-05-14');

const toISODate = (d: Date) => d.toISOString().slice(0, 10);
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const statusBadge = (status: string) => {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50';
    case 'late':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50';
    case 'absent':
      return 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/50';
    case 'leave':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950/50';
    default:
      return 'bg-muted text-foreground hover:bg-muted';
  }
};

export default function ManagerAttendancePage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { attendance } = useAttendance();

  const defaultStart = useMemo(() => {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() - 13);
    return toISODate(d);
  }, []);
  const defaultEnd = useMemo(() => toISODate(TODAY), []);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [memberFilter, setMemberFilter] = useState<string>('all');

  const team = useMemo(
    () => (user ? employees.filter((e) => e.managerId === user.id) : []),
    [employees, user],
  );
  const teamIds = useMemo(() => new Set(team.map((t) => t.id)), [team]);

  const rangeStart = useMemo(() => startOfDay(new Date(startDate)), [startDate]);
  const rangeEnd = useMemo(() => endOfDay(new Date(endDate)), [endDate]);

  const filtered = useMemo(() => {
    return attendance
      .filter((r) => {
        if (!teamIds.has(r.employeeId)) return false;
        const d = new Date(r.date).getTime();
        if (d < rangeStart.getTime() || d > rangeEnd.getTime()) return false;
        if (memberFilter !== 'all' && r.employeeId !== memberFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendance, teamIds, rangeStart, rangeEnd, memberFilter]);

  const summary = useMemo(() => {
    const present = filtered.filter((r) => r.status === 'present').length;
    const late = filtered.filter((r) => r.status === 'late').length;
    const absent = filtered.filter((r) => r.status === 'absent').length;
    const leave = filtered.filter((r) => r.status === 'leave').length;
    const overtime = filtered.reduce((sum, r) => sum + (r.overtimeHours ?? 0), 0);
    const total = filtered.length || 1;
    const attendanceRate = Math.round(((present + late) / total) * 100);
    return {
      present,
      late,
      absent,
      leave,
      overtime: Math.round(overtime * 10) / 10,
      attendanceRate,
    };
  }, [filtered]);

  const memberRollup = useMemo(() => {
    const map = new Map<
      string,
      { present: number; late: number; absent: number; leave: number; overtime: number }
    >();
    for (const member of team) {
      map.set(member.id, { present: 0, late: 0, absent: 0, leave: 0, overtime: 0 });
    }
    for (const record of filtered) {
      const entry = map.get(record.employeeId);
      if (!entry) continue;
      if (record.status === 'present') entry.present++;
      else if (record.status === 'late') entry.late++;
      else if (record.status === 'absent') entry.absent++;
      else if (record.status === 'leave') entry.leave++;
      entry.overtime += record.overtimeHours ?? 0;
    }
    return Array.from(map.entries()).map(([memberId, totals]) => ({
      member: team.find((m) => m.id === memberId)!,
      ...totals,
      overtime: Math.round(totals.overtime * 10) / 10,
    }));
  }, [team, filtered]);

  const employeeName = (id: string) =>
    employees.find((e) => e.id === id)?.name ?? 'Unknown';

  const handleResetRange = () => {
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track presence, late arrivals, overtime, and absences across your team.
        </p>
      </div>

      <Card className="border border-border bg-card p-5 shadow-none">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="att-start">From</Label>
            <Input
              id="att-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="att-end">To</Label>
            <Input
              id="att-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="att-member">Team Member</Label>
            <Select value={memberFilter} onValueChange={setMemberFilter}>
              <SelectTrigger id="att-member">
                <SelectValue placeholder="All members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All members</SelectItem>
                {team.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={handleResetRange}>
              Reset to last 14 days
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border bg-card p-5 shadow-none">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Present</p>
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-foreground">{summary.present}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across selected range</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Late arrivals</p>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-foreground">{summary.late}</p>
          <p className="mt-1 text-xs text-muted-foreground">Logged 15+ min late</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Absent</p>
            <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-foreground">{summary.absent}</p>
          <p className="mt-1 text-xs text-muted-foreground">{summary.leave} on leave</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Overtime</p>
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-foreground">{summary.overtime}h</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.attendanceRate}% attendance rate
          </p>
        </Card>
      </div>

      {/* Per-member rollup */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-base font-semibold text-foreground">Team Rollup</h3>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </div>
        {memberRollup.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">No team members.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Present
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Late
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Absent
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Leave
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Overtime
                  </th>
                </tr>
              </thead>
              <tbody>
                {memberRollup.map((row) => (
                  <tr
                    key={row.member.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {row.member.avatarUrl && (
                            <AvatarImage src={row.member.avatarUrl} alt={row.member.name} />
                          )}
                          <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {getInitials(row.member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {row.member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {row.member.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-foreground">{row.present}</td>
                    <td className="px-6 py-4 text-center text-sm text-foreground">{row.late}</td>
                    <td className="px-6 py-4 text-center text-sm text-foreground">{row.absent}</td>
                    <td className="px-6 py-4 text-center text-sm text-foreground">{row.leave}</td>
                    <td className="px-6 py-4 text-center text-sm text-foreground">
                      {row.overtime}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detailed records */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-base font-semibold text-foreground">
            Detailed Records ({filtered.length})
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(rangeStart)} → {formatDate(rangeEnd)}
          </p>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              No attendance records for this range.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Overtime
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(new Date(record.date))}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {employeeName(record.employeeId)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusBadge(record.status)}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {record.clockIn ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {record.clockOut ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-foreground">
                      {record.overtimeHours ? `${record.overtimeHours}h` : '—'}
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
