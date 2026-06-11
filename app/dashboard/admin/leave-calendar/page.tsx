'use client';

import { useMemo, useState } from 'react';
import { useEmployees } from '@/context/employees-context';
import { useRequests } from '@/context/requests-context';
import { LeaveCalendar } from '@/components/leave-calendar';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ALL_DEPARTMENTS = '__all__';

export default function AdminLeaveCalendarPage() {
  const { employees } = useEmployees();
  const { leaveRequests } = useRequests();

  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(set).sort();
  }, [employees]);

  const [department, setDepartment] = useState<string>(ALL_DEPARTMENTS);

  const filteredEmployees = useMemo(() => {
    if (department === ALL_DEPARTMENTS) return employees;
    return employees.filter((e) => e.department === department);
  }, [employees, department]);

  const filteredLeaves = useMemo(() => {
    const ids = new Set(filteredEmployees.map((e) => e.id));
    return leaveRequests.filter(
      (r) => ids.has(r.employeeId) && (r.status === 'approved' || r.status === 'pending'),
    );
  }, [leaveRequests, filteredEmployees]);

  const stats = useMemo(() => {
    const approved = filteredLeaves.filter((r) => r.status === 'approved').length;
    const pending = filteredLeaves.filter((r) => r.status === 'pending').length;
    return { approved, pending, people: filteredEmployees.length };
  }, [filteredLeaves, filteredEmployees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Leave Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Company-wide view of who&apos;s on leave and when. Filter by department to spot conflicts.
        </p>
      </div>

      <Card className="border border-border bg-card p-4 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label htmlFor="dept-filter" className="text-sm font-medium text-foreground">
              Department:
            </label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="dept-filter" className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_DEPARTMENTS}>All departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{stats.people}</span> people
            </span>
            <span>
              <span className="font-semibold text-foreground">{stats.approved}</span> approved
            </span>
            <span>
              <span className="font-semibold text-foreground">{stats.pending}</span> pending
            </span>
          </div>
        </div>
      </Card>

      <LeaveCalendar leaves={filteredLeaves} employees={filteredEmployees} />
    </div>
  );
}
