import { ComingSoon } from '@/components/coming-soon';
import { Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Configure company information, leave policies, and approval workflows."
      icon={SettingsIcon}
    />
  );
}
