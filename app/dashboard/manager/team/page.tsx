'use client';

import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useEmployees } from '@/context/employees-context';
import { useRequests } from '@/context/requests-context';
import { useAppraisals } from '@/context/appraisals-context';
import { useAttendance } from '@/context/attendance-context';
import { mockLeaveBalances } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

const PAGE_SIZE = 5;
const TODAY = new Date('2026-05-14');

const isWithinRange = (date: Date, start: Date, end: Date) => {
  const t = date.getTime();
  return t >= start.getTime() && t <= end.getTime();
};

export default function ManagerTeamPage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { leaveRequests } = useRequests();
  const { appraisals } = useAppraisals();
  const { attendance } = useAttendance();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const team = useMemo(
    () => (user ? employees.filter((e) => e.managerId === user.id) : []),
    [employees, user],
  );

  const departments = useMemo(
    () => Array.from(new Set(team.map((t) => t.department))).sort(),
    [team],
  );

  const last30Start = useMemo(() => {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() - 29);
    return d;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return team.filter((member) => {
      const matchesQuery =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.designation.toLowerCase().includes(q) ||
        member.employeeId.toLowerCase().includes(q);
      const matchesDept =
        departmentFilter === 'all' || member.department === departmentFilter;
      return matchesQuery && matchesDept;
    });
  }, [team, search, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedMembers = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const memberSummary = (memberId: string) => {
    const recent = attendance.filter(
      (r) => r.employeeId === memberId && isWithinRange(new Date(r.date), last30Start, TODAY),
    );
    const present = recent.filter((r) => r.status === 'present').length;
    const late = recent.filter((r) => r.status === 'late').length;
    const absent = recent.filter((r) => r.status === 'absent').length;
    const totalLeaveBalance = mockLeaveBalances.reduce((sum, l) => sum + l.balance, 0);
    const usedThisYear = leaveRequests
      .filter((r) => r.employeeId === memberId && r.status === 'approved')
      .reduce((sum, r) => sum + r.days, 0);
    const memberAppraisals = appraisals.filter((a) => a.employeeId === memberId);
    const latest = memberAppraisals
      .filter((a) => a.status === 'published')
      .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())[0];
    const draft = memberAppraisals.find((a) => a.status === 'draft');
    return {
      present,
      late,
      absent,
      remainingLeave: Math.max(0, totalLeaveBalance - usedThisYear),
      usedLeave: usedThisYear,
      latestAppraisal: latest,
      draftAppraisal: draft,
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">My Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Employees assigned to you. Search, filter, and drill into their summary.
        </p>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Team Directory ({filtered.length}
            {filtered.length !== team.length && ` of ${team.length}`})
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email, role…"
                className="pl-9"
              />
            </div>
            <Select
              value={departmentFilter}
              onValueChange={(v) => {
                setDepartmentFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {team.length === 0
                ? 'No employees are assigned to you yet.'
                : 'No team members match your filters.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Attendance (30d)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Leave Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Appraisal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedMembers.map((member) => {
                    const summary = memberSummary(member.id);
                    return (
                      <tr
                        key={member.id}
                        className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              {member.avatarUrl && (
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                              )}
                              <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {member.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {member.employeeId} · {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {member.designation}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {member.department}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50">
                              {summary.present}P
                            </Badge>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/50">
                              {summary.late}L
                            </Badge>
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/50">
                              {summary.absent}A
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-foreground">
                            {summary.remainingLeave}{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                              days left
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {summary.usedLeave} used this year
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {summary.draftAppraisal ? (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-300 dark:hover:bg-yellow-950/50">
                              Draft · {summary.draftAppraisal.period}
                            </Badge>
                          ) : summary.latestAppraisal ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50">
                              {summary.latestAppraisal.period} · {summary.latestAppraisal.rating}/5
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No appraisals</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-3">
                <p className="text-xs text-muted-foreground">
                  Page {safePage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="gap-1"
                  >
                    <ChevronLeft size={14} />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/manager/appraisals"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Manage appraisals →
        </Link>
        <Link
          href="/dashboard/manager/attendance"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View attendance →
        </Link>
      </div>
    </div>
  );
}
