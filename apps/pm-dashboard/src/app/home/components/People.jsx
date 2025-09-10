import React from 'react';
import { ChevronDown, MoreHorizontal, Plus } from 'lucide-react';

const People = ({ data }) => {
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">There&apos;s no people in your workspace</p>
      <p className="text-gray-400 text-xs mt-1">Invite your team members to start collaborating</p>
    </div>
  );

  const PersonCard = ({ person }) => {
    const getAvatarColor = (index) => {
      const colors = [
        'bg-orange-500', 'bg-blue-500', 'bg-yellow-500', 
        'bg-green-500', 'bg-teal-500', 'bg-purple-500'
      ];
      return colors[index % colors.length];
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className={`w-10 h-10 ${getAvatarColor(person.id - 1)} rounded-full flex items-center justify-center`}>
            <span className="text-white text-sm font-medium">
              {person.avatar}
            </span>
          </div>
          <div className="w-full">
            <h4 className="font-medium text-gray-900 text-sm truncate">{person.name}</h4>
            <p className="text-xs text-gray-500 truncate mt-1">{person.email}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">People (17)</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>Frequent Collaborators</span>
              <ChevronDown className="h-3 w-3" />
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
            <button className="p-1 bg-blue-500 hover:bg-blue-600 rounded">
              <Plus className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {data.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default People;
