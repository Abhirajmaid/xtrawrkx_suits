"use client";

import { useState } from "react";
import { Badge } from "@xtrawrkx/ui";
import {
  FileText,
  File,
  Image,
  FileSpreadsheet,
  FilePdf,
  Download,
  Eye,
  Edit,
  Trash2,
  Share,
  MoreHorizontal,
  Upload,
  Filter,
  Search,
  Folder,
  Calendar,
  User,
  Clock,
  Star,
  StarOff,
  Link,
  ExternalLink,
  Plus,
} from "lucide-react";

export default function ContactDocuments({ contactId }) {
  const [selectedFilters, setSelectedFilters] = useState({
    type: "all",
    category: "all",
    dateRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Mock documents data - replace with actual API calls
  const documents = [
    {
      id: 1,
      name: "Q1 Project Proposal.pdf",
      type: "pdf",
      category: "proposal",
      size: 2048576, // 2MB
      uploadedBy: "John Smith",
      uploadedAt: "2024-01-15T10:30:00Z",
      lastModified: "2024-01-15T10:30:00Z",
      version: "1.0",
      description: "Detailed proposal for Q1 CRM implementation project",
      tags: ["proposal", "q1", "crm"],
      isShared: true,
      isStarred: false,
      downloadCount: 3,
      linkedTo: ["deal-1", "project-1"],
      permissions: {
        view: true,
        edit: true,
        download: true,
        share: true,
      },
    },
    {
      id: 2,
      name: "Technical Specifications.docx",
      type: "docx",
      category: "technical",
      size: 1536000, // 1.5MB
      uploadedBy: "Jane Doe",
      uploadedAt: "2024-01-14T14:15:00Z",
      lastModified: "2024-01-14T14:15:00Z",
      version: "2.1",
      description: "Technical specifications for CRM integration requirements",
      tags: ["technical", "specifications", "integration"],
      isShared: true,
      isStarred: true,
      downloadCount: 8,
      linkedTo: ["project-1"],
      permissions: {
        view: true,
        edit: false,
        download: true,
        share: true,
      },
    },
    {
      id: 3,
      name: "Contract Template.pdf",
      type: "pdf",
      category: "contract",
      size: 1024000, // 1MB
      uploadedBy: "Mike Johnson",
      uploadedAt: "2024-01-12T09:20:00Z",
      lastModified: "2024-01-12T09:20:00Z",
      version: "3.2",
      description: "Standard contract template for enterprise clients",
      tags: ["contract", "template", "legal"],
      isShared: false,
      isStarred: false,
      downloadCount: 1,
      linkedTo: [],
      permissions: {
        view: true,
        edit: true,
        download: true,
        share: false,
      },
    },
    {
      id: 4,
      name: "Project Timeline.xlsx",
      type: "xlsx",
      category: "project",
      size: 512000, // 512KB
      uploadedBy: "John Smith",
      uploadedAt: "2024-01-10T11:00:00Z",
      lastModified: "2024-01-10T11:00:00Z",
      version: "1.3",
      description: "Detailed project timeline with milestones and dependencies",
      tags: ["timeline", "project", "milestones"],
      isShared: true,
      isStarred: false,
      downloadCount: 5,
      linkedTo: ["project-1", "deal-1"],
      permissions: {
        view: true,
        edit: true,
        download: true,
        share: true,
      },
    },
    {
      id: 5,
      name: "Company Logo.png",
      type: "png",
      category: "branding",
      size: 256000, // 256KB
      uploadedBy: "Sarah Wilson",
      uploadedAt: "2024-01-08T16:45:00Z",
      lastModified: "2024-01-08T16:45:00Z",
      version: "1.0",
      description: "High-resolution company logo for marketing materials",
      tags: ["logo", "branding", "marketing"],
      isShared: true,
      isStarred: false,
      downloadCount: 12,
      linkedTo: ["project-2"],
      permissions: {
        view: true,
        edit: false,
        download: true,
        share: true,
      },
    },
  ];

  const documentTypes = [
    { value: "all", label: "All Types" },
    { value: "pdf", label: "PDF" },
    { value: "docx", label: "Word" },
    { value: "xlsx", label: "Excel" },
    { value: "png", label: "Image" },
    { value: "jpg", label: "Image" },
    { value: "other", label: "Other" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "proposal", label: "Proposal" },
    { value: "technical", label: "Technical" },
    { value: "contract", label: "Contract" },
    { value: "project", label: "Project" },
    { value: "branding", label: "Branding" },
    { value: "other", label: "Other" },
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="w-8 h-8 text-red-600" />;
      case "docx":
        return <FileText className="w-8 h-8 text-blue-600" />;
      case "xlsx":
        return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <Image className="w-8 h-8 text-purple-600" />;
      default:
        return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      proposal: { color: "badge-primary", label: "Proposal" },
      technical: { color: "badge-warning", label: "Technical" },
      contract: { color: "badge-error", label: "Contract" },
      project: { color: "badge-success", label: "Project" },
      branding: { color: "badge-gray", label: "Branding" },
      other: { color: "badge-gray", label: "Other" },
    };
    
    const config = categoryConfig[category] || categoryConfig.other;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  const filteredDocuments = documents.filter((doc) => {
    // Type filter
    if (selectedFilters.type !== "all" && doc.type !== selectedFilters.type) {
      return false;
    }

    // Category filter
    if (selectedFilters.category !== "all" && doc.category !== selectedFilters.category) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        doc.name,
        doc.description,
        doc.uploadedBy,
        ...doc.tags,
      ].join(" ").toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const totalSize = filteredDocuments.reduce((sum, doc) => sum + doc.size, 0);
  const sharedDocuments = filteredDocuments.filter(doc => doc.isShared).length;
  const starredDocuments = filteredDocuments.filter(doc => doc.isStarred).length;

  const handleDocumentSelect = (docId, isSelected) => {
    if (isSelected) {
      setSelectedDocuments(prev => [...prev, docId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== docId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          <p className="text-sm text-gray-600">
            Files and documents associated with this contact
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid View"
            >
              <Folder className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List View"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
          <button className="btn-primary">
            <span>Upload</span>
            <div className="btn-icon">
              <Upload className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Files</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {filteredDocuments.length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Size</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatFileSize(totalSize)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Share className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Shared</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{sharedDocuments}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Starred</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{starredDocuments}</div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                value={selectedFilters.type}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
                className="input py-2"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
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
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                className="input py-2"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={selectedFilters.dateRange}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="input py-2"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Documents Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors">
                    {doc.isStarred ? (
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                {getCategoryBadge(doc.category)}
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {doc.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {doc.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} className="badge-gray text-xs">
                    {tag}
                  </Badge>
                ))}
                {doc.tags.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{doc.tags.length - 2}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{doc.uploadedBy}</span>
                </div>
                <span>{formatRelativeTime(doc.uploadedAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={(e) => handleDocumentSelect(doc.id, e.target.checked)}
                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.name}
                            </p>
                            {doc.isStarred && (
                              <Star className="w-4 h-4 fill-current text-yellow-500" />
                            )}
                            {doc.isShared && (
                              <Share className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(doc.category)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatFileSize(doc.size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {doc.uploadedBy}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(doc.uploadedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-brand-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-brand-primary transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedFilters.type !== "all" || selectedFilters.category !== "all"
              ? "Try adjusting your filters or search terms"
              : "No documents associated with this contact yet"
            }
          </p>
          <button className="btn-primary">
            <span>Upload First Document</span>
            <div className="btn-icon">
              <Upload className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
