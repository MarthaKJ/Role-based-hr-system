'use client';

import { useMemo, useState } from 'react';
import { usePayslips } from '@/context/payslips-context';
import { useEmployees } from '@/context/employees-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Eye, Download, Send, AlertCircle } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AdminPayslipsPage() {
  const { payslips, generatePayslip } = usePayslips();
  const { employees } = useEmployees();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [formError, setFormError] = useState('');

  const sortedPayslips = useMemo(
    () =>
      [...payslips].sort(
        (a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime(),
      ),
    [payslips],
  );

  const getMonthName = (month: number) => MONTHS[month - 1] ?? '';

  const getEmployeeName = (id: string) => {
    const employee = employees.find((e) => e.id === id);
    return employee?.name ?? 'Unknown';
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const resetForm = () => {
    setEmployeeId('');
    setMonth(String(new Date().getMonth() + 1));
    setYear(String(new Date().getFullYear()));
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!employeeId) {
      setFormError('Please select an employee.');
      return;
    }
    const monthNum = Number(month);
    const yearNum = Number(year);
    if (!monthNum || monthNum < 1 || monthNum > 12) {
      setFormError('Please select a valid month.');
      return;
    }
    if (!yearNum || yearNum < 2000 || yearNum > 2100) {
      setFormError('Please enter a valid year.');
      return;
    }

    const result = generatePayslip(employeeId, monthNum, yearNum);
    if (!result) {
      setFormError(
        `A payslip already exists for ${getEmployeeName(employeeId)} — ${getMonthName(monthNum)} ${yearNum}.`,
      );
      return;
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Payslips Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate, view, and manage payslips for all employees.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Generate Payslip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Payslip</DialogTitle>
              <DialogDescription>
                Create a payslip for an employee for the selected period. The default salary
                template is used.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ps-employee">Employee</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger id="ps-employee">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} — {employee.employeeId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ps-month">Month</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger id="ps-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((label, index) => (
                        <SelectItem key={index} value={String(index + 1)}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ps-year">Year</Label>
                  <Input
                    id="ps-year"
                    type="number"
                    min="2000"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Generate</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Total Payslips</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{payslips.length}</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {payslips.filter((p) => p.month === new Date().getMonth() + 1).length}
          </p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Total Distributed</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            ${payslips.reduce((acc, p) => acc + p.netSalary, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">Payslips History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Period</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Gross Salary</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayslips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No payslips yet.
                  </td>
                </tr>
              ) : (
                sortedPayslips.map((payslip) => (
                  <tr
                    key={payslip.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {getEmployeeName(payslip.employeeId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {getMonthName(payslip.month)} {payslip.year}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                      ${payslip.grossSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600 dark:text-green-400">
                      ${payslip.netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(payslip.generatedDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
