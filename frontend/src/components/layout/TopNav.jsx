import React from 'react';
import { Bell, Search } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

const TopNav = () => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects, tasks, or people..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pl-9 pr-4 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 ml-4">
        <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <Avatar name={user?.name || ''} size="sm" />
      </div>
    </header>
  );
};

export default TopNav;
