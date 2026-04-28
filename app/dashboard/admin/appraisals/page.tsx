'use client';

import { useMemo, useState } from 'react';
import { useEmployees } from '@/context/employees-context';
import { useAppraisals } from '@/context/appraisals-context';
import { Appraisal } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Plus, Star, AlertCircle, ClipboardList, Send, Trash2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const RatingPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        type="button"
        key={n}
        onClick={() => onChange(n)}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
        className="rounded p-1 hover:bg-muted"
      >
        <Star
          className={`h-5 w-5 ${
            n <= value
              ? 'fill-amber-400 text-amber-400 dark:fill-amber-300 dark:text-amber-300'
              : 'text-muted-foreground/40'
          }`}
        />
      </button>
    ))}
  </div>
);

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`h-3.5 w-3.5 ${
          n <= rating
            ? 'fill-amber-400 text-amber-400 dark:fill-amber-300 dark:text-amber-300'
            : 'text-muted-foreground/40'
        }`}
      />
    ))}
  </div>
);

type DialogMode =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; appraisal: Appraisal };

export default function AdminAppraisalsPage() {
  const { employees } = useEmployees();
  const { appraisals, createAppraisal, updateAppraisal, publishAppraisal, deleteAppraisal } =
    useAppraisals();

  const [mode, setMode] = useState<DialogMode>({ kind: 'closed' });
  const [employeeId, setEmployeeId] = useState('');
  const [period, setPeriod] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [formError, setFormError] = useState('');

  const employeeName = (id: string) =>
    employees.find((e) => e.id === id)?.name ?? 'Unknown employee';
  const employeeData = (id: string) => employees.find((e) => e.id === id);

  const sortedAppraisals = useMemo(
    () =>
      [...appraisals].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [appraisals],
  );

  const counts = useMemo(
    () => ({
      drafts: appraisals.filter((a) => a.status === 'draft').length,
      published: appraisals.filter((a) => a.status === 'published').length,
    }),
    [appraisals],
  );

  const resetForm = () => {
    setEmployeeId('');
    setPeriod('');
    setFeedback('');
    setRating(0);
    setFormError('');
  };

  const openCreate = () => {
    resetForm();
    setMode({ kind: 'create' });
  };

  const openEdit = (appraisal: Appraisal) => {
    setEmployeeId(appraisal.employeeId);
    setPeriod(appraisal.period);
    setFeedback(appraisal.managerFeedback);
    setRating(appraisal.rating);
    setFormError('');
    setMode({ kind: 'edit', appraisal });
  };

  const closeDialog = () => {
    setMode({ kind: 'closed' });
    resetForm();
  };

  const validate = () => {
    if (mode.kind === 'create' && !employeeId) {
      setFormError('Please choose an employee.');
      return false;
    }
    if (mode.kind === 'create' && !period.trim()) {
      setFormError('Please enter a period (e.g. Q3 2026).');
      return false;
    }
    if (!feedback.trim()) {
      setFormError('Please write feedback for the employee.');
      return false;
    }
    if (rating < 1 || rating > 5) {
      setFormError('Please select a rating between 1 and 5.');
      return false;
    }
    return true;
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    if (mode.kind === 'edit') {
      updateAppraisal(mode.appraisal.id, {
        managerFeedback: feedback.trim(),
        rating,
      });
    } else {
      const result = createAppraisal({
        employeeId,
        period: period.trim(),
        managerFeedback: feedback.trim(),
        rating,
      });
      if (!result) {
        setFormError(
          `${employeeName(employeeId)} already has an appraisal for ${period.trim()}.`,
        );
        return;
      }
    }
    closeDialog();
  };

  const handleSaveAndPublish = () => {
    setFormError('');
    if (!validate()) return;

    if (mode.kind === 'edit') {
      updateAppraisal(mode.appraisal.id, {
        managerFeedback: feedback.trim(),
        rating,
      });
      publishAppraisal(mode.appraisal.id);
    } else {
      const result = createAppraisal({
        employeeId,
        period: period.trim(),
        managerFeedback: feedback.trim(),
        rating,
      });
      if (!result) {
        setFormError(
          `${employeeName(employeeId)} already has an appraisal for ${period.trim()}.`,
        );
        return;
      }
      publishAppraisal(result.id);
    }
    closeDialog();
  };

  const handleDelete = (appraisal: Appraisal) => {
    if (
      confirm(
        `Delete appraisal for ${employeeName(appraisal.employeeId)} — ${appraisal.period}? This cannot be undone.`,
      )
    ) {
      deleteAppraisal(appraisal.id);
    }
  };

  const isEdit = mode.kind === 'edit';
  const isPublished = mode.kind === 'edit' && mode.appraisal.status === 'published';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Performance Appraisals</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Write feedback and rate employees. Save as draft while you work; publish to share with
            the employee.
          </p>
        </div>
        <Dialog
          open={mode.kind === 'create'}
          onOpenChange={(open) => (open ? openCreate() : closeDialog())}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openCreate}>
              <Plus size={16} />
              New Appraisal
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Counts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{counts.drafts}</p>
          <p className="mt-1 text-xs text-muted-foreground">Not yet shared with employees</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{counts.published}</p>
          <p className="mt-1 text-xs text-muted-foreground">Visible to employees</p>
        </Card>
      </div>

      {/* Create / Edit dialog */}
      <Dialog
        open={mode.kind !== 'closed'}
        onOpenChange={(open) => (open ? null : closeDialog())}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? `Edit Appraisal — ${employeeName(mode.kind === 'edit' ? mode.appraisal.employeeId : '')}, ${mode.kind === 'edit' ? mode.appraisal.period : ''}`
                : 'New Appraisal'}
            </DialogTitle>
            <DialogDescription>
              Write your feedback and pick a rating. Save as draft to keep working, or publish to
              share with the employee immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveDraft} className="space-y-4">
            {formError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>
              </div>
            )}

            {!isEdit && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ap-employee">Employee</Label>
                  <Select value={employeeId} onValueChange={setEmployeeId}>
                    <SelectTrigger id="ap-employee">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter((e) => e.role === 'employee')
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} — {employee.employeeId}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ap-period">Period</Label>
                  <Input
                    id="ap-period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="e.g. Q3 2026"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="ap-feedback">Manager Feedback</Label>
              <Textarea
                id="ap-feedback"
                rows={6}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Strengths, areas to develop, achievements, recommendations…"
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <RatingPicker value={rating} onChange={setRating} />
              <p className="text-xs text-muted-foreground">
                {rating === 0 ? 'No rating selected' : `${rating} / 5`}
              </p>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="outline" disabled={isPublished}>
                {isEdit ? 'Save Changes' : 'Save as Draft'}
              </Button>
              {!isPublished && (
                <Button type="button" className="gap-2" onClick={handleSaveAndPublish}>
                  <Send size={14} />
                  {isEdit ? 'Publish' : 'Save & Publish'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* All appraisals */}
      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">All Appraisals</h3>
        </div>
        {sortedAppraisals.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ClipboardList className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              No appraisals yet. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAppraisals.map((appraisal) => {
                  const employee = employeeData(appraisal.employeeId);
                  const isDraft = appraisal.status === 'draft';
                  return (
                    <tr
                      key={appraisal.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
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
                            <p className="text-xs text-muted-foreground">
                              {employee?.designation ?? ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {appraisal.period}
                      </td>
                      <td className="px-6 py-4">
                        {appraisal.rating > 0 ? (
                          <RatingStars rating={appraisal.rating} />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isDraft ? (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-300 dark:hover:bg-yellow-950/50">
                            Draft
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/50">
                            Published
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(appraisal.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(appraisal)}
                          >
                            {isDraft ? 'Edit' : 'View'}
                          </Button>
                          {isDraft && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => publishAppraisal(appraisal.id)}
                              disabled={
                                !appraisal.managerFeedback.trim() || appraisal.rating < 1
                              }
                            >
                              <Send size={14} />
                              Publish
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => handleDelete(appraisal)}
                            aria-label="Delete appraisal"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
