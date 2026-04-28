import { Card } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon = Construction }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="border border-border bg-card p-12 shadow-none">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Icon className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Coming Soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            This module is under development and will be available in an upcoming release. Check
            back soon.
          </p>
        </div>
      </Card>
    </div>
  );
}
