import { ComingSoon } from '@/components/coming-soon';
import { ShoppingCart } from 'lucide-react';

export default function StoreRequestsPage() {
  return (
    <ComingSoon
      title="Store Requests"
      description="Request supplies and equipment from the company store."
      icon={ShoppingCart}
    />
  );
}
