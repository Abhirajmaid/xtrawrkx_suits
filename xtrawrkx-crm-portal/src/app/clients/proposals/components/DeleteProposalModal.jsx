"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui";
import { createPortal } from "react-dom";

export default function DeleteProposalModal({
  isOpen,
  onClose,
  onConfirm,
  proposal,
  isDeleting,
}) {
  if (typeof window === "undefined" || !isOpen || !proposal) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Proposal
            </h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            Are you sure you want to delete proposal{" "}
            <strong>"{proposal.title}"</strong>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700 font-medium mb-2">
              ⚠️ This will permanently delete:
            </p>
            <ul className="text-sm text-red-600 space-y-1">
              <li>• Proposal information and content</li>
              <li>• Proposal details and attachments</li>
              <li>• All related data</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            disabled={isDeleting}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Proposal
              </>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

