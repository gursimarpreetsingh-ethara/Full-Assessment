import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, LogOut } from 'lucide-react';
import Avatar from '../ui/Avatar';

const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex items-center max-w-md w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--bg-tertiary)]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent-pink)] rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-[var(--border-color)]">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</span>
            <span className="text-xs text-[var(--text-muted)]">{user?.email}</span>
          </div>
          <Avatar name={user?.name} size="md" />
          <button onClick={logout} className="ml-2 p-2 text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors rounded-full hover:bg-red-500/10">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
