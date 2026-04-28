'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { Appraisal } from '@/lib/types';

const initialAppraisals: Appraisal[] = [
  {
    id: 'AP001',
    employeeId: '1',
    period: 'Q1 2026',
    status: 'published',
    managerFeedback:
      'Strong delivery on the payroll dashboard. Continue to take on cross-team initiatives. Mentoring newer engineers has been a real bright spot.',
    rating: 4,
    createdAt: new Date('2026-01-10'),
    publishedAt: new Date('2026-01-15'),
  },
  {
    id: 'AP002',
    employeeId: '1',
    period: 'Q2 2026',
    status: 'draft',
    managerFeedback: '',
    rating: 0,
    createdAt: new Date('2026-04-01'),
    publishedAt: null,
  },
];

interface AppraisalDraft {
  employeeId: string;
  period: string;
  managerFeedback: string;
  rating: number;
}

interface AppraisalUpdate {
  managerFeedback?: string;
  rating?: number;
}

interface AppraisalsContextType {
  appraisals: Appraisal[];
  createAppraisal: (draft: AppraisalDraft) => Appraisal | null;
  updateAppraisal: (id: string, updates: AppraisalUpdate) => void;
  publishAppraisal: (id: string) => void;
  deleteAppraisal: (id: string) => void;
}

const AppraisalsContext = createContext<AppraisalsContextType | undefined>(undefined);

export function AppraisalsProvider({ children }: { children: ReactNode }) {
  const [appraisals, setAppraisals] = useState<Appraisal[]>(initialAppraisals);

  const createAppraisal = useCallback(
    (draft: AppraisalDraft): Appraisal | null => {
      const exists = appraisals.some(
        (a) =>
          a.employeeId === draft.employeeId &&
          a.period.toLowerCase() === draft.period.toLowerCase(),
      );
      if (exists) return null;

      const newAppraisal: Appraisal = {
        id: `AP${Date.now()}`,
        employeeId: draft.employeeId,
        period: draft.period,
        status: 'draft',
        managerFeedback: draft.managerFeedback,
        rating: draft.rating,
        createdAt: new Date(),
        publishedAt: null,
      };
      setAppraisals((prev) => [newAppraisal, ...prev]);
      return newAppraisal;
    },
    [appraisals],
  );

  const updateAppraisal = useCallback((id: string, updates: AppraisalUpdate) => {
    setAppraisals((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }, []);

  const publishAppraisal = useCallback((id: string) => {
    setAppraisals((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'published' as const, publishedAt: new Date() } : a,
      ),
    );
  }, []);

  const deleteAppraisal = useCallback((id: string) => {
    setAppraisals((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AppraisalsContext.Provider
      value={{ appraisals, createAppraisal, updateAppraisal, publishAppraisal, deleteAppraisal }}
    >
      {children}
    </AppraisalsContext.Provider>
  );
}

export function useAppraisals() {
  const context = useContext(AppraisalsContext);
  if (context === undefined) {
    throw new Error('useAppraisals must be used within an AppraisalsProvider');
  }
  return context;
}
