import { Table, EmptyState, Button } from "../../../../components/ui";
import { Plus } from "lucide-react";

export default function ProposalsListView({
  filteredProposals,
  proposalColumnsTable,
  selectedProposals,
  setSelectedProposals,
  searchQuery,
  setSearchQuery,
  onAddClick,
  onRowClick,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      {filteredProposals.length > 0 ? (
        <Table
          columns={proposalColumnsTable}
          data={filteredProposals}
          selectable
          selectedRows={selectedProposals}
          onSelectRow={(id, selected) => {
            if (selected) {
              setSelectedProposals([...selectedProposals, id]);
            } else {
              setSelectedProposals(selectedProposals.filter((item) => item !== id));
            }
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedProposals(filteredProposals.map((proposal) => proposal.id));
            } else {
              setSelectedProposals([]);
            }
          }}
          onRowClick={onRowClick}
          className="min-w-[1600px]"
        />
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-12 text-center">
          <EmptyState
            title="No proposals found"
            description={
              searchQuery.trim()
                ? `No proposals match your search "${searchQuery}"`
                : `No proposals found for the selected status`
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
                  Add Proposal
                </Button>
              )
            }
          />
        </div>
      )}
    </div>
  );
}

