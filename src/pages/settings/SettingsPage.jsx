import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Moon, Sun, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { authAPI } from '../../services/auth';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setProfileLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    try {
      await authAPI.changePassword(data.oldPassword, data.newPassword);
      toast.success('Password changed');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-slate-800">Profile</h3>
        </div>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...profileForm.register('name')}
            error={profileForm.formState.errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            {...profileForm.register('email')}
            error={profileForm.formState.errors.email?.message}
          />
          <Input
            label="Phone"
            type="tel"
            {...profileForm.register('phone')}
            error={profileForm.formState.errors.phone?.message}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={profileLoading}>
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Section */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-800">Change Password</h3>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...passwordForm.register('oldPassword')}
            error={passwordForm.formState.errors.oldPassword?.message}
          />
          <Input
            label="New Password"
            type="password"
            {...passwordForm.register('newPassword')}
            error={passwordForm.formState.errors.newPassword?.message}
          />
          <Input
            label="Confirm New Password"
            type="password"
            {...passwordForm.register('confirmPassword')}
            error={passwordForm.formState.errors.confirmPassword?.message}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={passwordLoading}>
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance Section */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          {darkMode ? <Moon className="h-5 w-5 text-indigo-500" /> : <Sun className="h-5 w-5 text-amber-500" />}
          <h3 className="text-lg font-semibold text-slate-800">Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-800">Dark Mode</p>
            <p className="text-xs text-slate-500">Toggle between dark and light theme</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${darkMode ? 'translate-x-6' : ''}`}
            />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
