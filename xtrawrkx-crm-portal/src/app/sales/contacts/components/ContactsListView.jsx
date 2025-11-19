import { Table, EmptyState, Button } from "../../../../components/ui";
import { Plus, User } from "lucide-react";

export default function ContactsListView({
  filteredContacts,
  contactColumnsTable,
  selectedContacts,
  setSelectedContacts,
  searchQuery,
  setSearchQuery,
  onAddClick,
  onRowClick,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      {filteredContacts.length > 0 ? (
        <Table
          columns={contactColumnsTable}
          data={filteredContacts}
          selectable
          selectedRows={selectedContacts}
          onSelectRow={(id, selected) => {
            if (selected) {
              setSelectedContacts([...selectedContacts, id]);
            } else {
              setSelectedContacts(
                selectedContacts.filter((item) => item !== id)
              );
            }
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedContacts(
                filteredContacts.map((contact) => contact.id)
              );
            } else {
              setSelectedContacts([]);
            }
          }}
          onRowClick={onRowClick}
          className="min-w-[1400px]"
        />
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-12 text-center">
          <EmptyState
            icon={User}
            title="No contacts found"
            description={
              searchQuery.trim()
                ? `No contacts match your search "${searchQuery}"`
                : `No contacts found for the selected status`
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
                  Add Contact
                </Button>
              )
            }
          />
        </div>
      )}
    </div>
  );
}
