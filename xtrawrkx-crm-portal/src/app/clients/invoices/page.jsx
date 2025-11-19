"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Eye,
  Edit,
  Download,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  DollarSign,
  IndianRupee,
  Filter,
  Search,
  List,
  Columns,
  Trash2,
  X,
} from "lucide-react";
import { Badge, Avatar, Button, Table, Select } from "../../../components/ui";
import PageHeader from "../../../components/PageHeader";
import invoiceService from "../../../lib/api/invoiceService";
import clientAccountService from "../../../lib/api/clientAccountService";
import { useAuth } from "../../../contexts/AuthContext";
import InvoicesKPIs from "./components/InvoicesKPIs";
import InvoicesTabs from "./components/InvoicesTabs";
import InvoicesListView from "./components/InvoicesListView";
import AddInvoiceModal from "./components/AddInvoiceModal";
import ViewInvoiceModal from "./components/ViewInvoiceModal";
import EditInvoiceModal from "./components/EditInvoiceModal";
import DeleteInvoiceModal from "./components/DeleteInvoiceModal";

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function InvoicesPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State management
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeView, setActiveView] = useState("list");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToView, setInvoiceToView] = useState(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [invoiceFormData, setInvoiceFormData] = useState({
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    amount: "",
    taxAmount: "",
    totalAmount: "",
    status: "DRAFT",
    notes: "",
    account: "",
    file: null,
  });
  const [clientAccounts, setClientAccounts] = useState([]);

  // Fetch invoices
  useEffect(() => {
    fetchInvoices();
    fetchClientAccounts();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getAll({
        populate: ["clientAccount", "createdBy", "files"],
        "pagination[pageSize]": 1000,
      });
      const invoicesData = response.data || [];
      setInvoices(invoicesData);
      calculateStats(invoicesData);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientAccounts = async () => {
    try {
      const response = await clientAccountService.getAll({
        "pagination[pageSize]": 1000,
      });

      // Handle different response structures
      // The API returns data directly as an array, not wrapped in a data property
      const accounts = Array.isArray(response)
        ? response
        : response?.data || [];

      // Flatten Strapi v4 structure if needed (handle attributes)
      const flattenedAccounts = accounts.map((account) => {
        if (account.attributes) {
          // Strapi v4 format: { id, attributes: { companyName, ... } }
          return {
            id: account.id || account.documentId,
            ...account.attributes,
          };
        }
        // Already flattened or different format
        return account;
      });

      setClientAccounts(flattenedAccounts);
    } catch (err) {
      console.error("Error fetching client accounts:", err);
      setClientAccounts([]);
    }
  };

  const calculateStats = (invoicesData) => {
    const stats = {
      total: invoicesData.length,
      byStatus: {
        DRAFT: 0,
        SENT: 0,
        PAID: 0,
        OVERDUE: 0,
        CANCELLED: 0,
      },
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
    };

    invoicesData.forEach((invoice) => {
      const status = invoice.status || "DRAFT";
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      const amount = parseFloat(invoice.totalAmount || invoice.amount || 0);
      stats.totalAmount += amount;

      if (status === "PAID") {
        stats.paidAmount += amount;
      } else if (status === "SENT" || status === "DRAFT") {
        stats.pendingAmount += amount;
      } else if (status === "OVERDUE") {
        stats.overdueAmount += amount;
      }
    });

    setStats(stats);
  };

  // Filter invoices based on active tab and search
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesTab = activeTab === "all" || invoice.status === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      invoice.invoiceNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      invoice.clientAccount?.companyName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      invoice.clientAccount?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    return (
      new Date(b.createdAt || b.issueDate) -
      new Date(a.createdAt || a.issueDate)
    );
  });

  // Handle create invoice
  const handleCreateInvoice = async (e) => {
    e.preventDefault();

    if (!invoiceFormData.invoiceNumber.trim()) {
      alert("Invoice number is required");
      return;
    }
    if (!invoiceFormData.issueDate) {
      alert("Issue date is required");
      return;
    }
    if (!invoiceFormData.dueDate) {
      alert("Due date is required");
      return;
    }
    if (!invoiceFormData.amount) {
      alert("Amount is required");
      return;
    }
    if (!invoiceFormData.account) {
      alert("Client account is required");
      return;
    }

    try {
      const amount = parseFloat(invoiceFormData.amount) || 0;
      const taxAmount = parseFloat(invoiceFormData.taxAmount) || 0;
      const totalAmount = amount + taxAmount;

      const invoiceData = {
        invoiceNumber: invoiceFormData.invoiceNumber.trim(),
        issueDate: new Date(invoiceFormData.issueDate).toISOString(),
        dueDate: new Date(invoiceFormData.dueDate).toISOString(),
        amount: amount,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        status: invoiceFormData.status,
        notes: invoiceFormData.notes?.trim() || "",
        clientAccount: invoiceFormData.account,
      };

      const createdInvoice = await invoiceService.create(invoiceData);

      // Upload file if provided
      if (invoiceFormData.file && createdInvoice?.id) {
        try {
          await invoiceService.uploadDocument(
            createdInvoice.id,
            invoiceFormData.file
          );
        } catch (fileError) {
          console.error("Error uploading file:", fileError);
        }
      }

      await fetchInvoices();

      setShowAddInvoiceModal(false);
      setInvoiceFormData({
        invoiceNumber: "",
        issueDate: "",
        dueDate: "",
        amount: "",
        taxAmount: "",
        totalAmount: "",
        status: "DRAFT",
        notes: "",
        account: "",
        file: null,
      });
      alert("Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert(`Failed to create invoice: ${error.message || "Unknown error"}`);
    }
  };

  // Handle update invoice
  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceToEdit) return;

    if (!invoiceFormData.invoiceNumber.trim()) {
      alert("Invoice number is required");
      return;
    }
    if (!invoiceFormData.issueDate) {
      alert("Issue date is required");
      return;
    }
    if (!invoiceFormData.dueDate) {
      alert("Due date is required");
      return;
    }
    if (!invoiceFormData.amount) {
      alert("Amount is required");
      return;
    }
    if (!invoiceFormData.account) {
      alert("Client account is required");
      return;
    }

    try {
      setIsUpdating(true);
      const amount = parseFloat(invoiceFormData.amount) || 0;
      const taxAmount = parseFloat(invoiceFormData.taxAmount) || 0;
      const totalAmount = amount + taxAmount;

      const invoiceData = {
        invoiceNumber: invoiceFormData.invoiceNumber.trim(),
        issueDate: new Date(invoiceFormData.issueDate).toISOString(),
        dueDate: new Date(invoiceFormData.dueDate).toISOString(),
        amount: amount,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        status: invoiceFormData.status,
        notes: invoiceFormData.notes?.trim() || "",
        clientAccount: invoiceFormData.account,
      };

      await invoiceService.update(
        invoiceToEdit.id || invoiceToEdit.documentId,
        invoiceData
      );

      // Upload file if provided
      if (invoiceFormData.file && invoiceToEdit?.id) {
        try {
          await invoiceService.uploadDocument(
            invoiceToEdit.id,
            invoiceFormData.file
          );
        } catch (fileError) {
          console.error("Error uploading file:", fileError);
        }
      }

      await fetchInvoices();

      setShowEditModal(false);
      setInvoiceToEdit(null);
      setInvoiceFormData({
        invoiceNumber: "",
        issueDate: "",
        dueDate: "",
        amount: "",
        taxAmount: "",
        totalAmount: "",
        status: "DRAFT",
        notes: "",
        account: "",
        file: null,
      });
      alert("Invoice updated successfully!");
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert(`Failed to update invoice: ${error.message || "Unknown error"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete invoice
  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    try {
      setIsDeleting(true);
      await invoiceService.delete(
        invoiceToDelete.id || invoiceToDelete.documentId
      );
      await fetchInvoices();
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
      alert("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert(`Failed to delete invoice: ${error.message || "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Tab configuration
  const tabsConfig = [
    { key: "all", label: "All Invoices", count: stats.total || 0 },
    { key: "DRAFT", label: "Draft", count: stats.byStatus?.DRAFT || 0 },
    { key: "SENT", label: "Sent", count: stats.byStatus?.SENT || 0 },
    { key: "PAID", label: "Paid", count: stats.byStatus?.PAID || 0 },
    { key: "OVERDUE", label: "Overdue", count: stats.byStatus?.OVERDUE || 0 },
  ];

  // KPI stats
  const statusStats = [
    {
      label: "Total",
      count: stats.total || 0,
      icon: FileText,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      label: "Paid",
      count: `₹${(stats.paidAmount || 0).toLocaleString()}`,
      icon: CheckCircle,
      color: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      label: "Pending",
      count: `₹${(stats.pendingAmount || 0).toLocaleString()}`,
      icon: Clock,
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    },
    {
      label: "Overdue",
      count: `₹${(stats.overdueAmount || 0).toLocaleString()}`,
      icon: AlertTriangle,
      color: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
    },
  ];

  // Table columns
  const invoiceColumns = [
    {
      key: "invoiceNumber",
      label: "Invoice Number",
      render: (value, row) => (
        <div className="cursor-pointer hover:text-orange-500">
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">
            {row.clientAccount?.companyName || row.clientAccount?.name || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value, row) => (
        <div>
          <span className="font-semibold text-gray-900">
            ₹{(value || 0).toLocaleString()}
          </span>
          {row.taxAmount > 0 && (
            <div className="text-xs text-gray-500">
              Tax: ₹{(row.taxAmount || 0).toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (value) => (
        <span className="font-bold text-gray-900">
          ₹{(value || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const variants = {
          DRAFT: "default",
          SENT: "warning",
          PAID: "success",
          OVERDUE: "destructive",
          CANCELLED: "destructive",
        };
        const labels = {
          DRAFT: "Draft",
          SENT: "Sent",
          PAID: "Paid",
          OVERDUE: "Overdue",
          CANCELLED: "Cancelled",
        };
        return (
          <Badge variant={variants[value] || "default"}>
            {labels[value] || value}
          </Badge>
        );
      },
    },
    {
      key: "issueDate",
      label: "Issue Date",
      render: (value) => (
        <span className="text-sm text-gray-600">{formatDate(value)}</span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (value) => {
        const dueDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        const isOverdue = dueDate < today;

        return (
          <span
            className={`text-sm ${
              isOverdue ? "text-red-600 font-medium" : "text-gray-600"
            }`}
          >
            {formatDate(value)}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setInvoiceToView(row);
              setShowViewModal(true);
            }}
            title="View Invoice"
          >
            <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
          </button>
          {row.files && row.files.length > 0 && (
            <button
              className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (row.files[0]?.url) {
                  window.open(row.files[0].url, "_blank");
                }
              }}
              title="Download Document"
            >
              <Download className="w-4 h-4 text-gray-400 hover:text-green-600" />
            </button>
          )}
          <button
            className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setInvoiceToEdit(row);
              setInvoiceFormData({
                invoiceNumber: row.invoiceNumber || "",
                issueDate: row.issueDate
                  ? new Date(row.issueDate).toISOString().split("T")[0]
                  : "",
                dueDate: row.dueDate
                  ? new Date(row.dueDate).toISOString().split("T")[0]
                  : "",
                amount: row.amount?.toString() || "",
                taxAmount: row.taxAmount?.toString() || "",
                totalAmount: row.totalAmount?.toString() || "",
                status: row.status || "DRAFT",
                notes: row.notes || "",
                account: row.clientAccount?.id || "",
                file: null,
              });
              setShowEditModal(true);
            }}
            title="Edit Invoice"
          >
            <Edit className="w-4 h-4 text-gray-400 hover:text-orange-600" />
          </button>
          <button
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setInvoiceToDelete(row);
              setShowDeleteModal(true);
            }}
            title="Delete Invoice"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  if (error && invoices.length === 0) {
    return (
      <div className="p-4 space-y-4 bg-white min-h-screen">
        <PageHeader
          title="Invoices"
          subtitle="Manage all client invoices"
          breadcrumb={[
            { label: "Dashboard", href: "/" },
            { label: "Clients", href: "/clients" },
            { label: "Invoices", href: "/clients/invoices" },
          ]}
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-4 bg-white min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Invoices"
          subtitle="Manage and track all client invoices"
          breadcrumb={[
            { label: "Dashboard", href: "/" },
            { label: "Clients", href: "/clients" },
            { label: "Invoices", href: "/clients/invoices" },
          ]}
          showActions={true}
          onAddClick={() => setShowAddInvoiceModal(true)}
        />

        <div className="space-y-4">
          {/* Stats Overview */}
          <InvoicesKPIs statusStats={statusStats} />

          {/* Tabs and Filters */}
          <InvoicesTabs
            tabItems={tabsConfig}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeView={activeView}
            setActiveView={setActiveView}
            onFilterClick={() => {}}
            onAddClick={() => setShowAddInvoiceModal(true)}
            onExportClick={() => {}}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Single Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-600">Loading invoices...</span>
              </div>
            ) : (
              <InvoicesListView
                filteredInvoices={sortedInvoices}
                invoiceColumnsTable={invoiceColumns}
                selectedInvoices={selectedInvoices}
                setSelectedInvoices={setSelectedInvoices}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddClick={() => setShowAddInvoiceModal(true)}
                onRowClick={(row) => {
                  setInvoiceToView(row);
                  setShowViewModal(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        isOpen={showAddInvoiceModal}
        onClose={() => {
          setShowAddInvoiceModal(false);
          setInvoiceFormData({
            invoiceNumber: "",
            issueDate: "",
            dueDate: "",
            amount: "",
            taxAmount: "",
            totalAmount: "",
            status: "DRAFT",
            notes: "",
            account: "",
            file: null,
          });
        }}
        onSubmit={handleCreateInvoice}
        invoiceFormData={invoiceFormData}
        setInvoiceFormData={setInvoiceFormData}
        clientAccounts={clientAccounts}
        isSubmitting={false}
      />

      {/* View Invoice Modal */}
      <ViewInvoiceModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setInvoiceToView(null);
        }}
        invoice={invoiceToView}
      />

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setInvoiceToEdit(null);
          setInvoiceFormData({
            invoiceNumber: "",
            issueDate: "",
            dueDate: "",
            amount: "",
            taxAmount: "",
            totalAmount: "",
            status: "DRAFT",
            notes: "",
            account: "",
            file: null,
          });
        }}
        onSubmit={handleUpdateInvoice}
        invoiceFormData={invoiceFormData}
        setInvoiceFormData={setInvoiceFormData}
        clientAccounts={clientAccounts}
        isSubmitting={isUpdating}
      />

      {/* Delete Invoice Modal */}
      <DeleteInvoiceModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setInvoiceToDelete(null);
        }}
        onConfirm={handleDeleteInvoice}
        invoice={invoiceToDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
