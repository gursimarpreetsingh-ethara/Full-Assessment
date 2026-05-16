import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-base)]">
      <div className="relative w-64 h-64 mb-8 animate-float-ghost">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">
          <circle cx="100" cy="100" r="80" fill="url(#grad)" opacity="0.1" />
          <path d="M100 40 C 60 40 40 70 40 100 C 40 140 60 160 100 160 C 140 160 160 140 160 100 C 160 70 140 40 100 40 Z" fill="rgba(255,255,255,0.05)" stroke="var(--border-color)" strokeWidth="2" />
          <circle cx="80" cy="90" r="10" fill="var(--accent-purple)" />
          <circle cx="120" cy="90" r="10" fill="var(--accent-cyan)" />
          <path d="M85 120 Q 100 130 115 120" fill="none" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-purple)" />
              <stop offset="100%" stopColor="var(--accent-cyan)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Lost in Space</h1>
      <p className="text-[var(--text-muted)] mb-8 max-w-md">We couldn't find the page you're looking for. It might have been moved or deleted.</p>
      <Button onClick={() => navigate('/dashboard')} variant="primary">
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
