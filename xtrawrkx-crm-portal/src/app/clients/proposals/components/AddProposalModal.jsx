"use client";

import { X } from "lucide-react";
import { Button } from "../../../../components/ui";
import { createPortal } from "react-dom";

export default function AddProposalModal({
  isOpen,
  onClose,
  onSubmit,
  proposalFormData,
  setProposalFormData,
  clientAccounts,
  deals,
  contacts,
  isSubmitting,
}) {
  if (typeof window === "undefined" || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Add Proposal
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Proposal Title - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Proposal Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={proposalFormData.title}
                onChange={(e) =>
                  setProposalFormData({
                    ...proposalFormData,
                    title: e.target.value,
                  })
                }
                placeholder="Enter proposal title..."
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
                value={proposalFormData.clientAccount}
                onChange={(e) =>
                  setProposalFormData({
                    ...proposalFormData,
                    clientAccount: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors appearance-none cursor-pointer"
                required
              >
                <option value="">Select client account...</option>
                {clientAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.companyName || account.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Deal and Contact - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Related Deal
                </label>
                <select
                  value={proposalFormData.deal}
                  onChange={(e) =>
                    setProposalFormData({
                      ...proposalFormData,
                      deal: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select deal (optional)...</option>
                  {deals
                    .filter(
                      (deal) =>
                        deal.clientAccount?.id == proposalFormData.clientAccount ||
                        !proposalFormData.clientAccount
                    )
                    .map((deal) => (
                      <option key={deal.id} value={deal.id}>
                        {deal.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact
                </label>
                <select
                  value={proposalFormData.contact}
                  onChange={(e) =>
                    setProposalFormData({
                      ...proposalFormData,
                      contact: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select contact (optional)...</option>
                  {contacts
                    .filter(
                      (contact) =>
                        contact.clientAccount?.id == proposalFormData.clientAccount ||
                        !proposalFormData.clientAccount
                    )
                    .map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Valid Until and Status - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={proposalFormData.validUntil}
                  onChange={(e) =>
                    setProposalFormData({
                      ...proposalFormData,
                      validUntil: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={proposalFormData.status}
                  onChange={(e) =>
                    setProposalFormData({
                      ...proposalFormData,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors appearance-none cursor-pointer"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="SENT">Sent</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>

            {/* Proposal Content - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Proposal Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={proposalFormData.proposalContent}
                onChange={(e) =>
                  setProposalFormData({
                    ...proposalFormData,
                    proposalContent: e.target.value,
                  })
                }
                placeholder="Enter proposal content and details..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white transition-colors"
                rows={8}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Rich text content for the proposal
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !proposalFormData.title.trim() ||
                  !proposalFormData.proposalContent.trim() ||
                  !proposalFormData.clientAccount ||
                  isSubmitting
                }
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Proposal"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

