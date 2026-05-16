import React, { useEffect, useState } from 'react';
import GlassCard from '../ui/GlassCard';

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) return;
    
    if (start === end) {
      setCount(end);
      return;
    }

    let totalDuration = 800;
    let incrementTime = (totalDuration / end);
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`glass-panel p-5 border-t-2 ${borderClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{count}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)] ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
