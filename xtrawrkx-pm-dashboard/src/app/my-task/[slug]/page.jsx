"use client";

import { Plus, Eye, User, MoreHorizontal, Activity } from "lucide-react";
import { StatCard } from "../../../components/ui/StatCard.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import {
  dashboardStats as stats,
  assignedTasks,
  dashboardProjects as projects,
  teamMembersDashboard as teamMembers,
} from "../../../data/centralData";

export default function TaskDetail() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Tasks (Left Column) */}
        <div className="lg:col-span-1">
          <Card
            glass={true}
            title="Assigned Tasks"
            subtitle="Nearest Due Date"
            actions={
              <div className="flex items-center gap-2">
                <select className="text-sm bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-brand-text-light">
                  <option>Nearest Due Date</option>
                  <option>Farthest Due Date</option>
                  <option>Priority</option>
                </select>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {assignedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
                    <div>
                      <p className="font-semibold text-brand-foreground">
                        {task.title}
                      </p>
                      <p className="text-sm text-brand-text-light">
                        {task.project}
                      </p>
                      <p className="text-xs text-brand-text-muted">
                        {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-brand-text-light" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full text-center py-3 text-brand-primary hover:text-brand-secondary transition-colors font-medium">
                Show All
              </button>
            </div>
          </Card>
        </div>

        {/* Projects Grid (Right 2 Columns) */}
        <div className="lg:col-span-2">
          <Card
            glass={true}
            title="Projects"
            actions={
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-300 shadow-lg">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* New Project Card */}
              <div className="p-4 bg-white/15 rounded-xl border-dashed border-white/30 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-card group cursor-pointer">
                <div className="flex items-center justify-center h-20">
                  <Plus className="w-8 h-8 text-brand-text-light" />
                </div>
                <p className="text-center text-brand-text-light font-medium">
                  New Project
                </p>
              </div>

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-card group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold text-lg">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-lg transition-all">
                      <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-brand-foreground mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-brand-text-light">
                    {project.tasksCount}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* People Section */}
        <Card
          glass={true}
          title="People (17)"
          subtitle="Frequent Collaborators"
          actions={
            <div className="flex items-center gap-2">
              <select className="text-sm bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-brand-text-light">
                <option>Frequent Collaborators</option>
                <option>Recent</option>
                <option>Alphabetical</option>
              </select>
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-brand-foreground rounded-lg hover:bg-white/30 hover:border-white/40 transition-all duration-300">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center p-3 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-card"
              >
                {member.hasProfilePic ? (
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-sm mb-2">
                    <User className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-sm mb-2">
                    {member.initials}
                  </div>
                )}
                <p className="font-medium text-brand-foreground text-sm text-center">
                  {member.name}
                </p>
                <p className="text-xs text-brand-text-light text-center truncate w-full">
                  {member.email}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Private Notepad */}
        <Card
          glass={true}
          title="Private Notepad"
          actions={
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
            </button>
          }
        >
          <div className="bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm p-4 min-h-[200px]">
            <textarea
              placeholder="Write down anything here..."
              className="w-full h-full bg-transparent border-none outline-none resize-none text-brand-foreground placeholder:text-brand-text-light"
              rows={8}
            />
          </div>
          {/* Text formatting toolbar */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <span className="font-bold text-brand-text-light">B</span>
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <span className="italic text-brand-text-light">I</span>
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <span className="underline text-brand-text-light">U</span>
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <span className="line-through text-brand-text-light">S</span>
            </button>
            <div className="w-px h-4 bg-white/20 mx-1"></div>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <span className="text-brand-text-light">•</span>
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <span className="text-brand-text-light">1.</span>
            </button>
            <div className="w-px h-4 bg-white/20 mx-1"></div>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <span className="text-brand-text-light">⫷</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Get Started Progress Section */}
      <Card glass={true}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-foreground">
                Get Started
              </h3>
              <p className="text-sm text-brand-text-light">5/6 Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-white/20 rounded-full h-2">
              <div className="w-5/6 bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full"></div>
            </div>
            <span className="text-sm text-brand-text-light">83%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
