import { User, Payslip, LeaveBalance, LeaveRequest, Asset } from './types';

export const currentUser: User = {
  id: '1',
  name: 'Martha Kisakye',
  email: 'martha.kisakye@company.com',
  designation: 'Senior Software Engineer',
  department: 'Engineering',
  role: 'employee',
  employeeId: 'EMP001',
};

export const mockEmployees: User[] = [
  currentUser,
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@company.com',
    designation: 'Product Manager',
    department: 'Product',
    role: 'employee',
    employeeId: 'EMP002',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    designation: 'HR Manager',
    department: 'Human Resources',
    role: 'hr',
    employeeId: 'EMP003',
  },
];

export const mockPayslips: Payslip[] = [
  {
    id: 'PS001',
    employeeId: '1',
    month: 4,
    year: 2026,
    basicSalary: 80000,
    grossSalary: 105000,
    allowances: [
      { name: 'House Allowance', amount: 15000 },
      { name: 'Travel Allowance', amount: 5000 },
      { name: 'Performance Bonus', amount: 5000 },
    ],
    deductions: [
      { name: 'Professional Tax', amount: 500 },
      { name: 'Provident Fund', amount: 3200 },
      { name: 'Insurance Deduction', amount: 1000 },
    ],
    taxes: [
      { name: 'Income Tax', amount: 8750 },
      { name: 'Social Security', amount: 2550 },
    ],
    netSalary: 88000,
    bankDetails: {
      accountName: 'Gloria Nabirye',
      accountNumber: '****5678',
      bankName: 'First National Bank',
      routingNumber: '123456789',
    },
    generatedDate: new Date('2026-04-30'),
  },
  {
    id: 'PS002',
    employeeId: '1',
    month: 3,
    year: 2026,
    basicSalary: 80000,
    grossSalary: 105000,
    allowances: [
      { name: 'House Allowance', amount: 15000 },
      { name: 'Travel Allowance', amount: 5000 },
      { name: 'Performance Bonus', amount: 5000 },
    ],
    deductions: [
      { name: 'Professional Tax', amount: 500 },
      { name: 'Provident Fund', amount: 3200 },
      { name: 'Insurance Deduction', amount: 1000 },
    ],
    taxes: [
      { name: 'Income Tax', amount: 8750 },
      { name: 'Social Security', amount: 2550 },
    ],
    netSalary: 88000,
    bankDetails: {
      accountName: 'Gloria Nabirye',
      accountNumber: '****5678',
      bankName: 'First National Bank',
      routingNumber: '123456789',
    },
    generatedDate: new Date('2026-03-31'),
  },
];

export const mockLeaveBalances: LeaveBalance[] = [
  { type: 'Annual', entitled: 8, balance: 8 },
  { type: 'Compassionate', entitled: 7, balance: 7 },
  { type: 'Sick', entitled: 22, balance: 22 },
  { type: 'Maternity', entitled: 60, balance: 60 },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR001',
    employeeId: '1',
    type: 'annual',
    startDate: new Date('2026-05-01'),
    endDate: new Date('2026-05-05'),
    days: 5,
    reason: 'Vacation',
    status: 'pending',
    appliedOn: new Date('2026-04-20'),
  },
  {
    id: 'LR002',
    employeeId: '1',
    type: 'sick',
    startDate: new Date('2026-04-10'),
    endDate: new Date('2026-04-12'),
    days: 3,
    reason: 'Flu',
    status: 'approved',
    appliedOn: new Date('2026-04-10'),
  },
];

export const mockAssets: Asset[] = [
  {
    id: 'AS001',
    employeeId: '1',
    name: 'Laptop',
    type: 'Computing Device',
    serialNumber: 'SN-20251001',
    issuedDate: new Date('2024-01-15'),
    status: 'active',
  },
  {
    id: 'AS002',
    employeeId: '1',
    name: 'Mobile Phone',
    type: 'Computing Device',
    serialNumber: 'SN-20250502',
    issuedDate: new Date('2024-06-20'),
    status: 'active',
  },
  {
    id: 'AS003',
    employeeId: '1',
    name: 'Office Chair',
    type: 'Furniture',
    serialNumber: 'SN-20240315',
    issuedDate: new Date('2024-03-15'),
    status: 'active',
  },
];

export const pendingApprovals = {
  otherApprovals: 0,
  leaveRequests: 0,
  timeSheets: 0,
};

export const quickActions = [
  { id: '1', label: 'Apply for Leave', icon: 'Calendar', href: '/dashboard/employee/leave' },
  { id: '2', label: 'View Leave Calendar', icon: 'CalendarDays', href: '/dashboard/employee/calendar' },
  { id: '3', label: 'Submit Time Sheets', icon: 'Clock', href: '/dashboard/employee/timesheets' },
  { id: '4', label: 'Payment Requests', icon: 'CreditCard', href: '/dashboard/employee/payment-requests' },
  { id: '5', label: 'View Policies', icon: 'FileText', href: '/dashboard/employee/policies' },
];

export const actionCards = [
  { id: '1', title: 'Leave Requests', count: 5, icon: 'FileText', href: '/dashboard/employee/leave-requests' },
  { id: '2', title: 'Performance Appraisals', count: 1, icon: 'Star', href: '/dashboard/employee/appraisals' },
  { id: '3', title: 'Store Requests', count: 1, icon: 'ShoppingCart', href: '/dashboard/employee/store-requests' },
  { id: '4', title: 'Purchase Requisitions', count: 0, icon: 'ShoppingBag', href: '/dashboard/employee/purchase' },
  { id: '5', title: 'Payment Requisitions', count: 0, icon: 'CreditCard', href: '/dashboard/employee/payment-reqs' },
  { id: '6', title: 'Travel Requests', count: 0, icon: 'Plane', href: '/dashboard/employee/travel' },
];
