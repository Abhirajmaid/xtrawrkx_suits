"use client";

import { useState } from "react";
import { Badge } from "../../components/ui";
import {
  Receipt,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Send,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  FileText,
  CreditCard,
  Banknote,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from "lucide-react";

export default function ClientInvoices({ clientId }) {
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    dateRange: "all",
    amount: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock invoices data - replace with actual API calls
  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      status: "paid",
      amount: 15000,
      tax: 1200,
      total: 16200,
      currency: "USD",
      issueDate: "2024-01-01",
      dueDate: "2024-01-31",
      paidDate: "2024-01-15",
      description: "Q1 Support Package - January 2024",
      items: [
        { description: "Priority Support", quantity: 1, rate: 5000, amount: 5000 },
        { description: "Monthly Check-ins", quantity: 1, rate: 2000, amount: 2000 },
        { description: "System Updates", quantity: 1, rate: 3000, amount: 3000 },
        { description: "Training Sessions", quantity: 2, rate: 2500, amount: 5000 },
      ],
      paymentMethod: "Bank Transfer",
      paymentReference: "TXN-789456123",
      notes: "Payment received on time. Thank you for your business!",
      tags: ["support", "quarterly", "priority"],
      createdBy: "John Smith",
      lastModified: "2024-01-15T10:30:00Z",
      downloadCount: 2,
      isRecurring: true,
      recurringInterval: "monthly",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      status: "pending",
      amount: 25000,
      tax: 2000,
      total: 27000,
      currency: "USD",
      issueDate: "2024-01-15",
      dueDate: "2024-02-14",
      description: "CRM Implementation - Phase 1",
      items: [
        { description: "System Setup", quantity: 1, rate: 10000, amount: 10000 },
        { description: "Data Migration", quantity: 1, rate: 8000, amount: 8000 },
        { description: "Custom Integrations", quantity: 1, rate: 7000, amount: 7000 },
      ],
      paymentMethod: null,
      paymentReference: null,
      notes: "Payment due within 30 days of invoice date.",
      tags: ["implementation", "crm", "phase-1"],
      createdBy: "Jane Doe",
      lastModified: "2024-01-15T14:15:00Z",
      downloadCount: 1,
      isRecurring: false,
      recurringInterval: null,
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      status: "overdue",
      amount: 5000,
      tax: 400,
      total: 5400,
      currency: "USD",
      issueDate: "2023-12-15",
      dueDate: "2024-01-14",
      description: "Additional Training Sessions",
      items: [
        { description: "Advanced Training", quantity: 2, rate: 2500, amount: 5000 },
      ],
      paymentMethod: null,
      paymentReference: null,
      notes: "Overdue payment. Please contact us to arrange payment.",
      tags: ["training", "additional"],
      createdBy: "Mike Johnson",
      lastModified: "2023-12-15T09:20:00Z",
      downloadCount: 3,
      isRecurring: false,
      recurringInterval: null,
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      status: "draft",
      amount: 12000,
      tax: 960,
      total: 12960,
      currency: "USD",
      issueDate: "2024-01-20",
      dueDate: "2024-02-19",
      description: "Marketing Automation Setup",
      items: [
        { description: "Platform Setup", quantity: 1, rate: 5000, amount: 5000 },
        { description: "Campaign Creation", quantity: 1, rate: 4000, amount: 4000 },
        { description: "Analytics Setup", quantity: 1, rate: 3000, amount: 3000 },
      ],
      paymentMethod: null,
      paymentReference: null,
      notes: "Draft invoice - pending approval.",
      tags: ["marketing", "automation", "setup"],
      createdBy: "Sarah Wilson",
      lastModified: "2024-01-20T11:00:00Z",
      downloadCount: 0,
      isRecurring: false,
      recurringInterval: null,
    },
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "this-year", label: "This Year" },
  ];

  const amountRanges = [
    { value: "all", label: "All Amounts" },
    { value: "0-1000", label: "$0 - $1,000" },
    { value: "1000-5000", label: "$1,000 - $5,000" },
    { value: "5000-10000", label: "$5,000 - $10,000" },
    { value: "10000+", label: "$10,000+" },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "badge-gray", label: "Draft", icon: FileText },
      pending: { color: "badge-warning", label: "Pending", icon: Clock },
      paid: { color: "badge-success", label: "Paid", icon: CheckCircle },
      overdue: { color: "badge-error", label: "Overdue", icon: AlertCircle },
      cancelled: { color: "badge-gray", label: "Cancelled", icon: XCircle },
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Bank Transfer":
        return <Banknote className="w-4 h-4 text-green-600" />;
      case "Credit Card":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "Check":
        return <Receipt className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
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

  const getDaysOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
    return diffInDays > 0 ? diffInDays : 0;
  };

  const filteredInvoices = invoices.filter((invoice) => {
    // Status filter
    if (selectedFilters.status !== "all" && invoice.status !== selectedFilters.status) {
      return false;
    }

    // Amount filter
    if (selectedFilters.amount !== "all") {
      const amount = invoice.total;
      switch (selectedFilters.amount) {
        case "0-1000":
          if (amount < 0 || amount > 1000) return false;
          break;
        case "1000-5000":
          if (amount < 1000 || amount > 5000) return false;
          break;
        case "5000-10000":
          if (amount < 5000 || amount > 10000) return false;
          break;
        case "10000+":
          if (amount < 10000) return false;
          break;
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        invoice.invoiceNumber,
        invoice.description,
        invoice.createdBy,
        ...invoice.tags,
      ].join(" ").toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === "paid").reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === "pending").reduce((sum, invoice) => sum + invoice.total, 0);
  const overdueAmount = filteredInvoices.filter(inv => inv.status === "overdue").reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Client Invoices</h3>
          <p className="text-sm text-gray-600">
            Invoice management and payment tracking
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
          <button className="btn-primary">
            <span>Create Invoice</span>
            <div className="btn-icon">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Amount</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Paid</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(paidAmount)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(pendingAmount)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Overdue</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(overdueAmount)}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input py-2"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Range
              </label>
              <select
                value={selectedFilters.amount}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, amount: e.target.value }))}
                className="input py-2"
              >
                {amountRanges.map((range) => (
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
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {invoice.invoiceNumber}
                  </h4>
                  {getStatusBadge(invoice.status)}
                  {invoice.isRecurring && (
                    <Badge className="badge-primary">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Recurring
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{invoice.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tax: {formatCurrency(invoice.tax, invoice.currency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Issue Date</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDate(invoice.issueDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Due: {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Payment Status</div>
                    <div className="flex items-center gap-2">
                      {invoice.paymentMethod ? (
                        <>
                          {getPaymentMethodIcon(invoice.paymentMethod)}
                          <span className="text-sm font-semibold text-gray-900">
                            {invoice.paymentMethod}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Not paid</span>
                      )}
                    </div>
                    {invoice.paidDate && (
                      <div className="text-xs text-gray-500">
                        Paid: {formatDate(invoice.paidDate)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Created By</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {invoice.createdBy}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatRelativeTime(invoice.lastModified)}
                    </div>
                  </div>
                </div>

                {/* Overdue Warning */}
                {invoice.status === "overdue" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Overdue by {getDaysOverdue(invoice.dueDate)} days
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      {invoice.notes}
                    </p>
                  </div>
                )}

                {/* Payment Reference */}
                {invoice.paymentReference && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Payment Reference: {invoice.paymentReference}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      {invoice.notes}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {invoice.tags.map((tag) => (
                    <Badge key={tag} className="badge-gray text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{invoice.downloadCount} downloads</span>
                    </div>
                    {invoice.recurringInterval && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{invoice.recurringInterval}</span>
                      </div>
                    )}
                  </div>
                  <span>Last modified: {formatRelativeTime(invoice.lastModified)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-brand-primary transition-colors" title="View Invoice">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-brand-primary transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                {invoice.status === "draft" && (
                  <button className="p-2 text-gray-400 hover:text-brand-primary transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {invoice.status === "pending" && (
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Send">
                    <Send className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="More actions">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedFilters.status !== "all" || selectedFilters.amount !== "all"
              ? "Try adjusting your filters or search terms"
              : "No invoices associated with this client yet"
            }
          </p>
          <button className="btn-primary">
            <span>Create First Invoice</span>
            <div className="btn-icon">
              <Plus className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

