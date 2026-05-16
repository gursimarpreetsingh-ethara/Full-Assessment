import React from 'react';
import { Plus, PackageOpen } from 'lucide-react';
import TaskCard from './TaskCard';

const columnStyles = {
  todo: {
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-600',
    header: 'border-b-2 border-gray-200',
  },
  in_progress: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    header: 'border-b-2 border-blue-200',
  },
  done: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    header: 'border-b-2 border-emerald-200',
  },
};

const KanbanColumn = ({ title, tasks, onAddTask, onEditTask, project, status }) => {
  const style = columnStyles[status] || columnStyles.todo;

  return (
    <div className="flex-1 min-w-[300px] max-w-[380px] flex flex-col bg-gray-50 border border-gray-200 rounded-lg">
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 ${style.header}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></span>
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-gray-700"
          title="Add task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[200px]">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} project={project} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
            <PackageOpen className="w-7 h-7 mb-2 opacity-50" />
            <span className="text-xs">No tasks</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
