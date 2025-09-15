"use client";

import Link from "next/link";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import ProjectFiles from "@/components/projects/ProjectFiles";
import ProjectComments from "@/components/projects/ProjectComments";
import ProjectChat from "@/components/projects/ProjectChat";

export default function ProjectPage({ params }) {
  // Project Header
  const project = {
    id: 1,
    title: "Project Apollo Redesign",
    description: "A complete redesign of the Apollo landing page and dashboard.",
    status: "Active", // Active | Completed | On Hold
    owner: "Jane Doe",
    dueDate: "2025-10-30",
    completion: 65, // percentage
  };

  // Timeline / Milestones
  const milestones = [
    {
      id: 1,
      title: "Wireframes Completed",
      dueDate: "2025-09-01",
      status: "Completed",
    },
    {
      id: 2,
      title: "UI Design Finalized",
      dueDate: "2025-09-15",
      status: "Completed",
    },
    {
      id: 3,
      title: "Frontend Development",
      dueDate: "2025-10-05",
      status: "In Progress",
    },
    {
      id: 4,
      title: "Beta Release",
      dueDate: "2025-10-25",
      status: "Pending",
    },
  ];

  // File Repository
  const files = [
    {
      id: 1,
      name: "wireframes-v1.pdf",
      uploadedBy: "John Smith",
      date: "2025-09-01",
      version: "1.0",
    },
    {
      id: 2,
      name: "ui-design-v2.fig",
      uploadedBy: "Jane Doe",
      date: "2025-09-10",
      version: "2.0",
    },
    {
      id: 3,
      name: "frontend-specs.docx",
      uploadedBy: "Mark Lee",
      date: "2025-09-12",
      version: "1.2",
    },
  ];

  // Comments Section (Threaded)
  const comments = [
    {
      id: 1,
      user: "Jane Doe",
      avatar: "/avatars/jane.png",
      text: "I think we should revise the header section layout.",
      time: "2h ago",
      replies: [
        {
          id: 2,
          user: "John Smith",
          avatar: "/avatars/john.png",
          text: "Agreed, the navigation bar feels too cluttered.",
          time: "1h ago",
        },
      ],
    },
    {
      id: 3,
      user: "Mark Lee",
      avatar: "/avatars/mark.png",
      text: "The color scheme works really well with the client's branding.",
      time: "30m ago",
      replies: [],
    },
  ];

  // Project Chat
  const chatMessages = [
    {
      id: 1,
      sender: "Jane Doe",
      text: "Hi team, are we ready for the demo tomorrow?",
      time: "10:00 AM",
      isMine: false,
    },
    {
      id: 2,
      sender: "Me",
      text: "Almost done with final touches. Should be good!",
      time: "10:05 AM",
      isMine: true,
    },
    {
      id: 3,
      sender: "Mark Lee",
      text: "I'll update the docs after today's sync call.",
      time: "10:07 AM",
      isMine: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/projects" 
            className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium mb-6 transition-colors duration-200"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Back to All Projects
          </Link>
          <ProjectHeader 
            title={project.title}
            description={project.description}
            status={project.status}
            owner={project.owner}
            dueDate={project.dueDate}
            completion={project.completion}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Project Timeline */}
            <ProjectTimeline milestones={milestones} />

            {/* Project Files */}
            <ProjectFiles files={files} />

            {/* Project Comments */}
            <ProjectComments comments={comments} />
          </div>

          {/* Right Column - Chat */}
          <div className="xl:col-span-2">
            <div className="sticky top-6">
              <ProjectChat messages={chatMessages} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}