'use client';

import { mockPayslips, mockEmployees } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
          <h1 className="text-3xl font-bold text-gray-900">Payslips Management</h1>
          <p className="mt-2 text-gray-600">
            Generate, view, and manage payslips for all employees.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Generate Payslips
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
          <p className="text-sm text-gray-600">Total Payslips</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{mockPayslips.length}</p>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 p-6">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="mt-2 text-3xl font-bold text-green-900">
            {mockPayslips.filter((p) => p.month === new Date().getMonth() + 1).length}
          </p>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 p-6">
          <p className="text-sm text-gray-600">Total Distributed</p>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            ${mockPayslips.reduce((acc, p) => acc + p.netSalary, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      <Card className="border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">Payslips History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Period</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Gross Salary</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Net Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Generated</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPayslips.map((payslip) => (
                <tr key={payslip.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {getEmployeeName(payslip.employeeId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getMonthName(payslip.month)} {payslip.year}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    ${payslip.grossSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                    ${payslip.netSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(payslip.generatedDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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
