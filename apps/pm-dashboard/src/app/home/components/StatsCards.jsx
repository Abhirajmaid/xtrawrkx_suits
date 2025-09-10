import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCards = ({ data }) => {
  const stats = [
    {
      title: 'Total Project',
      value: data.totalProjects,
      trend: '+2',
      isPositive: true
    },
    {
      title: 'Total Tasks',
      value: data.totalTasks,
      trend: '+5',
      isPositive: true
    },
    {
      title: 'Assigned Tasks',
      value: data.assignedTasks,
      trend: '+3',
      isPositive: true
    },
    {
      title: 'Completed Tasks',
      value: data.completedTasks,
      trend: '+1',
      isPositive: true
    },
    {
      title: 'Overdue Tasks',
      value: data.overdueTasks,
      trend: '-1',
      isPositive: false
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`flex items-center space-x-1 text-xs ${
              stat.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{stat.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
