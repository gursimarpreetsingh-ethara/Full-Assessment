import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { getProjectGradient } from '../../utils/gradients';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const gradient = getProjectGradient(project.id);
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="cursor-pointer group relative h-full"
    >
      <GlassCard className="h-full flex flex-col p-0 overflow-hidden hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-shadow">
        <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{project.name}</h3>
            <Badge variant={project.role === 'admin' ? 'purple' : 'blue'}>
              {project.role}
            </Badge>
          </div>
          
          <p className="text-[var(--text-muted)] text-sm line-clamp-2 flex-1 mb-6">
            {project.description || 'No description provided.'}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
            <div className="flex -space-x-2">
              <Avatar name="User" size="sm" className="border-2 border-[var(--bg-surface)]" />
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" title="To Do"></span>
              <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)]" title="In Progress"></span>
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]" title="Done"></span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ProjectCard;
