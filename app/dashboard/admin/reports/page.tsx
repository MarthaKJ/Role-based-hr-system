import { ComingSoon } from '@/components/coming-soon';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <ComingSoon
      title="Reports"
      description="Generate and analyse company-wide HR reports — headcount, payroll trends, leave patterns."
      icon={BarChart3}
    />
  );
}
