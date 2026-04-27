'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PayslipCustomization } from '@/hooks/use-payslip-customization';
import { Download, Printer, Mail, RotateCcw } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

interface PayslipCustomizerProps {
  customization: PayslipCustomization;
  onToggleSection: (section: keyof Omit<PayslipCustomization, 'templateColor'>) => void;
  onSetColor: (color: PayslipCustomization['templateColor']) => void;
  onReset: () => void;
}

const colorOptions: Array<{ value: PayslipCustomization['templateColor']; label: string }> = [
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'slate', label: 'Slate' },
];

export function PayslipCustomizer({
  customization,
  onToggleSection,
  onSetColor,
  onReset,
}: PayslipCustomizerProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Payslip',
  });

  const handleDownloadPDF = () => {
    // For now, we'll use print to PDF functionality
    // In production, you'd integrate with jsPDF or html2pdf
    alert('PDF download functionality will be implemented with backend integration');
  };

  const handleEmailPayslip = () => {
    alert('Email functionality will be implemented with backend integration');
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button
          onClick={() => handlePrint()}
          variant="outline"
          className="gap-2"
        >
          <Printer size={16} />
          <span className="hidden sm:inline">Print</span>
        </Button>
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="gap-2"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Download PDF</span>
        </Button>
        <Button
          onClick={handleEmailPayslip}
          variant="outline"
          className="gap-2"
        >
          <Mail size={16} />
          <span className="hidden sm:inline">Email</span>
        </Button>
      </div>

      {/* Customization Options */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Show/Hide Sections</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="gross-salary"
                  checked={customization.showGrossSalary}
                  onCheckedChange={() => onToggleSection('showGrossSalary')}
                />
                <Label htmlFor="gross-salary" className="cursor-pointer font-medium text-gray-700">
                  Gross Salary & Breakdown
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="allowances"
                  checked={customization.showAllowances}
                  onCheckedChange={() => onToggleSection('showAllowances')}
                />
                <Label htmlFor="allowances" className="cursor-pointer font-medium text-gray-700">
                  Allowances
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="deductions"
                  checked={customization.showDeductions}
                  onCheckedChange={() => onToggleSection('showDeductions')}
                />
                <Label htmlFor="deductions" className="cursor-pointer font-medium text-gray-700">
                  Deductions
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="taxes"
                  checked={customization.showTaxes}
                  onCheckedChange={() => onToggleSection('showTaxes')}
                />
                <Label htmlFor="taxes" className="cursor-pointer font-medium text-gray-700">
                  Taxes & Statutory Deductions
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="bank-details"
                  checked={customization.showBankDetails}
                  onCheckedChange={() => onToggleSection('showBankDetails')}
                />
                <Label htmlFor="bank-details" className="cursor-pointer font-medium text-gray-700">
                  Bank Details
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="department"
                  checked={customization.showDepartmentInfo}
                  onCheckedChange={() => onToggleSection('showDepartmentInfo')}
                />
                <Label htmlFor="department" className="cursor-pointer font-medium text-gray-700">
                  Department & Designation
                </Label>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Template Color</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSetColor(option.value)}
                  className={`rounded-lg px-4 py-2 font-medium transition-all ${
                    customization.templateColor === option.value
                      ? `ring-2 ring-offset-2 ring-blue-500 ${
                        option.value === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : option.value === 'green'
                          ? 'bg-green-100 text-green-800'
                          : option.value === 'purple'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-800'
                      }`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <Button
              onClick={onReset}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <RotateCcw size={16} />
              Reset to Default
            </Button>
          </div>
        </div>
      </Card>

      {/* Hidden print ref */}
      <div className="hidden">
        <div ref={printRef} />
      </div>
    </div>
  );
}
