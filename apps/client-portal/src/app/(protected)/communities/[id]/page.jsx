"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Calendar,
  MessageCircle,
  Award,
  Crown,
  Star,
  Clock,
  TrendingUp,
  Share2,
  Bell,
  Settings,
  Plus,
  CheckCircle,
  Zap,
  Target,
  BookOpen,
  Video,
  FileText,
  Download,
} from "lucide-react";
import {
  BlueButton,
  PurpleButton,
  WhiteButton,
  GreenButton,
} from "@xtrawrkx/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for community detail
const communityData = {
  id: 1,
  name: "XEN",
  fullName: "XEN Entrepreneurs Network",
  category: "Business Division",
  description:
    "Early-stage startup community focused on innovation and growth. We provide mentorship, networking opportunities, and resources to help entrepreneurs build successful businesses.",
  members: 1247,
  tier: "Premium",
  status: "Active",
  tags: ["Startup Support", "Networking", "Mentorship", "Innovation"],
  logo: "/images/logos/xen-logo.png",
  color: "blue-500",
  isMember: true,
  userTier: "x3",
  userTierName: "Growth Member",
  canUpgrade: true,
  nextTier: "x4",
  nextTierName: "Scale Member",
  monthlyEvents: 8,
  activeDiscussions: 23,
  successStories: 156,
  joinDate: "2024-01-15",
  memberSince: "3 months",
  benefits: [
    "Weekly networking events",
    "1-on-1 mentorship sessions",
    "Pitch deck reviews",
    "Co-founder matching",
    "Access to investor network",
    "Business plan templates",
  ],
  upcomingEvents: [
    {
      id: 1,
      title: "Weekly Networking Mixer",
      date: "2024-03-15",
      time: "6:00 PM",
      type: "Networking",
      attendees: 45,
      location: "Virtual",
      description: "Connect with fellow entrepreneurs and share experiences",
    },
    {
      id: 2,
      title: "Pitch Deck Workshop",
      date: "2024-03-20",
      time: "2:00 PM",
      type: "Workshop",
      attendees: 23,
      location: "Virtual",
      description: "Learn how to create compelling pitch decks",
    },
    {
      id: 3,
      title: "Investor Panel Discussion",
      date: "2024-03-25",
      time: "7:00 PM",
      type: "Panel",
      attendees: 67,
      location: "Virtual",
      description: "Q&A session with successful investors",
    },
  ],
  recentDiscussions: [
    {
      id: 1,
      title: "Best practices for startup funding",
      author: "Sarah Johnson",
      authorAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47e?w=32&h=32&fit=crop&crop=face",
      replies: 12,
      lastActivity: "2 hours ago",
      category: "Funding",
    },
    {
      id: 2,
      title: "Co-founder equity split advice",
      author: "Mike Chen",
      authorAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      replies: 8,
      lastActivity: "4 hours ago",
      category: "Legal",
    },
    {
      id: 3,
      title: "Marketing strategies for early-stage startups",
      author: "Emily Davis",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      replies: 15,
      lastActivity: "6 hours ago",
      category: "Marketing",
    },
  ],
  successStories: [
    {
      id: 1,
      title: "From Idea to $1M Series A",
      author: "Alex Rodriguez",
      company: "TechFlow Solutions",
      description: "How I raised my first million in just 6 months",
      readTime: "5 min read",
      publishedDate: "2024-03-10",
    },
    {
      id: 2,
      title: "Building a Remote-First Company",
      author: "Lisa Wang",
      company: "RemoteWork Pro",
      description: "Lessons learned from scaling a distributed team",
      readTime: "8 min read",
      publishedDate: "2024-03-08",
    },
  ],
  resources: [
    {
      id: 1,
      title: "Startup Funding Guide",
      type: "PDF",
      size: "2.4 MB",
      downloads: 234,
      description: "Complete guide to startup funding options",
    },
    {
      id: 2,
      title: "Pitch Deck Template",
      type: "PPTX",
      size: "1.8 MB",
      downloads: 189,
      description: "Professional pitch deck template",
    },
    {
      id: 3,
      title: "Business Plan Template",
      type: "DOCX",
      size: "3.2 MB",
      downloads: 156,
      description: "Comprehensive business plan template",
    },
  ],
};

