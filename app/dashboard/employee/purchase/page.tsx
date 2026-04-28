import { ComingSoon } from '@/components/coming-soon';
import { ShoppingBag } from 'lucide-react';

export default function PurchasePage() {
  return (
    <ComingSoon
      title="Purchase Requisitions"
      description="Submit and track purchase requisitions for your department."
      icon={ShoppingBag}
    />
  );
}
