'use client';

import React, { useState } from 'react';
import { Header, StatsCards, AssignedTasks, Projects, People, PrivateNotepad } from './components';

const HomePage = ({ onSearchClick }) => {
  const [hasData, setHasData] = useState(true); // Default to filled state to show the UI like the image

  // Mock data state
  const statsData = {
    totalProjects: hasData ? 7 : 1,
    totalTasks: hasData ? 49 : 3,
    assignedTasks: hasData ? 12 : 0,
    completedTasks: hasData ? 6 : 0,
    overdueTasks: hasData ? 3 : 0
  };

  const assignedTasksData = hasData ? [
    {
      id: 1,
      name: 'Web Mockup',
      project: 'Yellow Branding',
      dueDate: 'Due in 20 hours',
      color: 'bg-yellow-500'
    },
    {
      id: 2,
      name: 'Carl Landing Page',
      project: 'Carl UI/UX',
      dueDate: 'Due in 3 days',
      color: 'bg-orange-500'
    },
    {
      id: 3,
      name: 'POS UI/UX',
      project: 'Resto Dashboard',
      dueDate: 'Due in 1 week',
      color: 'bg-pink-500'
    }
  ] : [];

  const projectsData = hasData ? [
    { id: 1, name: 'Yellow Branding', status: '1 task due soon', initials: '8', color: 'bg-blue-500' },
    { id: 2, name: 'Mogo Web Design', status: 'no task', initials: 'M', color: 'bg-green-500' },
    { id: 3, name: 'Futurework', status: '7 task due soon', initials: 'F', color: 'bg-blue-500' },
    { id: 4, name: 'Resto Dashboard', status: '4 task due soon', initials: 'R', color: 'bg-pink-500' },
    { id: 5, name: 'Hajime Illustration', status: '3 task due soon', initials: 'H', color: 'bg-green-500' },
    { id: 6, name: 'Carl UI/UX', status: '3 task due soon', initials: 'C', color: 'bg-orange-500' },
    { id: 7, name: 'The Run Branding...', status: '4 task due soon', initials: 'T', color: 'bg-green-500' }
  ] : [];

  const peopleData = hasData ? [
    { id: 1, name: 'Marc Atenson', email: 'marcnine@gmail.com', avatar: 'MA' },
    { id: 2, name: 'Susan Drake', email: 'contact@susandrak..', avatar: 'SD' },
    { id: 3, name: 'Ronald Richards', email: 'ronaldrichard@gmai..', avatar: 'RR' },
    { id: 4, name: 'Jane Cooper', email: 'janecooper@proton..', avatar: 'JC' },
    { id: 5, name: 'Ian Warren', email: 'wadewarren@mail.co', avatar: 'IW' },
    { id: 6, name: 'Darrell Steward', email: 'darrelsteward@gma..', avatar: 'DS' }
  ] : [];

  return (
    <div className="flex flex-col h-full">
      <Header onToggleData={() => setHasData(!hasData)} onSearchClick={onSearchClick} />
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <StatsCards data={statsData} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AssignedTasks data={assignedTasksData} />
              <People data={peopleData} />
            </div>
            
            <div className="space-y-6">
              <Projects data={projectsData} />
              <PrivateNotepad />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
