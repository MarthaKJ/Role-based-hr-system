'use client';

import { useMemo, useState } from 'react';
import { LeaveRequest, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};
const isoDay = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

interface DayLeave {
  request: LeaveRequest;
  employee: User;
}

interface LeaveCalendarProps {
  leaves: LeaveRequest[];
  employees: User[];
  onApplyForDay?: (isoDay: string) => void;
}

export function LeaveCalendar({ leaves, employees, onApplyForDay }: LeaveCalendarProps) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [openDay, setOpenDay] = useState<string | null>(null);

  const employeeById = useMemo(() => {
    const map = new Map<string, User>();
    employees.forEach((e) => map.set(e.id, e));
    return map;
  }, [employees]);

  const grid = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const startWeekday = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();

    // Pre-compute leaves by day for the displayed month
    const byDay = new Map<string, DayLeave[]>();
    for (let day = 1; day <= daysInMonth; day++) {
      const target = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      const targetTime = startOfDay(target).getTime();
      const matching: DayLeave[] = [];
      for (const request of leaves) {
        const start = startOfDay(new Date(request.startDate)).getTime();
        const end = startOfDay(new Date(request.endDate)).getTime();
        if (targetTime >= start && targetTime <= end) {
          const employee = employeeById.get(request.employeeId);
          if (employee) matching.push({ request, employee });
        }
      }
      byDay.set(isoDay(target), matching);
    }

    const cells: Array<{
      date: Date | null;
      iso: string;
      inMonth: boolean;
      leaves: DayLeave[];
    }> = [];

    // Leading blanks
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ date: null, iso: '', inMonth: false, leaves: [] });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      const iso = isoDay(date);
      cells.push({ date, iso, inMonth: true, leaves: byDay.get(iso) ?? [] });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, iso: '', inMonth: false, leaves: [] });
    }
    return cells;
  }, [cursor, leaves, employeeById]);

  const today = startOfDay(new Date());
  const todayIso = isoDay(today);

  const goPrev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const goNext = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goToday = () => setCursor(startOfMonth(new Date()));

  const openDayCell = openDay ? grid.find((c) => c.iso === openDay) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          {MONTH_LABELS[cursor.getMonth()]} {cursor.getFullYear()}
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goPrev} aria-label="Previous month">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goNext} aria-label="Next month">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="grid grid-cols-7 border-b border-border bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="px-2 py-2 text-center">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {grid.map((cell, index) => {
            if (!cell.date) {
              return (
                <div
                  key={`pad-${index}`}
                  className="min-h-24 border-b border-r border-border bg-muted/20 last:border-r-0"
                />
              );
            }
            const isToday = cell.iso === todayIso;
            const visibleLeaves = cell.leaves.slice(0, 3);
            const overflow = cell.leaves.length - visibleLeaves.length;
            const isFree = cell.leaves.length === 0;

            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => {
                  if (cell.leaves.length > 0) {
                    setOpenDay(cell.iso === openDay ? null : cell.iso);
                  } else if (onApplyForDay) {
                    onApplyForDay(cell.iso);
                  }
                }}
                className="group min-h-24 border-b border-r border-border p-2 text-left transition-colors hover:bg-muted/40 last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500'
                        : 'text-foreground'
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>
                  {isFree && onApplyForDay && (
                    <Plus
                      className="h-3 w-3 text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  {visibleLeaves.map(({ request, employee }) => (
                    <span
                      key={request.id}
                      title={`${employee.name} — ${request.type} leave`}
                      className={
                        request.status === 'approved'
                          ? 'inline-flex items-center'
                          : 'inline-flex items-center opacity-60'
                      }
                    >
                      <Avatar className="h-5 w-5">
                        {employee.avatarUrl && (
                          <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                        )}
                        <AvatarFallback className="bg-blue-100 text-[9px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                    </span>
                  ))}
                  {overflow > 0 && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      +{overflow}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {openDayCell && openDayCell.leaves.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              {new Date(openDayCell.iso).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h4>
            <div className="flex items-center gap-2">
              {onApplyForDay && (
                <Button size="sm" variant="outline" onClick={() => onApplyForDay(openDayCell.iso)}>
                  Apply for this day
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => setOpenDay(null)}>
                Close
              </Button>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {openDayCell.leaves.map(({ request, employee }) => (
              <li
                key={request.id}
                className="flex items-center gap-3 rounded-md border border-border p-2"
              >
                <Avatar className="h-8 w-8">
                  {employee.avatarUrl && (
                    <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                  )}
                  <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee.department} · {request.type} leave
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${
                    request.status === 'approved'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-200 dark:bg-blue-900" />
          Approved leave
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-200 opacity-60 dark:bg-blue-900" />
          Pending leave
        </span>
        {onApplyForDay && <span>Click any free day to apply for leave from that date.</span>}
      </div>
    </div>
  );
}
