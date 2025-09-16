"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "@/components/dashboard";
import { Plus, Search, Filter, Grid, List, SortAsc } from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Mock projects data
  const projects = [
    {
      id: 1,
      projectName: "Website Redesign",
      status: "active",
      dueDate: "2024-02-15",
      progress: 75,
      client: "Acme Corp",
      team: ["Sarah", "Mike", "John"],
    },
    {
      id: 2,
      projectName: "Mobile App Development",
      status: "active",
      dueDate: "2024-03-01",
      progress: 45,
      client: "TechStart Inc",
      team: ["Mike", "Lisa", "David"],
    },
    {
      id: 3,
      projectName: "Brand Identity",
      status: "completed",
      dueDate: "2024-01-20",
      progress: 100,
      client: "Creative Agency",
      team: ["Sarah", "Emma"],
    },
    {
      id: 4,
      projectName: "Marketing Campaign",
      status: "pending",
      dueDate: "2024-02-28",
      progress: 20,
      client: "Growth Co",
      team: ["John", "Alex"],
    },
    {
      id: 5,
      projectName: "E-commerce Platform",
      status: "active",
      dueDate: "2024-04-15",
      progress: 30,
      client: "Retail Plus",
      team: ["Mike", "Sarah", "Tom"],
    },
    {
      id: 6,
      projectName: "Data Analytics Dashboard",
      status: "onHold",
      dueDate: "2024-05-01",
      progress: 10,
      client: "DataCorp",
      team: ["David", "Lisa"],
    },
  ];

  const handleProjectClick = (project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleCreateProject = () => {
    console.log("Create new project");
    // This would open a modal or navigate to a create project page
  };

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">All Projects</h1>
          <p className="text-gray-600">Manage and track all your projects in one place</p>
        </div>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="progress">Sort by Progress</option>
              <option value="status">Sort by Status</option>
            </select>
            
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            
            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-colors ${
                  viewMode === "grid" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-colors ${
                  viewMode === "list" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <SortAsc className="w-4 h-4" />
            <span>Sorted by {sortBy}</span>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery ? "No projects match your search criteria." : "Get started by creating your first project."}
            </p>
            <button
              onClick={handleCreateProject}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
          }`}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                projectName={project.projectName}
                status={project.status}
                dueDate={project.dueDate}
                progress={project.progress}
                onClick={() => handleProjectClick(project)}
                className={viewMode === "list" ? "w-full" : ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
