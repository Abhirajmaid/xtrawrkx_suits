import {
    LayoutDashboard,
    Users,
    Briefcase,
    Building2,
    UserCheck,
    Package,
    FolderOpen,
    HeadphonesIcon,
    BarChart3,
    FileText,
    TrendingUp,
    Settings,
    Shield,
    Mail,
    Calendar,
    Target,
    DollarSign,
    Phone,
    FileCheck,
    ShoppingCart,
    CreditCard,
    Receipt,
    MessageSquare,
    GitBranch,
    Inbox,
    CheckSquare,
    Clock,
    UserPlus
} from 'lucide-react'

export const navigation = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/'
    },
    {
        id: 'sales',
        label: 'Sales',
        icon: DollarSign,
        children: [
            {
                id: 'leads',
                label: 'Leads',
                icon: Users,
                href: '/sales/leads',
                children: [
                    { id: 'leads-list', label: 'List', href: '/sales/leads' },
                    { id: 'leads-board', label: 'Board (Kanban)', href: '/sales/leads/board' },
                    { id: 'leads-detail', label: 'Lead Detail', href: '/sales/leads/[id]' },
                    { id: 'leads-import', label: 'Import / Segmentation Rules', href: '/sales/leads/import' }
                ]
            },
            {
                id: 'deals',
                label: 'Deals (Opportunities)',
                icon: Briefcase,
                href: '/sales/deals',
                children: [
                    { id: 'pipeline-board', label: 'Pipeline Board', href: '/sales/deals/pipeline' },
                    { id: 'deals-list', label: 'Deals List', href: '/sales/deals' },
                    { id: 'deal-detail', label: 'Deal Detail (Activity, Notes, Files)', href: '/sales/deals/[id]' }
                ]
            },
            {
                id: 'accounts',
                label: 'Accounts (Companies)',
                icon: Building2,
                href: '/sales/accounts',
                children: [
                    { id: 'accounts-list', label: 'Accounts List', href: '/sales/accounts' },
                    { id: 'account-detail', label: 'Account Detail (Overview • People • Activity • Docs)', href: '/sales/accounts/[id]' }
                ]
            },
            {
                id: 'contacts',
                label: 'Contacts',
                icon: UserCheck,
                href: '/sales/contacts',
                children: [
                    { id: 'contacts-list', label: 'Contacts List', href: '/sales/contacts' },
                    { id: 'contact-detail', label: 'Contact Detail (360° • Client Activity Timeline)', href: '/sales/contacts/[id]' }
                ]
            },
            {
                id: 'clients',
                label: 'Clients',
                icon: Building2,
                href: '/clients',
                children: [
                    { id: 'clients-list', label: 'Clients List', href: '/clients' },
                    { id: 'client-detail', label: 'Client Detail (360° • Activity Timeline)', href: '/clients/[id]' }
                ]
            },
            {
                id: 'products',
                label: 'Products & Services',
                icon: Package,
                href: '/sales/products',
                children: [
                    { id: 'catalog', label: 'Catalog', href: '/sales/products' },
                    { id: 'bundles', label: 'Bundles / Pricing Rules', href: '/sales/products/bundles' }
                ]
            },
            {
                id: 'proposals',
                label: 'Proposals & Quotes',
                icon: FileText,
                href: '/sales/proposals',
                children: [
                    { id: 'all-proposals', label: 'All Proposals', href: '/sales/proposals' },
                    { id: 'new-proposal', label: 'New Proposal (Template Builder • Live Preview • E-sign)', href: '/sales/proposals/new' },
                    { id: 'proposal-history', label: 'Proposal Detail (History)', href: '/sales/proposals/[id]' }
                ]
            },
            {
                id: 'invoices',
                label: 'Invoices & Payments',
                icon: Receipt,
                href: '/sales/invoices',
                children: [
                    { id: 'invoices-list', label: 'Invoices', href: '/sales/invoices' },
                    { id: 'new-invoice', label: 'New Invoice', href: '/sales/invoices/new' },
                    { id: 'invoice-detail', label: 'Invoice Detail (Payment Status • Timeline)', href: '/sales/invoices/[id]' },
                    { id: 'payment-settings', label: 'Payment Settings (Stripe/Razorpay)', href: '/sales/invoices/settings' }
                ]
            },
            {
                id: 'email-campaigns',
                label: 'Email Campaigns',
                icon: Mail,
                href: '/sales/campaigns',
                children: [
                    { id: 'campaigns-list', label: 'Campaigns', href: '/sales/campaigns' },
                    { id: 'new-campaign', label: 'New Campaign (Template • Segments)', href: '/sales/campaigns/new' },
                    { id: 'templates', label: 'Templates', href: '/sales/campaigns/templates' },
                    { id: 'performance', label: 'Performance Analytics', href: '/sales/campaigns/analytics' }
                ]
            },
            {
                id: 'meetings',
                label: 'Meetings & Calls',
                icon: Phone,
                href: '/sales/meetings',
                children: [
                    { id: 'calendar', label: 'Calendar', href: '/sales/meetings/calendar' },
                    { id: 'call-logs', label: 'Call Logs', href: '/sales/meetings/calls' },
                    { id: 'integrations', label: 'Integrations', href: '/sales/meetings/integrations' }
                ]
            },
            {
                id: 'tasks',
                label: 'Tasks & Reminders',
                icon: CheckSquare,
                href: '/sales/tasks',
                children: [
                    { id: 'my-tasks', label: 'My Tasks', href: '/sales/tasks' },
                    { id: 'team-boards', label: 'Team Boards', href: '/sales/tasks/boards' },
                    { id: 'automation-rules', label: 'Priority / Automation Rules', href: '/sales/tasks/automation' }
                ]
            }
        ]
    },
    {
        id: 'delivery',
        label: 'Delivery',
        icon: FolderOpen,
        children: [
            {
                id: 'projects',
                label: 'Projects',
                icon: GitBranch,
                href: '/delivery/projects',
                children: [
                    { id: 'all-projects', label: 'All Projects', href: '/delivery/projects' },
                    { id: 'project-detail', label: 'Project Detail (Kanban • Gantt • Milestones)', href: '/delivery/projects/[id]' },
                    { id: 'time-costs', label: 'Time/Costs', href: '/delivery/projects/time-costs' }
                ]
            },
            {
                id: 'support',
                label: 'Support Tickets',
                icon: HeadphonesIcon,
                href: '/delivery/support',
                children: [
                    { id: 'queues', label: 'Queues / Inbox', href: '/delivery/support' },
                    { id: 'ticket-detail', label: 'Ticket Detail (SLA • Comments • Attachments)', href: '/delivery/support/[id]' },
                    { id: 'chat-widget', label: 'Chat Widget (Embed Reference)', href: '/delivery/support/chat-widget' }
                ]
            }
        ]
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        children: [
            {
                id: 'reports',
                label: 'Reports & Forecasts',
                icon: FileText,
                href: '/analytics/reports',
                children: [
                    { id: 'executive-dashboards', label: 'Executive Dashboards (Funnel • Sales • CSAT)', href: '/analytics/reports/executive' },
                    { id: 'drilldowns', label: 'Drilldowns', href: '/analytics/reports/drilldowns' },
                    { id: 'exports', label: 'Exports', href: '/analytics/reports/exports' }
                ]
            }
        ]
    },
    {
        id: 'admin',
        label: 'Admin',
        icon: Settings,
        children: [
            {
                id: 'settings',
                label: 'Settings & RBAC',
                icon: Shield,
                href: '/admin/settings',
                children: [
                    { id: 'users-roles', label: 'Users & Roles', href: '/admin/settings/users' },
                    { id: 'field-customization', label: 'Field Customization', href: '/admin/settings/fields' },
                    { id: 'automations', label: 'Automations / Workflows', href: '/admin/settings/automations' },
                    { id: 'integrations', label: 'Integrations', href: '/admin/settings/integrations' },
                    { id: 'audit-logs', label: 'Audit Logs', href: '/admin/settings/audit' }
                ]
            }
        ]
    }
]
