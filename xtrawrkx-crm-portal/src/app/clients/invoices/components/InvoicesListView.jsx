import { Table, EmptyState, Button } from "../../../../components/ui";
import { Plus, FileText } from "lucide-react";

export default function InvoicesListView({
  filteredInvoices,
  invoiceColumnsTable,
  selectedInvoices,
  setSelectedInvoices,
  searchQuery,
  setSearchQuery,
  onAddClick,
  onRowClick,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      {filteredInvoices.length > 0 ? (
        <Table
          columns={invoiceColumnsTable}
          data={filteredInvoices}
          selectable
          selectedRows={selectedInvoices}
          onSelectRow={(id, selected) => {
            if (selected) {
              setSelectedInvoices([...selectedInvoices, id]);
            } else {
              setSelectedInvoices(
                selectedInvoices.filter((item) => item !== id)
              );
            }
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedInvoices(
                filteredInvoices.map((invoice) => invoice.id)
              );
            } else {
              setSelectedInvoices([]);
            }
          }}
          onRowClick={onRowClick}
          className="min-w-[1600px]"
        />
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/30 shadow-xl p-12 text-center">
          <EmptyState
            icon={FileText}
            title="No invoices found"
            description={
              searchQuery.trim()
                ? `No invoices match your search "${searchQuery}"`
                : `No invoices found for the selected status`
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
                  Add Invoice
                </Button>
              )
            }
          />
        </div>
      )}
    </div>
  );
}
