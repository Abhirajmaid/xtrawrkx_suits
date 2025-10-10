"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Crown,
  Calendar,
  MessageCircle,
  TrendingUp,
  Award,
  Plus,
  Grid3X3,
  Columns,
  MoreVertical,
  CheckCircle,
} from "lucide-react";
import { ModernButton } from "../../../components/ui";

// Communities data
const communitiesData = [
  {
    id: 1,
    name: "XEN",
    fullName: "XEN Entrepreneurs Network",
    category: "Business Division",
    description:
      "Early-stage startup community focused on innovation and growth",
    members: 1247,
    tier: "Premium",
    status: "Active",
    tags: ["Startup Support", "Networking", "Mentorship"],
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
    ],
  },
  {
    id: 2,
    name: "XEV.FiN",
    fullName: "XEV Financial Network",
    category: "Investment Division",
    description: "Investment & funding network for entrepreneurs and investors",
    members: 523,
    tier: "Elite",
    status: "Active",
    tags: ["Investment", "Funding", "Due Diligence"],
    logo: "/images/logos/xevfin-logo.png",
    color: "green-500",
    isMember: false,
    userTier: null,
    userTierName: null,
    canUpgrade: false,
    nextTier: null,
    nextTierName: null,
    monthlyEvents: 4,
    activeDiscussions: 12,
    successStories: 89,
    joinDate: null,
    memberSince: null,
    benefits: [
      "Investor pitch sessions",
      "Due diligence workshops",
      "Term sheet negotiations",
      "Portfolio management",
    ],
  },
  {
    id: 3,
    name: "XEVTG",
    fullName: "XEV Tech Guild",
    category: "Tech Division",
    description: "Tech talent marketplace for professionals and companies",
    members: 2156,
    tier: "Standard",
    status: "Active",
    tags: ["Tech Talent", "Remote Work", "Skill Development"],
    logo: "/images/logos/xevtg-logo.png",
    color: "purple-500",
    isMember: true,
    userTier: "x2",
    userTierName: "Tech Member",
    canUpgrade: true,
    nextTier: "x3",
    nextTierName: "Senior Member",
    monthlyEvents: 12,
    activeDiscussions: 45,
    successStories: 234,
    joinDate: "2024-02-20",
    memberSince: "2 months",
    benefits: [
      "Skill assessment tests",
      "Job matching algorithm",
      "Remote work opportunities",
      "Tech mentorship",
    ],
  },
  {
    id: 4,
    name: "xD&D",
    fullName: "Design & Development Community",
    category: "Creative Division",
    description: "Design & development community for creators and builders",
    members: 892,
    tier: "Standard",
    status: "Active",
    tags: ["Design", "Development", "Portfolio"],
    logo: "/images/logos/xdd-logo.png",
    color: "pink-500",
    isMember: false,
    userTier: null,
    userTierName: null,
    canUpgrade: false,
    nextTier: null,
    nextTierName: null,
    monthlyEvents: 6,
    activeDiscussions: 18,
    successStories: 67,
    joinDate: null,
    memberSince: null,
    benefits: [
      "Portfolio reviews",
      "Design critiques",
      "Collaboration projects",
      "Creative workshops",
    ],
  },
];

