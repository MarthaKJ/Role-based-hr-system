'use client';

import { mockEmployees } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Edit, Trash2, Mail } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage employee information and view employee details.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Employee
        </Button>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-none">
        <div className="border-b border-border px-8 py-5">
          <h3 className="text-base font-semibold text-foreground">
            Employee Directory ({mockEmployees.length})
          </h3>
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
              {mockEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
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
                  <td className="px-6 py-4 text-sm text-muted-foreground">{employee.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{employee.department}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{employee.designation}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={employee.role === 'admin' ? 'default' : 'secondary'}
                      className={
                        employee.role === 'admin'
                          ? ''
                          : 'bg-muted text-foreground hover:bg-muted'
                      }
                    >
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
