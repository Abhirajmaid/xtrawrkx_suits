// Centralized project data and utilities
export const projectsData = [
  {
    id: 1,
    name: "Website Redesign",
    client: "Tech Solutions Inc",
    status: "active",
    priority: "High",
    progress: 65,
    budget: 85000,
    spent: 55250,
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    team: ["John Smith", "Emily Davis", "Michael Chen"],
    tasks: { total: 48, completed: 31 },
    milestones: { total: 4, completed: 2 },
    health: "Good",
    description: "Complete redesign of corporate website with new branding",
    stage: "development"
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "StartUp Hub",
    status: "active",
    priority: "Critical",
    progress: 45,
    budget: 120000,
    spent: 54000,
    startDate: "2024-09-15",
    endDate: "2025-01-15",
    team: ["Sarah Wilson", "Robert Martinez", "Lisa Anderson"],
    tasks: { total: 82, completed: 37 },
    milestones: { total: 6, completed: 2 },
    health: "At Risk",
    description: "Native iOS and Android app development for e-commerce platform",
    stage: "development"
  },
  {
    id: 3,
    name: "Cloud Migration",
    client: "Global Enterprises",
    status: "on-hold",
    priority: "Medium",
    progress: 15,
    budget: 200000,
    spent: 30000,
    startDate: "2024-12-01",
    endDate: "2025-03-31",
    team: ["John Smith", "Emily Davis"],
    tasks: { total: 64, completed: 10 },
    milestones: { total: 5, completed: 0 },
    health: "Good",
    description: "Migrate on-premise infrastructure to AWS cloud",
    stage: "planning"
  },
  {
    id: 4,
    name: "CRM Implementation",
    client: "Innovation Labs",
    status: "completed",
    priority: "High",
    progress: 100,
    budget: 65000,
    spent: 62000,
    startDate: "2024-08-01",
    endDate: "2024-10-15",
    team: ["Michael Chen", "Lisa Anderson"],
    tasks: { total: 35, completed: 35 },
    milestones: { total: 3, completed: 3 },
    health: "Excellent",
    description: "Full CRM system implementation and training",
    stage: "completed"
  },
  {
    id: 5,
    name: "Data Analytics Platform",
    client: "DataCorp",
    status: "active",
    priority: "Medium",
    progress: 80,
    budget: 95000,
    spent: 76000,
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    team: ["Sarah Wilson", "John Smith"],
    tasks: { total: 42, completed: 34 },
    milestones: { total: 4, completed: 3 },
    health: "Good",
    description: "Custom analytics dashboard and reporting system",
    stage: "testing"
  }
];

export const projectStages = [
  { id: "planning", name: "Planning", color: "blue" },
  { id: "development", name: "Development", color: "yellow" },
  { id: "testing", name: "Testing", color: "purple" },
  { id: "deployment", name: "Deployment", color: "orange" },
  { id: "completed", name: "Completed", color: "green" }
];

export const teamMembers = [
  "John Smith", "Emily Davis", "Michael Chen", "Sarah Wilson", 
  "Robert Martinez", "Lisa Anderson", "David Brown", "Jennifer Lee"
];

export const clients = [
  "Tech Solutions Inc", "StartUp Hub", "Global Enterprises", 
  "Innovation Labs", "DataCorp", "Future Systems", "Digital Dynamics"
];

// Helper functions
export const getProjectsByStatus = (status) => {
  if (status === "all") return projectsData;
  return projectsData.filter(project => project.status === status);
};

export const getProjectStats = (projects = projectsData) => {
  const total = projects.length;
  const active = projects.filter(p => p.status === "active").length;
  const completed = projects.filter(p => p.status === "completed").length;
  const onHold = projects.filter(p => p.status === "on-hold").length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  
  return { total, active, completed, onHold, totalBudget, totalSpent };
};

export const searchProjects = (projects, query) => {
  if (!query) return projects;
  return projects.filter(project =>
    project.name.toLowerCase().includes(query.toLowerCase()) ||
    project.client.toLowerCase().includes(query.toLowerCase()) ||
    project.description.toLowerCase().includes(query.toLowerCase())
  );
};

export const filterProjects = (projects, filters) => {
  return projects.filter(project => {
    if (filters.client && project.client !== filters.client) return false;
    if (filters.priority && project.priority !== filters.priority) return false;
    if (filters.health && project.health !== filters.health) return false;
    if (filters.minBudget && project.budget < parseInt(filters.minBudget)) return false;
    if (filters.maxBudget && project.budget > parseInt(filters.maxBudget)) return false;
    return true;
  });
};
