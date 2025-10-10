"use client";

import {
  Card,
  StatCard,
  Badge,
  Button,
  CircularProgress,
  BarChart,
} from "@xtrawrkx/ui";
import {
  Users,
  Briefcase,
  Target,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  User,
} from "lucide-react";

export default function DashboardDemo() {
  // Sample data for the dashboard
  const stats = [
    { title: "Employees", value: "432", icon: Users },
    { title: "Payrolls", value: "24", icon: Briefcase },
    { title: "Turnover Rate", value: "8%", icon: TrendingUp },
    { title: "Job Applicants", value: "24", icon: Target },
  ];

  const chartData = [
    { month: "Jul", value: 20 },
    { month: "Aug", value: 35 },
    { month: "Sep", value: 45 },
    { month: "Oct", value: 55 },
    { month: "Nov", value: 70 },
    { month: "Dec", value: 32 },
  ];

  const employmentData = [
    { label: "Permanent", value: 450, color: "#ffaa44" },
    { label: "Contract", value: 250, color: "#2d2d2d" },
    { label: "Probation", value: 150, color: "#999999" },
  ];

  const leaveTypes = [
    { type: "Annual Leave", days: "12 Days", usage: "2 Days" },
    { type: "Monthly Leave", days: "2 Days", usage: "6 Days" },
    { type: "Daily Leave", days: "8 Days", usage: "5 Days" },
    { type: "Hourly Leave", days: "6 Days", usage: "5 Days" },
    { type: "Sick Leave Used", days: "5 Days", usage: "" },
  ];

  const employees = [
    {
      name: "Marvin McKinney",
      id: "356476746",
      role: "UI Mentor",
      email: "example@gmail.com",
      status: "Active",
      date: "11 Nov 2024",
      department: "Team Project",
    },
    {
      name: "Ralph Edwards",
      id: "36547354",
      role: "UX Researcher",
      email: "example@gmail.com",
      status: "Active",
      date: "10 Nov 2024",
      department: "Public Project",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-light text-brand-foreground tracking-tight">
            Good Morning, Homies
          </h1>
          <p className="text-brand-text-light mt-1">
            It's Wednesday, 11 November 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Calendar className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={index === 0}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Satisfaction */}
        <Card
          title="Employee Satisfaction"
          className="flex flex-col items-center justify-center"
          gradient
        >
          <CircularProgress
            value={80}
            title="Employee Satisfactory"
            size={150}
            strokeWidth={12}
          />
        </Card>

        {/* Schedule */}
        <Card title="Schedule" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-foreground">
                    Interview Candidate UI/UX Designer
                  </h4>
                  <p className="text-sm text-brand-text-light">
                    Project Discussion
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-brand-foreground">
                  15:00 - 13:30
                </p>
                <p className="text-xs text-brand-text-muted">Google Meet</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-foreground">
                    Retro Day Celebration - HR Department
                  </h4>
                  <p className="text-sm text-brand-text-light">
                    Arrangement Plan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-brand-foreground">
                  15:00 - 16:00
                </p>
                <p className="text-xs text-brand-text-muted">Google Meet</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Team KPI Chart */}
        <Card
          title="Average Team KPI"
          subtitle="70.32%"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <BarChart
              data={chartData}
              dataKey="value"
              nameKey="month"
              height={200}
              color="#ffaa44"
            />
          </div>
        </Card>

        {/* Employment Status */}
        <Card title="Employment Status">
          <div className="space-y-4">
            {employmentData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-brand-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-brand-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Leave Types */}
        <Card title="" className="lg:col-span-3">
          <div className="grid grid-cols-5 gap-4 mb-6">
            {leaveTypes.map((leave, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-brand-text-muted mb-1">
                  {leave.type}
                </p>
                <p className="text-lg font-bold text-brand-foreground">
                  {leave.days}
                </p>
                {leave.usage && (
                  <p className="text-xs text-brand-text-light">{leave.usage}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Employee List */}
        <Card title="List Employee" className="lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left py-3 text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="text-left py-3 text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                    EMPLOYEE ID
                  </th>
                  <th className="text-left py-3 text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                    ROLE
                  </th>
                  <th className="text-left py-3 text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="text-left py-3 text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left py-3 text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="text-left py-3 text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                    DEPARTMENT
                  </th>
                  <th className="text-left py-3 text-xs font-medium text-brand-text-muted uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index} className="border-b border-brand-border/30">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-brand-foreground">
                          {employee.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-brand-text-light">
                      {employee.id}
                    </td>
                    <td className="py-4 text-sm text-brand-text-light">
                      {employee.role}
                    </td>
                    <td className="py-4 text-sm text-brand-text-light">
                      {employee.email}
                    </td>
                    <td className="py-4">
                      <Badge variant="success">{employee.status}</Badge>
                    </td>
                    <td className="py-4 text-sm text-brand-text-light">
                      {employee.date}
                    </td>
                    <td className="py-4 text-sm text-brand-text-light">
                      {employee.department}
                    </td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
