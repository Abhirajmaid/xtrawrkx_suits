"use client";

import { useState, useEffect } from "react";
import { Users, IndianRupee, TrendingUp, Target, Loader2 } from "lucide-react";
import { Card } from "../../components/ui";
import ProtectedRoute from "../../components/ProtectedRoute";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import dashboardService from "../../lib/api/dashboardService";
import { formatCurrency } from "../../lib/utils/format";
import DealsPipelineWidget from "../../components/dashboard/DealsPipelineWidget";
import SalesAnalyticsWidget from "../../components/dashboard/SalesAnalyticsWidget";
import ActivityFeedWidget from "../../components/dashboard/ActivityFeedWidget";
import QuickActionsWidget from "../../components/dashboard/QuickActionsWidget";

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    weeklyLeads: [],
    pipelineStages: {
      leads: [],
      qualified: [],
      proposal: [],
      negotiation: [],
    },
    tasks: [],
  });

  // Get current date
  const getCurrentDate = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("en-US", options);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsResponse, weeklyLeads, pipelineStages, tasks] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getWeeklyLeadsData(),
          dashboardService.getPipelineStages(),
          dashboardService.getUpcomingTasks(),
        ]);

      const statsData = statsResponse?.data || {};

      // Calculate stats with change indicators from real data
      const changes = statsData.changes || {};
      const formatChange = (change) => {
        if (change === 0) return "0";
        return change > 0 ? `+${change}%` : `${change}%`;
      };

      const stats = [
        {
          title: "Total Leads",
          value: statsData.totalLeads?.toString() || "0",
          change: formatChange(changes.leadsChange || 0),
          changeType: (changes.leadsChange || 0) >= 0 ? "increase" : "decrease",
          icon: Users,
        },
        {
          title: "Pipeline Value",
          value: formatCurrency(statsData.pipelineValue || 0, {
            notation: "compact",
          }),
          change: formatChange(changes.pipelineValueChange || 0),
          changeType:
            (changes.pipelineValueChange || 0) >= 0 ? "increase" : "decrease",
          icon: IndianRupee,
        },
        {
          title: "Conversion Rate",
          value: `${statsData.conversionRate || 0}%`,
          change: formatChange(changes.conversionRateChange || 0),
          changeType:
            (changes.conversionRateChange || 0) >= 0 ? "increase" : "decrease",
          icon: TrendingUp,
        },
        {
          title: "Active Deals",
          value: statsData.activeDeals?.toString() || "0",
          change: formatChange(changes.dealsChange || 0),
          changeType: (changes.dealsChange || 0) >= 0 ? "increase" : "decrease",
          icon: Target,
        },
      ];

      setDashboardData({
        stats,
        weeklyLeads,
        pipelineStages,
        tasks,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default stats on error
      setDashboardData({
        stats: [
          {
            title: "Total Leads",
            value: "0",
            change: "0",
            changeType: "increase",
            icon: Users,
          },
          {
            title: "Pipeline Value",
            value: formatCurrency(0, { notation: "compact" }),
            change: "0",
            changeType: "increase",
            icon: IndianRupee,
          },
          {
            title: "Conversion Rate",
            value: "0%",
            change: "0",
            changeType: "increase",
            icon: TrendingUp,
          },
          {
            title: "Active Deals",
            value: "0",
            change: "0",
            changeType: "increase",
            icon: Target,
          },
        ],
        weeklyLeads: [],
        pipelineStages: {
          leads: [],
          qualified: [],
          proposal: [],
          negotiation: [],
        },
        tasks: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle share image functionality
  const handleShareImage = async () => {
    try {
      // Capture the dashboard as an image using html2canvas or similar
      // For now, we'll create a simple implementation
      if (typeof window !== "undefined" && navigator.share) {
        // Use Web Share API if available
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Try to capture the dashboard content
        const dashboardElement = document.querySelector(".dashboard-content");
        if (dashboardElement) {
          // You would use html2canvas here in a real implementation
          // html2canvas(dashboardElement).then(canvas => {
          //   canvas.toBlob(blob => {
          //     const file = new File([blob], "dashboard.png", { type: "image/png" });
          //     navigator.share({ files: [file], title: "Dashboard Screenshot" });
          //   });
          // });

          // Temporary: show message about sharing
          alert(
            "Dashboard screenshot feature coming soon! This will capture and share the dashboard as an image."
          );
        }
      } else {
        // Fallback for browsers without Web Share API
        alert("Sharing dashboard image is coming soon!");
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      alert("Failed to share image. Please try again.");
    }
  };

  const stats = dashboardData.stats || [];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-4 space-y-4 bg-white min-h-screen">
          <PageHeader
            title="Dashboard"
            subtitle={`${getGreeting()}, ${
              user?.firstName || user?.name?.split(" ")[0] || "User"
            } • ${getCurrentDate()}`}
            breadcrumb={[{ label: "Dashboard", href: "/" }]}
            showSearch={false}
            showActions={false}
          />
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <span className="text-gray-600">Loading dashboard...</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // (Old pipeline color helpers removed)

  return (
    <ProtectedRoute>
      <div className="p-4 space-y-4 bg-white min-h-screen dashboard-content">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          subtitle={`${getGreeting()}, ${
            user?.firstName || user?.name?.split(" ")[0] || "User"
          } • ${getCurrentDate()}`}
          breadcrumb={[{ label: "Dashboard", href: "/" }]}
          showSearch={true}
          showActions={true}
          searchPlaceholder="Search anything..."
          onSearchChange={setSearchQuery}
          onAddClick={() => console.log("Add clicked")}
          onFilterClick={() => console.log("Filter clicked")}
          onImportClick={() => console.log("Import clicked")}
          onShareImageClick={handleShareImage}
        />

        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const statConfig = [
                {
                  color: "bg-blue-50",
                  borderColor: "border-blue-200",
                  iconColor: "text-blue-600",
                  dotColor: "bg-blue-500",
                },
                {
                  color: "bg-green-50",
                  borderColor: "border-green-200",
                  iconColor: "text-green-600",
                  dotColor: "bg-green-500",
                },
                {
                  color: "bg-purple-50",
                  borderColor: "border-purple-200",
                  iconColor: "text-purple-600",
                  dotColor: "bg-purple-500",
                },
                {
                  color: "bg-orange-50",
                  borderColor: "border-orange-200",
                  iconColor: "text-orange-600",
                  dotColor: "bg-orange-500",
                },
              ];

              const config = statConfig[index];
              const IconComponent = stat.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1 font-medium">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-black text-gray-800">
                        {stat.value}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${config.dotColor}`}
                        ></span>
                        <span
                          className={
                            stat.changeType === "increase"
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {stat.change}
                        </span>
                        {stat.change !== "0" && (
                          <span className="ml-1">this period</span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-16 h-16 ${config.color} backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border ${config.borderColor}`}
                    >
                      <IconComponent
                        className={`w-8 h-8 ${config.iconColor}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Dashboard Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Analytics & Pipeline */}
          <div className="xl:col-span-2 space-y-6">
            {/* Sales Analytics */}
            <SalesAnalyticsWidget />

            {/* Deals Pipeline */}
            <DealsPipelineWidget />
          </div>

          {/* Right Column - Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActionsWidget />

            {/* Activity Feed */}
            <ActivityFeedWidget />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
