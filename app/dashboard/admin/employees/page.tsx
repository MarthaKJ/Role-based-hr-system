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
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="mt-2 text-gray-600">
            Manage employee information and view employee details.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Employee
        </Button>
      </div>

      <Card className="border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Employee Directory ({mockEmployees.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Designation</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockEmployees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-blue-200">
                        {employee.avatarUrl && (
                          <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                        )}
                        <AvatarFallback className="bg-blue-200 text-blue-800 text-xs font-semibold">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.designation}</td>
                  <td className="px-6 py-4">
                    <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'}>
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
