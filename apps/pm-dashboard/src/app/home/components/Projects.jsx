import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

const Projects = ({ data }) => {
  const ProjectCard = ({ project, isNew = false }) => {
    if (isNew) {
      return (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">New Project</span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg ${project.color} flex items-center justify-center`}>
            <span className="text-white text-sm font-medium">{project.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">{project.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{project.status}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Projects</h3>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No projects yet</p>
            <p className="text-gray-400 text-xs mt-1">Create your first project to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <ProjectCard isNew={true} />
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
