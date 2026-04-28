import { ComingSoon } from '@/components/coming-soon';
import { Plane } from 'lucide-react';

export default function TravelPage() {
  return (
    <ComingSoon
      title="Travel Requests"
      description="Plan and request approval for business travel."
      icon={Plane}
    />
  );
}
