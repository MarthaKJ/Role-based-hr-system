import { ComingSoon } from '@/components/coming-soon';
import { Star } from 'lucide-react';

export default function AppraisalsPage() {
  return (
    <ComingSoon
      title="Performance Appraisals"
      description="View your performance reviews, goals, and feedback."
      icon={Star}
    />
  );
}
