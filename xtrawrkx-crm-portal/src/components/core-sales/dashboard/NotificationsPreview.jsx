"use client";

import { Card, Button, Badge } from "../../../components/ui";
import {
  Bell,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  User,
  ArrowRight,
  MoreHorizontal,
  X
} from "lucide-react";

export default function NotificationsPreview() {
  const notifications = [
    {
      id: 1,
      type: "urgent",
      title: "Deal about to expire",
      message: "Tech Corp deal expires in 2 hours without action",
      dealValue: 85000,
      time: "2 hours",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      iconBg: "bg-red-50",
      actionRequired: true,
    },
    {
      id: 2,
      type: "reminder",
      title: "Follow-up call scheduled",
      message: "Call with Design Studio scheduled for 3:00 PM today",
      contact: "Sarah Martinez",
      time: "30 minutes",
      icon: Clock,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
      actionRequired: true,
    },
    {
      id: 3,
      type: "achievement",
      title: "Monthly target achieved",
      message: "You've reached 110% of your monthly sales target",
      achievement: "110%",
      time: "1 hour",
      icon: TrendingUp,
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
      actionRequired: false,
    },
  ];

  const getNotificationPriority = (type) => {
    switch (type) {
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50/50';
      case 'reminder':
        return 'border-l-4 border-l-orange-500 bg-orange-50/50';
      case 'achievement':
        return 'border-l-4 border-l-green-500 bg-green-50/50';
      default:
        return 'border-l-4 border-l-gray-300 bg-gray-50/50';
    }
  };

  const getPriorityBadge = (type, actionRequired) => {
    if (type === 'urgent') {
      return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
    }
    if (actionRequired) {
      return <Badge variant="warning" className="text-xs">Action Required</Badge>;
    }
    return <Badge variant="success" className="text-xs">Info</Badge>;
  };

  const unreadCount = notifications.filter(n => n.actionRequired).length;

  return (
    <Card title="Notifications" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-text-light" />
          <span className="text-sm text-brand-text-light">
            {unreadCount} require action
          </span>
          {unreadCount > 0 && (
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`p-4 rounded-xl transition-all duration-200 hover:shadow-sm group ${getNotificationPriority(notification.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${notification.iconBg} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${notification.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 pr-2">
                      <h5 className="text-sm font-semibold text-brand-foreground mb-1">
                        {notification.title}
                      </h5>
                      <p className="text-xs text-brand-text-light line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {getPriorityBadge(notification.type, notification.actionRequired)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {notification.dealValue && (
                        <>
                          <DollarSign className="w-3 h-3 text-brand-text-light" />
                          <span className="text-brand-text-light">
                            ${(notification.dealValue / 1000).toFixed(0)}K
                          </span>
                        </>
                      )}
                      {notification.contact && (
                        <>
                          <User className="w-3 h-3 text-brand-text-light" />
                          <span className="text-brand-text-light">
                            {notification.contact}
                          </span>
                        </>
                      )}
                      {notification.achievement && (
                        <>
                          <TrendingUp className="w-3 h-3 text-brand-text-light" />
                          <span className="text-brand-text-light">
                            Target: {notification.achievement}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-brand-text-muted">{notification.time} ago</span>
                  </div>

                  {notification.actionRequired && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="default" className="text-xs px-3 py-1">
                        {notification.type === 'urgent' ? 'Take Action' : 'View Details'}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs px-3 py-1">
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-text-light">Unread notifications</span>
          <span className="text-lg font-bold text-brand-foreground">{unreadCount}</span>
        </div>
      </div>
    </Card>
  );
}