export default function CommunityDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "events", label: "Events", icon: Calendar },
    { id: "discussions", label: "Discussions", icon: MessageCircle },
    { id: "resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link href="/communities">
                  <WhiteButton size="sm" className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Communities
                  </WhiteButton>
                </Link>
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 bg-${communityData.color} rounded-xl flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-2xl">
                      {communityData.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {communityData.name}
                    </h1>
                    <p className="text-gray-600">{communityData.fullName}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <WhiteButton size="sm" className="flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </WhiteButton>
                <WhiteButton size="sm" className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </WhiteButton>
                <PurpleButton size="sm" className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </PurpleButton>
              </div>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">
                      Total Members
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {communityData.members.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">
                      Events This Month
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {communityData.monthlyEvents}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">
                      Active Discussions
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {communityData.activeDiscussions}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-orange-600">
                      Success Stories
                    </p>
                    <p className="text-2xl font-bold text-orange-900">
                      {communityData.successStories}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div
                  className={`w-20 h-20 bg-${communityData.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <span className="text-white font-bold text-3xl">
                    {communityData.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {communityData.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {communityData.category}
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {communityData.userTierName}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">
                    {communityData.memberSince}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tier</span>
                  <span className="font-medium">{communityData.tier}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">
                    {communityData.status}
                  </span>
                </div>
              </div>

              {communityData.canUpgrade && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <PurpleButton size="sm" className="w-full">
                    Upgrade to {communityData.nextTierName}
                  </PurpleButton>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Benefits
                </h4>
                <ul className="space-y-2">
                  {communityData.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                          activeTab === tab.id
                            ? "border-purple-500 text-purple-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About {communityData.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {communityData.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {communityData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Recent Success Stories
                      </h3>
                      <div className="space-y-4">
                        {communityData.successStories.map((story) => (
                          <div
                            key={story.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {story.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {story.description}
                                </p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <span>By {story.author}</span>
                                  <span className="mx-2">•</span>
                                  <span>{story.company}</span>
                                  <span className="mx-2">•</span>
                                  <span>{story.readTime}</span>
                                </div>
                              </div>
                              <WhiteButton size="sm">Read</WhiteButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "events" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Upcoming Events
                      </h3>
                      <PurpleButton size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
                      </PurpleButton>
                    </div>

                    <div className="space-y-4">
                      {communityData.upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {event.title}
                                </h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {event.type}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">
                                {event.description}
                              </p>
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {event.date} at {event.time}
                                </div>
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {event.attendees} attendees
                                </div>
                                <div className="flex items-center">
                                  <Video className="w-4 h-4 mr-1" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <WhiteButton size="sm">Details</WhiteButton>
                              <BlueButton size="sm">Join</BlueButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "discussions" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent Discussions
                      </h3>
                      <PurpleButton size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Start Discussion
                      </PurpleButton>
                    </div>

                    <div className="space-y-4">
                      {communityData.recentDiscussions.map((discussion) => (
                        <div
                          key={discussion.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={discussion.authorAvatar} />
                              <AvatarFallback>
                                {discussion.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900">
                                  {discussion.title}
                                </h4>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  {discussion.category}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <span>By {discussion.author}</span>
                                <span className="mx-2">•</span>
                                <span>{discussion.replies} replies</span>
                                <span className="mx-2">•</span>
                                <span>{discussion.lastActivity}</span>
                              </div>
                            </div>
                            <WhiteButton size="sm">View</WhiteButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Community Resources
                      </h3>
                      <PurpleButton size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Resource
                      </PurpleButton>
                    </div>

                    <div className="space-y-4">
                      {communityData.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {resource.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {resource.description}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <span>{resource.type}</span>
                                  <span className="mx-2">•</span>
                                  <span>{resource.size}</span>
                                  <span className="mx-2">•</span>
                                  <span>{resource.downloads} downloads</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <WhiteButton
                                size="sm"
                                className="flex items-center"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </WhiteButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
