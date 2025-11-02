"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  Activity,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar,
  MapPin,
  Globe,
  Phone,
  Mail,
  Edit,
  Share,
  Download,
  MoreHorizontal,
  Plus,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Briefcase,
  PieChart,
  Star,
} from "lucide-react";
import {
  Card,
  Badge,
  Avatar,
  Button,
  Table,
  Select,
} from "../../../../components/ui";
import PageHeader from "../../../../components/PageHeader";
import ActivitiesPanel from "../../../../components/activities/ActivitiesPanel";
import clientAccountService from "../../../../lib/api/clientAccountService";
import contactService from "../../../../lib/api/contactService";
import activityService from "../../../../lib/api/activityService";
import dealService from "../../../../lib/api/dealService";
import invoiceService from "../../../../lib/api/invoiceService";
import strapiClient from "../../../../lib/strapiClient";
import { useAuth } from "../../../../contexts/AuthContext";
import authService from "../../../../lib/authService";

const ClientAccountDetailPage = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const { user } = useAuth();

  const [account, setAccount] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [healthDetails, setHealthDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [contactsLoading, setContactsLoading] = useState(false);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [dealFormData, setDealFormData] = useState({
    name: "",
    value: "",
    stage: "DISCOVERY",
    probability: 25,
    closeDate: "",
    description: "",
  });
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [invoiceFormData, setInvoiceFormData] = useState({
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    amount: "",
    taxAmount: "",
    totalAmount: "",
    status: "DRAFT",
    notes: "",
    file: null,
  });

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

  useEffect(() => {
    if (id) {
      fetchAccountDetails();
    }
  }, [id]);

  // Fetch deals when deals tab is active
  useEffect(() => {
    if (activeTab === "deals" && account?.id) {
      fetchDeals(account.id);
    }
  }, [activeTab, account?.id]);

  // Fetch invoices when invoices tab is active
  useEffect(() => {
    if (activeTab === "invoices" && account?.id) {
      fetchInvoices(account.id);
    }
  }, [activeTab, account?.id]);

  // Fetch users for assignment
  useEffect(() => {
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
              u.attributes ? { id: u.id, documentId: u.id, ...u.attributes } : u
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
      } catch (e) {
        console.error("Error fetching users:", e);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (isAdmin()) fetchUsers();
  }, [user]);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);

      // Fetch account data first with error handling
      let accountData;
      try {
        accountData = await clientAccountService.getById(id);
        setAccount(accountData);
      } catch (accountError) {
        console.error("Failed to fetch account:", accountError);
        setError(
          `Account with ID ${id} not found. Please check if the account exists.`
        );
        return;
      }

      // Fetch related data with error handling
      const [contactsData, activitiesData, healthData] =
        await Promise.allSettled([
          contactService
            .getByClientAccount(id, {
              pagination: { pageSize: 50 },
            })
            .catch((err) => {
              console.warn("Failed to fetch contacts:", err);
              return { data: [] };
            }),
          activityService
            .getByClientAccount(id, {
              pagination: { pageSize: 50 },
            })
            .catch((err) => {
              console.warn("Failed to fetch activities:", err);
              return { data: [] };
            }),
          clientAccountService.getHealthDetails(id).catch((err) => {
            console.warn("Failed to fetch health details:", err);
            return {};
          }),
        ]);

      // Handle settled promises
      setContacts(
        contactsData.status === "fulfilled"
          ? contactsData.value?.data || []
          : []
      );
      setActivities(
        activitiesData.status === "fulfilled"
          ? activitiesData.value?.data || []
          : []
      );
      setHealthDetails(
        healthData.status === "fulfilled" ? healthData.value : {}
      );

      // Fetch deals when account is loaded
      if (accountData?.id) {
        await fetchDeals(accountData.id);
      }

      setProjects([
        {
          id: 1,
          name: "System Implementation",
          status: "IN_PROGRESS",
          progress: 75,
          startDate: "2024-01-01",
          endDate: "2024-03-31",
          manager: "John Smith",
        },
        {
          id: 2,
          name: "Data Migration",
          status: "COMPLETED",
          progress: 100,
          startDate: "2023-11-01",
          endDate: "2023-12-31",
          manager: "Sarah Johnson",
        },
        {
          id: 3,
          name: "Training Program",
          status: "PLANNED",
          progress: 0,
          startDate: "2024-04-01",
          endDate: "2024-05-15",
          manager: "Mike Chen",
        },
      ]);

      // Invoices will be fetched when invoices tab is active via useEffect
      setInvoices([]);
    } catch (err) {
      console.error("Error fetching account details:", err);
      setError("Failed to load account details");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeals = async (accountId) => {
    try {
      setDealsLoading(true);
      const response = await dealService.getByClientAccount(accountId);
      const dealsData = response.data || [];
      setDeals(dealsData);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setDeals([]);
    } finally {
      setDealsLoading(false);
    }
  };

  const handleAddDeal = () => {
    setShowAddDealModal(true);
  };

  const handleDealSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!dealFormData.name.trim()) {
      alert("Deal name is required");
      return;
    }

    try {
      const dealData = {
        name: dealFormData.name.trim(),
        value: dealFormData.value ? parseFloat(dealFormData.value) : 0,
        stage: dealFormData.stage,
        probability: dealFormData.probability
          ? parseInt(dealFormData.probability)
          : 50,
        closeDate: dealFormData.closeDate || null,
        description: dealFormData.description?.trim() || "",
        clientAccount: account.id,
        source: "FROM_CLIENT",
        priority: "MEDIUM",
      };

      await dealService.create(dealData);

      // Refresh deals
      await fetchDeals(account.id);
      await fetchAccountDetails();

      setShowAddDealModal(false);
      setDealFormData({
        name: "",
        value: "",
        stage: "DISCOVERY",
        probability: 25,
        closeDate: "",
        description: "",
      });
      alert("Deal added successfully!");
    } catch (error) {
      console.error("Error adding deal:", error);

      let errorMessage = "Failed to add deal";
      if (error.message.includes("validation")) {
        errorMessage = "Please check your input and try again";
      } else if (error.message) {
        errorMessage = `Failed to add deal: ${error.message}`;
      }

      alert(errorMessage);
    }
  };

  const dealColumns = [
    {
      key: "name",
      label: "Deal Name",
      render: (value, row) => (
        <div
          className="cursor-pointer hover:text-orange-500"
          onClick={() => router.push(`/sales/deals/${row.id}`)}
        >
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.stage}</div>
        </div>
      ),
    },
    {
      key: "value",
      label: "Value",
      render: (value) => (
        <span className="font-semibold text-gray-900">₹{value}K</span>
      ),
    },
    {
      key: "stage",
      label: "Stage",
      render: (value) => {
        const variants = {
          Prospecting: "default",
          Qualification: "warning",
          Proposal: "info",
          Negotiation: "warning",
          "Closed Won": "success",
          "Closed Lost": "destructive",
        };
        return <Badge variant={variants[value] || "default"}>{value}</Badge>;
      },
    },
    {
      key: "probability",
      label: "Probability",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-orange-500 h-1.5 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-900">{value}%</span>
        </div>
      ),
    },
    {
      key: "closeDate",
      label: "Close Date",
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
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
              router.push(`/sales/deals/${row.id}`);
            }}
            title="View Deal"
          >
            <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
          </button>
          <button
            className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/sales/deals/${row.id}/edit`);
            }}
            title="Edit Deal"
          >
            <Edit className="w-4 h-4 text-gray-400 hover:text-orange-600" />
          </button>
        </div>
      ),
    },
  ];

  const fetchInvoices = async (accountId) => {
    try {
      setInvoicesLoading(true);
      const response = await invoiceService.getByClientAccount(accountId);
      const invoicesData = response.data || [];
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const handleAddInvoice = () => {
    setShowAddInvoiceModal(true);
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
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
        clientAccount: account.id,
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
          // Don't fail the entire operation if file upload fails
        }
      }

      // Refresh invoices
      await fetchInvoices(account.id);
      await fetchAccountDetails();

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
        file: null,
      });
      alert("Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error);

      let errorMessage = "Failed to create invoice";
      if (error.message.includes("validation")) {
        errorMessage = "Please check your input and try again";
      } else if (error.message) {
        errorMessage = `Failed to create invoice: ${error.message}`;
      }

      alert(errorMessage);
    }
  };

  const invoiceColumns = [
    {
      key: "invoiceNumber",
      label: "Invoice Number",
      render: (value, row) => (
        <div
          className="cursor-pointer hover:text-orange-500"
          onClick={() => router.push(`/clients/invoices/${row.id}`)}
        >
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
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
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
            {new Date(value).toLocaleDateString()}
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
              router.push(`/clients/invoices/${row.id}`);
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
                // Download first file
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
              router.push(`/clients/invoices/${row.id}/edit`);
            }}
            title="Edit Invoice"
          >
            <Edit className="w-4 h-4 text-gray-400 hover:text-orange-600" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = () => {
    router.push(`/clients/accounts/${id}/edit`);
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this client account?")
    ) {
      try {
        await clientAccountService.delete(id);
        router.push("/clients/accounts");
      } catch (err) {
        console.error("Error deleting account:", err);
        alert("Failed to delete account");
      }
    }
  };

  const handleSetPrimaryContact = async (contactId) => {
    try {
      setContactsLoading(true);

      // First, remove primary contact role from all other contacts in this account
      const updatePromises = contacts.map(async (contact) => {
        if (contact.id !== contactId && contact.role === "PRIMARY_CONTACT") {
          return contactService.update(contact.id, {
            role: "TECHNICAL_CONTACT",
          });
        }
        return Promise.resolve();
      });

      // Wait for all role removals to complete
      await Promise.all(updatePromises);

      // Set the selected contact as primary
      await contactService.update(contactId, { role: "PRIMARY_CONTACT" });

      // Refresh contacts data
      const contactsData = await contactService.getByClientAccount(id, {
        pagination: { pageSize: 50 },
      });
      setContacts(contactsData.data || []);

      console.log(`Contact ${contactId} set as primary contact`);
    } catch (error) {
      console.error("Error setting primary contact:", error);
      alert("Failed to set primary contact");
    } finally {
      setContactsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "CHURNED":
        return "bg-red-100 text-red-800";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getHealthScoreBg = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  const getDealStageColor = (stage) => {
    switch (stage) {
      case "CLOSED_WON":
        return "bg-green-100 text-green-800";
      case "CLOSED_LOST":
        return "bg-red-100 text-red-800";
      case "NEGOTIATION":
        return "bg-blue-100 text-blue-800";
      case "PROPOSAL":
        return "bg-purple-100 text-purple-800";
      case "QUALIFICATION":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PLANNED":
        return "bg-gray-100 text-gray-800";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityTypeColor = (type) => {
    switch (type) {
      case "CALL":
        return "bg-blue-100 text-blue-800";
      case "EMAIL":
        return "bg-green-100 text-green-800";
      case "MEETING":
        return "bg-purple-100 text-purple-800";
      case "NOTE":
        return "bg-gray-100 text-gray-800";
      case "TASK":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!loading && !account)) {
    return (
      <div className="bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <div className="text-center py-12">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Account Not Found
              </h2>
              <div className="text-red-600 mb-4">
                {error || `Account with ID ${id} could not be found.`}
              </div>
              <p className="text-gray-600 mb-6">
                This account may have been deleted, or you may not have
                permission to view it.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/clients/accounts")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Back to Accounts
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalDealValue = deals.reduce(
    (sum, deal) => sum + (deal.value || 0),
    0
  );
  const wonDeals = deals.filter((deal) => deal.stage === "CLOSED_WON");
  const activeDealValue = deals
    .filter((deal) => !["CLOSED_WON", "CLOSED_LOST"].includes(deal.stage))
    .reduce((sum, deal) => sum + (deal.value || 0), 0);

  // Contact columns configuration for table
  const contactColumns = [
    {
      key: "contact",
      label: "CONTACT",
      render: (_, contact) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar
            src={contact.avatar}
            alt={`${contact.firstName} ${contact.lastName}`}
            fallback={`${contact.firstName?.[0] || ""}${
              contact.lastName?.[0] || ""
            }`}
            className="w-10 h-10"
          />
          <div>
            <div className="flex items-center gap-2">
              <div className="font-medium text-gray-900">
                {contact.firstName} {contact.lastName}
              </div>
              {contact.role === "PRIMARY_CONTACT" && (
                <Badge variant="success" className="text-xs">
                  Primary
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-500">{contact.title}</div>
          </div>
        </div>
      ),
    },
    {
      key: "contact_info",
      label: "CONTACT INFO",
      render: (_, contact) => (
        <div className="min-w-[180px]">
          <div className="flex items-center gap-1 text-sm text-gray-900 mb-1">
            <Mail className="w-3 h-3" />
            {contact.email || "No email"}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Phone className="w-3 h-3" />
            {contact.phone || "No phone"}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "ROLE",
      render: (_, contact) => (
        <Badge
          variant={
            contact.role === "PRIMARY_CONTACT"
              ? "success"
              : contact.role === "DECISION_MAKER"
              ? "warning"
              : contact.role === "INFLUENCER"
              ? "info"
              : "secondary"
          }
        >
          {contact.role?.replace("_", " ") || "TECHNICAL CONTACT"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (_, contact) => (
        <div className="min-w-[120px]">
          <Badge
            variant={
              contact.status === "ACTIVE"
                ? "success"
                : contact.status === "INACTIVE"
                ? "secondary"
                : "warning"
            }
          >
            {contact.status || "ACTIVE"}
          </Badge>
          {contact.leadCompany && (
            <div className="mt-1">
              <Badge variant="warning" className="text-xs">
                Lead Company
              </Badge>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (_, contact) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/sales/contacts/${contact.id}`)}
            title="View Contact"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {contact.role !== "PRIMARY_CONTACT" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSetPrimaryContact(contact.id)}
              title="Set as Primary Contact"
              className="text-orange-600 hover:text-orange-700"
            >
              <Star className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const tabItems = [
    { key: "overview", label: "Overview" },
    { key: "contacts", label: "Contacts" },
    { key: "activities", label: "Activities" },
    { key: "deals", label: "Deals" },
    { key: "projects", label: "Projects" },
    { key: "invoices", label: "Invoices" },
    { key: "health", label: "Account Health" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4 space-y-4">
        <PageHeader
          title={account.companyName}
          subtitle={`Client Account • ${
            account.industry || "Industry not specified"
          } • ${account.type || "Customer"}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Clients", href: "/clients" },
            { label: "Client Accounts", href: "/clients/accounts" },
            { label: account.companyName, href: `/clients/accounts/${id}` },
          ]}
          showSearch={false}
          showActions={true}
          actions={[
            {
              label: "Edit",
              icon: Edit,
              onClick: handleEdit,
              variant: "primary",
            },
            {
              label: "Share",
              icon: Share,
              onClick: () => {},
              variant: "secondary",
            },
            {
              label: "Export",
              icon: Download,
              onClick: () => {},
              variant: "secondary",
            },
            {
              label: "Delete",
              icon: Trash2,
              onClick: handleDelete,
              variant: "danger",
            },
          ]}
        />

        {/* Account Header Card */}
        <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <Building2 className="w-10 h-10 text-green-600" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {account.companyName}
                  </h1>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      account.status
                    )}`}
                  >
                    {account.status || "ACTIVE"}
                  </span>
                  {account.healthScore && (
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full ${getHealthScoreBg(
                        account.healthScore
                      )}`}
                    >
                      <TrendingUp
                        className={`w-4 h-4 ${getHealthScoreColor(
                          account.healthScore
                        )}`}
                      />
                      <span
                        className={`text-sm font-semibold ${getHealthScoreColor(
                          account.healthScore
                        )}`}
                      >
                        {account.healthScore}% Health
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{account.industry || "Industry not specified"}</span>
                  </div>

                  {account.employees && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{account.employees} employees</span>
                    </div>
                  )}

                  {account.founded && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Founded {account.founded}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  {account.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${account.email}`}
                        className="hover:text-orange-600 transition-colors"
                      >
                        {account.email}
                      </a>
                    </div>
                  )}

                  {account.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${account.phone}`}
                        className="hover:text-orange-600 transition-colors"
                      >
                        {account.phone}
                      </a>
                    </div>
                  )}

                  {account.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a
                        href={account.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-600 transition-colors"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${totalDealValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Deal Value</div>
              {account.conversionDate && (
                <div className="text-xs text-gray-500 mt-2">
                  Client since{" "}
                  {new Date(account.conversionDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Contacts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Deals
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    deals.filter(
                      (deal) =>
                        !["CLOSED_WON", "CLOSED_LOST"].includes(deal.stage)
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Won Deals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {wonDeals.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    projects.filter(
                      (project) => project.status === "IN_PROGRESS"
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-2 shadow-lg">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-transparent text-gray-700 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Information */}
                <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Company Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Industry
                      </label>
                      <span className="text-gray-900">
                        {account.industry || "Not specified"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Account Type
                      </label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          account.type === "CUSTOMER"
                            ? "bg-blue-100 text-blue-800"
                            : account.type === "PARTNER"
                            ? "bg-green-100 text-green-800"
                            : account.type === "VENDOR"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {account.type || "CUSTOMER"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Company Size
                      </label>
                      <span className="text-gray-900">
                        {account.employees || "Not specified"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Founded
                      </label>
                      <span className="text-gray-900">
                        {account.founded || "Not specified"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Annual Revenue
                      </label>
                      <span className="text-gray-900">
                        {account.revenue
                          ? `$${account.revenue.toLocaleString()}`
                          : "Not specified"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Website
                      </label>
                      {account.website ? (
                        <a
                          href={account.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          {account.website}
                        </a>
                      ) : (
                        <span className="text-gray-900">Not provided</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Account Manager
                      </label>
                      <div className="flex items-center gap-2">
                        <Avatar
                          alt={
                            account.accountManager
                              ? `${account.accountManager.firstName} ${account.accountManager.lastName}`
                              : "Unassigned"
                          }
                          fallback={(
                            account.accountManager?.firstName ||
                            account.accountManager?.lastName ||
                            "?"
                          )
                            .charAt(0)
                            .toUpperCase()}
                          size="sm"
                        />
                        <span className="text-gray-900">
                          {account.accountManager
                            ? `${account.accountManager.firstName} ${account.accountManager.lastName}`
                            : "Not assigned"}
                        </span>
                        {isAdmin() && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(
                                account.accountManager?.id?.toString() ||
                                  account.accountManager?.documentId?.toString() ||
                                  ""
                              );
                              setShowAssignModal(true);
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                          >
                            Change
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Client Since
                      </label>
                      <span className="text-gray-900">
                        {account.conversionDate
                          ? new Date(
                              account.conversionDate
                            ).toLocaleDateString()
                          : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Company Description */}
                  {account.description && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Company Description
                      </label>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
                        {account.description}
                      </p>
                    </div>
                  )}

                  {/* Address Information */}
                  {(account.address ||
                    account.city ||
                    account.state ||
                    account.country) && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-600 mb-3">
                        Address Information
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {account.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-900">
                              {account.address}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-700 ml-6">
                          {account.city && <span>{account.city}</span>}
                          {account.state && <span>{account.state}</span>}
                          {account.zipCode && <span>{account.zipCode}</span>}
                          {account.country && <span>{account.country}</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversion History */}
                {account.convertedFromLead && (
                  <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Conversion History
                    </h3>

                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Converted from Lead Company
                          </h4>
                          <p className="text-sm text-gray-600">
                            Originally "{account.convertedFromLead.companyName}"
                            lead company
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Converted on{" "}
                            {new Date(
                              account.conversionDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {account.notes && (
                  <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Notes
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {account.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Account Health */}
                <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Health
                  </h3>

                  {account.healthScore && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Overall Score
                        </span>
                        <span
                          className={`text-lg font-bold ${getHealthScoreColor(
                            account.healthScore
                          )}`}
                        >
                          {account.healthScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            account.healthScore >= 80
                              ? "bg-green-500"
                              : account.healthScore >= 60
                              ? "bg-yellow-500"
                              : account.healthScore >= 40
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${account.healthScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Activity</span>
                      <span className="font-semibold text-gray-900">
                        {account.lastActivityDate
                          ? new Date(
                              account.lastActivityDate
                            ).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold text-gray-900">
                        $
                        {wonDeals
                          .reduce((sum, deal) => sum + deal.value, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Deal Value</span>
                      <span className="font-semibold text-gray-900">
                        ${activeDealValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Outstanding Invoices
                      </span>
                      <span className="font-semibold text-gray-900">
                        $
                        {invoices
                          .filter((inv) => inv.status !== "PAID")
                          .reduce((sum, inv) => sum + inv.amount, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Customer Lifetime Value
                      </span>
                      <span className="font-semibold text-gray-900">
                        $
                        {(
                          wonDeals.reduce((sum, deal) => sum + deal.value, 0) +
                          invoices
                            .filter((inv) => inv.status === "PAID")
                            .reduce((sum, inv) => sum + inv.amount, 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>

                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${getActivityTypeColor(
                            activity.activityType
                          )}`}
                        >
                          <Activity className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {activities.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No recent activities
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                {(account.linkedIn || account.twitter) && (
                  <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Social Profiles
                    </h3>

                    <div className="space-y-2">
                      {account.linkedIn && (
                        <a
                          href={account.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4" />
                          </div>
                          LinkedIn Profile
                        </a>
                      )}

                      {account.twitter && (
                        <a
                          href={account.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                          </div>
                          Twitter Profile
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs content would go here - contacts, activities, deals, projects, health */}
          {/* For brevity, I'll implement the key tabs */}

          {activeTab === "contacts" && (
            <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contacts
                </h3>
                <Button
                  size="sm"
                  onClick={() => {}}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
              {contactsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  <span className="ml-2 text-gray-600">
                    Loading contacts...
                  </span>
                </div>
              ) : contacts.length > 0 ? (
                <Table columns={contactColumns} data={contacts} />
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">👥</div>
                  <p className="text-gray-600">
                    No contacts found for this account
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add contacts to start building relationships
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "activities" && account && (
            <ActivitiesPanel
              entityType="clientAccount"
              entityId={account.id}
              entityName={account.name}
              onActivityCreated={fetchAccountDetails}
            />
          )}

          {activeTab === "deals" && (
            <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Deals</h3>
                <Button
                  size="sm"
                  onClick={handleAddDeal}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deal
                </Button>
              </div>
              {dealsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  <span className="ml-2 text-gray-600">Loading deals...</span>
                </div>
              ) : deals.length > 0 ? (
                <Table columns={dealColumns} data={deals} />
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">💼</div>
                  <p className="text-gray-600">
                    No deals found for this account
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create deals to track opportunities
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Account Projects
                </h3>
                <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create Project
                </button>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg rounded-xl p-4 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {project.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Manager: {project.manager}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getProjectStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          {new Date(project.startDate).toLocaleDateString()}
                        </span>
                        <span>
                          {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "invoices" && (
            <div className="rounded-2xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Invoices
                </h3>
                <Button
                  size="sm"
                  onClick={handleAddInvoice}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Invoice
                </Button>
              </div>
              {invoicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  <span className="ml-2 text-gray-600">
                    Loading invoices...
                  </span>
                </div>
              ) : invoices.length > 0 ? (
                <Table columns={invoiceColumns} data={invoices} />
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📄</div>
                  <p className="text-gray-600">
                    No invoices found for this account
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create invoices to track billing
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Deal</h2>
                <Button
                  onClick={() => setShowAddDealModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  variant="ghost"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleDealSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Name *
                  </label>
                  <input
                    type="text"
                    value={dealFormData.name}
                    onChange={(e) =>
                      setDealFormData({ ...dealFormData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deal Value
                    </label>
                    <input
                      type="number"
                      value={dealFormData.value}
                      onChange={(e) =>
                        setDealFormData({
                          ...dealFormData,
                          value: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stage
                    </label>
                    <select
                      value={dealFormData.stage}
                      onChange={(e) =>
                        setDealFormData({
                          ...dealFormData,
                          stage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="DISCOVERY">Discovery</option>
                      <option value="PROPOSAL">Proposal</option>
                      <option value="NEGOTIATION">Negotiation</option>
                      <option value="CLOSED_WON">Closed Won</option>
                      <option value="CLOSED_LOST">Closed Lost</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Probability (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={dealFormData.probability}
                      onChange={(e) =>
                        setDealFormData({
                          ...dealFormData,
                          probability: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Close Date
                    </label>
                    <input
                      type="date"
                      value={dealFormData.closeDate}
                      onChange={(e) =>
                        setDealFormData({
                          ...dealFormData,
                          closeDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={dealFormData.description}
                    onChange={(e) =>
                      setDealFormData({
                        ...dealFormData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowAddDealModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
                  >
                    Add Deal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add Invoice
                </h2>
                <Button
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  variant="ghost"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleInvoiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    value={invoiceFormData.invoiceNumber}
                    onChange={(e) =>
                      setInvoiceFormData({
                        ...invoiceFormData,
                        invoiceNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      value={invoiceFormData.issueDate}
                      onChange={(e) =>
                        setInvoiceFormData({
                          ...invoiceFormData,
                          issueDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={invoiceFormData.dueDate}
                      onChange={(e) =>
                        setInvoiceFormData({
                          ...invoiceFormData,
                          dueDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={invoiceFormData.amount}
                      onChange={(e) => {
                        const amount = e.target.value;
                        const taxAmount =
                          parseFloat(invoiceFormData.taxAmount) || 0;
                        const totalAmount =
                          (parseFloat(amount) || 0) + taxAmount;
                        setInvoiceFormData({
                          ...invoiceFormData,
                          amount: amount,
                          totalAmount: totalAmount.toFixed(2),
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={invoiceFormData.taxAmount}
                      onChange={(e) => {
                        const taxAmount = e.target.value;
                        const amount = parseFloat(invoiceFormData.amount) || 0;
                        const totalAmount =
                          amount + (parseFloat(taxAmount) || 0);
                        setInvoiceFormData({
                          ...invoiceFormData,
                          taxAmount: taxAmount,
                          totalAmount: totalAmount.toFixed(2),
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoiceFormData.totalAmount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={invoiceFormData.status}
                    onChange={(e) =>
                      setInvoiceFormData({
                        ...invoiceFormData,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SENT">Sent</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={invoiceFormData.notes}
                    onChange={(e) =>
                      setInvoiceFormData({
                        ...invoiceFormData,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Document
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setInvoiceFormData({
                        ...invoiceFormData,
                        file: e.target.files[0],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload PDF, Word, or image files
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowAddInvoiceModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
                  >
                    Create Invoice
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Account Manager Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
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
                Select a user to assign <strong>{account.companyName}</strong>{" "}
                to:
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
                    await clientAccountService.update(id, {
                      accountManager: selectedUserId || null,
                    });
                    // Refresh account details with proper population
                    await fetchAccountDetails();
                    // Dispatch custom event to notify list page
                    window.dispatchEvent(
                      new CustomEvent("accountUpdated", {
                        detail: { accountId: id },
                      })
                    );
                    setShowAssignModal(false);
                    setSelectedUserId("");
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
  );
};

export default ClientAccountDetailPage;
