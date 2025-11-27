"use client";

import { Table, EmptyState, Button } from "../ui";
import { Plus, CheckSquare } from "lucide-react";

export default function TasksListView({
  filteredTasks,
  taskColumnsTable,
  searchQuery,
  setSearchQuery,
  setIsModalOpen,
  onRowClick,
  selectable = true,
  selectedTaskIds = [],
  onSelectTask,
  onSelectAll,
  bulkActions = null,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      {filteredTasks.length > 0 ? (
        <>
          {bulkActions && selectedTaskIds.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedTaskIds.length} task{selectedTaskIds.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                {bulkActions}
              </div>
            </div>
          )}
          <Table
            columns={taskColumnsTable}
            data={filteredTasks}
            onRowClick={onRowClick}
            className="min-w-[1800px]"
            selectable={selectable}
            selectedRows={selectedTaskIds}
            onSelectRow={onSelectTask}
            onSelectAll={onSelectAll}
          />
        </>
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-12 text-center">
          <EmptyState
            icon={CheckSquare}
            title="No tasks found"
            description={
              searchQuery.trim()
                ? `No tasks match your search "${searchQuery}"`
                : `No tasks found for the selected status`
            }
            action={
              searchQuery.trim() ? (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              ) : (
                <Button
                  onClick={() => setIsModalOpen()}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )
            }
          />
        </div>
      )}
    </div>
  );
}
