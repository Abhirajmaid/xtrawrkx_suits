"use client";

import React from "react";
import { useParams } from "next/navigation";
import { KanbanBoard, DealsPipeline, ProjectsBoard, TasksBoard } from "../../../components/kanban";

export default function KanbanPage() {
  const { type } = useParams();

  const renderKanbanBoard = () => {
    switch (type) {
      case "deals":
        return <DealsPipeline />;
      case "projects":
        return <ProjectsBoard />;
      case "tasks":
        return <TasksBoard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Board Not Found
            </h2>
            <p className="text-gray-600">
              The requested board type "{type}" is not available.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {renderKanbanBoard()}
    </div>
  );
}
