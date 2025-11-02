"use client";

import { useState, useEffect } from "react";
import { Card, Avatar, Badge } from "../ui";
import activityService from "../../lib/api/activityService";
import {
  Activity,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  Building2,
} from "lucide-react";

export default function ActivityFeedWidget() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getAll({
        pagination: { pageSize: 15 },
        sort: ["createdAt:desc"],
        populate: ["createdBy", "leadCompany", "clientAccount", "deal", "contact"],
      });

      const activitiesData = response?.data || [];
      
      // Transform Strapi activities to widget format
      const transformedActivities = activitiesData.map((activity) => {
        const activityData = activity.attributes || activity;
        const activityType = activityData.activityType || activityData.type || "";
        const type = activityData.type || "activity";
        
        // Map activity types to icons and colors
        const activityConfig = getActivityConfig(activityType, type, activityData);
        
        // Get user info
        const createdBy = activityData.createdBy?.data || activityData.createdBy;
        const user = createdBy
          ? {
              name: `${createdBy.firstName || ""} ${createdBy.lastName || ""}`.trim() || createdBy.username || "Unknown User",
              avatar: getInitials(createdBy.firstName, createdBy.lastName, createdBy.username),
            }
          : { name: "System", avatar: "SY" };

        // Get description/title
        const title = activityData.title || activityConfig.defaultTitle || "Activity";
        let description = activityData.description || "";
        
        // Build description from related entities
        if (!description) {
          const leadCompany = activityData.leadCompany?.data || activityData.leadCompany;
          const clientAccount = activityData.clientAccount?.data || activityData.clientAccount;
          const deal = activityData.deal?.data || activityData.deal;
          const contact = activityData.contact?.data || activityData.contact;
          
          if (deal) {
            const dealData = deal.attributes || deal;
            description = `${dealData.name || "Deal"} - ${formatCurrency(dealData.value || 0)}`;
          } else if (leadCompany) {
            const leadData = leadCompany.attributes || leadCompany;
            description = leadData.companyName || "Lead Company";
          } else if (clientAccount) {
            const accountData = clientAccount.attributes || clientAccount;
            description = accountData.companyName || "Client Account";
          } else if (contact) {
            const contactData = contact.attributes || contact;
            description = `${contactData.firstName || ""} ${contactData.lastName || ""}`.trim() || "Contact";
          } else {
            description = activityConfig.defaultDescription || "No details";
          }
        }

        const timestamp = new Date(activityData.createdAt || activity.createdAt || Date.now());
        
        return {
          id: activity.id || activity.documentId,
          ...activityConfig,
          title,
          description,
          user,
          timestamp,
          timeAgo: formatTimeAgo(timestamp),
        };
      });

      setActivities(transformedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };
  
  const getActivityConfig = (activityType, type, activityData) => {
    const typeLower = (activityType || type || "").toLowerCase();
    
    if (typeLower.includes("deal") || typeLower.includes("opportunity")) {
      return {
        icon: DollarSign,
        color: "text-green-600 bg-green-100",
        defaultTitle: "Deal activity",
        defaultDescription: "Deal update",
      };
    }
    if (typeLower.includes("call") || typeLower === "phone") {
      return {
        icon: Phone,
        color: "text-blue-600 bg-blue-100",
        defaultTitle: "Call completed",
        defaultDescription: "Phone call",
      };
    }
    if (typeLower.includes("email") || typeLower === "email") {
      return {
        icon: Mail,
        color: "text-purple-600 bg-purple-100",
        defaultTitle: "Email sent",
        defaultDescription: "Email communication",
      };
    }
    if (typeLower.includes("meeting") || typeLower.includes("appointment")) {
      return {
        icon: Calendar,
        color: "text-orange-600 bg-orange-100",
        defaultTitle: "Meeting scheduled",
        defaultDescription: "Meeting",
      };
    }
    if (typeLower.includes("task") || activityData.status === "COMPLETED") {
      return {
        icon: CheckCircle,
        color: "text-green-600 bg-green-100",
        defaultTitle: "Task completed",
        defaultDescription: "Task update",
      };
    }
    if (typeLower.includes("lead") || typeLower.includes("conversion")) {
      return {
        icon: TrendingUp,
        color: "text-indigo-600 bg-indigo-100",
        defaultTitle: "Lead activity",
        defaultDescription: "Lead update",
      };
    }
    if (typeLower.includes("contact")) {
      return {
        icon: User,
        color: "text-gray-600 bg-gray-100",
        defaultTitle: "Contact activity",
        defaultDescription: "Contact update",
      };
    }
    
    // Default
    return {
      icon: Activity,
      color: "text-gray-600 bg-gray-100",
      defaultTitle: "Activity",
      defaultDescription: "System activity",
    };
  };
  
  const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "NA";
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };


  if (loading) {
    return (
      <Card className="p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-600">Latest updates from your team</p>
        </div>
        <div className="w-12 h-12 bg-orange-50 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
          <Activity className="w-6 h-6 text-orange-600" />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          
          // Map activity colors to icon container styles
          const getIconContainerStyles = (colorClass) => {
            const colorMap = {
              'text-green-600 bg-green-100': { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' },
              'text-blue-600 bg-blue-100': { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
              'text-purple-600 bg-purple-100': { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600' },
              'text-orange-600 bg-orange-100': { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' },
              'text-indigo-600 bg-indigo-100': { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-600' },
              'text-gray-600 bg-gray-100': { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-600' },
            };
            return colorMap[colorClass] || { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' };
          };
          
          const iconStyles = getIconContainerStyles(activity.color);

          return (
            <div
              key={activity.id}
              className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-4 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-start space-x-3">
                {/* Activity Icon */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border ${iconStyles.bg} ${iconStyles.border}`}
                  >
                    <IconComponent className={`w-6 h-6 ${iconStyles.icon}`} />
                  </div>
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {activity.timeAgo}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>

                  <div className="flex items-center space-x-2">
                    <Avatar
                      name={activity.user.name}
                      size="sm"
                      className="w-6 h-6 text-xs"
                    />
                    <span className="text-xs text-gray-500 font-medium">
                      {activity.user.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/30">
        <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm">
          View All Activities
        </button>
      </div>
    </Card>
  );
}
