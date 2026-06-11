'use client';

import { useMemo, useState } from 'react';
import { useEmployees } from '@/context/employees-context';
import { User } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Mail, AlertCircle, Search } from 'lucide-react';
import { getInitials } from '@/lib/utils';

type EmployeeRole = User['role'];
type DialogMode = { kind: 'closed' } | { kind: 'add' } | { kind: 'edit'; employee: User };

const ROLE_OPTIONS: { value: EmployeeRole; label: string }[] = [
  { value: 'employee', label: 'Employee' },
  { value: 'admin', label: 'HR Admin' },
  { value: 'hr', label: 'HR' },
];

const roleBadge = (role: EmployeeRole) => {
  const label = role === 'admin' ? 'HR Admin' : role === 'hr' ? 'HR' : 'Employee';
  if (role === 'admin') {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950/50">
        {label}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-muted text-foreground hover:bg-muted">
      {label}
    </Badge>
  );
};

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useEmployees();
  const [mode, setMode] = useState<DialogMode>({ kind: 'closed' });
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState<EmployeeRole | ''>('');
  const [formError, setFormError] = useState('');

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q),
    );
  }, [employees, search]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setDepartment('');
    setDesignation('');
    setRole('');
    setFormError('');
  };

  const openAdd = () => {
    resetForm();
    setMode({ kind: 'add' });
  };

  const openEdit = (employee: User) => {
    setName(employee.name);
    setEmail(employee.email);
    setDepartment(employee.department);
    setDesignation(employee.designation);
    setRole(employee.role);
    setFormError('');
    setMode({ kind: 'edit', employee });
  };

  const closeDialog = () => {
    setMode({ kind: 'closed' });
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim() || !department.trim() || !designation.trim() || !role) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const editingId = mode.kind === 'edit' ? mode.employee.id : null;
    const emailClash = employees.some(
      (e) => e.id !== editingId && e.email.toLowerCase() === trimmedEmail,
    );
    if (emailClash) {
      setFormError('An employee with this email already exists.');
      return;
    }

    if (mode.kind === 'edit') {
      updateEmployee(mode.employee.id, {
        name: name.trim(),
        email: trimmedEmail,
        department: department.trim(),
        designation: designation.trim(),
        role,
      });
    } else {
      addEmployee({
        name: name.trim(),
        email: trimmedEmail,
        department: department.trim(),
        designation: designation.trim(),
        role,
      });
    }
    closeDialog();
  };

  const handleRemove = (employee: User) => {
    if (confirm(`Remove ${employee.name} from the directory? This cannot be undone.`)) {
      removeEmployee(employee.id);
    }
  };

  const isEditing = mode.kind === 'edit';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage employee information and view employee details.
          </p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus size={16} />
          Add Employee
        </Button>
      </div>

      <Dialog
        open={mode.kind !== 'closed'}
        onOpenChange={(open) => (open ? null : closeDialog())}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update this employee’s details. Employee ID cannot be changed.'
                : 'Add a new employee to the directory. They will be assigned the next available Employee ID.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="emp-name">Full Name</Label>
              <Input
                id="emp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Walker"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-email">Email</Label>
              <Input
                id="emp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.walker@company.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="emp-dept">Department</Label>
                <Input
                  id="emp-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-designation">Designation</Label>
                <Input
                  id="emp-designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as EmployeeRole)}>
                <SelectTrigger id="emp-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Add Employee'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="flex flex-col gap-4 border-b border-border px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Employee Directory ({filteredEmployees.length}
            {filteredEmployees.length !== employees.length && ` of ${employees.length}`})
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, department…"
              className="pl-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No employees match “{search}”.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {employee.avatarUrl && (
                            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                          )}
                          <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {employee.employeeId}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{employee.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {employee.designation}
                    </td>
                    <td className="px-6 py-4">{roleBadge(employee.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(employee)}
                          aria-label={`Edit ${employee.name}`}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => (window.location.href = `mailto:${employee.email}`)}
                          aria-label={`Email ${employee.name}`}
                        >
                          <Mail size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleRemove(employee)}
                          aria-label={`Remove ${employee.name}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
