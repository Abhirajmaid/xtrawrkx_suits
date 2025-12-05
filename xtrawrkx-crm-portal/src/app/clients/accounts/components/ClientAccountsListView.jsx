import { Table, EmptyState, Button } from "../../../../components/ui";
import { Plus, Building2 } from "lucide-react";

export default function ClientAccountsListView({
  filteredAccounts,
  accountColumnsTable,
  selectedAccounts,
  setSelectedAccounts,
  searchQuery,
  setSearchQuery,
  onAddClick,
  onRowClick,
  pagination,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      {filteredAccounts.length > 0 ? (
        <>
        <Table
          columns={accountColumnsTable}
          data={filteredAccounts}
          selectable
          selectedRows={selectedAccounts}
          onSelectRow={(id, selected) => {
            if (selected) {
              setSelectedAccounts([...selectedAccounts, id]);
            } else {
              setSelectedAccounts(selectedAccounts.filter((item) => item !== id));
            }
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedAccounts(filteredAccounts.map((account) => account.id));
            } else {
              setSelectedAccounts([]);
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
            icon={Building2}
            title="No client accounts found"
            description={
              searchQuery.trim()
                ? `No client accounts match your search "${searchQuery}"`
                : `No client accounts found for the selected status`
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
                  Add Client Account
                </Button>
              )
            }
          />
        </div>
      )}
    </div>
  );
}
