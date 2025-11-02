"use client";

import { X } from "lucide-react";
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

export default function ViewProposalModal({
  isOpen,
  onClose,
  proposal,
}) {
  if (typeof window === "undefined" || !isOpen || !proposal) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {proposal.title}
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
                {proposal.clientAccount?.companyName ||
                  proposal.clientAccount?.name ||
                  "N/A"}
              </div>
            </div>

            {/* Deal and Contact - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Related Deal
                </label>
                <div className="text-gray-900">
                  {proposal.deal?.name || "—"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact
                </label>
                <div className="text-gray-900">
                  {proposal.contact
                    ? `${proposal.contact.firstName} ${proposal.contact.lastName}`
                    : "—"}
                </div>
              </div>
            </div>

            {/* Valid Until and Status - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Valid Until
                </label>
                <div className="text-gray-900">
                  {proposal.validUntil
                    ? formatDate(proposal.validUntil)
                    : "—"}
                </div>
              </div>

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
                        ACCEPTED: "success",
                        REJECTED: "destructive",
                        EXPIRED: "destructive",
                      }[proposal.status] || "default"
                    }
                  >
                    {proposal.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Sent At and Responded At - Two Columns */}
            {(proposal.sentAt || proposal.respondedAt) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposal.sentAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Sent At
                    </label>
                    <div className="text-gray-900">
                      {formatDate(proposal.sentAt)}
                    </div>
                  </div>
                )}

                {proposal.respondedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Responded At
                    </label>
                    <div className="text-gray-900">
                      {formatDate(proposal.respondedAt)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Proposal Content - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Proposal Content
              </label>
              <div
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: proposal.proposalContent || "",
                }}
              />
            </div>

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

