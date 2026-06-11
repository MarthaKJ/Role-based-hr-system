'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AttendanceRecord } from '@/lib/types';
import { mockAttendance } from '@/lib/mock-data';

interface AttendanceContextType {
  attendance: AttendanceRecord[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [attendance] = useState<AttendanceRecord[]>(mockAttendance);
  return (
    <AttendanceContext.Provider value={{ attendance }}>{children}</AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
