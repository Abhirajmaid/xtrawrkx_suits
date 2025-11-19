"use client";

import { X } from "lucide-react";
import { Button } from "../../../../components/ui";
import { createPortal } from "react-dom";

export default function EditInvoiceModal({
  isOpen,
  onClose,
  onSubmit,
  invoiceFormData,
  setInvoiceFormData,
  clientAccounts,
  isSubmitting,
}) {
  if (typeof window === "undefined" || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Edit Invoice</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Invoice Number - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={invoiceFormData.invoiceNumber}
                onChange={(e) =>
                  setInvoiceFormData({
                    ...invoiceFormData,
                    invoiceNumber: e.target.value,
                  })
                }
                placeholder="Enter invoice number..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                required
              />
            </div>

            {/* Client Account - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Client Account <span className="text-red-500">*</span>
              </label>
              <select
                value={invoiceFormData.account}
                onChange={(e) =>
                  setInvoiceFormData({
                    ...invoiceFormData,
                    account: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors appearance-none cursor-pointer"
                required
              >
                <option value="">Select client account...</option>
                {clientAccounts && clientAccounts.length > 0 ? (
                  clientAccounts.map((account) => (
                    <option key={account.id || account.documentId} value={account.id || account.documentId}>
                      {account.companyName || account.name || "Unknown Account"}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No client accounts available</option>
                )}
              </select>
            </div>

            {/* Issue Date and Due Date - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={invoiceFormData.issueDate}
                  onChange={(e) =>
                    setInvoiceFormData({
                      ...invoiceFormData,
                      issueDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={invoiceFormData.dueDate}
                  onChange={(e) =>
                    setInvoiceFormData({
                      ...invoiceFormData,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Amount and Tax Amount - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={invoiceFormData.amount}
                  onChange={(e) => {
                    const amount = e.target.value;
                    const taxAmount = parseFloat(invoiceFormData.taxAmount) || 0;
                    const totalAmount = (parseFloat(amount) || 0) + taxAmount;
                    setInvoiceFormData({
                      ...invoiceFormData,
                      amount: amount,
                      totalAmount: totalAmount.toFixed(2),
                    });
                  }}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tax Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={invoiceFormData.taxAmount}
                  onChange={(e) => {
                    const taxAmount = e.target.value;
                    const amount = parseFloat(invoiceFormData.amount) || 0;
                    const totalAmount = amount + (parseFloat(taxAmount) || 0);
                    setInvoiceFormData({
                      ...invoiceFormData,
                      taxAmount: taxAmount,
                      totalAmount: totalAmount.toFixed(2),
                    });
                  }}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                />
              </div>
            </div>

            {/* Total Amount - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Total Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={invoiceFormData.totalAmount}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            {/* Status - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={invoiceFormData.status}
                onChange={(e) =>
                  setInvoiceFormData({
                    ...invoiceFormData,
                    status: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors appearance-none cursor-pointer"
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Notes - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                value={invoiceFormData.notes}
                onChange={(e) =>
                  setInvoiceFormData({
                    ...invoiceFormData,
                    notes: e.target.value,
                  })
                }
                placeholder="Additional notes..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white transition-colors"
                rows={3}
              />
            </div>

            {/* Invoice Document - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Invoice Document
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setInvoiceFormData({
                    ...invoiceFormData,
                    file: e.target.files[0],
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload PDF, Word, or image files
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !invoiceFormData.invoiceNumber.trim() ||
                  !invoiceFormData.account ||
                  !invoiceFormData.issueDate ||
                  !invoiceFormData.dueDate ||
                  !invoiceFormData.amount ||
                  isSubmitting
                }
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </div>
                ) : (
                  "Update Invoice"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

