import React from 'react';
import { Layers } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="flex items-center gap-2 mb-6 z-10 relative">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Ethara</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-6 leading-tight">Streamline your team's workflow.</h1>
          <p className="text-gray-400 text-lg">Manage projects, track tasks, and collaborate effectively in a secure enterprise environment.</p>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Ethara. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0f172a]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white tracking-tight">Ethara</span>
              <span className="text-violet-200">Enterprise Task Management</span>
            </div>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
