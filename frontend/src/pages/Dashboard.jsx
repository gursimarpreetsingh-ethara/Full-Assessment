import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Layers, Circle, Loader2, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { getDashboardStats } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import PriorityChart from '../components/dashboard/PriorityChart';
import Skeleton from '../components/ui/Skeleton';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-64 h-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return <GlassCard className="text-red-400 p-6 text-center border-red-500/50">Failed to load dashboard data. Please try again.</GlassCard>;
  }

  const stats = data;

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gradient">Good morning, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-[var(--text-secondary)]">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Tasks" value={stats.totalTasks} icon={Layers} 
          colorClass="text-violet-400" borderClass="border-[var(--accent-purple)]/50" 
        />
        <StatCard 
          title="To Do" value={stats.statusCounts?.todo || 0} icon={Circle} 
          colorClass="text-blue-400" borderClass="border-[var(--accent-blue)]/50" 
        />
        <StatCard 
          title="In Progress" value={stats.statusCounts?.in_progress || 0} icon={Loader2} 
          colorClass="text-amber-400" borderClass="border-[var(--accent-amber)]/50" 
        />
        <StatCard 
          title="Overdue" value={stats.overdueCount || 0} icon={AlertCircle} 
          colorClass="text-red-400" borderClass="border-[var(--accent-red)]/50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--accent-cyan)]" />
              Tasks per User
            </h2>
            <div className="flex flex-col gap-3">
               {stats.tasksPerUser?.length > 0 ? (
                 stats.tasksPerUser.map(u => (
                   <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-cyan)]/30 transition-colors">
                     <div className="flex items-center gap-3">
                       <Avatar name={u.name} size="md" />
                       <div className="flex flex-col">
                         <span className="font-medium text-white">{u.name}</span>
                         <span className="text-xs text-[var(--text-muted)]">Assigned member</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{u.taskCount}</span>
                       <span className="text-sm text-[var(--text-muted)]">tasks</span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-8 text-[var(--text-muted)]">No users with assigned tasks found.</div>
               )}
            </div>
          </GlassCard>
        </div>
        
        <div>
          <GlassCard className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--accent-purple)]" />
              Tasks by Project
            </h2>
            <div className="flex-1">
              <PriorityChart data={stats.projectSummary || []} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
