"use client";

import { Card, Button, Badge } from "../../../components/ui";
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  User,
  Clock,
  ArrowRight,
  MoreHorizontal
} from "lucide-react";

export default function ActivityFeedPreview() {
  const activities = [
    {
      id: 1,
      type: "call",
      title: "Follow up call with Tech Corp",
      description: "Discussed pricing and implementation timeline",
      contact: "John Davis",
      company: "Tech Corp",
      time: "2 hours ago",
      status: "completed",
      icon: Phone,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
    },
    {
      id: 2,
      type: "email",
      title: "Proposal sent to Design Studio",
      description: "Comprehensive project proposal with timeline",
      contact: "Sarah Martinez",
      company: "Design Studio",
      time: "4 hours ago",
      status: "sent",
      icon: Mail,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      id: 3,
      type: "meeting",
      title: "Demo scheduled with Marketing Pro",
      description: "Product demonstration and Q&A session",
      contact: "Mike Rodriguez",
      company: "Marketing Pro",
      time: "6 hours ago",
      status: "scheduled",
      icon: Calendar,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
    },
    {
      id: 4,
      type: "note",
      title: "Lead qualification completed",
      description: "Qualified as enterprise prospect with high intent",
      contact: "Lisa Wong",
      company: "Enterprise Solutions",
      time: "1 day ago",
      status: "updated",
      icon: FileText,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },
    {
      id: 5,
      type: "message",
      title: "Chat conversation with prospect",
      description: "Answered questions about integration capabilities",
      contact: "Tom Wilson",
      company: "Global Systems",
      time: "2 days ago",
      status: "responded",
      icon: MessageSquare,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-50",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "success", text: "Completed" },
      sent: { variant: "default", text: "Sent" },
      scheduled: { variant: "warning", text: "Scheduled" },
      updated: { variant: "secondary", text: "Updated" },
      responded: { variant: "default", text: "Responded" },
    };

    const config = statusConfig[status] || { variant: "secondary", text: status };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  return (
    <Card title="Recent Activities" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-text-light" />
          <span className="text-sm text-brand-text-light">
            Last 5 activities
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200 group"
            >
              <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h5 className="text-sm font-semibold text-brand-foreground truncate pr-2">
                    {activity.title}
                  </h5>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusBadge(activity.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-brand-text-light mb-2 line-clamp-2">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-brand-text-light" />
                    <span className="text-brand-text-light">
                      {activity.contact}
                    </span>
                    <span className="text-brand-text-muted">•</span>
                    <span className="text-brand-text-light">
                      {activity.company}
                    </span>
                  </div>
                  <span className="text-brand-text-muted">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-text-light">Today's Activities</span>
          <span className="text-lg font-bold text-brand-foreground">8</span>
        </div>
      </div>
    </Card>
  );
}