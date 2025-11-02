"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Badge, Avatar, Button, Select } from "../../../components/ui";
import { formatNumber, formatCurrency } from "../../../lib/utils";

// Local utility function to replace @xtrawrkx/utils formatDate
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

import clientAccountService from "../../../lib/api/clientAccountService";
import strapiClient from "../../../lib/strapiClient";
import { useAuth } from "../../../contexts/AuthContext";
import authService from "../../../lib/authService";
import PageHeader from "../../../components/PageHeader";
import ClientAccountsKPIs from "./components/ClientAccountsKPIs";
import ClientAccountsTabs from "./components/ClientAccountsTabs";
import ClientAccountsListView from "./components/ClientAccountsListView";
import ClientAccountsFilterModal from "./components/ClientAccountsFilterModal";
import ClientAccountsImportModal from "./components/ClientAccountsImportModal";

import {
  Plus,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  UserPlus,
  Star,
  Clock,
  User,
  PhoneCall,
  CheckCircle,
  XCircle,
  IndianRupee,
  Building2,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  DollarSign,
} from "lucide-react";

export default function ClientAccountsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State management
  const [clientAccounts, setClientAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeView, setActiveView] = useState("list");
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAddSuccessMessage, setShowAddSuccessMessage] = useState(false);
  const [loadingActions, setLoadingActions] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const exportDropdownRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [accountToAssign, setAccountToAssign] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  const isAdmin = () => {
    if (!user) return false;
    return (
      authService.isAdmin() ||
      user.primaryRole?.name === "Super Admin" ||
      user.primaryRole?.name === "Admin" ||
      user.userRoles?.some((role) =>
        ["Super Admin", "Admin"].includes(role.name)
      )
    );
  };

  // Fetch client accounts from Strapi
  useEffect(() => {
    fetchClientAccounts();
    fetchStats();
  }, []);

  // Refresh data when account is updated (from details page)
  useEffect(() => {
    const handleAccountUpdate = () => {
      // Small delay to ensure any updates from details page are saved
      setTimeout(() => {
        fetchClientAccounts();
        fetchStats();
      }, 500);
    };

    // Listen for custom event from details page
    window.addEventListener("accountUpdated", handleAccountUpdate);

    return () => {
      window.removeEventListener("accountUpdated", handleAccountUpdate);
    };
  }, []);

  // fetch users if admin
  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      let allUsers = [];
      let page = 1;
      let hasMore = true;
      const pageSize = 100;

      while (hasMore) {
        const queryParams = {
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          populate: "primaryRole,userRoles",
        };
        const response = await strapiClient.getXtrawrkxUsers(queryParams);
        const usersData = response?.data || [];
        if (Array.isArray(usersData)) {
          const extracted = usersData.map((u) =>
            u.attributes
              ? {
                  id: u.id,
                  documentId: u.id,
                  ...u.attributes,
                }
              : u
          );
          allUsers = [...allUsers, ...extracted];
          const pageCount = response?.meta?.pagination?.pageCount || 1;
          hasMore = page < pageCount && usersData.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }
      setUsers(allUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchClientAccounts = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      console.log("Fetching client accounts...");
      const response = await clientAccountService.getAll({
        populate: "accountManager,contacts",
      });
      console.log("Client accounts response:", response);

      // Handle different response structures
      // The API returns data directly as an array, not wrapped in a data property
      const accounts = Array.isArray(response)
        ? response
        : response?.data || [];
      setClientAccounts(accounts);

      console.log(`Loaded ${accounts.length} client accounts`);
    } catch (err) {
      console.error("Error fetching client accounts:", err);
      console.error("Error details:", err.response?.data || err.message);

      // Set more specific error message
      const errorMessage =
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to load client accounts";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await clientAccountService.getStats();
      console.log("Client accounts stats:", statsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Set default stats if API fails
      setStats({
        byStatus: { ACTIVE: 0, INACTIVE: 0, CHURNED: 0, ON_HOLD: 0 },
        totalRevenue: 0,
        averageHealthScore: 0,
        recentConversions: 0,
      });
    }
  };

  // Filter accounts based on search and active tab
  const filteredAccounts = clientAccounts.filter((account) => {
    const matchesSearch =
      !searchQuery ||
      account.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.accountManager?.firstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      account.accountManager?.lastName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && account.status?.toLowerCase() === "active") ||
      (activeTab === "inactive" &&
        account.status?.toLowerCase() === "inactive") ||
      (activeTab === "churned" &&
        account.status?.toLowerCase() === "churned") ||
      (activeTab === "on-hold" && account.status?.toLowerCase() === "on_hold");

    return matchesSearch && matchesTab;
  });

  // Calculate KPI data
  const statusStats = [
    {
      label: "Total",
      count: clientAccounts.length,
      icon: Building2,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      label: "Active",
      count: stats.byStatus?.ACTIVE || 0,
      icon: CheckCircle,
      color: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      label: "Revenue",
      count: `$${formatNumber(stats.totalRevenue || 0)}`,
      icon: DollarSign,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
  ];

  // Tab configuration
  const tabsConfig = [
    { key: "all", label: "All Clients", count: clientAccounts.length },
    { key: "active", label: "Active", count: stats.byStatus?.ACTIVE || 0 },
    {
      key: "inactive",
      label: "Inactive",
      count: stats.byStatus?.INACTIVE || 0,
    },
    { key: "churned", label: "Churned", count: stats.byStatus?.CHURNED || 0 },
    {
      key: "on-hold",
      label: "On Hold",
      count: stats.byStatus?.ON_HOLD || 0,
    },
  ];

  // Table columns configuration
  const accountColumnsTable = [
    {
      key: "company",
      label: "COMPANY",
      render: (_, account) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar
            name={account.companyName}
            size="sm"
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {account.companyName}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {account.contacts && account.contacts.length > 0
                ? `${account.contacts[0].firstName} ${account.contacts[0].lastName}`
                : "No primary contact"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "PRIMARY CONTACT",
      render: (_, account) => (
        <div className="space-y-1 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {account.contacts && account.contacts.length > 0
                ? account.contacts[0].email
                : account.email || "No email"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {account.contacts && account.contacts.length > 0
                ? account.contacts[0].phone
                : account.phone || "No phone"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "healthScore",
      label: "HEALTH SCORE",
      render: (_, account) => {
        const score = account.healthScore || 0;
        const getHealthColor = () => {
          if (score >= 80)
            return "bg-green-100 text-green-800 border-green-300";
          if (score >= 60)
            return "bg-yellow-100 text-yellow-800 border-yellow-300";
          if (score >= 40)
            return "bg-orange-100 text-orange-800 border-orange-300";
          return "bg-red-100 text-red-800 border-red-300";
        };

        return (
          <div className="min-w-[120px]">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getHealthColor()}`}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {score}%
            </div>
          </div>
        );
      },
    },
    {
      key: "dealValue",
      label: "DEAL VALUE",
      render: (_, account) => (
        <div className="min-w-[120px]">
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900">
              {account.revenue ? `₹${formatNumber(account.revenue)}` : "₹0"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "contacts",
      label: "CONTACTS",
      render: (_, account) => (
        <div className="min-w-[100px]">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600">
              {account.contacts?.length || 0}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "accountManager",
      label: "ACCOUNT MANAGER",
      render: (_, account) => {
        const manager = account.accountManager;
        const managerName = manager
          ? `${manager.firstName || ""} ${manager.lastName || ""}`.trim() ||
            manager.username ||
            "Unknown"
          : "Unassigned";

        const handleAssignClick = () => {
          setAccountToAssign(account);
          setSelectedUserId(
            manager?.id?.toString() || manager?.documentId?.toString() || ""
          );
          setShowAssignModal(true);
        };

        return (
          <div className="min-w-[180px] flex items-center gap-2">
            <Avatar
              alt={managerName}
              fallback={(managerName || "?").charAt(0).toUpperCase()}
              size="sm"
              className="flex-shrink-0"
            />
            <span className="text-sm font-medium text-gray-900 flex-1 truncate">
              {managerName}
            </span>
            {isAdmin() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAssignClick();
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg"
                title="Change Assignee"
              >
                <User className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "STATUS",
      render: (_, account) => {
        const status = account.status?.toLowerCase() || "active";
        const getStatusColor = () => {
          switch (status) {
            case "active":
              return "bg-green-100 text-green-800 border-green-300";
            case "inactive":
              return "bg-gray-100 text-gray-800 border-gray-300";
            case "churned":
              return "bg-red-100 text-red-800 border-red-300";
            case "on_hold":
              return "bg-yellow-100 text-yellow-800 border-yellow-300";
            default:
              return "bg-green-100 text-green-800 border-green-300";
          }
        };

        const displayStatus = account.status || "ACTIVE";

        return (
          <div className="min-w-[120px]">
            <Badge
              className={`${getStatusColor()} border font-medium text-xs px-3 py-1`}
            >
              {displayStatus}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "created",
      label: "CREATED",
      render: (_, account) => (
        <div className="min-w-[120px]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600">
              {formatDate(account.createdAt)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, account) => (
        <div
          className="flex items-center gap-1 min-w-[120px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewAccount(account.id);
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
            title="View Account"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditAccount(account.id);
            }}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-all duration-200"
            title="Edit Account"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate(
                account.id,
                account.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
              );
            }}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-2 rounded-lg transition-all duration-200"
            title={account.status === "ACTIVE" ? "Deactivate" : "Activate"}
          >
            {account.status === "ACTIVE" ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setAccountToDelete(account);
              setShowDeleteModal(true);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
            title="Delete Account"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Handle status updates
  const handleStatusUpdate = async (accountId, newStatus) => {
    if (!accountId) {
      console.error("No account ID provided");
      return;
    }

    const loadingKey = `${accountId}-${newStatus.toLowerCase()}`;

    // Set loading state
    setLoadingActions((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      console.log(`Updating account ${accountId} status to ${newStatus}`);

      // Update the status via API
      const response = await clientAccountService.updateStatus(
        accountId,
        newStatus
      );
      console.log("Status update response:", response);

      // Update local state
      setClientAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account?.id === accountId
            ? { ...account, status: newStatus }
            : account
        )
      );

      // Refresh stats
      await fetchStats();

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      console.log(`Successfully updated account ${accountId} to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      console.error("Error details:", error.message);

      // Show user-friendly error message
      const errorMessage =
        error.message || "Failed to update status. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      // Clear loading state
      setLoadingActions((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Handle view account
  const handleViewAccount = (id) => {
    router.push(`/clients/accounts/${id}`);
  };

  // Handle edit account
  const handleEditAccount = (id) => {
    router.push(`/clients/accounts/${id}/edit`);
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;

    const loadingKey = `${accountToDelete.id}-delete`;
    setLoadingActions((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      console.log(`Deleting account ${accountToDelete.id}`);

      // Delete the account via API (this will cascade delete linked data)
      await clientAccountService.delete(accountToDelete.id);

      // Remove from local state
      setClientAccounts((prev) =>
        prev.filter((account) => account.id !== accountToDelete.id)
      );

      // Update stats
      await fetchStats();

      // Close modal and reset state
      setShowDeleteModal(false);
      setAccountToDelete(null);

      console.log("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Handle export
  const handleExport = (format) => {
    console.log(`Exporting client accounts as ${format}`);
    setShowExportDropdown(false);
  };

  // Handle import
  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  // Handle filter
  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  // Handle add account
  const handleAddAccount = () => {
    router.push("/clients/accounts/new");
  };

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target)
      ) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="p-4 space-y-6">
          <PageHeader
            title="Client Accounts"
            subtitle="Loading client accounts..."
            breadcrumb={[
              { label: "Dashboard", href: "/" },
              { label: "Clients", href: "/clients" },
              { label: "Client Accounts", href: "/clients/accounts" },
            ]}
            showProfile={true}
            showSearch={false}
            showActions={false}
          />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4 space-y-6">
          <PageHeader
            title="Client Accounts"
            subtitle="Error loading client accounts"
            breadcrumb={[
              { label: "Dashboard", href: "/" },
              { label: "Clients", href: "/clients" },
              { label: "Client Accounts", href: "/clients/accounts" },
            ]}
            showProfile={true}
            showSearch={false}
            showActions={false}
          />
          <Card className="rounded-2xl bg-red-50 border border-red-200 p-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Data
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button
                onClick={fetchClientAccounts}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 space-y-6">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Account updated successfully!
          </div>
        )}

        {/* Page Header */}
        <PageHeader
          title="Client Accounts"
          subtitle={`Manage your client relationships and account health (${filteredAccounts.length} accounts)`}
          breadcrumb={[
            { label: "Dashboard", href: "/" },
            { label: "Clients", href: "/clients" },
            { label: "Client Accounts", href: "/clients/accounts" },
          ]}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showProfile={true}
          showSearch={true}
          searchPlaceholder="Search client accounts..."
          showActions={true}
          onAddClick={handleAddAccount}
          addButtonText="Add Client Account"
          onFilterClick={handleFilter}
          onImportClick={handleImport}
        />

        <div className="space-y-4">
          {/* Stats Overview */}
          <ClientAccountsKPIs statusStats={statusStats} />

          {/* View Toggle */}
          <ClientAccountsTabs
            tabItems={tabsConfig}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeView={activeView}
            setActiveView={setActiveView}
            onFilterClick={handleFilter}
            onAddClick={handleAddAccount}
            onExportClick={handleExport}
            showExportDropdown={showExportDropdown}
            setShowExportDropdown={setShowExportDropdown}
            exportDropdownRef={exportDropdownRef}
          />

          {/* Single Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Client Accounts Table */}
            {activeView === "list" && (
              <ClientAccountsListView
                filteredAccounts={filteredAccounts}
                accountColumnsTable={accountColumnsTable}
                selectedAccounts={selectedAccounts}
                setSelectedAccounts={setSelectedAccounts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddClick={handleAddAccount}
                onRowClick={(row) => {
                  router.push(`/clients/accounts/${row.id}`);
                }}
              />
            )}
          </div>
        </div>

        {/* Modals */}
        {isFilterModalOpen && (
          <ClientAccountsFilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            appliedFilters={appliedFilters}
            onApplyFilters={setAppliedFilters}
          />
        )}

        {isImportModalOpen && (
          <ClientAccountsImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onImportComplete={fetchClientAccounts}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && accountToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Client Account
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Are you sure you want to delete{" "}
                  <strong>{accountToDelete.companyName}</strong>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-medium mb-2">
                    ⚠️ This will permanently delete:
                  </p>
                  <ul className="text-sm text-red-600 space-y-1">
                    <li>• Account information and details</li>
                    <li>• All associated contacts</li>
                    <li>• All invoices and billing history</li>
                    <li>• Activity history and notes</li>
                    <li>• All related projects and tasks</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAccountToDelete(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={loadingActions[`${accountToDelete.id}-delete`]}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                >
                  {loadingActions[`${accountToDelete.id}-delete`] ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Account Manager Modal */}
        {showAssignModal && accountToAssign && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Change Assignee
                  </h3>
                  <p className="text-sm text-gray-500">
                    Assign account to a team member
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Select a user to assign{" "}
                  <strong>{accountToAssign.companyName}</strong> to:
                </p>
                <Select
                  label="Assign To"
                  value={selectedUserId}
                  onChange={setSelectedUserId}
                  options={[
                    { value: "", label: "Unassigned" },
                    ...users.map((u) => ({
                      value: (u.id || u.documentId).toString(),
                      label:
                        `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                        u.username ||
                        "Unknown User",
                    })),
                  ]}
                  disabled={loadingUsers}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAccountToAssign(null);
                    setSelectedUserId("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await clientAccountService.update(accountToAssign.id, {
                        accountManager: selectedUserId || null,
                      });
                      // Update local list
                      await fetchClientAccounts();
                      setShowAssignModal(false);
                      setAccountToAssign(null);
                      setSelectedUserId("");
                      setShowSuccessMessage(true);
                      setTimeout(() => setShowSuccessMessage(false), 3000);
                    } catch (error) {
                      console.error("Error updating assignee:", error);
                      alert("Failed to update assignee. Please try again.");
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                >
                  Update Assignee
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
