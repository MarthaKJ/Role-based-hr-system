'use client';

import { usePayslips } from '@/context/payslips-context';
import { usePayslipCustomization } from '@/hooks/use-payslip-customization';
import { PayslipViewer } from '@/components/payslip-viewer';
import { PayslipCustomizer } from '@/components/payslip-customizer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PayslipDetailPage() {
  const params = useParams();
  const payslipId = params.id as string;

  const { payslips } = usePayslips();
  const payslip = payslips.find((p) => p.id === payslipId);
  const { customization, toggleSection, setTemplateColor, resetCustomization } =
    usePayslipCustomization();

  if (!payslip) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/employee/payslips">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} />
            Back to Payslips
          </Button>
        </Link>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Payslip not found.</p>
        </div>
      </div>
    );
  }

  const getMonthName = (month: number) => {
    return new Date(2026, month - 1).toLocaleDateString('en-US', { month: 'long' });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/employee/payslips">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} />
            Back to Payslips
          </Button>
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">
          {getMonthName(payslip.month)} {payslip.year} Payslip
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Payslip Viewer */}
        <div className="lg:col-span-2">
          <PayslipViewer payslip={payslip} customization={customization} />
        </div>

        {/* Customizer Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <PayslipCustomizer
              customization={customization}
              onToggleSection={toggleSection}
              onSetColor={setTemplateColor}
              onReset={resetCustomization}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
