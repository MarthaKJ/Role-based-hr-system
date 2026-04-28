'use client';

import { mockPayslips, mockEmployees } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Download, Send } from 'lucide-react';

export default function AdminPayslipsPage() {
  const getMonthName = (month: number) => {
    return new Date(2026, month - 1).toLocaleDateString('en-US', { month: 'long' });
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find((e) => e.id === employeeId);
    return employee?.name || 'Unknown';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <Button className="gap-2">
          <Plus size={16} />
          Generate Payslips
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Total Payslips</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{mockPayslips.length}</p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {mockPayslips.filter((p) => p.month === new Date().getMonth() + 1).length}
          </p>
        </Card>
        <Card className="border border-border bg-card p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Total Distributed</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            ${mockPayslips.reduce((acc, p) => acc + p.netSalary, 0).toLocaleString()}
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
              {mockPayslips.map((payslip) => (
                <tr key={payslip.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
