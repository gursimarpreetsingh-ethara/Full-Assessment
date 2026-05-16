import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getProjects, createProject } from '../api/projects';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import ProjectCard from '../components/projects/ProjectCard';
import NewProjectModal from '../components/projects/NewProjectModal';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      addToast('Project created successfully', 'success');
      setIsModalOpen(false);
    },
    onError: (error) => {
      addToast(error.response?.data?.error || 'Failed to create project', 'error');
    }
  });

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : projects?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
          <div className="w-24 h-24 mb-6 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center animate-float-ghost">
            <Plus className="w-10 h-10" />
          </div>
          <p className="text-xl">No projects yet</p>
          <p className="mt-2 text-sm">Create your first project to get started.</p>
        </div>
      )}

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};

export default Projects;
