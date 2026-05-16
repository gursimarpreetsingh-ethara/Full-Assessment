import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, isPast, isToday } from 'date-fns';
import { updateTaskStatus, deleteTask } from '../../api/tasks';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

const TaskCard = ({ task, onEdit, project }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== 'done';
  const myTask = task.assigned_to === user?.id;
  const isAdmin = project.members?.find(m => m.id === user?.id)?.role === 'admin';

  const statusMutation = useMutation({
    mutationFn: (newStatus) => updateTaskStatus(project.id, task.id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
    },
    onError: () => addToast('Failed to update status', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(project.id, task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      addToast('Task deleted', 'success');
    },
    onError: () => addToast('Failed to delete task', 'error')
  });

  const priorityColors = {
    low: 'green',
    medium: 'amber',
    high: 'red'
  };

  return (
    <GlassCard className="p-4 group relative overflow-hidden transition-all hover:border-[var(--accent-purple)]/50 hover:shadow-[0_0_15px_rgba(124,58,237,0.1)]">
      <div className="flex justify-between items-start mb-2">
        <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
        
        {isAdmin && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button onClick={onEdit} className="p-1 hover:bg-[var(--bg-tertiary)] rounded text-[var(--text-muted)] hover:text-white">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => deleteMutation.mutate()} className="p-1 hover:bg-red-500/20 rounded text-[var(--text-muted)] hover:text-red-400">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <h4 className="font-semibold mb-1 text-white">{task.title}</h4>
      <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4 min-h-[32px]">
        {task.description}
      </p>

      <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3">
        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-[var(--text-muted)]'}`}>
          <Calendar className="w-3.5 h-3.5" />
          {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date'}
        </div>
        
        <div className="flex items-center gap-2">
          {(myTask || isAdmin) && (
            <select
              value={task.status}
              onChange={(e) => statusMutation.mutate(e.target.value)}
              className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs text-white rounded p-1 outline-none focus:border-[var(--accent-purple)]"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          )}
          {task.assigned_to && (
            <Avatar name={task.assignee_name} size="sm" title={task.assignee_name} />
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default TaskCard;
