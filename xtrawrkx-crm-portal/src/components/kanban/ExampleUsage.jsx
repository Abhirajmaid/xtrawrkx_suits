"use client";

import React from "react";
import { KanbanBoard, KanbanCard } from "./index";
// import { useDragDropBoard } from "../../lib/dragdrop"; // Removed - using react-beautiful-dnd now

/**
 * Example Usage of the Drag-Drop Kanban System
 * 
 * This file demonstrates how to use the reusable drag-drop components
 * in different scenarios throughout the CRM.
 */

// Example 1: Simple Kanban Board
export function SimpleKanbanExample() {
  const initialColumns = [
    {
      id: "todo",
      title: "To Do",
      color: "#f3f4f6",
      items: [
        { id: "1", title: "Task 1", description: "First task" },
        { id: "2", title: "Task 2", description: "Second task" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "#dbeafe",
      items: [
        { id: "3", title: "Task 3", description: "Third task" },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "#d1fae5",
      items: [
        { id: "4", title: "Task 4", description: "Fourth task" },
      ],
    },
  ];

  const handleItemDrop = (item, sourceColumnId, targetColumnId, newIndex) => {
    console.log("Item moved:", {
      item: item.title,
      from: sourceColumnId,
      to: targetColumnId,
      index: newIndex,
    });
    
    // Make API call to update item status
    // fetch(`/api/items/${item.id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: targetColumnId })
    // });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Simple Kanban Example</h2>
      <KanbanBoard
        initialColumns={initialColumns}
        onItemDrop={handleItemDrop}
        onItemClick={(item) => console.log("Item clicked:", item.title)}
        onColumnClick={(column) => console.log("Add item to:", column.title)}
      />
    </div>
  );
}

// Example 2: Custom Card Component
function CustomCard({ item, columnId, itemIndex, isDragging, onDragStart, onDragEnd, onClick }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(item)}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : 'hover:border-brand-primary/50'
      }`}
    >
      <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Priority: {item.priority}</span>
        <span className="text-xs text-gray-500">Due: {item.dueDate}</span>
      </div>
    </div>
  );
}

export function CustomCardExample() {
  const initialColumns = [
    {
      id: "backlog",
      title: "Backlog",
      color: "#f3f4f6",
      items: [
        {
          id: "1",
          title: "Feature Request",
          description: "Add new feature to the system",
          priority: "high",
          dueDate: "2024-02-15",
        },
        {
          id: "2",
          title: "Bug Fix",
          description: "Fix critical bug in payment system",
          priority: "urgent",
          dueDate: "2024-02-10",
        },
      ],
    },
    {
      id: "sprint",
      title: "Current Sprint",
      color: "#dbeafe",
      items: [
        {
          id: "3",
          title: "UI Improvements",
          description: "Enhance user interface components",
          priority: "medium",
          dueDate: "2024-02-20",
        },
      ],
    },
  ];

  const handleItemDrop = (item, sourceColumnId, targetColumnId, newIndex) => {
    console.log("Custom item moved:", {
      item: item.title,
      from: sourceColumnId,
      to: targetColumnId,
      index: newIndex,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Custom Card Example</h2>
      <KanbanBoard
        initialColumns={initialColumns}
        onItemDrop={handleItemDrop}
        cardComponent={CustomCard}
        onItemClick={(item) => console.log("Custom item clicked:", item.title)}
        onColumnClick={(column) => console.log("Add item to:", column.title)}
      />
    </div>
  );
}

// Example 3: Using the Hook Directly
export function HookExample() {
  const initialColumns = [
    {
      id: "stage1",
      title: "Stage 1",
      items: [
        { id: "1", title: "Item 1" },
        { id: "2", title: "Item 2" },
      ],
    },
    {
      id: "stage2",
      title: "Stage 2",
      items: [
        { id: "3", title: "Item 3" },
      ],
    },
  ];

  const {
    columns,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = { columns: initialColumns }; // Temporarily disabled hook

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Hook Example</h2>
      <div className="flex gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-white rounded-xl shadow-card border border-brand-border/50 p-4"
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <h3 className="font-semibold text-gray-900 mb-4">{column.title}</h3>
            <div className="space-y-3">
              {column.items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, column.id, index)}
                  onDragEnd={handleDragEnd}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 transition-colors"
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 4: File Upload Status Board
export function FileUploadBoard() {
  const initialColumns = [
    {
      id: "uploading",
      title: "Uploading",
      color: "#fef3c7",
      items: [
        {
          id: "f1",
          title: "document.pdf",
          description: "Uploading... 45%",
          status: "uploading",
          progress: 45,
        },
      ],
    },
    {
      id: "processing",
      title: "Processing",
      color: "#dbeafe",
      items: [
        {
          id: "f2",
          title: "image.jpg",
          description: "Converting format...",
          status: "processing",
          progress: 100,
        },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      color: "#d1fae5",
      items: [
        {
          id: "f3",
          title: "report.docx",
          description: "Ready for download",
          status: "completed",
          progress: 100,
        },
      ],
    },
  ];

  const handleItemDrop = (item, sourceColumnId, targetColumnId, newIndex) => {
    console.log("File moved:", {
      file: item.title,
      from: sourceColumnId,
      to: targetColumnId,
      index: newIndex,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">File Upload Status Board</h2>
      <KanbanBoard
        initialColumns={initialColumns}
        onItemDrop={handleItemDrop}
        onItemClick={(item) => console.log("File clicked:", item.title)}
        onColumnClick={(column) => console.log("Upload to:", column.title)}
      />
    </div>
  );
}

// Main Example Component
export default function ExampleUsage() {
  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Drag & Drop Kanban Examples
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          These examples demonstrate how to use the reusable drag-drop system
          throughout the CRM for different types of boards and workflows.
        </p>
      </div>
      
      <SimpleKanbanExample />
      <CustomCardExample />
      <HookExample />
      <FileUploadBoard />
    </div>
  );
}
