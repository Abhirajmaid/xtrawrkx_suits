"use client";

import { useState } from "react";
import { Modal, Avatar } from "../../../../../../../../components/ui";
import { 
  Mail, 
  Send, 
  Users, 
  Calendar, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Plus,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Target,
  Clock
} from "lucide-react";

export default function EmailCampaignsModal({ isOpen, onClose, selectedAccounts = [] }) {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    template: "welcome",
    recipients: "selected",
    scheduleType: "now",
    scheduleDate: "",
    scheduleTime: "",
  });

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: "Q4 Product Launch",
      subject: "Introducing Our Latest Innovation",
      status: "sent",
      recipients: 156,
      sent: "2024-01-15",
      openRate: 68,
      clickRate: 24,
      replies: 12,
      template: "product_launch",
    },
    {
      id: 2,
      name: "Holiday Greetings",
      subject: "Season's Greetings from Our Team",
      status: "scheduled",
      recipients: 89,
      scheduledFor: "2024-01-20",
      template: "holiday",
    },
    {
      id: 3,
      name: "Customer Success Stories",
      subject: "See How Companies Like Yours Are Succeeding",
      status: "draft",
      recipients: 234,
      template: "case_study",
    },
    {
      id: 4,
      name: "Webinar Invitation",
      subject: "Join Our Exclusive Industry Webinar",
      status: "sent",
      recipients: 312,
      sent: "2024-01-10",
      openRate: 72,
      clickRate: 31,
      replies: 18,
      template: "webinar",
    },
  ];

  const templates = [
    {
      id: "welcome",
      name: "Welcome Email",
      description: "Welcome new accounts to your platform",
      preview: "Welcome to our platform! We're excited to have you on board...",
    },
    {
      id: "product_launch",
      name: "Product Launch",
      description: "Announce new products or features",
      preview: "We're thrilled to introduce our latest innovation that will...",
    },
    {
      id: "case_study",
      name: "Case Study",
      description: "Share customer success stories",
      preview: "See how companies like yours are achieving remarkable results...",
    },
    {
      id: "webinar",
      name: "Webinar Invitation",
      description: "Invite accounts to webinars or events",
      preview: "Join us for an exclusive webinar where industry experts will...",
    },
    {
      id: "follow_up",
      name: "Follow-up",
      description: "Follow up on previous interactions",
      preview: "We wanted to follow up on our recent conversation about...",
    },
    {
      id: "newsletter",
      name: "Newsletter",
      description: "Regular updates and industry insights",
      preview: "Here's your monthly roundup of industry trends and insights...",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      sent: "bg-green-100 text-green-700",
      scheduled: "bg-blue-100 text-blue-700",
      draft: "bg-gray-100 text-gray-700",
      sending: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const icons = {
      sent: Send,
      scheduled: Clock,
      draft: Edit,
      sending: TrendingUp,
    };
    return icons[status] || Edit;
  };

  const handleCreateCampaign = () => {
    // Simulate campaign creation
    console.log("Creating campaign:", newCampaign);
    setIsCreating(false);
    setNewCampaign({
      name: "",
      subject: "",
      template: "welcome",
      recipients: "selected",
      scheduleType: "now",
      scheduleDate: "",
      scheduleTime: "",
    });
  };

  const CampaignsList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Email Campaigns</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const StatusIcon = getStatusIcon(campaign.status);
          
          return (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{campaign.subject}</p>
                  
                  <div className="flex items-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {campaign.recipients} recipients
                    </div>
                    
                    {campaign.sent && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Sent {new Date(campaign.sent).toLocaleDateString()}
                      </div>
                    )}
                    
                    {campaign.scheduledFor && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Scheduled for {new Date(campaign.scheduledFor).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {campaign.status === 'sent' && (
                    <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-600">{campaign.openRate}%</span>
                        <span className="text-gray-500">open rate</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <MousePointer className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">{campaign.clickRate}%</span>
                        <span className="text-gray-500">click rate</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-600">{campaign.replies}</span>
                        <span className="text-gray-500">replies</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const CreateCampaign = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Create New Campaign</h3>
        <button
          onClick={() => setIsCreating(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Campaigns
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter campaign name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={newCampaign.subject}
              onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter email subject line"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients
            </label>
            <select
              value={newCampaign.recipients}
              onChange={(e) => setNewCampaign(prev => ({ ...prev, recipients: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="selected">Selected Accounts ({selectedAccounts.length})</option>
              <option value="all">All Accounts</option>
              <option value="customers">Customers Only</option>
              <option value="prospects">Prospects Only</option>
              <option value="partners">Partners Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="send-now"
                  name="schedule"
                  value="now"
                  checked={newCampaign.scheduleType === "now"}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduleType: e.target.value }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="send-now" className="text-sm text-gray-700">
                  Send immediately
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="send-later"
                  name="schedule"
                  value="later"
                  checked={newCampaign.scheduleType === "later"}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduleType: e.target.value }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="send-later" className="text-sm text-gray-700">
                  Schedule for later
                </label>
              </div>
              
              {newCampaign.scheduleType === "later" && (
                <div className="ml-7 grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={newCampaign.scheduleDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduleDate: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={newCampaign.scheduleTime}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Template
          </label>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  newCampaign.template === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setNewCampaign(prev => ({ ...prev, template: template.id }))}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="template"
                    value={template.id}
                    checked={newCampaign.template === template.id}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <p className="text-xs text-gray-500 italic">{template.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => setIsCreating(false)}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateCampaign}
          disabled={!newCampaign.name || !newCampaign.subject}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            newCampaign.name && newCampaign.subject
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          {newCampaign.scheduleType === 'now' ? 'Send Campaign' : 'Schedule Campaign'}
        </button>
      </div>
    </div>
  );

  const CampaignStats = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Campaign Performance</h3>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Sent</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">1,247</div>
          <div className="text-xs text-blue-700">+12% from last month</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Avg Open Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-600">68.5%</div>
          <div className="text-xs text-green-700">+3.2% from last month</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Avg Click Rate</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">24.8%</div>
          <div className="text-xs text-purple-700">+1.8% from last month</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Conversions</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">89</div>
          <div className="text-xs text-orange-700">+15% from last month</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Top Performing Campaigns</h4>
        <div className="space-y-3">
          {campaigns.filter(c => c.status === 'sent').map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{campaign.name}</div>
                <div className="text-sm text-gray-600">{campaign.recipients} recipients</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">{campaign.openRate}% open</div>
                <div className="text-sm text-gray-600">{campaign.clickRate}% click</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Email Campaigns"
      size="xl"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "campaigns"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="min-h-96">
          {isCreating ? (
            <CreateCampaign />
          ) : activeTab === "campaigns" ? (
            <CampaignsList />
          ) : (
            <CampaignStats />
          )}
        </div>

        {/* Footer */}
        {!isCreating && (
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
