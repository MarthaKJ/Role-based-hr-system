'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ClipboardList,
  Plus,
  Send,
  Star,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useEmployees } from '@/context/employees-context';
import { useAppraisals, AppraisalUpdate } from '@/context/appraisals-context';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getInitials } from '@/lib/utils';

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

interface RatingPickerProps {
  value: number;
  onChange: (n: number) => void;
  label?: string;
}

const RatingPicker = ({ value, onChange, label }: RatingPickerProps) => (
  <div className="flex items-center gap-3">
    {label && <span className="min-w-[7rem] text-sm text-muted-foreground">{label}</span>}
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
    <span className="text-xs text-muted-foreground">{value > 0 ? `${value}/5` : '—'}</span>
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

interface FormState {
  employeeId: string;
  period: string;
  performance: number;
  teamwork: number;
  communication: number;
  technical: number;
  attendance: number;
  strengths: string;
  weaknesses: string;
  recommendations: string;
  feedback: string;
}

const emptyForm: FormState = {
  employeeId: '',
  period: '',
  performance: 0,
  teamwork: 0,
  communication: 0,
  technical: 0,
  attendance: 0,
  strengths: '',
  weaknesses: '',
  recommendations: '',
  feedback: '',
};

export default function ManagerAppraisalsPage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { appraisals, createAppraisal, updateAppraisal, publishAppraisal, deleteAppraisal } =
    useAppraisals();

  const [mode, setMode] = useState<DialogMode>({ kind: 'closed' });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');

  const team = useMemo(
    () => (user ? employees.filter((e) => e.managerId === user.id) : []),
    [employees, user],
  );
  const teamIds = useMemo(() => new Set(team.map((t) => t.id)), [team]);

  const teamAppraisals = useMemo(
    () =>
      appraisals
        .filter((a) => teamIds.has(a.employeeId))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [appraisals, teamIds],
  );

  const counts = useMemo(
    () => ({
      drafts: teamAppraisals.filter((a) => a.status === 'draft').length,
      published: teamAppraisals.filter((a) => a.status === 'published').length,
    }),
    [teamAppraisals],
  );

  const employeeName = (id: string) =>
    employees.find((e) => e.id === id)?.name ?? 'Unknown employee';
  const employeeData = (id: string) => employees.find((e) => e.id === id);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setMode({ kind: 'create' });
  };

  const openEdit = (appraisal: Appraisal) => {
    setForm({
      employeeId: appraisal.employeeId,
      period: appraisal.period,
      performance: appraisal.rating,
      teamwork: appraisal.teamworkRating ?? 0,
      communication: appraisal.communicationRating ?? 0,
      technical: appraisal.technicalRating ?? 0,
      attendance: appraisal.attendanceRating ?? 0,
      strengths: appraisal.strengths ?? '',
      weaknesses: appraisal.weaknesses ?? '',
      recommendations: appraisal.recommendations ?? '',
      feedback: appraisal.managerFeedback,
    });
    setFormError('');
    setMode({ kind: 'edit', appraisal });
  };

  const closeDialog = () => {
    setMode({ kind: 'closed' });
    setForm(emptyForm);
    setFormError('');
  };

  const validate = (requireFull: boolean) => {
    if (mode.kind === 'create' && !form.employeeId) {
      setFormError('Please choose a team member.');
      return false;
    }
    if (mode.kind === 'create' && !form.period.trim()) {
      setFormError('Please enter a period (e.g. Q3 2026).');
      return false;
    }
    if (requireFull) {
      if (form.performance < 1) {
        setFormError('Please set an overall performance rating.');
        return false;
      }
      if (!form.feedback.trim()) {
        setFormError('Please add manager comments before publishing.');
        return false;
      }
    }
    return true;
  };

  const buildUpdate = (): AppraisalUpdate => ({
    managerFeedback: form.feedback.trim(),
    rating: form.performance,
    teamworkRating: form.teamwork || undefined,
    communicationRating: form.communication || undefined,
    technicalRating: form.technical || undefined,
    attendanceRating: form.attendance || undefined,
    strengths: form.strengths.trim() || undefined,
    weaknesses: form.weaknesses.trim() || undefined,
    recommendations: form.recommendations.trim() || undefined,
  });

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate(false)) return;

    if (mode.kind === 'edit') {
      updateAppraisal(mode.appraisal.id, buildUpdate());
    } else {
      const result = createAppraisal({
        employeeId: form.employeeId,
        period: form.period.trim(),
        managerFeedback: form.feedback.trim(),
        rating: form.performance,
        teamworkRating: form.teamwork || undefined,
        communicationRating: form.communication || undefined,
        technicalRating: form.technical || undefined,
        attendanceRating: form.attendance || undefined,
        strengths: form.strengths.trim() || undefined,
        weaknesses: form.weaknesses.trim() || undefined,
        recommendations: form.recommendations.trim() || undefined,
      });
      if (!result) {
        setFormError(
          `${employeeName(form.employeeId)} already has an appraisal for ${form.period.trim()}.`,
        );
        return;
      }
    }
    closeDialog();
  };

  const handleSubmit = () => {
    setFormError('');
    if (!validate(true)) return;

    if (mode.kind === 'edit') {
      updateAppraisal(mode.appraisal.id, buildUpdate());
      publishAppraisal(mode.appraisal.id);
    } else {
      const result = createAppraisal({
        employeeId: form.employeeId,
        period: form.period.trim(),
        managerFeedback: form.feedback.trim(),
        rating: form.performance,
        teamworkRating: form.teamwork || undefined,
        communicationRating: form.communication || undefined,
        technicalRating: form.technical || undefined,
        attendanceRating: form.attendance || undefined,
        strengths: form.strengths.trim() || undefined,
        weaknesses: form.weaknesses.trim() || undefined,
        recommendations: form.recommendations.trim() || undefined,
      });
      if (!result) {
        setFormError(
          `${employeeName(form.employeeId)} already has an appraisal for ${form.period.trim()}.`,
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
        `Delete appraisal for ${employeeName(appraisal.employeeId)} — ${appraisal.period}?`,
      )
    ) {
      deleteAppraisal(appraisal.id);
    }
  };

  const isEdit = mode.kind === 'edit';
  const isPublished = mode.kind === 'edit' && mode.appraisal.status === 'published';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Appraisals</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rate, comment on, and publish performance appraisals for your team.
          </p>
        </div>
        <Button className="gap-2 w-fit" onClick={openCreate}>
          <Plus size={16} />
          New Appraisal
        </Button>
      </div>

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

      <Dialog open={mode.kind !== 'closed'} onOpenChange={(open) => (open ? null : closeDialog())}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? `${isPublished ? 'View' : 'Edit'} Appraisal — ${employeeName(
                    mode.kind === 'edit' ? mode.appraisal.employeeId : '',
                  )}`
                : 'New Appraisal'}
            </DialogTitle>
            <DialogDescription>
              Rate criteria on a 1–5 scale. Save as draft to keep working, or submit to publish to
              the employee.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveDraft} className="space-y-5">
            {formError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>
              </div>
            )}

            {!isEdit && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ap-employee">Team Member</Label>
                  <Select
                    value={form.employeeId}
                    onValueChange={(v) => setForm({ ...form, employeeId: v })}
                  >
                    <SelectTrigger id="ap-employee">
                      <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {team.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} — {member.employeeId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ap-period">Period</Label>
                  <Input
                    id="ap-period"
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="e.g. Q3 2026"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
              <Label>Ratings</Label>
              <RatingPicker
                value={form.performance}
                onChange={(v) => setForm({ ...form, performance: v })}
                label="Performance"
              />
              <RatingPicker
                value={form.teamwork}
                onChange={(v) => setForm({ ...form, teamwork: v })}
                label="Teamwork"
              />
              <RatingPicker
                value={form.communication}
                onChange={(v) => setForm({ ...form, communication: v })}
                label="Communication"
              />
              <RatingPicker
                value={form.technical}
                onChange={(v) => setForm({ ...form, technical: v })}
                label="Technical"
              />
              <RatingPicker
                value={form.attendance}
                onChange={(v) => setForm({ ...form, attendance: v })}
                label="Attendance"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ap-strengths">Strengths</Label>
                <Textarea
                  id="ap-strengths"
                  rows={3}
                  value={form.strengths}
                  onChange={(e) => setForm({ ...form, strengths: e.target.value })}
                  placeholder="Key strengths and achievements…"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ap-weaknesses">Areas to Develop</Label>
                <Textarea
                  id="ap-weaknesses"
                  rows={3}
                  value={form.weaknesses}
                  onChange={(e) => setForm({ ...form, weaknesses: e.target.value })}
                  placeholder="Areas needing growth…"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ap-recommendations">Recommendations</Label>
              <Textarea
                id="ap-recommendations"
                rows={2}
                value={form.recommendations}
                onChange={(e) => setForm({ ...form, recommendations: e.target.value })}
                placeholder="Suggested next steps, training, or growth opportunities…"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ap-feedback">Manager Comments</Label>
              <Textarea
                id="ap-feedback"
                rows={4}
                value={form.feedback}
                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                placeholder="Summary feedback for the employee…"
              />
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="outline" disabled={isPublished}>
                {isEdit ? 'Save Changes' : 'Save as Draft'}
              </Button>
              {!isPublished && (
                <Button type="button" className="gap-2" onClick={handleSubmit}>
                  <Send size={14} />
                  {isEdit ? 'Publish' : 'Submit & Publish'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-base font-semibold text-foreground">Appraisal History</h3>
        </div>
        {teamAppraisals.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
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
                    Performance
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
                {teamAppraisals.map((appraisal) => {
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
                          {isDraft && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              onClick={() => handleDelete(appraisal)}
                              aria-label="Delete appraisal"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
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
