'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { LeaveRequest, PaymentRequest } from '@/lib/types';
import { mockLeaveRequests } from '@/lib/mock-data';

const initialPaymentRequests: PaymentRequest[] = [
  {
    id: 'PR001',
    employeeId: '1',
    category: 'advance-salary',
    title: 'Advance Salary Request',
    amount: 50000,
    date: '2026-04-20',
    status: 'pending',
    description: 'Medical expenses',
  },
  {
    id: 'PR002',
    employeeId: '1',
    category: 'reimbursement',
    title: 'Reimbursement - Office Supplies',
    amount: 5000,
    date: '2026-04-15',
    status: 'approved',
    description: 'Office equipment and supplies',
  },
  {
    id: 'PR003',
    employeeId: '1',
    category: 'reimbursement',
    title: 'Travel Reimbursement',
    amount: 15000,
    date: '2026-04-10',
    status: 'approved',
    description: 'Project travel to branch office',
  },
];

type LeaveDraft = Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>;
type PaymentDraft = Omit<PaymentRequest, 'id' | 'status' | 'date'>;
type Decision = 'approved' | 'rejected';

interface RequestsContextType {
  leaveRequests: LeaveRequest[];
  paymentRequests: PaymentRequest[];
  addLeaveRequest: (request: LeaveDraft) => void;
  addPaymentRequest: (request: PaymentDraft) => void;
  updateLeaveStatus: (id: string, status: Decision) => void;
  updatePaymentStatus: (id: string, status: Decision) => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(initialPaymentRequests);

  const addLeaveRequest = useCallback((request: LeaveDraft) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: `LR${Date.now()}`,
      status: 'pending',
      appliedOn: new Date(),
    };
    setLeaveRequests((prev) => [newRequest, ...prev]);
  }, []);

  const addPaymentRequest = useCallback((request: PaymentDraft) => {
    const newRequest: PaymentRequest = {
      ...request,
      id: `PR${Date.now()}`,
      status: 'pending',
      date: new Date().toISOString().slice(0, 10),
    };
    setPaymentRequests((prev) => [newRequest, ...prev]);
  }, []);

  const updateLeaveStatus = useCallback((id: string, status: Decision) => {
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const updatePaymentStatus = useCallback((id: string, status: Decision) => {
    setPaymentRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  return (
    <RequestsContext.Provider
      value={{
        leaveRequests,
        paymentRequests,
        addLeaveRequest,
        addPaymentRequest,
        updateLeaveStatus,
        updatePaymentStatus,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
}
