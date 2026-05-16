import React from 'react';
import { Layers } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Team Task Manager</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-6 leading-tight">Streamline your team's workflow.</h1>
          <p className="text-gray-400 text-lg">Manage projects, track tasks, and collaborate effectively in a secure enterprise environment.</p>
        </div>
        
        <div className="relative z-10 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Team Task Manager. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Team Task Manager</span>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
