'use client';

import { useAuth } from '@/context/auth-context';
import { useAppraisals } from '@/context/appraisals-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar } from 'lucide-react';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const ratingLabel = (rating: number) => {
  if (rating === 5) return 'Outstanding';
  if (rating === 4) return 'Exceeds Expectations';
  if (rating === 3) return 'Meets Expectations';
  if (rating === 2) return 'Needs Improvement';
  if (rating === 1) return 'Below Expectations';
  return '';
};

const RatingStars = ({ rating, size = 4 }: { rating: number; size?: 4 | 5 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`${size === 5 ? 'h-5 w-5' : 'h-4 w-4'} ${
          n <= rating
            ? 'fill-amber-400 text-amber-400 dark:fill-amber-300 dark:text-amber-300'
            : 'text-muted-foreground/40'
        }`}
      />
    ))}
  </div>
);

export default function EmployeeAppraisalsPage() {
  const { user } = useAuth();
  const { appraisals } = useAppraisals();

  const myAppraisals = appraisals
    .filter((a) => a.employeeId === (user?.id ?? '1') && a.status === 'published')
    .sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Performance Appraisals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review feedback and ratings from your manager.
        </p>
      </div>

      {myAppraisals.length === 0 ? (
        <Card className="border border-border bg-card p-12 shadow-none">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              You don&apos;t have any published appraisals yet. Your manager will share feedback
              when a review cycle is complete.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {myAppraisals.map((appraisal) => (
            <Card
              key={appraisal.id}
              className="border border-border bg-card p-6 shadow-none"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{appraisal.period}</h3>
                    <Badge
                      variant="secondary"
                      className="bg-muted text-foreground hover:bg-muted"
                    >
                      Published
                    </Badge>
                  </div>
                  {appraisal.publishedAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Shared on {formatDate(appraisal.publishedAt)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <RatingStars rating={appraisal.rating} size={5} />
                  <p className="text-xs font-medium text-muted-foreground">
                    {ratingLabel(appraisal.rating)}
                  </p>
                </div>
              </div>

              {appraisal.managerFeedback && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Manager Feedback
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm text-foreground">
                    {appraisal.managerFeedback}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
