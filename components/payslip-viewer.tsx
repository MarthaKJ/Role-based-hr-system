'use client';

import { Payslip } from '@/lib/types';
import { PayslipCustomization } from '@/hooks/use-payslip-customization';
import { useAuth } from '@/context/auth-context';
import { currentUser } from '@/lib/mock-data';

const colorThemes = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900',
    text: 'text-blue-900 dark:text-blue-200',
    header: 'bg-blue-100 dark:bg-blue-950/50',
    badge: 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-900',
    text: 'text-green-900 dark:text-green-200',
    header: 'bg-green-100 dark:bg-green-950/50',
    badge: 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-900',
    text: 'text-purple-900 dark:text-purple-200',
    header: 'bg-purple-100 dark:bg-purple-950/50',
    badge: 'bg-purple-200 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-900/40',
    border: 'border-slate-200 dark:border-slate-800',
    text: 'text-slate-900 dark:text-slate-200',
    header: 'bg-slate-100 dark:bg-slate-900/60',
    badge: 'bg-slate-200 text-slate-800 dark:bg-slate-800/50 dark:text-slate-200',
  },
};

interface PayslipViewerProps {
  payslip: Payslip;
  customization: PayslipCustomization;
}

export function PayslipViewer({ payslip, customization }: PayslipViewerProps) {
  const theme = colorThemes[customization.templateColor];
  const { user } = useAuth();
  const employee = user ?? currentUser;

  const getMonthName = (month: number) => {
    return new Date(2026, month - 1).toLocaleDateString('en-US', { month: 'long' });
  };

  return (
    <div id="payslip-print" className={`${theme.bg} rounded-lg border ${theme.border} overflow-hidden`}>
      <div className={`${theme.header} px-8 py-8`}>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${theme.text}`}>IDRC</h1>
            <p className="text-sm text-muted-foreground mt-1">Human Resources Management System</p>
          </div>
          <div className="text-right">
            <h2 className={`text-2xl font-bold ${theme.text}`}>PAYSLIP</h2>
            <p className={`text-sm ${theme.text} opacity-75`}>
              {getMonthName(payslip.month)} {payslip.year}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Employee Information */}
        {customization.showDepartmentInfo && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Employee Name</p>
              <p className="text-sm font-medium text-foreground">{employee.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Employee ID</p>
              <p className="text-sm font-medium text-foreground">{employee.employeeId}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Department</p>
              <p className="text-sm font-medium text-foreground">{employee.department}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Designation</p>
              <p className="text-sm font-medium text-foreground">{employee.designation}</p>
            </div>
          </div>
        )}

        {/* Salary Summary */}
        <div className="border-t border-border pt-6">
          <h3 className={`font-bold ${theme.text} mb-4`}>Salary Breakdown</h3>

          {customization.showGrossSalary && (
            <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3">
              <div className={`${theme.badge} rounded-lg p-4`}>
                <p className="text-xs font-semibold opacity-75">Basic Salary</p>
                <p className="text-lg font-bold mt-1">${payslip.basicSalary.toLocaleString()}</p>
              </div>
              <div className={`${theme.badge} rounded-lg p-4`}>
                <p className="text-xs font-semibold opacity-75">Gross Salary</p>
                <p className="text-lg font-bold mt-1">${payslip.grossSalary.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded-lg p-4">
                <p className="text-xs font-semibold opacity-75">Net Salary</p>
                <p className="text-lg font-bold mt-1">${payslip.netSalary.toLocaleString()}</p>
              </div>
            </div>
          )}

          {customization.showAllowances && payslip.allowances.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-3">Allowances</h4>
              <div className="space-y-2">
                {payslip.allowances.map((allowance, index) => (
                  <div key={index} className="flex justify-between border-b border-border pb-2">
                    <span className="text-foreground/90">{allowance.name}</span>
                    <span className="font-medium text-foreground">
                      ${allowance.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customization.showDeductions && payslip.deductions.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-3">Deductions</h4>
              <div className="space-y-2">
                {payslip.deductions.map((deduction, index) => (
                  <div key={index} className="flex justify-between border-b border-border pb-2">
                    <span className="text-foreground/90">{deduction.name}</span>
                    <span className="font-medium text-foreground">
                      -${deduction.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customization.showTaxes && payslip.taxes.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-3">Taxes & Statutory Deductions</h4>
              <div className="space-y-2">
                {payslip.taxes.map((tax, index) => (
                  <div key={index} className="flex justify-between border-b border-border pb-2">
                    <span className="text-foreground/90">{tax.name}</span>
                    <span className="font-medium text-foreground">
                      -${tax.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bank Details */}
        {customization.showBankDetails && payslip.bankDetails && (
          <div className="border-t border-border pt-6">
            <h3 className={`font-bold ${theme.text} mb-4`}>Bank Details</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Account Name</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {employee.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Account Number</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {payslip.bankDetails.accountNumber}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Bank Name</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {payslip.bankDetails.bankName}
                </p>
              </div>
              {payslip.bankDetails.routingNumber && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Routing Number</p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {payslip.bankDetails.routingNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Generated on {new Date(payslip.generatedDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This is a computer-generated payslip and requires no signature.
          </p>
        </div>
      </div>
    </div>
  );
}
