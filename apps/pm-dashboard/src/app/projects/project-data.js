// Comprehensive Project Data for All 7 Projects
export const projectsData = {
  "yellow-branding": {
    id: 1,
    name: "Yellow Branding",
    slug: "yellow-branding",
    color: "from-blue-400 to-blue-600",
    icon: "Y",
    description: "Complete brand identity and visual design for Yellow company",
    status: "In Progress",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    progress: 65,
    stats: {
      totalTasks: 12,
      assignedTasks: 12,
      incompleteTasks: 7,
      completedTasks: 4,
      overdueTasks: 1
    },
    tasks: [
      {
        id: 1,
        name: "Logo Concept Development",
        assignee: "Mark Atenson",
        dueDate: "2024-01-15",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Initial logo concept sketches and iterations"
      },
      {
        id: 2,
        name: "Brand Color Palette",
        assignee: "Jane Cooper",
        dueDate: "2024-01-20",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Primary and secondary color selection"
      },
      {
        id: 3,
        name: "Typography Selection",
        assignee: "Alex Johnson",
        dueDate: "2024-01-25",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Choose brand fonts and typography system"
      },
      {
        id: 4,
        name: "Logo Refinement",
        assignee: "Mark Atenson",
        dueDate: "2024-02-01",
        status: "In Progress",
        progress: 75,
        priority: "high",
        description: "Final logo adjustments based on feedback"
      },
      {
        id: 5,
        name: "Business Card Design",
        assignee: "Jane Cooper",
        dueDate: "2024-02-05",
        status: "In Progress",
        progress: 40,
        priority: "medium",
        description: "Corporate business card layout and design"
      },
      {
        id: 6,
        name: "Letterhead Template",
        assignee: "Alex Johnson",
        dueDate: "2024-02-08",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Official letterhead design template"
      },
      {
        id: 7,
        name: "Brand Guidelines Document",
        assignee: "Multiple",
        dueDate: "2024-02-15",
        status: "In Progress",
        progress: 25,
        priority: "high",
        description: "Comprehensive brand usage guidelines"
      },
      {
        id: 8,
        name: "Social Media Templates",
        assignee: "Jane Cooper",
        dueDate: "2024-02-20",
        status: "To Do",
        progress: 0,
        priority: "low",
        description: "Social media post templates and layouts"
      },
      {
        id: 9,
        name: "Website Mockups",
        assignee: "Mark Atenson",
        dueDate: "2024-02-25",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Homepage and key page mockups"
      },
      {
        id: 10,
        name: "Packaging Design",
        assignee: "Alex Johnson",
        dueDate: "2024-03-01",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Product packaging design concepts"
      },
      {
        id: 11,
        name: "Brand Presentation",
        assignee: "Multiple",
        dueDate: "2024-03-10",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Final brand presentation for client"
      },
      {
        id: 12,
        name: "Marketing Collateral",
        assignee: "Jane Cooper",
        dueDate: "2024-01-30",
        status: "Overdue",
        progress: 20,
        priority: "high",
        description: "Brochures and marketing materials"
      }
    ],
    team: [
      { id: 1, name: "Mark Atenson", role: "Senior Designer", avatar: "MA", color: "bg-blue-500" },
      { id: 2, name: "Jane Cooper", role: "Creative Director", avatar: "JC", color: "bg-green-500" },
      { id: 3, name: "Alex Johnson", role: "Brand Strategist", avatar: "AJ", color: "bg-purple-500" }
    ]
  },

  "mogo-web-design": {
    id: 2,
    name: "Mogo Web Design",
    slug: "mogo-web-design",
    color: "from-green-400 to-green-600",
    icon: "M",
    description: "Modern responsive website design and development",
    status: "In Progress",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    progress: 45,
    stats: {
      totalTasks: 15,
      assignedTasks: 15,
      incompleteTasks: 9,
      completedTasks: 5,
      overdueTasks: 1
    },
    tasks: [
      {
        id: 13,
        name: "User Research & Analysis",
        assignee: "Sarah Wilson",
        dueDate: "2024-01-25",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Target audience research and competitive analysis"
      },
      {
        id: 14,
        name: "Information Architecture",
        assignee: "Mike Chen",
        dueDate: "2024-02-01",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Site structure and navigation planning"
      },
      {
        id: 15,
        name: "Wireframe Creation",
        assignee: "Sarah Wilson",
        dueDate: "2024-02-05",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Low-fidelity wireframes for all pages"
      },
      {
        id: 16,
        name: "Homepage Design",
        assignee: "Tom Rodriguez",
        dueDate: "2024-02-10",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "High-fidelity homepage design mockup"
      },
      {
        id: 17,
        name: "About Page Design",
        assignee: "Sarah Wilson",
        dueDate: "2024-02-15",
        status: "In Progress",
        progress: 80,
        priority: "medium",
        description: "About us page layout and content design"
      },
      {
        id: 18,
        name: "Services Page Design",
        assignee: "Tom Rodriguez",
        dueDate: "2024-02-20",
        status: "In Progress",
        progress: 60,
        priority: "medium",
        description: "Services showcase page design"
      },
      {
        id: 19,
        name: "Contact Page Design",
        assignee: "Mike Chen",
        dueDate: "2024-02-25",
        status: "In Progress",
        progress: 30,
        priority: "low",
        description: "Contact form and information page"
      },
      {
        id: 20,
        name: "Mobile Responsiveness",
        assignee: "Sarah Wilson",
        dueDate: "2024-03-01",
        status: "To Do",
        progress: 0,
        priority: "high",
        description: "Mobile and tablet responsive design"
      },
      {
        id: 21,
        name: "Frontend Development",
        assignee: "Mike Chen",
        dueDate: "2024-03-15",
        status: "To Do",
        progress: 0,
        priority: "high",
        description: "HTML, CSS, JavaScript implementation"
      },
      {
        id: 22,
        name: "CMS Integration",
        assignee: "Tom Rodriguez",
        dueDate: "2024-03-20",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Content management system setup"
      },
      {
        id: 23,
        name: "SEO Optimization",
        assignee: "Mike Chen",
        dueDate: "2024-03-25",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Search engine optimization implementation"
      },
      {
        id: 24,
        name: "Performance Testing",
        assignee: "Tom Rodriguez",
        dueDate: "2024-04-01",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Website speed and performance optimization"
      },
      {
        id: 25,
        name: "Browser Testing",
        assignee: "Sarah Wilson",
        dueDate: "2024-04-05",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Cross-browser compatibility testing"
      },
      {
        id: 26,
        name: "Content Population",
        assignee: "Multiple",
        dueDate: "2024-04-10",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Add final content and images"
      },
      {
        id: 27,
        name: "Client Training",
        assignee: "Mike Chen",
        dueDate: "2024-02-12",
        status: "Overdue",
        progress: 0,
        priority: "medium",
        description: "CMS training for client team"
      }
    ],
    team: [
      { id: 4, name: "Sarah Wilson", role: "UI/UX Designer", avatar: "SW", color: "bg-yellow-500" },
      { id: 5, name: "Mike Chen", role: "Frontend Developer", avatar: "MC", color: "bg-red-500" },
      { id: 6, name: "Tom Rodriguez", role: "Backend Developer", avatar: "TR", color: "bg-indigo-500" }
    ]
  },

  "futurework": {
    id: 3,
    name: "Futurework",
    slug: "futurework",
    color: "from-purple-400 to-purple-600",
    icon: "F",
    description: "Future of work platform research and design",
    status: "Planning",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    progress: 25,
    stats: {
      totalTasks: 18,
      assignedTasks: 18,
      incompleteTasks: 14,
      completedTasks: 3,
      overdueTasks: 1
    },
    tasks: [
      {
        id: 28,
        name: "Market Research",
        assignee: "Lisa Park",
        dueDate: "2024-02-10",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Remote work trends and market analysis"
      },
      {
        id: 29,
        name: "User Persona Development",
        assignee: "David Kim",
        dueDate: "2024-02-15",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Create detailed user personas and journey maps"
      },
      {
        id: 30,
        name: "Competitive Analysis",
        assignee: "Lisa Park",
        dueDate: "2024-02-20",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Analysis of competing platforms and features"
      },
      {
        id: 31,
        name: "Feature Requirements",
        assignee: "David Kim",
        dueDate: "2024-02-25",
        status: "In Progress",
        progress: 70,
        priority: "high",
        description: "Define core platform features and requirements"
      },
      {
        id: 32,
        name: "Technical Architecture",
        assignee: "Robert Chen",
        dueDate: "2024-03-01",
        status: "In Progress",
        progress: 40,
        priority: "high",
        description: "System architecture and technology stack"
      },
      {
        id: 33,
        name: "Database Design",
        assignee: "Robert Chen",
        dueDate: "2024-03-05",
        status: "In Progress",
        progress: 20,
        priority: "medium",
        description: "Database schema and data modeling"
      },
      {
        id: 34,
        name: "UI Wireframes",
        assignee: "Lisa Park",
        dueDate: "2024-03-10",
        status: "To Do",
        progress: 0,
        priority: "high",
        description: "Low-fidelity wireframes for main interfaces"
      },
      {
        id: 35,
        name: "Design System",
        assignee: "David Kim",
        dueDate: "2024-03-15",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Component library and design tokens"
      },
      {
        id: 36,
        name: "Dashboard Mockups",
        assignee: "Lisa Park",
        dueDate: "2024-03-20",
        status: "To Do",
        progress: 0,
        priority: "high",
        description: "High-fidelity dashboard design mockups"
      },
      {
        id: 37,
        name: "User Profile Design",
        assignee: "David Kim",
        dueDate: "2024-03-25",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "User profile and settings interfaces"
      },
      {
        id: 38,
        name: "Authentication System",
        assignee: "Robert Chen",
        dueDate: "2024-04-01",
        status: "Backlog",
        progress: 0,
        priority: "high",
        description: "User authentication and security features"
      },
      {
        id: 39,
        name: "Chat Feature Design",
        assignee: "Lisa Park",
        dueDate: "2024-04-05",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Real-time messaging interface design"
      },
      {
        id: 40,
        name: "Video Call Integration",
        assignee: "Robert Chen",
        dueDate: "2024-04-10",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Video conferencing integration planning"
      },
      {
        id: 41,
        name: "Mobile App Wireframes",
        assignee: "David Kim",
        dueDate: "2024-04-15",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Mobile application wireframes and flow"
      },
      {
        id: 42,
        name: "API Documentation",
        assignee: "Robert Chen",
        dueDate: "2024-04-20",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "API endpoints and documentation"
      },
      {
        id: 43,
        name: "Testing Strategy",
        assignee: "Multiple",
        dueDate: "2024-05-01",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "QA and testing framework planning"
      },
      {
        id: 44,
        name: "Security Audit",
        assignee: "Robert Chen",
        dueDate: "2024-05-15",
        status: "Backlog",
        progress: 0,
        priority: "high",
        description: "Security assessment and compliance review"
      },
      {
        id: 45,
        name: "User Testing Plan",
        assignee: "Lisa Park",
        dueDate: "2024-02-18",
        status: "Overdue",
        progress: 10,
        priority: "medium",
        description: "User testing methodology and scheduling"
      }
    ],
    team: [
      { id: 7, name: "Lisa Park", role: "UX Researcher", avatar: "LP", color: "bg-pink-500" },
      { id: 8, name: "David Kim", role: "Product Designer", avatar: "DK", color: "bg-orange-500" },
      { id: 9, name: "Robert Chen", role: "Tech Lead", avatar: "RC", color: "bg-cyan-500" }
    ]
  },

  "resto-dashboard": {
    id: 4,
    name: "Resto Dashboard",
    slug: "resto-dashboard",
    color: "from-red-400 to-red-600",
    icon: "R",
    description: "Restaurant management dashboard and POS system",
    status: "In Progress",
    startDate: "2024-01-20",
    endDate: "2024-05-20",
    progress: 55,
    stats: {
      totalTasks: 20,
      assignedTasks: 20,
      incompleteTasks: 12,
      completedTasks: 7,
      overdueTasks: 1
    },
    tasks: [
      {
        id: 46,
        name: "Requirements Gathering",
        assignee: "Emma Stone",
        dueDate: "2024-01-25",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Restaurant workflow analysis and requirements"
      },
      {
        id: 47,
        name: "System Architecture",
        assignee: "Bob Taylor",
        dueDate: "2024-02-01",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Backend architecture and database design"
      },
      {
        id: 48,
        name: "Dashboard Wireframes",
        assignee: "Emma Stone",
        dueDate: "2024-02-05",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Admin dashboard wireframes and layouts"
      },
      {
        id: 49,
        name: "POS Interface Design",
        assignee: "Chris Wong",
        dueDate: "2024-02-10",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Point of sale interface design"
      },
      {
        id: 50,
        name: "Menu Management UI",
        assignee: "Emma Stone",
        dueDate: "2024-02-15",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Menu creation and editing interface"
      },
      {
        id: 51,
        name: "Order Management System",
        assignee: "Bob Taylor",
        dueDate: "2024-02-20",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Order processing and tracking backend"
      },
      {
        id: 52,
        name: "Inventory Tracking",
        assignee: "Chris Wong",
        dueDate: "2024-02-25",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Inventory management and alerts system"
      },
      {
        id: 53,
        name: "Payment Integration",
        assignee: "Bob Taylor",
        dueDate: "2024-03-01",
        status: "In Progress",
        progress: 75,
        priority: "high",
        description: "Payment gateway integration and processing"
      },
      {
        id: 54,
        name: "Staff Management",
        assignee: "Emma Stone",
        dueDate: "2024-03-05",
        status: "In Progress",
        progress: 60,
        priority: "medium",
        description: "Employee scheduling and management features"
      },
      {
        id: 55,
        name: "Analytics Dashboard",
        assignee: "Chris Wong",
        dueDate: "2024-03-10",
        status: "In Progress",
        progress: 40,
        priority: "medium",
        description: "Sales analytics and reporting dashboard"
      },
      {
        id: 56,
        name: "Customer Management",
        assignee: "Emma Stone",
        dueDate: "2024-03-15",
        status: "In Progress",
        progress: 25,
        priority: "low",
        description: "Customer database and loyalty program"
      },
      {
        id: 57,
        name: "Table Management",
        assignee: "Bob Taylor",
        dueDate: "2024-03-20",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Table booking and reservation system"
      },
      {
        id: 58,
        name: "Kitchen Display System",
        assignee: "Chris Wong",
        dueDate: "2024-03-25",
        status: "To Do",
        progress: 0,
        priority: "high",
        description: "Kitchen order display and management"
      },
      {
        id: 59,
        name: "Mobile App Design",
        assignee: "Emma Stone",
        dueDate: "2024-04-01",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Mobile application for managers"
      },
      {
        id: 60,
        name: "Printer Integration",
        assignee: "Bob Taylor",
        dueDate: "2024-04-05",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Receipt and kitchen printer setup"
      },
      {
        id: 61,
        name: "Backup System",
        assignee: "Chris Wong",
        dueDate: "2024-04-10",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Data backup and recovery system"
      },
      {
        id: 62,
        name: "User Training Materials",
        assignee: "Emma Stone",
        dueDate: "2024-04-15",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Training guides and video tutorials"
      },
      {
        id: 63,
        name: "Security Testing",
        assignee: "Bob Taylor",
        dueDate: "2024-04-20",
        status: "Backlog",
        progress: 0,
        priority: "high",
        description: "Security audit and penetration testing"
      },
      {
        id: 64,
        name: "Performance Optimization",
        assignee: "Chris Wong",
        dueDate: "2024-05-01",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "System performance tuning and optimization"
      },
      {
        id: 65,
        name: "Multi-location Support",
        assignee: "Multiple",
        dueDate: "2024-02-28",
        status: "Overdue",
        progress: 30,
        priority: "medium",
        description: "Support for multiple restaurant locations"
      }
    ],
    team: [
      { id: 10, name: "Emma Stone", role: "Product Manager", avatar: "ES", color: "bg-teal-500" },
      { id: 11, name: "Bob Taylor", role: "Backend Developer", avatar: "BT", color: "bg-emerald-500" },
      { id: 12, name: "Chris Wong", role: "Full Stack Developer", avatar: "CW", color: "bg-rose-500" }
    ]
  },

  "hajime-illustration": {
    id: 5,
    name: "Hajime Illustration",
    slug: "hajime-illustration",
    color: "from-yellow-400 to-yellow-600",
    icon: "H",
    description: "Character illustration and animation project",
    status: "In Progress",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    progress: 70,
    stats: {
      totalTasks: 16,
      assignedTasks: 16,
      incompleteTasks: 8,
      completedTasks: 7,
      overdueTasks: 1
    },
    tasks: [
      {
        id: 66,
        name: "Character Concept Art",
        assignee: "Amy Chen",
        dueDate: "2024-02-05",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Initial character design concepts and sketches"
      },
      {
        id: 67,
        name: "Style Guide Creation",
        assignee: "Ray Lopez",
        dueDate: "2024-02-08",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Art style guidelines and color palette"
      },
      {
        id: 68,
        name: "Main Character Design",
        assignee: "Amy Chen",
        dueDate: "2024-02-12",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Finalized main character illustration"
      },
      {
        id: 69,
        name: "Supporting Characters",
        assignee: "Ray Lopez",
        dueDate: "2024-02-15",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Secondary character designs"
      },
      {
        id: 70,
        name: "Background Environments",
        assignee: "Yuki Tanaka",
        dueDate: "2024-02-20",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Environmental background illustrations"
      },
      {
        id: 71,
        name: "Character Expressions",
        assignee: "Amy Chen",
        dueDate: "2024-02-25",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Facial expressions and emotion variants"
      },
      {
        id: 72,
        name: "Props and Objects",
        assignee: "Ray Lopez",
        dueDate: "2024-03-01",
        status: "Completed",
        progress: 100,
        priority: "low",
        description: "Interactive objects and prop designs"
      },
      {
        id: 73,
        name: "Animation Keyframes",
        assignee: "Yuki Tanaka",
        dueDate: "2024-03-05",
        status: "In Progress",
        progress: 80,
        priority: "high",
        description: "Key animation frames for character movement"
      },
      {
        id: 74,
        name: "Walk Cycle Animation",
        assignee: "Amy Chen",
        dueDate: "2024-03-10",
        status: "In Progress",
        progress: 60,
        priority: "high",
        description: "Character walking animation loop"
      },
      {
        id: 75,
        name: "Idle Animations",
        assignee: "Ray Lopez",
        dueDate: "2024-03-15",
        status: "In Progress",
        progress: 40,
        priority: "medium",
        description: "Character idle state animations"
      },
      {
        id: 76,
        name: "Special Effects",
        assignee: "Yuki Tanaka",
        dueDate: "2024-03-20",
        status: "In Progress",
        progress: 20,
        priority: "medium",
        description: "Visual effects and particle animations"
      },
      {
        id: 77,
        name: "Scene Compositions",
        assignee: "Amy Chen",
        dueDate: "2024-03-25",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Final scene layout and composition"
      },
      {
        id: 78,
        name: "Color Grading",
        assignee: "Ray Lopez",
        dueDate: "2024-04-01",
        status: "To Do",
        progress: 0,
        priority: "low",
        description: "Final color correction and grading"
      },
      {
        id: 79,
        name: "Final Rendering",
        assignee: "Yuki Tanaka",
        dueDate: "2024-04-10",
        status: "Backlog",
        progress: 0,
        priority: "high",
        description: "High-quality final render output"
      },
      {
        id: 80,
        name: "Asset Optimization",
        assignee: "Multiple",
        dueDate: "2024-04-15",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Optimize assets for web and mobile"
      },
      {
        id: 81,
        name: "Client Presentation",
        assignee: "Amy Chen",
        dueDate: "2024-02-22",
        status: "Overdue",
        progress: 50,
        priority: "medium",
        description: "Present illustrations to client for approval"
      }
    ],
    team: [
      { id: 13, name: "Amy Chen", role: "Lead Illustrator", avatar: "AC", color: "bg-violet-500" },
      { id: 14, name: "Ray Lopez", role: "Character Artist", avatar: "RL", color: "bg-amber-500" },
      { id: 15, name: "Yuki Tanaka", role: "Animator", avatar: "YT", color: "bg-sky-500" }
    ]
  },

  "carl-ui-ux": {
    id: 6,
    name: "Carl UI/UX",
    slug: "carl-ui-ux",
    color: "from-indigo-400 to-indigo-600",
    icon: "C",
    description: "Mobile app UI/UX design and user experience optimization",
    status: "Planning",
    startDate: "2024-02-15",
    endDate: "2024-06-15",
    progress: 30,
    stats: {
      totalTasks: 22,
      assignedTasks: 22,
      incompleteTasks: 17,
      completedTasks: 4,
      overdueTasks: 1
    },
    tasks: [
      {
        id: 82,
        name: "User Research Interviews",
        assignee: "Nina Patel",
        dueDate: "2024-02-20",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Conduct user interviews and gather insights"
      },
      {
        id: 83,
        name: "User Journey Mapping",
        assignee: "Jack Wilson",
        dueDate: "2024-02-25",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Map out complete user journey and touchpoints"
      },
      {
        id: 84,
        name: "Persona Development",
        assignee: "Nina Patel",
        dueDate: "2024-03-01",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Create detailed user personas and scenarios"
      },
      {
        id: 85,
        name: "Information Architecture",
        assignee: "Sophie Kim",
        dueDate: "2024-03-05",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "App structure and navigation hierarchy"
      },
      {
        id: 86,
        name: "Low-Fi Wireframes",
        assignee: "Jack Wilson",
        dueDate: "2024-03-10",
        status: "In Progress",
        progress: 75,
        priority: "high",
        description: "Low-fidelity wireframes for all screens"
      },
      {
        id: 87,
        name: "User Flow Diagrams",
        assignee: "Nina Patel",
        dueDate: "2024-03-12",
        status: "In Progress",
        progress: 60,
        priority: "medium",
        description: "Detailed user flow documentation"
      },
      {
        id: 88,
        name: "Design System Planning",
        assignee: "Sophie Kim",
        dueDate: "2024-03-15",
        status: "In Progress",
        progress: 40,
        priority: "high",
        description: "Component library and design token planning"
      },
      {
        id: 89,
        name: "Color Palette Design",
        assignee: "Jack Wilson",
        dueDate: "2024-03-18",
        status: "In Progress",
        progress: 30,
        priority: "medium",
        description: "App color scheme and accessibility testing"
      },
      {
        id: 90,
        name: "Typography System",
        assignee: "Nina Patel",
        dueDate: "2024-03-20",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Typography hierarchy and font selection"
      },
      {
        id: 91,
        name: "Icon Design",
        assignee: "Sophie Kim",
        dueDate: "2024-03-25",
        status: "To Do",
        progress: 0,
        priority: "low",
        description: "Custom icon set for app interface"
      },
      {
        id: 92,
        name: "High-Fi Mockups",
        assignee: "Jack Wilson",
        dueDate: "2024-04-01",
        status: "To Do",
        progress: 0,
        priority: "high",
        description: "High-fidelity screen mockups"
      },
      {
        id: 93,
        name: "Onboarding Flow",
        assignee: "Nina Patel",
        dueDate: "2024-04-05",
        status: "To Do",
        progress: 0,
        priority: "high",
        description: "New user onboarding experience design"
      },
      {
        id: 94,
        name: "Navigation Design",
        assignee: "Sophie Kim",
        dueDate: "2024-04-08",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "App navigation and menu systems"
      },
      {
        id: 95,
        name: "Form Design",
        assignee: "Jack Wilson",
        dueDate: "2024-04-12",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Input forms and data entry interfaces"
      },
      {
        id: 96,
        name: "Micro-interactions",
        assignee: "Nina Patel",
        dueDate: "2024-04-15",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Subtle animations and interaction feedback"
      },
      {
        id: 97,
        name: "Prototype Creation",
        assignee: "Sophie Kim",
        dueDate: "2024-04-20",
        status: "Backlog",
        progress: 0,
        priority: "high",
        description: "Interactive prototype for testing"
      },
      {
        id: 98,
        name: "Usability Testing",
        assignee: "Multiple",
        dueDate: "2024-04-25",
        status: "Backlog",
        progress: 0,
        priority: "high",
        description: "User testing sessions and feedback collection"
      },
      {
        id: 99,
        name: "Accessibility Audit",
        assignee: "Jack Wilson",
        dueDate: "2024-05-01",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Accessibility compliance review"
      },
      {
        id: 100,
        name: "Design Handoff",
        assignee: "Nina Patel",
        dueDate: "2024-05-10",
        status: "Backlog",
        progress: 0,
        priority: "high",
        description: "Developer handoff documentation"
      },
      {
        id: 101,
        name: "Style Guide Creation",
        assignee: "Sophie Kim",
        dueDate: "2024-05-15",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Comprehensive style guide documentation"
      },
      {
        id: 102,
        name: "Design QA",
        assignee: "Jack Wilson",
        dueDate: "2024-06-01",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Final design quality assurance review"
      },
      {
        id: 103,
        name: "Competitive Analysis",
        assignee: "Nina Patel",
        dueDate: "2024-03-08",
        status: "Overdue",
        progress: 20,
        priority: "medium",
        description: "Analysis of competitor apps and features"
      }
    ],
    team: [
      { id: 16, name: "Nina Patel", role: "UX Researcher", avatar: "NP", color: "bg-slate-500" },
      { id: 17, name: "Jack Wilson", role: "UI Designer", avatar: "JW", color: "bg-stone-500" },
      { id: 18, name: "Sophie Kim", role: "Product Designer", avatar: "SK", color: "bg-zinc-500" }
    ]
  },

  "the-run-branding-graphic": {
    id: 7,
    name: "The Run Branding & Graphic",
    slug: "the-run-branding-graphic",
    color: "from-orange-400 to-orange-600",
    icon: "T",
    description: "Complete branding and graphic design for athletic brand",
    status: "Active",
    startDate: "2024-01-05",
    endDate: "2024-04-05",
    progress: 40,
    stats: {
      totalTasks: 25,
      assignedTasks: 25,
      incompleteTasks: 18,
      completedTasks: 6,
      overdueTasks: 1
    },
    tasks: [
      {
        id: 104,
        name: "Brand Strategy Research",
        assignee: "Carlos Garcia",
        dueDate: "2024-01-10",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Athletic market research and brand positioning"
      },
      {
        id: 105,
        name: "Logo Concepts",
        assignee: "Maria Santos",
        dueDate: "2024-01-15",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Initial logo design concepts and variations"
      },
      {
        id: 106,
        name: "Brand Colors",
        assignee: "Carlos Garcia",
        dueDate: "2024-01-20",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Athletic brand color palette development"
      },
      {
        id: 107,
        name: "Typography Selection",
        assignee: "Alex Rivera",
        dueDate: "2024-01-25",
        status: "Completed",
        progress: 100,
        priority: "medium",
        description: "Sports-focused typography system"
      },
      {
        id: 108,
        name: "Logo Refinement",
        assignee: "Maria Santos",
        dueDate: "2024-02-01",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Final logo design and variations"
      },
      {
        id: 109,
        name: "Brand Guidelines",
        assignee: "Carlos Garcia",
        dueDate: "2024-02-05",
        status: "Completed",
        progress: 100,
        priority: "high",
        description: "Comprehensive brand usage guidelines"
      },
      {
        id: 110,
        name: "Athletic Apparel Mockups",
        assignee: "Maria Santos",
        dueDate: "2024-02-10",
        status: "In Progress",
        progress: 80,
        priority: "high",
        description: "T-shirts, jerseys, and athletic wear designs"
      },
      {
        id: 111,
        name: "Shoe Design Graphics",
        assignee: "Alex Rivera",
        dueDate: "2024-02-15",
        status: "In Progress",
        progress: 65,
        priority: "medium",
        description: "Athletic footwear graphic elements"
      },
      {
        id: 112,
        name: "Equipment Branding",
        assignee: "Carlos Garcia",
        dueDate: "2024-02-20",
        status: "In Progress",
        progress: 45,
        priority: "medium",
        description: "Sports equipment and gear branding"
      },
      {
        id: 113,
        name: "Marketing Materials",
        assignee: "Maria Santos",
        dueDate: "2024-02-25",
        status: "In Progress",
        progress: 30,
        priority: "high",
        description: "Promotional posters and advertisements"
      },
      {
        id: 114,
        name: "Social Media Templates",
        assignee: "Alex Rivera",
        dueDate: "2024-03-01",
        status: "In Progress",
        progress: 25,
        priority: "medium",
        description: "Instagram and social media post templates"
      },
      {
        id: 115,
        name: "Website Mockups",
        assignee: "Carlos Garcia",
        dueDate: "2024-03-05",
        status: "To Do",
        progress: 0,
        priority: "high",
        description: "E-commerce website design mockups"
      },
      {
        id: 116,
        name: "Packaging Design",
        assignee: "Maria Santos",
        dueDate: "2024-03-10",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Product packaging and box designs"
      },
      {
        id: 117,
        name: "Store Signage",
        assignee: "Alex Rivera",
        dueDate: "2024-03-15",
        status: "To Do",
        progress: 0,
        priority: "low",
        description: "Retail store signage and displays"
      },
      {
        id: 118,
        name: "Vehicle Graphics",
        assignee: "Carlos Garcia",
        dueDate: "2024-03-20",
        status: "To Do",
        progress: 0,
        priority: "low",
        description: "Delivery van and vehicle branding"
      },
      {
        id: 119,
        name: "Event Materials",
        assignee: "Maria Santos",
        dueDate: "2024-03-25",
        status: "To Do",
        progress: 0,
        priority: "medium",
        description: "Sports event banners and materials"
      },
      {
        id: 120,
        name: "Mobile App Icons",
        assignee: "Alex Rivera",
        dueDate: "2024-04-01",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Mobile application icon design"
      },
      {
        id: 121,
        name: "Brand Animation",
        assignee: "Carlos Garcia",
        dueDate: "2024-04-05",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Animated logo and brand elements"
      },
      {
        id: 122,
        name: "Print Advertisements",
        assignee: "Maria Santos",
        dueDate: "2024-04-10",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Magazine and print advertising designs"
      },
      {
        id: 123,
        name: "Trade Show Materials",
        assignee: "Alex Rivera",
        dueDate: "2024-04-15",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Trade show booth and display materials"
      },
      {
        id: 124,
        name: "Brand Photography Guide",
        assignee: "Carlos Garcia",
        dueDate: "2024-04-20",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Photography style guide and direction"
      },
      {
        id: 125,
        name: "Digital Style Guide",
        assignee: "Maria Santos",
        dueDate: "2024-04-25",
        status: "Backlog",
        progress: 0,
        priority: "high",
        description: "Digital brand guidelines and assets"
      },
      {
        id: 126,
        name: "Brand Asset Library",
        assignee: "Alex Rivera",
        dueDate: "2024-04-30",
        status: "Backlog",
        progress: 0,
        priority: "medium",
        description: "Organized library of all brand assets"
      },
      {
        id: 127,
        name: "Client Training",
        assignee: "Multiple",
        dueDate: "2024-05-05",
        status: "Backlog",
        progress: 0,
        priority: "low",
        description: "Brand usage training for client team"
      },
      {
        id: 128,
        name: "Market Research Update",
        assignee: "Carlos Garcia",
        dueDate: "2024-02-08",
        status: "Overdue",
        progress: 40,
        priority: "medium",
        description: "Updated competitive analysis and trends"
      }
    ],
    team: [
      { id: 19, name: "Carlos Garcia", role: "Brand Strategist", avatar: "CG", color: "bg-red-500" },
      { id: 20, name: "Maria Santos", role: "Graphic Designer", avatar: "MS", color: "bg-blue-500" },
      { id: 21, name: "Alex Rivera", role: "Creative Director", avatar: "AR", color: "bg-green-500" }
    ]
  }
};

