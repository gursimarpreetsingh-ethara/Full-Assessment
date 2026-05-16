import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMember } from '../../api/projects';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';

const AddMemberForm = ({ projectId, onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const mutation = useMutation({
    mutationFn: (data) => addMember(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      addToast('Member added successfully', 'success');
      onSuccess();
    },
    onError: (error) => {
      addToast(error.response?.data?.error || 'Failed to add member', 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-300">User Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="glass-input" placeholder="colleague@example.com"
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">User must already have an account.</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-300">Role</label>
        <select
          value={role} onChange={(e) => setRole(e.target.value)}
          className="glass-input appearance-none"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)] mt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={mutation.isPending}>
          Add Member
        </Button>
      </div>
    </form>
  );
};

export default AddMemberForm;
