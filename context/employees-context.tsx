'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { User } from '@/lib/types';
import { mockEmployees } from '@/lib/mock-data';

type EmployeeDraft = Omit<User, 'id' | 'employeeId'>;
type EmployeeUpdate = Partial<Omit<User, 'id' | 'employeeId'>>;

interface EmployeesContextType {
  employees: User[];
  addEmployee: (draft: EmployeeDraft) => User;
  updateEmployee: (id: string, updates: EmployeeUpdate) => void;
  removeEmployee: (id: string) => void;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

const nextEmployeeId = (employees: User[]) => {
  const maxNumeric = employees.reduce((max, e) => {
    const match = e.employeeId.match(/EMP(\d+)/);
    if (!match) return max;
    return Math.max(max, parseInt(match[1], 10));
  }, 0);
  return `EMP${String(maxNumeric + 1).padStart(3, '0')}`;
};

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<User[]>(mockEmployees);

  const addEmployee = useCallback(
    (draft: EmployeeDraft): User => {
      const newId = (Math.max(...employees.map((e) => Number(e.id))) + 1).toString();
      const newEmployee: User = {
        ...draft,
        id: newId,
        employeeId: nextEmployeeId(employees),
      };
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    },
    [employees],
  );

  const updateEmployee = useCallback((id: string, updates: EmployeeUpdate) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const removeEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <EmployeesContext.Provider
      value={{ employees, addEmployee, updateEmployee, removeEmployee }}
    >
      {children}
    </EmployeesContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeesContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeesProvider');
  }
  return context;
}
