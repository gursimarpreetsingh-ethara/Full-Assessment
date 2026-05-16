import React from 'react';
import { Plus, PackageOpen } from 'lucide-react';
import TaskCard from './TaskCard';

const columnStyles = {
  todo: {
    dot: 'bg-gray-400',
    badge: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]',
    header: 'border-b-2 border-gray-600/30',
  },
  in_progress: {
    dot: 'bg-[var(--accent-blue)]',
    badge: 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/20',
    header: 'border-b-2 border-[var(--accent-blue)]/30',
  },
  done: {
    dot: 'bg-[var(--accent-green)]',
    badge: 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20',
    header: 'border-b-2 border-[var(--accent-green)]/30',
  },
};

const KanbanColumn = ({ title, tasks, onAddTask, onEditTask, project, status }) => {
  const style = columnStyles[status] || columnStyles.todo;

  return (
    <div className="flex-1 min-w-[300px] max-w-[380px] flex flex-col glass-panel !bg-[var(--bg-secondary)]/50">
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 ${style.header}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${style.dot} shadow-[0_0_8px_currentColor] opacity-80`}></span>
          <h3 className="font-semibold text-white text-sm">{title}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors text-[var(--text-muted)] hover:text-white"
          title="Add task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[200px] custom-scrollbar">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} project={project} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--border-color)] rounded-lg text-[var(--text-muted)]">
            <PackageOpen className="w-7 h-7 mb-2 opacity-30" />
            <span className="text-xs">No tasks</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
