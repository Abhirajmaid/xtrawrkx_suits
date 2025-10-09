import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  Eye,
  Edit,
  // Archive,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
} from "lucide-react";

const Projects = ({ data }) => {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const NewProjectCard = () => (
    <div
      onClick={() => router.push("/projects/add")}
      className="bg-gradient-to-br from-primary-50 to-primary-100/50 backdrop-blur-sm border-2 border-dashed border-primary-200 rounded-xl p-4 hover:from-primary-100 hover:to-primary-200/50 hover:border-primary-300 transition-all duration-300 cursor-pointer flex items-center justify-center min-h-[80px] group"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
          <Plus className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-sm font-semibold text-primary-700 group-hover:text-primary-800">
            Create New Project
          </span>
          <p className="text-xs text-primary-600">Start a new project</p>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "on hold":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const ProjectCard = ({ project }) => {
    const progress = project.progress || 0;
    const teamMembers = project.team || [];

    return (
      <div className="card card-hover p-5 cursor-pointer group">
        <div className="space-y-4">
          {/* Header with icon, title and actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-xl ${project.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                <span className="text-white text-sm font-bold">
                  {project.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-base truncate">
                  {project.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
              <button
                onClick={() => handleViewProject(project)}
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                title="View project"
              >
                <Eye className="h-4 w-4 text-primary-600" />
              </button>
              <button
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit project"
              >
                <Edit className="h-4 w-4 text-primary-600" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Progress</span>
              <span className="text-gray-900 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Footer with team and due date */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">
                {teamMembers.length} members
              </span>
            </div>

            {project.dueDate && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{project.dueDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProjectViewModal = () => {
    if (!selectedProject) return null;

    const getStatusIcon = (status) => {
      switch (status?.toLowerCase()) {
        case "active":
          return <PlayCircle className="h-5 w-5 text-green-600" />;
        case "completed":
          return <CheckCircle className="h-5 w-5 text-blue-600" />;
        case "on hold":
          return <Clock className="h-5 w-5 text-yellow-600" />;
        case "overdue":
          return <AlertCircle className="h-5 w-5 text-red-600" />;
        default:
          return <PlayCircle className="h-5 w-5 text-gray-600" />;
      }
    };

    const mockTasks = [
      {
        id: 1,
        name: "Design wireframes",
        status: "completed",
        assignee: "John Doe",
      },
      {
        id: 2,
        name: "Create mockups",
        status: "in_progress",
        assignee: "Jane Smith",
      },
      {
        id: 3,
        name: "Frontend development",
        status: "pending",
        assignee: "Mike Wilson",
      },
      {
        id: 4,
        name: "Testing & QA",
        status: "pending",
        assignee: "Sarah Connor",
      },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-xl ${selectedProject.color} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-lg font-bold">
                    {selectedProject.initials}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedProject.name}
                  </h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedProject.status)}
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedProject.status)}`}
                      >
                        {selectedProject.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {selectedProject.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Progress Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">
                    Overall Progress
                  </span>
                  <span className="text-gray-900 font-bold">
                    {selectedProject.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {mockTasks.length}
                    </p>
                    <p className="text-sm text-gray-500">Total Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {mockTasks.filter((t) => t.status === "completed").length}
                    </p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {
                        mockTasks.filter((t) => t.status === "in_progress")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-500">In Progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Team Members
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedProject.team.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center`}
                    >
                      <span className="text-white text-sm font-semibold">
                        {member.initials}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500">Team Member</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Tasks
              </h3>
              <div className="space-y-3">
                {mockTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-500"
                            : task.status === "in_progress"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">{task.name}</p>
                        <p className="text-sm text-gray-500">
                          Assigned to {task.assignee}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated 2 hours ago
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit Project
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View All Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Projects</h3>
            <p className="text-sm text-gray-500 mt-1">
              {data.length} active project{data.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push("/projects")}
              className="px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              View All
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No projects yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Create your first project to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <NewProjectCard />
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && <ProjectViewModal />}
    </div>
  );
};

export default Projects;
