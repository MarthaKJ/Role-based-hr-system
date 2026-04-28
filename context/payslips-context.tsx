'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { Payslip } from '@/lib/types';
import { mockPayslips } from '@/lib/mock-data';

const SALARY_TEMPLATE = {
  basicSalary: 80000,
  allowances: [
    { name: 'House Allowance', amount: 15000 },
    { name: 'Travel Allowance', amount: 5000 },
    { name: 'Performance Bonus', amount: 5000 },
  ],
  deductions: [
    { name: 'Professional Tax', amount: 500 },
    { name: 'Provident Fund', amount: 3200 },
    { name: 'Insurance Deduction', amount: 1000 },
  ],
  taxes: [
    { name: 'Income Tax', amount: 8750 },
    { name: 'Social Security', amount: 2550 },
  ],
};

const computeTotals = () => {
  const grossSalary =
    SALARY_TEMPLATE.basicSalary +
    SALARY_TEMPLATE.allowances.reduce((sum, a) => sum + a.amount, 0);
  const totalDeductions = SALARY_TEMPLATE.deductions.reduce((sum, d) => sum + d.amount, 0);
  const totalTaxes = SALARY_TEMPLATE.taxes.reduce((sum, t) => sum + t.amount, 0);
  return { grossSalary, netSalary: grossSalary - totalDeductions - totalTaxes };
};

interface PayslipsContextType {
  payslips: Payslip[];
  generatePayslip: (employeeId: string, month: number, year: number) => Payslip | null;
}

const PayslipsContext = createContext<PayslipsContextType | undefined>(undefined);

export function PayslipsProvider({ children }: { children: ReactNode }) {
  const [payslips, setPayslips] = useState<Payslip[]>(mockPayslips);

  const generatePayslip = useCallback(
    (employeeId: string, month: number, year: number) => {
      const exists = payslips.some(
        (p) => p.employeeId === employeeId && p.month === month && p.year === year,
      );
      if (exists) return null;

      const { grossSalary, netSalary } = computeTotals();
      const newPayslip: Payslip = {
        id: `PS${Date.now()}`,
        employeeId,
        month,
        year,
        basicSalary: SALARY_TEMPLATE.basicSalary,
        grossSalary,
        allowances: SALARY_TEMPLATE.allowances,
        deductions: SALARY_TEMPLATE.deductions,
        taxes: SALARY_TEMPLATE.taxes,
        netSalary,
        bankDetails: {
          accountName: '',
          accountNumber: '****0000',
          bankName: 'First National Bank',
          routingNumber: '123456789',
        },
        generatedDate: new Date(),
      };
      setPayslips((prev) => [newPayslip, ...prev]);
      return newPayslip;
    },
    [payslips],
  );

  return (
    <PayslipsContext.Provider value={{ payslips, generatePayslip }}>
      {children}
    </PayslipsContext.Provider>
  );
}

export function usePayslips() {
  const context = useContext(PayslipsContext);
  if (context === undefined) {
    throw new Error('usePayslips must be used within a PayslipsProvider');
  }
  return context;
}
