"use client";

import { useState } from "react";
import { Button, Card, Badge, Modal, Table, Input, Select } from "@xtrawrkx/ui";
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Link,
  Unlink,
  X,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function ContactLinkedDeals({ contactId, onClose }) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [availableDeals, setAvailableDeals] = useState([]);

  const linkedDeals = [
    {
      id: 1,
      name: "Enterprise Software License",
      value: 85000,
      stage: "Proposal",
      probability: 75,
      closeDate: "2024-12-15",
      owner: "Alex Johnson",
      status: "active",
      lastActivity: "2 days ago",
      nextStep: "Send final proposal",
      description: "Multi-year enterprise license for our core platform"
    },
    {
      id: 2,
      name: "Implementation Services",
      value: 35000,
      stage: "Qualification",
      probability: 60,
      closeDate: "2024-12-30",
      owner: "Sarah Wilson",
      status: "active",
      lastActivity: "1 week ago",
      nextStep: "Technical requirements review",
      description: "Professional services for implementation and training"
    },
    {
      id: 3,
      name: "Support Contract",
      value: 15000,
      stage: "Closed Won",
      probability: 100,
      closeDate: "2024-10-15",
      owner: "Alex Johnson",
      status: "won",
      lastActivity: "1 month ago",
      nextStep: "Implementation started",
      description: "Annual support and maintenance contract"
    }
  ];

  const allDeals = [
    ...linkedDeals,
    {
      id: 4,
      name: "API Integration Package",
      value: 25000,
      stage: "Needs Analysis",
      probability: 40,
      closeDate: "2025-01-15",
      owner: "Mike Chen",
      status: "active",
      lastActivity: "3 days ago",
      nextStep: "Technical discovery call",
      description: "Custom API integration services"
    },
    {
      id: 5,
      name: "Training Workshop",
      value: 8000,
      stage: "Proposal",
      probability: 80,
      closeDate: "2024-11-30",
      owner: "Lisa Wong",
      status: "active",
      lastActivity: "5 days ago",
      nextStep: "Schedule training dates",
      description: "On-site training for development team"
    }
  ];

  const getStageBadge = (stage) => {
    const stageConfig = {
      "Needs Analysis": { variant: "secondary", text: "Needs Analysis" },
      "Qualification": { variant: "default", text: "Qualification" },
      "Proposal": { variant: "warning", text: "Proposal" },
      "Negotiation": { variant: "default", text: "Negotiation" },
      "Closed Won": { variant: "success", text: "Closed Won" },
      "Closed Lost": { variant: "destructive", text: "Closed Lost" }
    };

    const config = stageConfig[stage] || { variant: "secondary", text: stage };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'lost':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "text-green-600 bg-green-50";
    if (probability >= 60) return "text-orange-600 bg-orange-50";
    if (probability >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const filteredDeals = linkedDeals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === "all" || deal.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const handleLinkDeal = (dealId) => {
    // Here you would typically link the deal to the contact via API
    console.log("Linking deal:", dealId);
    setShowLinkModal(false);
  };

  const handleUnlinkDeal = (dealId) => {
    // Here you would typically unlink the deal from the contact via API
    console.log("Unlinking deal:", dealId);
  };

  const columns = [
    {
      id: "deal",
      header: "Deal",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {getStatusIcon(row.status)}
          </div>
          <div>
            <p className="font-semibold text-brand-foreground">{row.name}</p>
            <p className="text-sm text-brand-text-light">{row.description}</p>
          </div>
        </div>
      )
    },
    {
      id: "value",
      header: "Value",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-brand-text-light" />
          <span className="font-semibold text-brand-foreground">
            ${(row.value / 1000).toFixed(0)}K
          </span>
        </div>
      )
    },
    {
      id: "stage",
      header: "Stage",
      cell: (row) => getStageBadge(row.stage)
    },
    {
      id: "probability",
      header: "Probability",
      cell: (row) => (
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(row.probability)}`}>
          {row.probability}%
        </div>
      )
    },
    {
      id: "closeDate",
      header: "Close Date",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-brand-text-light" />
          <span className="text-sm text-brand-text-light">{row.closeDate}</span>
        </div>
      )
    },
    {
      id: "owner",
      header: "Owner",
      cell: (row) => (
        <span className="text-sm text-brand-foreground">{row.owner}</span>
      )
    },
    {
      id: "actions",
      header: "",
      width: "100px",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleUnlinkDeal(row.id)}
          >
            <Unlink className="w-3 h-3" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="h-full bg-white border-l border-brand-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-brand-foreground">Linked Deals</h2>
            <p className="text-sm text-brand-text-light">Deals associated with this contact</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-sm w-full"
            />
          </div>
          <Select
            value={filterStage}
            onValueChange={setFilterStage}
            className="w-40"
          >
            <option value="all">All Stages</option>
            <option value="Needs Analysis">Needs Analysis</option>
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </Select>
          <Button onClick={() => setShowLinkModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Link Deal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-brand-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-brand-text-light">Total Value</p>
                <p className="text-lg font-semibold text-brand-foreground">
                  ${linkedDeals.reduce((sum, deal) => sum + deal.value, 0) / 1000}K
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-brand-text-light">Active Deals</p>
                <p className="text-lg font-semibold text-brand-foreground">
                  {linkedDeals.filter(deal => deal.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-brand-text-light">Avg. Probability</p>
                <p className="text-lg font-semibold text-brand-foreground">
                  {Math.round(linkedDeals.reduce((sum, deal) => sum + deal.probability, 0) / linkedDeals.length)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-brand-text-light">Won Deals</p>
                <p className="text-lg font-semibold text-brand-foreground">
                  {linkedDeals.filter(deal => deal.status === 'won').length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Deals Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredDeals.length > 0 ? (
          <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
            <Table
              data={filteredDeals}
              columns={columns}
              className="min-h-[300px]"
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <Link className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No deals found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || filterStage !== "all" 
                ? "Try adjusting your search or filters"
                : "This contact doesn't have any linked deals yet"
              }
            </p>
            <Button onClick={() => setShowLinkModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Link Deal
            </Button>
          </div>
        )}
      </div>

      {/* Link Deal Modal */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} size="lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-brand-foreground">Link Deal to Contact</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowLinkModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <input
                type="text"
                placeholder="Search available deals..."
                className="pl-10 pr-4 py-2 bg-white border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-sm w-full"
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {allDeals.filter(deal => !linkedDeals.some(linked => linked.id === deal.id)).map((deal) => (
                  <Card key={deal.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkDeal(deal.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-brand-foreground">{deal.name}</h4>
                        <p className="text-sm text-brand-text-light">{deal.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-brand-text-light">
                            ${(deal.value / 1000).toFixed(0)}K
                          </span>
                          <span className="text-sm text-brand-text-light">
                            {deal.stage}
                          </span>
                          <span className="text-sm text-brand-text-light">
                            {deal.probability}% probability
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        <Link className="w-4 h-4 mr-2" />
                        Link
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-border mt-6">
            <Button variant="outline" onClick={() => setShowLinkModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
