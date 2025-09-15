"use client";

import { useState, useCallback, memo } from "react";
import { useParams } from "next/navigation";
import {
  ProjectHeader,
  Timeline,
  FileRepository,
  CommentsSection,
  ChatThread,
} from "@/components/projects";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;
  const [activeTab, setActiveTab] = useState("timeline");

  // Mock project data
  const projectData = {
    id: projectId,
    name: "Website Redesign",
    status: "active",
    dueDate: "2024-03-15",
    clientName: "Acme Corporation",
    clientLogo: null,
  };

  // Mock milestones data
  const milestones = [
    {
      id: 1,
      title: "Project Kickoff",
      description: "Initial meeting and requirements gathering",
      dueDate: "2024-01-15",
      completed: true,
      progress: 100,
    },
    {
      id: 2,
      title: "Design Phase",
      description: "Wireframes and mockups creation",
      dueDate: "2024-02-01",
      completed: true,
      progress: 100,
    },
    {
      id: 3,
      title: "Development Phase",
      description: "Frontend and backend development",
      dueDate: "2024-02-28",
      completed: false,
      progress: 65,
    },
    {
      id: 4,
      title: "Testing & QA",
      description: "Quality assurance and bug fixes",
      dueDate: "2024-03-10",
      completed: false,
      progress: 0,
    },
    {
      id: 5,
      title: "Launch",
      description: "Production deployment and go-live",
      dueDate: "2024-03-15",
      completed: false,
      progress: 0,
    },
  ];

  // Mock files data
  const files = [
    {
      id: 1,
      name: "project-brief.pdf",
      version: "1.2",
      uploadedBy: "Sarah Johnson",
      date: "2024-01-10",
      size: 2048000,
    },
    {
      id: 2,
      name: "wireframes.fig",
      version: "2.1",
      uploadedBy: "Mike Chen",
      date: "2024-01-20",
      size: 5120000,
    },
    {
      id: 3,
      name: "mockups.png",
      version: "1.0",
      uploadedBy: "Sarah Johnson",
      date: "2024-01-25",
      size: 1536000,
    },
    {
      id: 4,
      name: "style-guide.pdf",
      version: "1.0",
      uploadedBy: "Mike Chen",
      date: "2024-02-01",
      size: 1024000,
    },
  ];

  // Mock comments data
  const comments = [
    {
      id: 1,
      user: "Sarah Johnson",
      text: "The wireframes look great! I have a few suggestions for the user flow.",
      timestamp: "2024-01-20T10:30:00Z",
      replies: [
        {
          id: 11,
          user: "Mike Chen",
          text: "Thanks Sarah! I'd love to hear your feedback.",
          timestamp: "2024-01-20T11:15:00Z",
        },
      ],
    },
    {
      id: 2,
      user: "Mike Chen",
      text: "I've uploaded the latest mockups. Please review and let me know your thoughts.",
      timestamp: "2024-01-25T14:20:00Z",
      replies: [],
    },
    {
      id: 3,
      user: "John Doe",
      text: "The color scheme looks perfect. Can we proceed with development?",
      timestamp: "2024-02-01T09:45:00Z",
      replies: [
        {
          id: 31,
          user: "Sarah Johnson",
          text: "Yes, I agree. Let's move forward with the current design.",
          timestamp: "2024-02-01T10:30:00Z",
        },
      ],
    },
  ];

  // Mock chat messages
  const chatMessages = [
    {
      id: 1,
      user: "Sarah Johnson",
      text: "Good morning team! How's the development going?",
      timestamp: "2024-01-15T09:00:00Z",
      type: "text",
    },
    {
      id: 2,
      user: "You",
      text: "Morning Sarah! We're making good progress on the frontend components.",
      timestamp: "2024-01-15T09:15:00Z",
      type: "text",
    },
    {
      id: 3,
      user: "Mike Chen",
      text: "I've finished the responsive design for mobile. Should I start on the backend API?",
      timestamp: "2024-01-15T10:30:00Z",
      type: "text",
    },
    {
      id: 4,
      user: "Sarah Johnson",
      text: "Yes, that sounds good. Let's sync up this afternoon to discuss the API structure.",
      timestamp: "2024-01-15T11:00:00Z",
      type: "text",
    },
  ];

  const tabs = [
    { id: "timeline", label: "Timeline", icon: "📅" },
    { id: "files", label: "Files", icon: "📁" },
    { id: "comments", label: "Comments", icon: "💬" },
    { id: "chat", label: "Chat", icon: "💭" },
  ];

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handleFileUpload = useCallback((uploadedFiles) => {
    console.log("Files uploaded:", uploadedFiles);
  }, []);

  const handleFileDownload = useCallback((file) => {
    console.log("Downloading file:", file);
  }, []);

  const handleFileView = useCallback((file) => {
    console.log("Viewing file:", file);
  }, []);

  const handleAddComment = useCallback((comment) => {
    console.log("Adding comment:", comment);
  }, []);

  const handleReplyToComment = useCallback((parentId, reply) => {
    console.log("Replying to comment:", parentId, reply);
  }, []);

  const handleSendMessage = useCallback((message) => {
    console.log("Sending message:", message);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "timeline":
        return <Timeline milestones={milestones} />;
      case "files":
        return (
          <FileRepository
            files={files}
            onUpload={handleFileUpload}
            onDownload={handleFileDownload}
            onView={handleFileView}
          />
        );
      case "comments":
        return (
          <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            onReplyToComment={handleReplyToComment}
          />
        );
      case "chat":
        return (
          <ChatThread
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            currentUser="You"
          />
        );
      default:
        return <Timeline milestones={milestones} />;
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Project Header */}
      <ProjectHeader
        projectName={projectData.name}
        status={projectData.status}
        dueDate={projectData.dueDate}
        clientName={projectData.clientName}
        clientLogo={projectData.clientLogo}
      />

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl border border-neutral-200 p-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96 max-h-full overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
}
