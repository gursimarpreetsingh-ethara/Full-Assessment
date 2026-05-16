import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layers, LayoutDashboard, CheckSquare, FolderGit2, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-color)] z-40 relative"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-glow shrink-0">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="text-xl font-bold tracking-tight text-gradient whitespace-nowrap"
            >
              Ethara
            </motion.span>
          )}
        </div>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-purple)] transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 overflow-hidden group font-medium text-sm mb-1
                ${isActive 
                  ? 'bg-[var(--accent-purple-light)] text-[var(--accent-purple)] border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-colors duration-200 ${isActive ? 'text-[var(--accent-purple)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}`} />
              {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Sidebar;
