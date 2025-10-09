"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  Phone,
  Video,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useChat } from "@/components/providers/ChatProvider";
import ModernButton from "@/components/ui/ModernButton";

export default function MessagesPage() {
  const { conversations, unreadCount, onlineUsers } = useChat();

  // Calculate online team members
  const onlineTeamMembers = conversations.filter(
    (conv) => conv.isOnline
  ).length;
  const totalTeamMembers = conversations.length;

  return (
    <div className="p-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">
              Chat with the Xtrawrkx team directly through the portal
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{onlineTeamMembers} Team Members Online</span>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="bg-gradient-to-r from-pink-100 to-red-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Chat</h3>
                <p className="text-sm text-gray-600">
                  Instant messaging with the team
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Team Access</h3>
                <p className="text-sm text-gray-600">
                  Connect with project managers & developers
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">File Sharing</h3>
                <p className="text-sm text-gray-600">
                  Share documents and images easily
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Response</h3>
                <p className="text-sm text-gray-600">
                  Get instant replies from our team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Status */}
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-blue-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Xtrawrkx Support Team
                </h3>
                <p className="text-gray-600 text-lg">
                  Our team is here to help you 24/7. Average response time: &lt;
                  5 minutes
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-3 text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Available Now</span>
              </div>
              <div className="text-sm text-gray-500 mt-2 bg-white/30 px-3 py-1 rounded-full">
                {onlineTeamMembers}/{totalTeamMembers} team members online
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Interface */}
      <ChatInterface />
    </div>
  );
}
