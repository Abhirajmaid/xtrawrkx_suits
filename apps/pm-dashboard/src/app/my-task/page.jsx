"use client";

import {
  Plus,
  Calendar,
  Columns,
  Filter,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  CheckSquare,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Card } from "@xtrawrkx/ui";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMyTasksKanbanDragDrop, getMyTasksDropZoneClass, getMyTasksTaskCardClass } from "./my-tasks-drag-drop";
import TaskContextMenu from "../../components/TaskContextMenu";
import TaskDateModal from "../../components/TaskDateModal";
import Header from "../../components/Header";

export default function MyTasks() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("table");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // January 2024
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'Task Name', 'Project', 'Assignee', 'Due Date', 'Status', 'Progress'
  ]);
  const [filters, setFilters] = useState({
    status: 'all',
    project: 'all',
    assignee: 'all'
  });

  // Refs for dropdowns
  const columnsMenuRef = useRef(null);
  const filterMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target)) {
        setShowColumnsMenu(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null
  });

  // Task date modal state
  const [taskDateModal, setTaskDateModal] = useState({
    isOpen: false,
    selectedDate: null
  });

  // Mock data for tasks - will be filtered based on current month
  const allTasks = [
    // January 2024 tasks
    {
      id: 1,
      name: "Logo Moodboard & Sketch",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T"
      },
      assignee: "Multiple",
      dueDate: "Jan 1 2024",
      time: null,
      status: "In Progress",
      progress: 15,
      hasMultipleAssignees: true,
      borderColor: "border-green-400"
    },
    {
      id: 2,
      name: "Logo Finalization",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T"
      },
      assignee: "Multiple",
      dueDate: "Jan 4 2024",
      time: null,
      status: "In Progress",
      progress: 25,
      hasMultipleAssignees: true,
      borderColor: "border-green-400"
    },
    {
      id: 3,
      name: "Brand Guide",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T"
      },
      assignee: "Multiple",
      dueDate: "Jan 5 2024",
      time: null,
      status: "In Progress",
      progress: 30,
      hasMultipleAssignees: true,
      borderColor: "border-green-400"
    },
    
    // Week 2 (Jan 7 - Jan 13)
    {
      id: 4,
      name: "Social Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H"
      },
      assignee: "You",
      dueDate: "Jan 8 2024",
      time: null,
      status: "In Progress",
      progress: 20,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 5,
      name: "Ads Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H"
      },
      assignee: "You",
      dueDate: "Jan 8 2024",
      time: null,
      status: "In Progress",
      progress: 40,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 6,
      name: "Point of Sell",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R"
      },
      assignee: "You",
      dueDate: "Jan 9 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 7,
      name: "Banner Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H"
      },
      assignee: "You",
      dueDate: "Jan 10 2024",
      time: null,
      status: "In Progress",
      progress: 35,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 8,
      name: "Resto Management Dash...",
      project: {
        name: "Resto Dashboard",
        color: "from-blue-400 to-blue-600",
        icon: "R"
      },
      assignee: "You",
      dueDate: "Jan 12 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 9,
      name: "First Draft",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C"
      },
      assignee: "You",
      dueDate: "Jan 12 2024",
      time: null,
      status: "To Do",
      progress: 5,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400"
    },
    
    // Week 3 (Jan 14 - Jan 20)
    {
      id: 10,
      name: "Online Order Flow",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R"
      },
      assignee: "You",
      dueDate: "Jan 15 2024",
      time: null,
      status: "In Progress",
      progress: 45,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 11,
      name: "Landing Page Options",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C"
      },
      assignee: "You",
      dueDate: "Jan 15 2024",
      time: null,
      status: "In Progress",
      progress: 25,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 12,
      name: "Landing Page",
      project: {
        name: "Mogo Web Design",
        color: "from-yellow-400 to-yellow-600",
        icon: "M"
      },
      assignee: "You",
      dueDate: "Jan 17 2024",
      time: null,
      status: "In Progress",
      progress: 60,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 13,
      name: "Table Management Flow",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R"
      },
      assignee: "You",
      dueDate: "Jan 18 2024",
      time: null,
      status: "In Progress",
      progress: 55,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    
    // Week 4 (Jan 21 - Jan 27)
    {
      id: 14,
      name: "Logo Options",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T"
      },
      assignee: "Multiple",
      dueDate: "Jan 22 2024",
      time: null,
      status: "In Progress",
      progress: 40,
      hasMultipleAssignees: true,
      borderColor: "border-green-400"
    },
    {
      id: 15,
      name: "Homepage",
      project: {
        name: "Mogo Web Design",
        color: "from-yellow-400 to-yellow-600",
        icon: "M"
      },
      assignee: "You",
      dueDate: "Jan 23 2024",
      time: null,
      status: "In Review",
      progress: 100,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 16,
      name: "Brand Guide Deck",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y"
      },
      assignee: "Multiple",
      dueDate: "Jan 25 2024",
      time: null,
      status: "Done",
      progress: 100,
      hasMultipleAssignees: true,
      borderColor: "border-green-400"
    },
    {
      id: 17,
      name: "Web Mockup",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y"
      },
      assignee: "You",
      dueDate: "Jan 25 2024",
      time: "19:00",
      status: "In Progress",
      progress: 60,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400"
    },
    {
      id: 18,
      name: "Resto Dashboard",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R"
      },
      assignee: "You",
      dueDate: "Jan 26 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400"
    },
    
    // Week 5 (Jan 28 - Feb 3)
    {
      id: 19,
      name: "Hero Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H"
      },
      assignee: "You",
      dueDate: "Jan 29 2024",
      time: null,
      status: "In Progress",
      progress: 20,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 20,
      name: "Landing Page Options",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C"
      },
      assignee: "You",
      dueDate: "Jan 30 2024",
      time: null,
      status: "To Do",
      progress: 5,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400"
    },
    {
      id: 21,
      name: "Onboarding Flow",
      project: {
        name: "Futurework",
        color: "from-blue-400 to-blue-600",
        icon: "F"
      },
      assignee: "Multiple",
      dueDate: "Jan 21 2024",
      time: "9:00",
      status: "In Progress",
      progress: 15,
      hasMultipleAssignees: true,
      borderColor: "border-orange-400"
    },
    {
      id: 22,
      name: "Mid Month Review",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y"
      },
      assignee: "You",
      dueDate: "Jan 22 2024",
      time: null,
      status: "In Review",
      progress: 100,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400"
    },
    {
      id: 23,
      name: "Brand Guide Deck",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y"
      },
      assignee: "Multiple",
      dueDate: "Jan 25 2024",
      time: null,
      status: "Done",
      progress: 100,
      hasMultipleAssignees: true,
      borderColor: "border-green-400"
    },
    {
      id: 24,
      name: "Web Mockup",
      project: {
        name: "Yellow Branding",
        color: "from-blue-400 to-blue-600",
        icon: "Y"
      },
      assignee: "You",
      dueDate: "Jan 25 2024",
      time: "19:00",
      status: "In Progress",
      progress: 60,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400"
    },
    {
      id: 25,
      name: "Resto Dashboard",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R"
      },
      assignee: "You",
      dueDate: "Jan 26 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400"
    },
    {
      id: 26,
      name: "Hero Illustration",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H"
      },
      assignee: "You",
      dueDate: "Jan 29 2024",
      time: null,
      status: "In Progress",
      progress: 20,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 27,
      name: "Landing Page Options",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C"
      },
      assignee: "You",
      dueDate: "Jan 30 2024",
      time: null,
      status: "To Do",
      progress: 5,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400"
    },
    {
      id: 28,
      name: "Onboarding Flow",
      project: {
        name: "Futurework",
        color: "from-blue-400 to-blue-600",
        icon: "F"
      },
      assignee: "Multiple",
      dueDate: "Jan 31 2024",
      time: "9:00",
      status: "In Progress",
      progress: 15,
      hasMultipleAssignees: true,
      borderColor: "border-orange-400"
    },
    
    // February 2024 tasks (leap year - 29 days)
    {
      id: 29,
      name: "February Planning",
      project: {
        name: "Futurework",
        color: "from-blue-400 to-blue-600",
        icon: "F"
      },
      assignee: "You",
      dueDate: "Feb 1 2024",
      time: null,
      status: "To Do",
      progress: 0,
      hasMultipleAssignees: false,
      borderColor: "border-blue-400"
    },
    {
      id: 30,
      name: "Leap Year Project",
      project: {
        name: "The Run Branding & Graphic",
        color: "from-green-400 to-green-600",
        icon: "T"
      },
      assignee: "You",
      dueDate: "Feb 29 2024",
      time: null,
      status: "In Progress",
      progress: 25,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    
    // March 2024 tasks (31 days)
    {
      id: 31,
      name: "March Kickoff",
      project: {
        name: "Mogo Web Design",
        color: "from-yellow-400 to-yellow-600",
        icon: "M"
      },
      assignee: "You",
      dueDate: "Mar 1 2024",
      time: null,
      status: "To Do",
      progress: 0,
      hasMultipleAssignees: false,
      borderColor: "border-yellow-400"
    },
    {
      id: 32,
      name: "End of March",
      project: {
        name: "Carl UI/UX",
        color: "from-orange-400 to-orange-600",
        icon: "C"
      },
      assignee: "You",
      dueDate: "Mar 31 2024",
      time: null,
      status: "In Progress",
      progress: 50,
      hasMultipleAssignees: false,
      borderColor: "border-orange-400"
    },
    
    // April 2024 tasks (30 days)
    {
      id: 33,
      name: "April Showers",
      project: {
        name: "Hajime Illustration",
        color: "from-green-400 to-green-600",
        icon: "H"
      },
      assignee: "You",
      dueDate: "Apr 1 2024",
      time: null,
      status: "To Do",
      progress: 0,
      hasMultipleAssignees: false,
      borderColor: "border-green-400"
    },
    {
      id: 34,
      name: "April End",
      project: {
        name: "Resto Dashboard",
        color: "from-pink-400 to-pink-600",
        icon: "R"
      },
      assignee: "You",
      dueDate: "Apr 30 2024",
      time: null,
      status: "In Progress",
      progress: 75,
      hasMultipleAssignees: false,
      borderColor: "border-pink-400"
    }
  ];

  // Filter tasks based on current month
  const getTasksForCurrentMonth = () => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();
    
    return allTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getFullYear() === currentYear && taskDate.getMonth() === currentMonthNum;
    });
  };

  const tasks = getTasksForCurrentMonth();

  // Initialize drag and drop functionality
  const {
    tasks: draggableTasks,
    draggedTask,
    draggedOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getKanbanColumns
  } = useMyTasksKanbanDragDrop(tasks);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Review":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Done":
        return "bg-green-100 text-green-700 border-green-200";
      case "To Do":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Backlog":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleNewTask = () => {
    // Navigate to new task creation or open modal
    console.log('Creating new task...');
    // You can implement task creation modal here
  };

  const handleDateChange = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Handle context menu
  const handleContextMenuOpen = (event, task) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      position: {
        x: rect.right - 180, // Offset to the left of the button (reduced for smaller menu)
        y: rect.top + rect.height / 2
      },
      task
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      task: null
    });
  };

  // Handle task date modal
  const handleDateClick = (date) => {
    setTaskDateModal({
      isOpen: true,
      selectedDate: date
    });
  };

  const handleDateModalClose = () => {
    setTaskDateModal({
      isOpen: false,
      selectedDate: null
    });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getTasksForDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth(); // 0-based
    const year = date.getFullYear();
    
    // Show tasks for the current month and year
    if (month !== currentMonth.getMonth() || year !== currentMonth.getFullYear()) return [];
    
    return draggableTasks.filter(task => {
      const taskDay = parseInt(task.dueDate.split(' ')[1]);
      return taskDay === day;
    });
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Calculate the start date for the calendar grid (first Sunday of the week containing the 1st)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate exactly 6 weeks (42 days) to ensure we cover all possible month layouts
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Helper function to check if a year is a leap year
    const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    // Get the correct number of days in the month
    const getDaysInMonth = (year, month) => {
      const daysInMonthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month === 1 && isLeapYear(year)) { // February in leap year
        return 29;
      }
      return daysInMonthArray[month];
    };

    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-full">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-brand-text-light" />
            </button>
            <h2 className="text-lg font-semibold text-brand-foreground">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-brand-text-light" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 w-full">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-brand-text-light">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            const dayTasks = getTasksForDate(date);
            const dayNumber = date.getDate();
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-1.5 border border-white/10 rounded-lg ${
                  isCurrentMonth ? 'bg-white/5' : 'bg-white/2'
                } ${isToday ? 'ring-2 ring-brand-primary' : ''} hover:bg-white/10 transition-colors relative group`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-brand-foreground' : 'text-brand-text-muted'
                }`}>
                  {dayNumber}
                </div>
                
                {/* Tasks for this date */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className={`p-1.5 rounded border-l-2 ${task.borderColor} bg-white/10 backdrop-blur-sm text-xs`}
                    >
                      <div className="font-medium text-brand-foreground truncate text-xs">
                        {task.name}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {task.hasMultipleAssignees ? (
                          <div className="flex -space-x-1">
                            <div className="w-3 h-3 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-xs border border-white/20">
                              <User className="w-1.5 h-1.5" />
                            </div>
                            <div className="w-3 h-3 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-xs border border-white/20">
                              <User className="w-1.5 h-1.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-3 h-3 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-xs">
                            <User className="w-1.5 h-1.5" />
                          </div>
                        )}
                        <div
                          className={`w-2 h-2 bg-gradient-to-br ${task.project.color} rounded-sm`}
                        ></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show More link for dates with more than 2 tasks */}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-brand-primary hover:text-brand-secondary cursor-pointer">
                      +{dayTasks.length - 2}
                    </div>
                  )}
                  
                  {/* Add task button for empty dates */}
                  {dayTasks.length === 0 && isCurrentMonth && (
                    <button className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                      <Plus className="w-2.5 h-2.5 text-brand-text-light" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTableView = () => (
    <Card glass={true} className="overflow-hidden w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand-primary bg-white/10 border-white/20 rounded focus:ring-brand-primary focus:ring-2"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-brand-text-light uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-left">
                {/* Empty header for actions */}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {draggableTasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-white/5 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-brand-primary bg-white/10 border-white/20 rounded focus:ring-brand-primary focus:ring-2"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-brand-foreground">
                    {task.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 bg-gradient-to-br ${task.project.color} rounded-lg flex items-center justify-center shadow-sm`}
                    >
                      <span className="text-white font-bold text-sm">
                        {task.project.icon}
                      </span>
                    </div>
                    <span className="text-sm text-brand-text-light">
                      {task.project.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {task.hasMultipleAssignees ? (
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/20">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/20">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-brand-foreground">
                      {task.assignee}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-text-light" />
                    <div>
                      <span className="text-sm text-brand-foreground">
                        {task.dueDate}
                      </span>
                      {task.time && (
                        <span className="text-xs text-brand-text-muted block">
                          {task.time}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-brand-text-light min-w-[3rem]">
                      {task.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={(e) => handleContextMenuOpen(e, task)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
        <div className="text-sm text-brand-text-light">
          Page 1 of 10
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50">
            <ChevronLeft className="w-4 h-4 text-brand-text-light" />
          </button>
          <button className="px-3 py-2 bg-white/20 text-brand-foreground rounded-lg text-sm font-medium">
            1
          </button>
          <button className="px-3 py-2 hover:bg-white/20 text-brand-text-light hover:text-brand-foreground rounded-lg text-sm font-medium">
            2
          </button>
          <button className="px-3 py-2 hover:bg-white/20 text-brand-text-light hover:text-brand-foreground rounded-lg text-sm font-medium">
            3
          </button>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-brand-text-light" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-text-light">Show</span>
          <select className="px-2 py-1 bg-white/10 border border-white/20 rounded text-sm text-brand-foreground">
            <option>12</option>
            <option>24</option>
            <option>48</option>
          </select>
          <span className="text-sm text-brand-text-light">/page</span>
        </div>
      </div>
    </Card>
  );

  const renderKanbanView = () => {
    const kanbanColumns = getKanbanColumns();

    return (
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(kanbanColumns).map(([columnTitle, column]) => (
          <div 
            key={columnTitle} 
            className={getMyTasksDropZoneClass(columnTitle, draggedOverColumn, draggedTask)}
            onDragOver={(e) => handleDragOver(e, columnTitle)}
            onDragEnter={(e) => handleDragEnter(e, columnTitle)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, columnTitle)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className="font-medium text-gray-800">{columnTitle}</h3>
                <span className="text-sm text-gray-500">{column.tasks.length}</span>
              </div>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className={getMyTasksTaskCardClass(task, draggedTask)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800 text-sm leading-tight">{task.name}</h4>
                    <button 
                      onClick={(e) => handleContextMenuOpen(e, task)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-4 h-4 rounded-md bg-gradient-to-br ${task.project.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {task.project.icon}
                    </div>
                    <span className="text-xs text-gray-600">{task.project.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {task.hasMultipleAssignees ? (
                        <div className="flex -space-x-1">
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                            +
                          </div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                          {task.assignee.charAt(0)}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{task.dueDate}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400">
                      {task.progress}%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${task.borderColor.replace('border-', 'bg-')}`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <Header title="My Tasks" subtitle="Monitor all of your tasks here" />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Filtering and Actions Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Date Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
            <Calendar className="w-4 h-4 text-brand-text-light" />
            <span className="text-sm text-brand-foreground">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <div className="flex flex-col">
              <button onClick={() => handleDateChange('prev')} className="hover:bg-white/20 rounded p-0.5">
                <ChevronUp className="w-3 h-3 text-brand-text-light" />
              </button>
              <button onClick={() => handleDateChange('next')} className="hover:bg-white/20 rounded p-0.5">
                <ChevronDown className="w-3 h-3 text-brand-text-light" />
              </button>
            </div>
          </div>

          {/* Columns Dropdown */}
          <div className="relative" ref={columnsMenuRef}>
            <button
              onClick={() => setShowColumnsMenu(!showColumnsMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Columns className="w-4 h-4 text-brand-text-light" />
              <span className="text-sm text-brand-foreground">Columns</span>
              <ChevronDown className="w-4 h-4 text-brand-text-light" />
            </button>
            
            {showColumnsMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {['Task Name', 'Project', 'Assignee', 'Due Date', 'Status', 'Progress', 'Actions'].map(column => (
                    <label key={column} className="flex items-center gap-2 p-2 hover:bg-white/20 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(column)}
                        onChange={() => handleColumnToggle(column)}
                        className="w-4 h-4 text-brand-primary bg-white/10 border-white/20 rounded focus:ring-brand-primary"
                      />
                      <span className="text-sm text-brand-foreground">{column}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Filter className="w-4 h-4 text-brand-text-light" />
              <span className="text-sm text-brand-foreground">Filter</span>
              <ChevronDown className="w-4 h-4 text-brand-text-light" />
            </button>
            
            {showFilterMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-brand-foreground mb-2 block">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-brand-foreground"
                    >
                      <option value="all">All Status</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="in-review">In Review</option>
                      <option value="done">Done</option>
                      <option value="backlog">Backlog</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-brand-foreground mb-2 block">Project</label>
                    <select
                      value={filters.project}
                      onChange={(e) => handleFilterChange('project', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-brand-foreground"
                    >
                      <option value="all">All Projects</option>
                      <option value="yellow-branding">Yellow Branding</option>
                      <option value="mogo-web">Mogo Web Design</option>
                      <option value="futurework">Futurework</option>
                      <option value="resto-dashboard">Resto Dashboard</option>
                      <option value="hajime-illustration">Hajime Illustration</option>
                      <option value="carl-ui-ux">Carl UI/UX</option>
                      <option value="the-run-branding">The Run Branding</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-brand-foreground mb-2 block">Assignee</label>
                    <select
                      value={filters.assignee}
                      onChange={(e) => handleFilterChange('assignee', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-brand-foreground"
                    >
                      <option value="all">All Assignees</option>
                      <option value="me">Me</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort */}
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          >
            <span className="text-sm text-brand-foreground">Nearest Due Date</span>
            {sortOrder === "asc" ? (
              <ChevronUp className="w-4 h-4 text-brand-text-light" />
            ) : (
              <ChevronDown className="w-4 h-4 text-brand-text-light" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* New Task Button */}
          <button 
            onClick={handleNewTask}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New
          </button>

          {/* More Options */}
          <button className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
            <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
          </button>
        </div>
      </div>

      {/* View Toggle Buttons - Compact Design */}
      <div className="flex items-center justify-start">
        <div className="flex space-x-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setActiveView("table")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeView === "table"
                ? "bg-white/20 text-brand-foreground shadow-sm"
                : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setActiveView("kanban")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeView === "kanban"
                ? "bg-white/20 text-brand-foreground shadow-sm"
                : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10"
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setActiveView("calendar")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeView === "calendar"
                ? "bg-white/20 text-brand-foreground shadow-sm"
                : "text-brand-text-light hover:text-brand-foreground hover:bg-white/10"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

          {/* Content based on active view */}
          <div className="w-full">
            {activeView === "calendar" ? renderCalendar() : 
             activeView === "kanban" ? renderKanbanView() : renderTableView()}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <TaskContextMenu
        isOpen={contextMenu.isOpen}
        onClose={handleContextMenuClose}
        position={contextMenu.position}
        task={contextMenu.task}
      />
    </div>
  );
}