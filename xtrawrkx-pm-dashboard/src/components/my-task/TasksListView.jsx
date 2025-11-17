"use client";

import { Table } from "../ui";
import { Plus } from "lucide-react";

export default function TasksListView({
  filteredTasks,
  taskColumnsTable,
  selectedTasks,
  setSelectedTasks,
  searchQuery,
  setSearchQuery,
  setIsModalOpen,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      {filteredTasks.length > 0 ? (
        <Table
          columns={taskColumnsTable}
          data={filteredTasks}
          selectable
          selectedRows={selectedTasks}
          onSelectRow={(id, selected) => {
            if (selected) {
              setSelectedTasks([...selectedTasks, id]);
            } else {
              setSelectedTasks(selectedTasks.filter((item) => item !== id));
            }
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedTasks(filteredTasks.map((task) => task.id));
            } else {
              setSelectedTasks([]);
            }
          }}
          className="min-w-[1600px]"
        />
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery.trim()
                ? `No tasks match your search "${searchQuery}"`
                : `No tasks found for the selected status`}
            </p>
            {searchQuery.trim() ? (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen()}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl text-white shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
