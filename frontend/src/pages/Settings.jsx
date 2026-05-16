import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogOut, Shield } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Manage your account preferences</p>
      </div>

      {/* Profile section */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--border-light)]">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--text-muted)]" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 flex items-center gap-6">
          <Avatar name={user?.name || ''} size="lg" />
          <div>
            <p className="text-lg font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
              <Shield className="w-3 h-3" /> Authenticated User
            </span>
          </div>
        </div>
      </div>

      {/* Change password section */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--border-light)]">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[var(--text-muted)]" />
            Change Password
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="glass-input"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="glass-input"
              placeholder="At least 6 characters"
            />
          </div>
          <Button variant="secondary">Save Changes</Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[var(--bg-secondary)] border border-red-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-red-100">
          <h2 className="font-semibold text-red-700 flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Session
          </h2>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Sign out of your account</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">You will be redirected to the login page.</p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
