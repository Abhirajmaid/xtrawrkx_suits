import { Table, EmptyState, Button } from "../../../../components/ui";
import { Plus, Target } from "lucide-react";

export default function DealsListView({
  filteredDeals,
  dealColumnsTable,
  selectedDeals,
  setSelectedDeals,
  searchQuery,
  setSearchQuery,
  onAddClick,
  onRowClick,
  pagination,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      {filteredDeals.length > 0 ? (
        <>
        <Table
          columns={dealColumnsTable}
          data={filteredDeals}
          selectable
          selectedRows={selectedDeals}
          onSelectRow={(id, selected) => {
            if (selected) {
              setSelectedDeals([...selectedDeals, id]);
            } else {
              setSelectedDeals(selectedDeals.filter((item) => item !== id));
            }
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedDeals(filteredDeals.map((deal) => deal.id));
            } else {
              setSelectedDeals([]);
            }
          }}
          onRowClick={onRowClick}
          className="min-w-[1800px]"
        />
          {pagination}
        </>
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-12 text-center">
          <EmptyState
            icon={Target}
            title="No deals found"
            description={
              searchQuery?.trim()
                ? `No deals match your search "${searchQuery}"`
                : `No deals found for the selected status`
            }
            action={
              searchQuery?.trim() ? (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              ) : (
                <Button
                  onClick={onAddClick}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deal
                </Button>
              )
            }
          />
        </div>
      )}
    </div>
  );
}
