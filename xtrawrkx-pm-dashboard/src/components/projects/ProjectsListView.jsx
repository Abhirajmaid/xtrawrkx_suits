"use client";

import { Table, EmptyState, Button } from "../ui";
import { Plus, FolderOpen } from "lucide-react";

export default function ProjectsListView({
  filteredProjects,
  projectColumnsTable,
  searchQuery,
  setSearchQuery,
  setIsModalOpen,
  onRowClick,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      {filteredProjects.length > 0 ? (
        <Table
          columns={projectColumnsTable}
          data={filteredProjects}
          onRowClick={onRowClick}
          className="min-w-[1600px]"
          rowPadding="py-4"
        />
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-12 text-center">
          <EmptyState
            icon={FolderOpen}
            title="No projects found"
            description={
              searchQuery.trim()
                ? `No projects match your search "${searchQuery}"`
                : `No projects found for the selected status`
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
                  Add Project
                </Button>
              )
            }
          />
        </div>
      )}
    </div>
  );
}

