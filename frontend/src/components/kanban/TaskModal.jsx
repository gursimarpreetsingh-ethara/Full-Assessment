import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SegmentedControl from '../ui/SegmentedControl';
import { createTask, updateTask } from '../../api/tasks';
import { useToast } from '../../context/ToastContext';

const TaskModal = ({ isOpen, onClose, project, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');

  const queryClient = useQueryClient();
  const { addToast } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.due_date ? task.due_date.substring(0, 10) : '');
      setPriority(task.priority || 'medium');
      setAssignedTo(task.assigned_to || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setAssignedTo('');
    }
  }, [task, isOpen]);

  const mutationFn = task 
    ? (data) => updateTask(project.id, task.id, data) 
    : (data) => createTask(project.id, data);

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      addToast(task ? 'Task updated' : 'Task created', 'success');
      onClose();
    },
    onError: (error) => {
      addToast(error.response?.data?.error || 'Error saving task', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      title,
      description,
      due_date: dueDate || null,
      priority,
      assigned_to: assignedTo || null
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">Title</label>
          <input
            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="glass-input" placeholder="Task title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">Description</label>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="glass-input min-h-[80px] resize-none" placeholder="Task description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Due Date</label>
            <input
              type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="glass-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Priority</label>
            <SegmentedControl
              value={priority}
              onChange={setPriority}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Med', value: 'medium' },
                { label: 'High', value: 'high' }
              ]}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">Assign To</label>
          <select
            value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
            className="glass-input appearance-none"
          >
            <option value="">Unassigned</option>
            {project?.members?.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)] mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
