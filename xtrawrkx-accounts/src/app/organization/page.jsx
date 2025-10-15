"use client";

import { motion } from "framer-motion";
import { Building, Users, MapPin, Briefcase } from "lucide-react";
import RouteGuard from "@/components/RouteGuard";

function OrganizationPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organization</h1>
            <p className="text-gray-600">
              Manage departments, teams, and locations
            </p>
          </div>
        </div>
      </div>

      {/* Organization Structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Departments",
            description: "Organizational departments",
            icon: Building,
            href: "/organization/departments",
            count: "8",
          },
          {
            title: "Teams",
            description: "Project and functional teams",
            icon: Users,
            href: "/coming-soon",
            count: "15",
          },
          {
            title: "Locations",
            description: "Office locations and sites",
            icon: MapPin,
            href: "/coming-soon",
            count: "3",
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => (window.location.href = item.href)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {item.count}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Organization Overview */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Organization Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                New team "Marketing" created
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Department "Engineering" updated
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Location "Remote" added
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Quick Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Employees</span>
                <span className="font-medium text-gray-900">47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Teams</span>
                <span className="font-medium text-gray-900">15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Office Locations</span>
                <span className="font-medium text-gray-900">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export with route protection - requires Manager level access
export default function ProtectedOrganizationPage() {
  return (
    <RouteGuard requiredLevel="Manager">
      <OrganizationPage />
    </RouteGuard>
  );
}
