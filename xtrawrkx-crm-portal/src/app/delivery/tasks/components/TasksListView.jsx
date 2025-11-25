import { Table, EmptyState, Button } from "../../../../components/ui";
import { Plus, ClipboardList } from "lucide-react";

export default function TasksListView({
  filteredTasks,
  taskColumnsTable,
  selectedTasks,
  setSelectedTasks,
  searchQuery,
  setSearchQuery,
  onAddClick,
  onRowClick,
}) {
  return (
    <div className="rounded-3xl overflow-hidden ">
      {filteredTasks.length > 0 ? (
        <Table
          columns={taskColumnsTable}
          data={filteredTasks}
          onRowClick={onRowClick}
          className="min-w-[1600px]"
        />
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-12 text-center">
          <EmptyState
            icon={ClipboardList}
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
                  onClick={onAddClick}
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
