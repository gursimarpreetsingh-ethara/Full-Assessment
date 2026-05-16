import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Layers, Circle, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getDashboardStats } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import PriorityChart from '../components/dashboard/PriorityChart';
import Skeleton from '../components/ui/Skeleton';
import GlassCard from '../components/ui/GlassCard';

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
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
        <h1 className="text-3xl font-bold">Good morning, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-[var(--text-secondary)]">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Tasks" value={stats.totalTasks} icon={Layers} 
          colorClass="text-indigo-600" borderClass="border-t-indigo-500" 
        />
        <StatCard 
          title="To Do" value={stats.statusCounts?.todo || 0} icon={Circle} 
          colorClass="text-blue-600" borderClass="border-t-blue-500" 
        />
        <StatCard 
          title="In Progress" value={stats.statusCounts?.in_progress || 0} icon={Loader2} 
          colorClass="text-amber-600" borderClass="border-t-amber-500" 
        />
        <StatCard 
          title="Done" value={stats.statusCounts?.done || 0} icon={CheckCircle} 
          colorClass="text-emerald-600" borderClass="border-t-emerald-500" 
        />
        <StatCard 
          title="Overdue" value={stats.overdueCount || 0} icon={AlertCircle} 
          colorClass="text-red-600" borderClass="border-t-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <div className="flex flex-col gap-4">
               {/* Activity feed placeholder */}
               <div className="flex items-start gap-4">
                 <div className="w-2 h-2 mt-2 rounded-full bg-[var(--accent-blue)] ring-4 ring-[var(--accent-blue)]/20"></div>
                 <div>
                   <p className="text-gray-900">You logged in</p>
                   <p className="text-sm text-[var(--text-muted)]">Just now</p>
                 </div>
               </div>
            </div>
          </GlassCard>
        </div>
        <div>
          <GlassCard className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-6">Tasks Per Project</h2>
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
