import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '../api/projects';
import { getProjectGradient } from '../utils/gradients';
import SegmentedControl from '../components/ui/SegmentedControl';
import KanbanBoard from '../components/kanban/KanbanBoard';
import MembersList from '../components/members/MembersList';
import Skeleton from '../components/ui/Skeleton';
import GlassCard from '../components/ui/GlassCard';

const ProjectDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('board');

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
  });

  if (isLoading) return <Skeleton className="h-[600px] w-full" />;
  if (error) return <GlassCard className="text-red-400 p-6 text-center">Failed to load project.</GlassCard>;

  const gradient = getProjectGradient(project.id);
  
  return (
    <div className="space-y-6 h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <span>Projects</span>
          <span>/</span>
          <span className="text-gray-900">{project.name}</span>
        </div>
        <h1 className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
          {project.name}
        </h1>
      </div>

      <div className="flex items-center border-b border-[var(--border-color)] pb-4">
        <div className="w-64">
          <SegmentedControl 
            value={activeTab} 
            onChange={setActiveTab}
            options={[
              { label: 'Board', value: 'board' },
              { label: 'Members', value: 'members' }
            ]}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {activeTab === 'board' ? (
          <KanbanBoard project={project} />
        ) : (
          <MembersList project={project} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
