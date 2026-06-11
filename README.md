# HR Management System

A role-based Human Resources management web application with dedicated portals for
**Employees**, **Managers**, and **HR Administrators**. It covers the core HR
workflows an organization relies on day to day — leave, payroll, requests,
approvals, performance appraisals, and attendance — behind role-aware navigation
and access control.

> **Note:** This is a front-end application. All data is served from in-memory
> mock data via React Context (no backend or database yet), which makes it easy
> to run and explore locally.

## Features

### Employee portal
- **Dashboard** with leave balances, quick actions, and request summaries
- **Leave** — apply for annual, sick, compassionate, or maternity leave with validation
- **Payslips** — browse monthly payslips and view/print a detailed, customizable payslip
- **Payment requests** — advance salary and reimbursement requests
- **Store, purchase & travel requests**
- **Appraisals** — view published performance reviews and ratings
- **Leave calendar** — shared team leave at a glance
- **Profile** — personal details, avatar upload, and light/dark theme

### Manager portal
- **Team overview** and member directory
- **Approvals** — review and approve/reject pending leave and requests
- **Appraisals** — create and publish performance reviews for direct reports
- **Attendance** — track team clock-in/out, lateness, and overtime
- **Leave calendar**, **payslips**, and **payment requests**

### HR Admin portal
- **Employee management**
- **Approvals** queue across the organization
- **Payslips** administration
- **Appraisals**, **reports**, **leave calendar**, and **settings**

### Cross-cutting
- Role-based access control via protected routes
- Form validation with React Hook Form + Zod
- Charts and data visualization with Recharts
- Accessible UI built on Radix UI / shadcn primitives
- System-aware light/dark mode
- Toast notifications and printable documents

## Tech stack

| Area | Technology |
|------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Components | Radix UI / shadcn, lucide-react icons |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| State | React Context |
| Theming | next-themes |
| Printing | react-to-print |

## Getting started

### Prerequisites
- Node.js 18.18+ (or 20+)
- npm, pnpm, or yarn

### Installation

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Logging in

Authentication is mocked — **any password works**; sign in with one of the seeded
emails to land in the matching role's portal:

| Role | Email |
|------|-------|
| Employee | `martha.kisakye@company.com` |
| Manager | `david.lee@company.com` |
| HR Admin | `jane.smith@company.com` |

Other seeded employees (e.g. `john.doe@company.com`, `priya.patel@company.com`)
are available in [`lib/mock-data.ts`](lib/mock-data.ts).

## Project structure

```
app/                      # Next.js App Router routes
  login/                  # Login page
  dashboard/
    employee/             # Employee portal pages
    manager/              # Manager portal pages
    admin/                # HR admin portal pages
    profile/              # Shared profile page
components/               # Shared components
  ui/                     # Radix/shadcn UI primitives
context/                  # React Context providers (auth, employees, payslips, ...)
hooks/                    # Custom hooks
lib/
  types.ts                # Domain types (User, Payslip, LeaveRequest, ...)
  mock-data.ts            # Seeded demo data
  utils.ts
```

## Roadmap

- Real backend & database with persistent storage
- Authentication with proper credentials and sessions
- API layer replacing in-memory mock data
- Notifications and audit history

## License

This project is for portfolio/demonstration purposes.
