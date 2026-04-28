'use client';

import { usePayslips } from '@/context/payslips-context';
import { useAuth } from '@/context/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PayslipsPage() {
  const { user } = useAuth();
  const { payslips } = usePayslips();

  const sortedPayslips = payslips
    .filter((p) => p.employeeId === (user?.id ?? '1'))
    .sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMonthName = (month: number) => {
    return new Date(2026, month - 1).toLocaleDateString('en-US', { month: 'long' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Payslips</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and download your payslips from previous months.
        </p>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Gross Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayslips.map((payslip) => (
                <tr key={payslip.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {getMonthName(payslip.month)} {payslip.year}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      ${payslip.grossSalary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-green-600 dark:text-green-400">
                      ${payslip.netSalary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(payslip.generatedDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link href={`/dashboard/employee/payslips/${payslip.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye size={16} />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Mail size={16} />
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
