export interface User {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  avatar?: string;
  role: 'employee' | 'admin' | 'hr';
  employeeId: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  grossSalary: number;
  basicSalary: number;
  allowances: {
    name: string;
    amount: number;
  }[];
  deductions: {
    name: string;
    amount: number;
  }[];
  taxes: {
    name: string;
    amount: number;
  }[];
  netSalary: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
  };
  generatedDate: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'compassionate' | 'maternity';
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: Date;
}

export interface LeaveBalance {
  type: string;
  entitled: number;
  balance: number;
}

export interface Approval {
  type: 'leave' | 'timesheet' | 'purchase';
  count: number;
}

export interface PendingApprovals {
  otherApprovals: number;
  leaveRequests: number;
  timeSheets: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface Card {
  id: string;
  title: string;
  count: number;
  icon: string;
  href: string;
}

export interface Asset {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  serialNumber: string;
  issuedDate: Date;
  status: 'active' | 'returned' | 'lost';
}
