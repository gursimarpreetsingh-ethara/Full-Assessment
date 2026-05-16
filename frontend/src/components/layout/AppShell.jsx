import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const AppShell = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex overflow-hidden selection:bg-[var(--accent-purple)] selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent-purple)] blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent-cyan)] blur-[150px] opacity-10 pointer-events-none"></div>
        
        <TopNav />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
