import {
  User,
  Payslip,
  LeaveBalance,
  LeaveRequest,
  Asset,
  AttendanceRecord,
  AttendanceStatus,
} from './types';

export const currentUser: User = {
  id: '1',
  name: 'Martha Kisakye',
  email: 'martha.kisakye@company.com',
  designation: 'Senior Software Engineer',
  department: 'Engineering',
  role: 'employee',
  employeeId: 'EMP001',
  managerId: '6',
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
    role: 'admin',
    employeeId: 'EMP003',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    designation: 'UX Designer',
    department: 'Design',
    role: 'employee',
    employeeId: 'EMP004',
    managerId: '6',
  },
  {
    id: '5',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    designation: 'Backend Engineer',
    department: 'Engineering',
    role: 'employee',
    employeeId: 'EMP005',
    managerId: '6',
  },
  {
    id: '6',
    name: 'David Lee',
    email: 'david.lee@company.com',
    designation: 'Engineering Manager',
    department: 'Engineering',
    role: 'manager',
    employeeId: 'EMP006',
  },
  {
    id: '7',
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    designation: 'Frontend Engineer',
    department: 'Engineering',
    role: 'employee',
    employeeId: 'EMP007',
    managerId: '6',
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
      accountName: '',
      accountNumber: '****5678',
      bankName: 'First National Bank',
      routingNumber: '123456789',
    },
    generatedDate: new Date('2026-04-30'),
  },
  {
    id: 'PS006',
    employeeId: '6',
    month: 4,
    year: 2026,
    basicSalary: 110000,
    grossSalary: 142000,
    allowances: [
      { name: 'House Allowance', amount: 18000 },
      { name: 'Travel Allowance', amount: 6000 },
      { name: 'Leadership Bonus', amount: 8000 },
    ],
    deductions: [
      { name: 'Professional Tax', amount: 800 },
      { name: 'Provident Fund', amount: 4200 },
      { name: 'Insurance Deduction', amount: 1200 },
    ],
    taxes: [
      { name: 'Income Tax', amount: 14500 },
      { name: 'Social Security', amount: 3300 },
    ],
    netSalary: 118000,
    bankDetails: {
      accountName: 'David Lee',
      accountNumber: '****9921',
      bankName: 'First National Bank',
      routingNumber: '123456789',
    },
    generatedDate: new Date('2026-04-30'),
  },
  {
    id: 'PS007',
    employeeId: '6',
    month: 3,
    year: 2026,
    basicSalary: 110000,
    grossSalary: 142000,
    allowances: [
      { name: 'House Allowance', amount: 18000 },
      { name: 'Travel Allowance', amount: 6000 },
      { name: 'Leadership Bonus', amount: 8000 },
    ],
    deductions: [
      { name: 'Professional Tax', amount: 800 },
      { name: 'Provident Fund', amount: 4200 },
      { name: 'Insurance Deduction', amount: 1200 },
    ],
    taxes: [
      { name: 'Income Tax', amount: 14500 },
      { name: 'Social Security', amount: 3300 },
    ],
    netSalary: 118000,
    bankDetails: {
      accountName: 'David Lee',
      accountNumber: '****9921',
      bankName: 'First National Bank',
      routingNumber: '123456789',
    },
    generatedDate: new Date('2026-03-31'),
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
      accountName: '',
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
    managerComment: 'Get well soon.',
    decidedBy: '6',
    decidedOn: new Date('2026-04-10'),
  },
  {
    id: 'LR003',
    employeeId: '4',
    type: 'annual',
    startDate: new Date('2026-05-18'),
    endDate: new Date('2026-05-22'),
    days: 5,
    reason: 'Family trip',
    status: 'pending',
    appliedOn: new Date('2026-05-08'),
  },
  {
    id: 'LR004',
    employeeId: '5',
    type: 'compassionate',
    startDate: new Date('2026-05-12'),
    endDate: new Date('2026-05-14'),
    days: 3,
    reason: 'Family emergency',
    status: 'pending',
    appliedOn: new Date('2026-05-11'),
  },
  {
    id: 'LR005',
    employeeId: '7',
    type: 'sick',
    startDate: new Date('2026-05-13'),
    endDate: new Date('2026-05-15'),
    days: 3,
    reason: 'Doctor visit',
    status: 'approved',
    appliedOn: new Date('2026-05-11'),
    managerComment: 'Approved. Rest up.',
    decidedBy: '6',
    decidedOn: new Date('2026-05-12'),
  },
  {
    id: 'LR006',
    employeeId: '5',
    type: 'annual',
    startDate: new Date('2026-03-02'),
    endDate: new Date('2026-03-04'),
    days: 3,
    reason: 'Personal',
    status: 'rejected',
    appliedOn: new Date('2026-02-25'),
    managerComment: 'Conflicts with release week.',
    decidedBy: '6',
    decidedOn: new Date('2026-02-26'),
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

export const actionCards = [
  { id: '1', title: 'Leave Requests', count: 5, icon: 'FileText', href: '/dashboard/employee/leave' },
  { id: '2', title: 'Performance Appraisals', count: 1, icon: 'Star', href: '/dashboard/employee/appraisals' },
  { id: '3', title: 'Store Requests', count: 1, icon: 'ShoppingCart', href: '/dashboard/employee/store-requests' },
  { id: '4', title: 'Purchase Requisitions', count: 0, icon: 'ShoppingBag', href: '/dashboard/employee/purchase' },
  { id: '5', title: 'Payment Requisitions', count: 0, icon: 'CreditCard', href: '/dashboard/employee/payment-requests' },
  { id: '6', title: 'Travel Requests', count: 0, icon: 'Plane', href: '/dashboard/employee/travel' },
];

const ATTENDANCE_TEAM_IDS = ['1', '4', '5', '7'];

const seededRandom = (seed: number) => {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const buildAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date('2026-05-14');
  const start = new Date(today);
  start.setDate(today.getDate() - 29);

  let counter = 1;
  for (const employeeId of ATTENDANCE_TEAM_IDS) {
    const rand = seededRandom(Number(employeeId) * 9973);

    for (let i = 0; i < 30; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const day = date.getDay();
      if (day === 0 || day === 6) continue;

      const roll = rand();
      let status: AttendanceStatus;
      if (roll < 0.78) status = 'present';
      else if (roll < 0.88) status = 'late';
      else if (roll < 0.95) status = 'leave';
      else status = 'absent';

      const record: AttendanceRecord = {
        id: `AT${String(counter).padStart(4, '0')}`,
        employeeId,
        date,
        status,
      };

      if (status === 'present' || status === 'late') {
        const clockInMinute = status === 'late' ? 540 + Math.floor(rand() * 45) : 525 + Math.floor(rand() * 15);
        const clockOutMinute = 1020 + Math.floor(rand() * 90);
        const fmt = (m: number) =>
          `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
        record.clockIn = fmt(clockInMinute);
        record.clockOut = fmt(clockOutMinute);
        const workedHours = (clockOutMinute - clockInMinute) / 60;
        if (workedHours > 9) {
          record.overtimeHours = Math.round((workedHours - 8) * 10) / 10;
        }
      }

      records.push(record);
      counter++;
    }
  }
  return records;
};

export const mockAttendance: AttendanceRecord[] = buildAttendance();
