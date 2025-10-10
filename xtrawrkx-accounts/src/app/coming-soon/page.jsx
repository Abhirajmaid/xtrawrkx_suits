"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Wrench,
  Zap,
  Shield,
  Users,
  Building,
  BarChart3,
  Bell,
  Globe,
  Key,
  Settings,
  MapPin,
  Calendar,
} from "lucide-react";

export default function ComingSoonPage() {
  const router = useRouter();

  const upcomingFeatures = [
    {
      icon: Shield,
      title: "Advanced Security",
      description:
        "Enhanced security features including audit logs and session management",
      eta: "Q2 2024",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics and reporting for user activities",
      eta: "Q2 2024",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Intelligent notification system with customizable alerts",
      eta: "Q3 2024",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Globe,
      title: "API Integrations",
      description: "Connect with third-party services and external APIs",
      eta: "Q3 2024",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Enhanced team features and collaboration tools",
      eta: "Q4 2024",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: MapPin,
      title: "Location Management",
      description: "Advanced location and office management features",
      eta: "Q4 2024",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  const roadmapItems = [
    {
      quarter: "Q2 2024",
      items: [
        "Advanced Security Features",
        "Analytics Dashboard",
        "Enhanced Reporting",
        "Mobile App Beta",
      ],
    },
    {
      quarter: "Q3 2024",
      items: [
        "Smart Notifications",
        "API Integrations",
        "Workflow Automation",
        "Advanced Permissions",
      ],
    },
    {
      quarter: "Q4 2024",
      items: [
        "Team Collaboration Tools",
        "Location Management",
        "Custom Dashboards",
        "Enterprise Features",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Wrench className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h1>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          We're working hard to bring you amazing new features. This page is
          currently under development and will be available soon with enhanced
          functionality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 glass-button rounded-xl font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Development Progress
          </h2>
          <span className="text-sm text-gray-600">65% Complete</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">12</div>
            <div className="text-sm text-green-700">Features Complete</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
            <div className="text-sm text-blue-700">In Development</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">6</div>
            <div className="text-sm text-purple-700">In Planning</div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Upcoming Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg mb-4`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {feature.description}
              </p>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  ETA: {feature.eta}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Development Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Development Roadmap
          </h2>
        </div>

        <div className="space-y-6">
          {roadmapItems.map((quarter, index) => (
            <motion.div
              key={quarter.quarter}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                  {quarter.quarter.split(" ")[0]}
                </div>
                {index < roadmapItems.length - 1 && (
                  <div className="w-0.5 h-16 bg-gradient-to-b from-primary-500 to-primary-300 mt-4" />
                )}
              </div>

              <div className="flex-1 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {quarter.quarter}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quarter.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stay Updated */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Bell className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Stay Updated
        </h2>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Want to be notified when new features are released? We'll keep you
          informed about our progress.
        </p>

        <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          Get Notified
        </button>
      </motion.div>
    </div>
  );
}
