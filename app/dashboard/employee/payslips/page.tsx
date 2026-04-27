'use client';

import { mockPayslips } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PayslipsPage() {
  const sortedPayslips = [...mockPayslips].sort(
    (a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime()
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Payslips</h1>
        <p className="mt-2 text-gray-600">
          View and download your payslips from previous months.
        </p>
      </div>

      <Card className="border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Period</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Gross Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Net Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Generated</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayslips.map((payslip) => (
                <tr key={payslip.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {getMonthName(payslip.month)} {payslip.year}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">
                      ${payslip.grossSalary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-green-600 font-medium">
                      ${payslip.netSalary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(payslip.generatedDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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
