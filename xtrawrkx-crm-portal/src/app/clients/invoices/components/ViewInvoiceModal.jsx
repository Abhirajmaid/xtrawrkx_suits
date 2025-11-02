"use client";

import { X, Download } from "lucide-react";
import { Badge, Button } from "../../../../components/ui";
import { createPortal } from "react-dom";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ViewInvoiceModal({
  isOpen,
  onClose,
  invoice,
}) {
  if (typeof window === "undefined" || !isOpen || !invoice) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Invoice {invoice.invoiceNumber}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Client Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Client Account
              </label>
              <div className="text-gray-900">
                {invoice.clientAccount?.companyName ||
                  invoice.clientAccount?.name ||
                  "N/A"}
              </div>
            </div>

            {/* Issue Date and Due Date - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Issue Date
                </label>
                <div className="text-gray-900">{formatDate(invoice.issueDate)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Due Date
                </label>
                <div className="text-gray-900">{formatDate(invoice.dueDate)}</div>
              </div>
            </div>

            {/* Amount, Tax, and Total - Three Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount
                </label>
                <div className="text-lg font-semibold text-gray-900">
                  ₹{(invoice.amount || 0).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tax Amount
                </label>
                <div className="text-lg font-semibold text-gray-900">
                  ₹{(invoice.taxAmount || 0).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Total Amount
                </label>
                <div className="text-xl font-bold text-gray-900">
                  ₹{(
                    invoice.totalAmount ||
                    invoice.amount ||
                    0
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <div>
                <Badge
                  variant={
                    {
                      DRAFT: "default",
                      SENT: "warning",
                      PAID: "success",
                      OVERDUE: "destructive",
                      CANCELLED: "destructive",
                    }[invoice.status] || "default"
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Notes
                </label>
                <div className="text-gray-900 whitespace-pre-wrap">
                  {invoice.notes}
                </div>
              </div>
            )}

            {/* Files */}
            {invoice.files && invoice.files.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Attached Documents
                </label>
                <div className="space-y-2">
                  {invoice.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-300 rounded-lg"
                    >
                      <span className="text-gray-900">
                        {file.name || `Document ${index + 1}`}
                      </span>
                      {file.url && (
                        <button
                          onClick={() => window.open(file.url, "_blank")}
                          className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4 text-gray-400 hover:text-green-600" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

