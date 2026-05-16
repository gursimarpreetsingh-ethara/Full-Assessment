import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeMember } from '../../api/projects';
import { useToast } from '../../context/ToastContext';
import { UserMinus, Shield, User, Plus } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import AddMemberForm from './AddMemberForm';
import Modal from '../ui/Modal';

const MembersList = ({ project }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const isAdmin = project.members?.find(m => m.id === user?.id)?.role === 'admin';

  const removeMutation = useMutation({
    mutationFn: (userId) => removeMember(project.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      addToast('Member removed successfully', 'success');
    },
    onError: (error) => {
      addToast(error.response?.data?.error || 'Failed to remove member', 'error');
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Project Members</h2>
        {isAdmin && (
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {project.members?.map(member => (
          <GlassCard key={member.id} className="p-4 flex items-center gap-4">
            <Avatar name={member.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{member.name} {member.id === user?.id && '(You)'}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{member.email}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={member.role === 'admin' ? 'purple' : 'default'} className="flex items-center gap-1">
                {member.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {member.role}
              </Badge>
              {isAdmin && member.id !== user?.id && (
                <button 
                  onClick={() => removeMutation.mutate(member.id)}
                  className="text-[var(--text-muted)] hover:text-red-400 p-1 transition-colors"
                  title="Remove from project"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Team Member">
        <AddMemberForm 
          projectId={project.id} 
          onSuccess={() => setIsAddOpen(false)} 
          onCancel={() => setIsAddOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default MembersList;