// Get project by slug
export const getProjectBySlug = (slug) => {
  return projectsData[slug] || null;
};

// Get all projects
export const getAllProjects = () => {
  return Object.values(projectsData);
};

// Get tasks by status for Kanban view
export const getTasksByStatus = (tasks) => {
  return {
    backlog: tasks.filter(task => task.status === "Backlog"),
    todo: tasks.filter(task => task.status === "To Do"),
    inProgress: tasks.filter(task => task.status === "In Progress"),
    inReview: tasks.filter(task => task.status === "In Review"),
    completed: tasks.filter(task => task.status === "Completed" || task.status === "Done"),
    overdue: tasks.filter(task => task.status === "Overdue")
  };
};

// Get tasks for calendar view (by date)
export const getTasksByDate = (tasks) => {
  const tasksByDate = {};
  tasks.forEach(task => {
    const date = task.dueDate.split(' ')[0]; // Get date part only
    if (!tasksByDate[date]) {
      tasksByDate[date] = [];
    }
    tasksByDate[date].push(task);
  });
  return tasksByDate;
};

// Update task status (for drag and drop functionality)
export const updateProjectTaskStatus = (projectSlug, taskId, newStatus) => {
  if (projectsData[projectSlug]) {
    const task = projectsData[projectSlug].tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      // Update progress based on status
      if (newStatus === "Completed" || newStatus === "Done") {
        task.progress = 100;
      } else if (newStatus === "In Progress") {
        task.progress = Math.max(task.progress, 25);
      } else if (newStatus === "To Do") {
        task.progress = Math.max(task.progress, 0);
      } else if (newStatus === "Backlog") {
        task.progress = 0;
      }
    }
  }
};