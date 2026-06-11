'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { StoreItem, StoreRequest } from '@/lib/types';

const initialCatalog: StoreItem[] = [
  { id: 'ITEM001', name: 'Notebook (A5)', description: 'Lined paper notebook', stock: 50 },
  { id: 'ITEM002', name: 'Ballpoint Pens (12-pack)', description: 'Black ink pens', stock: 25 },
  { id: 'ITEM003', name: 'Wireless Mouse', description: 'USB receiver, 2.4GHz', stock: 12 },
  { id: 'ITEM004', name: 'Wireless Keyboard', description: 'Compact mechanical layout', stock: 8 },
  { id: 'ITEM005', name: 'Headphones', description: 'Noise-cancelling, over-ear', stock: 6 },
  { id: 'ITEM006', name: 'External Monitor (24")', description: '1080p IPS display', stock: 4 },
  { id: 'ITEM007', name: 'USB-C Hub', description: '6-in-1 with HDMI, USB-A, SD', stock: 10 },
  { id: 'ITEM008', name: 'Branded T-Shirt', description: 'Company-branded, sizes S–XL', stock: 35 },
];

const initialRequests: StoreRequest[] = [
  {
    id: 'SR001',
    employeeId: '1',
    itemId: 'ITEM003',
    quantity: 1,
    reason: 'Existing mouse stopped working',
    status: 'pending',
    requestedAt: new Date('2026-04-22'),
  },
];

type StoreRequestDraft = Omit<StoreRequest, 'id' | 'status' | 'requestedAt'>;

interface StoreContextType {
  catalog: StoreItem[];
  requests: StoreRequest[];
  addRequest: (draft: StoreRequestDraft) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  issueRequest: (id: string) => { ok: boolean; error?: string };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<StoreItem[]>(initialCatalog);
  const [requests, setRequests] = useState<StoreRequest[]>(initialRequests);

  const addRequest = useCallback((draft: StoreRequestDraft) => {
    const newRequest: StoreRequest = {
      ...draft,
      id: `SR${Date.now()}`,
      status: 'pending',
      requestedAt: new Date(),
    };
    setRequests((prev) => [newRequest, ...prev]);
  }, []);

  const approveRequest = useCallback((id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
  }, []);

  const rejectRequest = useCallback((id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));
  }, []);

  const issueRequest = useCallback(
    (id: string): { ok: boolean; error?: string } => {
      const request = requests.find((r) => r.id === id);
      if (!request) return { ok: false, error: 'Request not found.' };
      const item = catalog.find((i) => i.id === request.itemId);
      if (!item) return { ok: false, error: 'Item no longer in catalog.' };
      if (item.stock < request.quantity) {
        return { ok: false, error: `Only ${item.stock} in stock; requested ${request.quantity}.` };
      }
      setCatalog((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, stock: i.stock - request.quantity } : i)),
      );
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'issued' } : r)));
      return { ok: true };
    },
    [catalog, requests],
  );

  return (
    <StoreContext.Provider
      value={{ catalog, requests, addRequest, approveRequest, rejectRequest, issueRequest }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