// Filter options
const filterOptions = {
  status: ["All", "Member", "Non-Member"],
  tier: ["All", "Standard", "Premium", "Elite"],
  category: [
    "All",
    "Business Division",
    "Investment Division",
    "Tech Division",
    "Creative Division",
  ],
};

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "All",
    tier: "All",
    category: "All",
  });
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Filter communities based on search and filters
  const filteredCommunities = communitiesData.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedFilters.status === "All" ||
      (selectedFilters.status === "Member" && community.isMember) ||
      (selectedFilters.status === "Non-Member" && !community.isMember);

    const matchesTier =
      selectedFilters.tier === "All" || community.tier === selectedFilters.tier;
    const matchesCategory =
      selectedFilters.category === "All" ||
      community.category === selectedFilters.category;

    return matchesSearch && matchesStatus && matchesTier && matchesCategory;
  });

  const memberCommunities = communitiesData.filter((c) => c.isMember);
  const totalMembers = communitiesData.reduce((sum, c) => sum + c.members, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Communities
                </h1>
                <p className="mt-2 text-gray-600">
                  Connect with like-minded professionals and grow your network
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <ModernButton
                  type="gradient"
                  size="sm"
                  text="Join Community"
                  icon={Plus}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      {totalMembers.toLocaleString()}
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
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">
                      My Communities
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {memberCommunities.length}
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
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">
                      Events This Month
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {communitiesData.reduce(
                        (sum, c) => sum + c.monthlyEvents,
                        0
                      )}
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
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-orange-600">
                      Success Stories
                    </p>
                    <p className="text-2xl font-bold text-orange-900">
                      {communitiesData.reduce(
                        (sum, c) => sum + c.successStories,
                        0
                      )}
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
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search communities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ModernButton
                type="secondary"
                onClick={() => setShowFilters(!showFilters)}
                text="Filters"
                icon={Filter}
              />

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Columns className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedFilters.status}
                    onChange={(e) =>
                      setSelectedFilters({
                        ...selectedFilters,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {filterOptions.status.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tier
                  </label>
                  <select
                    value={selectedFilters.tier}
                    onChange={(e) =>
                      setSelectedFilters({
                        ...selectedFilters,
                        tier: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {filterOptions.tier.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedFilters.category}
                    onChange={(e) =>
                      setSelectedFilters({
                        ...selectedFilters,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {filterOptions.category.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Communities Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {filteredCommunities.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {viewMode === "grid" ? (
                // Grid View
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 bg-${community.color} rounded-lg flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-lg">
                          {community.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {community.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {community.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {community.isMember && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Member
                        </span>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {community.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {community.tags.length > 2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{community.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {community.members.toLocaleString()} members
                    </div>
                    <div className="flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      {community.tier}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {community.isMember ? (
                      <div className="flex items-center space-x-3">
                        <Link href={`/communities/${community.id}`}>
                          <ModernButton
                            type="primary"
                            size="sm"
                            text="View Community"
                            hideArrow={false}
                          />
                        </Link>
                        {community.canUpgrade && (
                          <ModernButton
                            type="tertiary"
                            size="sm"
                            text="Upgrade"
                            className="border-purple-600 text-purple-600 hover:bg-purple-50"
                          />
                        )}
                      </div>
                    ) : (
                      <ModernButton
                        type="gradient"
                        size="sm"
                        text="Join Community"
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              ) : (
                // List View
                <>
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-16 h-16 bg-${community.color} rounded-lg flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-xl">
                            {community.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {community.name}
                          </h3>
                          <p className="text-gray-600">{community.fullName}</p>
                          <p className="text-sm text-gray-500">
                            {community.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {community.isMember && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Member
                          </span>
                        )}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {community.members.toLocaleString()} members
                          </p>
                          <p className="text-sm text-gray-500">
                            {community.tier} tier
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {community.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {community.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {community.monthlyEvents} events/month
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {community.activeDiscussions} discussions
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          {community.successStories} success stories
                        </div>
                      </div>
                      {community.isMember ? (
                        <div className="flex items-center space-x-3">
                          <Link href={`/communities/${community.id}`}>
                            <ModernButton
                              type="primary"
                              size="sm"
                              text="View Community"
                              hideArrow={false}
                            />
                          </Link>
                          {community.canUpgrade && (
                            <ModernButton
                              type="tertiary"
                              size="sm"
                              text="Upgrade"
                              className="border-purple-600 text-purple-600 hover:bg-purple-50"
                            />
                          )}
                        </div>
                      ) : (
                        <ModernButton
                          type="gradient"
                          size="sm"
                          text="Join Community"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No communities found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <ModernButton
              type="secondary"
              onClick={() => {
                setSearchTerm("");
                setSelectedFilters({
                  status: "All",
                  tier: "All",
                  category: "All",
                });
              }}
              text="Clear Filters"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
