import { Card, Table, EmptyState, Button } from "../../../../components/ui";
import { Plus, TrendingUp } from "lucide-react";

export default function LeadsListView({
  filteredLeads,
  leadColumnsTable,
  selectedLeads,
  setSelectedLeads,
  searchQuery,
  setSearchQuery,
  setIsModalOpen,
}) {
  return (
    <div>
      <Card glass={true}>
        {filteredLeads.length > 0 ? (
          <Table
            columns={leadColumnsTable}
            data={filteredLeads}
            selectable
            selectedRows={selectedLeads}
            onSelectRow={(id, selected) => {
              if (selected) {
                setSelectedLeads([...selectedLeads, id]);
              } else {
                setSelectedLeads(selectedLeads.filter((item) => item !== id));
              }
            }}
            onSelectAll={(selected) => {
              if (selected) {
                setSelectedLeads(filteredLeads.map((lead) => lead.id));
              } else {
                setSelectedLeads([]);
              }
            }}
            className="min-w-[1600px]"
          />
        ) : (
          <div className="p-8 text-center">
            <EmptyState
              icon={TrendingUp}
              title="No leads found"
              description={
                searchQuery.trim()
                  ? `No leads match your search "${searchQuery}"`
                  : `No leads found for the selected status`
              }
              action={
                searchQuery.trim() ? (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                )
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
}
