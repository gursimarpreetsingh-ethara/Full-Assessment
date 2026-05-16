import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isPast, isToday } from 'date-fns';
import { Calendar, CheckCircle } from 'lucide-react';
import { getProjects } from '../api/projects';
import { getTasks } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import SegmentedControl from '../components/ui/SegmentedControl';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

const MyTasks = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Fetch all projects the user belongs to
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 30000,
  });

  // Fetch tasks for ALL projects in a single parallel call — much faster
  const { data: allTasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['myTasks', projects.map(p => p.id).join(',')],
    queryFn: async () => {
      if (projects.length === 0) return [];
      const results = await Promise.all(
        projects.map(p =>
          getTasks(p.id).then(tasks =>
            tasks
              .filter(t => t.assigned_to === user?.id || String(t.assigned_to) === String(user?.id))
              .map(t => ({ ...t, projectName: p.name }))
          )
        )
      );
      return results.flat();
    },
    enabled: projects.length > 0 && !!user,
    staleTime: 15000,
  });

  const isLoading = loadingProjects || (projects.length > 0 && loadingTasks);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-48 h-10" />
        <Skeleton className="w-full h-12" />
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  // Apply filter
  const filteredTasks = allTasks.filter(task => {
    if (filter === 'all') return task.status !== 'done';
    if (filter === 'done') return task.status === 'done';
    if (filter === 'overdue') {
      return task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== 'done';
    }
    if (filter === 'upcoming') {
      return (!task.due_date || !isPast(new Date(task.due_date)) || isToday(new Date(task.due_date))) && task.status !== 'done';
    }
    return true;
  }).sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date) - new Date(b.due_date);
  });

  const priorityColors = {
    low: 'green',
    medium: 'amber',
    high: 'red'
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <h1 className="text-3xl font-bold">My Tasks</h1>

      <div className="w-full max-w-lg">
        <SegmentedControl 
          value={filter}
          onChange={setFilter}
          options={[
            { label: 'All Active', value: 'all' },
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Overdue', value: 'overdue' },
            { label: 'Done', value: 'done' }
          ]}
        />
      </div>

      <div className="flex flex-col gap-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== 'done';
            
            return (
              <GlassCard key={task.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-blue-700 font-medium px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
                      {task.projectName}
                    </span>
                    <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
                    {task.status === 'done' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
                  </div>
                  <h4 className={`font-semibold ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'} truncate`}>{task.title}</h4>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                    <Calendar className="w-4 h-4" />
                    {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date'}
                  </div>
                </div>
              </GlassCard>
            );
          })
        ) : (
          <div className="py-20 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium text-gray-500">No tasks found</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
