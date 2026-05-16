import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api/projects';
import { Users, Shield, Mail, FolderKanban } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

const Team = () => {
  const { user } = useAuth();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  // Collect all unique members across all projects
  const membersMap = {};
  projects.forEach(project => {
    if (project.members) {
      project.members.forEach(member => {
        if (!membersMap[member.id]) {
          membersMap[member.id] = { ...member, projects: [] };
        }
        membersMap[member.id].projects.push(project.name);
      });
    }
  });
  const allMembers = Object.values(membersMap);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Members across all your projects</p>
        </div>
        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
          <Users className="w-4 h-4" />
          {allMembers.length} member{allMembers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {allMembers.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-gray-200 rounded-lg">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No team members found</p>
          <p className="text-sm text-gray-400 mt-1">Create a project and invite team members to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMembers.map(member => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Avatar name={member.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                    {member.id === user?.id && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">You</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={member.role === 'admin' ? 'purple' : 'blue'}>
                      {member.role === 'admin' ? <Shield className="w-3 h-3 mr-1 inline" /> : null}
                      {member.role}
                    </Badge>
                  </div>
                </div>
              </div>
              {member.projects.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <FolderKanban className="w-3 h-3" /> Projects
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.projects.slice(0, 3).map((p, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                        {p}
                      </span>
                    ))}
                    {member.projects.length > 3 && (
                      <span className="text-xs text-gray-400">+{member.projects.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
