'use client';

import { useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, Mail, Building2, IdCard, Briefcase, Shield, Info } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { user, updateAvatar, removeAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB.');
      return;
    }
    await updateAvatar(file);
    e.target.value = '';
  };

  const roleLabel =
    user.role === 'admin' ? 'HR Administrator' : user.role === 'hr' ? 'HR Manager' : 'Employee';

  const personalDetails = [
    { label: 'Full Name', value: user.name, icon: IdCard },
    { label: 'Email Address', value: user.email, icon: Mail },
    { label: 'Employee ID', value: user.employeeId, icon: IdCard },
    { label: 'Role', value: roleLabel, icon: Shield },
  ];

  const jobDetails = [
    { label: 'Department', value: user.department, icon: Building2 },
    { label: 'Designation', value: user.designation, icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your personal information and manage your profile photo.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar card */}
      <Card className="border border-border bg-card p-6 shadow-none">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Avatar className="h-24 w-24">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="bg-blue-100 text-2xl font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.designation}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="bg-muted text-foreground hover:bg-muted">
                {roleLabel}
              </Badge>
              <Badge variant="secondary" className="bg-muted text-foreground hover:bg-muted">
                {user.department}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              {user.avatarUrl ? 'Change Photo' : 'Upload Photo'}
            </Button>
            {user.avatarUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700"
                onClick={() => removeAvatar()}
              >
                <Trash2 size={16} />
                Remove
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Personal Information</h2>
        <Card className="border border-border bg-card p-6 shadow-none">
          <div className="grid gap-6 md:grid-cols-2">
            {personalDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.label} className="flex items-start gap-3">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{detail.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Job Details */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Job Details</h2>
        <Card className="border border-border bg-card p-6 shadow-none">
          <div className="grid gap-6 md:grid-cols-2">
            {jobDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.label} className="flex items-start gap-3">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{detail.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          To update your personal or job details, please contact the HR department.
        </p>
      </div>
    </div>
  );
}
