import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../../api/tasks';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';

const KanbanBoard = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', project.id],
    queryFn: () => getTasks(project.id),
  });

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex gap-6 h-96">
        {[1,2,3].map(i => (
          <div key={i} className="flex-1 min-w-[300px] bg-[var(--bg-tertiary)] animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
        </p>
        <Button variant="primary" onClick={handleAddTask}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <KanbanColumn
          title="To Do"
          tasks={todoTasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          project={project}
          status="todo"
        />
        <KanbanColumn
          title="In Progress"
          tasks={inProgressTasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          project={project}
          status="in_progress"
        />
        <KanbanColumn
          title="Done"
          tasks={doneTasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          project={project}
          status="done"
        />

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={project}
          task={selectedTask}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
