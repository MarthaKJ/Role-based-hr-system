'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useEmployees } from '@/context/employees-context';
import { useRequests } from '@/context/requests-context';
import { LeaveCalendar } from '@/components/leave-calendar';
import { ApplyLeaveDialog } from '@/components/apply-leave-dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

const ALL_DEPARTMENTS = '__all__';

export default function LeaveCalendarPage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { leaveRequests } = useRequests();

  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(set).sort();
  }, [employees]);

  const defaultDept = user?.department && departments.includes(user.department) ? user.department : ALL_DEPARTMENTS;
  const [department, setDepartment] = useState<string>(defaultDept);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultStart, setDefaultStart] = useState<string | undefined>(undefined);

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

  const handleApplyForDay = (iso: string) => {
    setDefaultStart(iso);
    setDialogOpen(true);
  };

  const openBlankDialog = () => {
    setDefaultStart(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Leave Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            See who&apos;s out and pick days that don&apos;t collide with your team.
          </p>
        </div>
        <Button className="gap-2" onClick={openBlankDialog}>
          <Plus size={16} />
          Apply for Leave
        </Button>
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

      <LeaveCalendar
        leaves={filteredLeaves}
        employees={filteredEmployees}
        onApplyForDay={handleApplyForDay}
      />

      <ApplyLeaveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultStart={defaultStart}
      />
    </div>
  );
}
