"use client";

import { useState } from "react";
import { Button, Input } from "@xtrawrkx/ui";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { BaseModal } from "../ui";

export default function DeleteAllDataModal({ isOpen, onClose, onDeleteAll }) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation, 3: Processing

  const requiredText = "DELETE ALL DATA";
  const isConfirmationValid = confirmationText === requiredText;

  const handleDelete = async () => {
    if (!isConfirmationValid) return;

    setIsDeleting(true);
    setStep(3);

    try {
      // Simulate deletion process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      onDeleteAll();
      handleClose();
    } catch (error) {
      console.error('Error deleting data:', error);
      setIsDeleting(false);
      setStep(2);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    setIsDeleting(false);
    setStep(1);
    onClose();
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="small">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400/20 to-red-500/20 backdrop-blur-md border border-red-300/40 rounded-lg flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Delete All Data</h2>
              <p className="text-xs text-gray-600">Permanent data removal</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
            disabled={isDeleting}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              {/* Warning Step */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900 mb-2">Warning: This action cannot be undone</h3>
                    <p className="text-sm text-red-700 mb-3">
                      Deleting all data will permanently remove:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1 ml-4">
                      <li>• All contacts and lead information</li>
                      <li>• All deals and sales data</li>
                      <li>• All activities and notes</li>
                      <li>• All files and documents</li>
                      <li>• All user accounts and settings</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2">Before proceeding, please ensure you have:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Exported all important data</li>
                  <li>• Informed all team members</li>
                  <li>• Confirmed this is the intended action</li>
                </ul>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Confirmation Step */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900 mb-2">Final Confirmation Required</h3>
                    <p className="text-sm text-red-700 mb-3">
                      To confirm deletion, type <strong>DELETE ALL DATA</strong> in the box below:
                    </p>
                    <Input
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder="Type: DELETE ALL DATA"
                      className="border-red-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>This action will immediately and permanently delete all data from your CRM system.</p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Processing Step */}
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Deleting All Data</h3>
                <p className="text-sm text-gray-600 mb-4">This may take a few minutes...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          {step < 3 && (
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={handleClose} className="px-4 py-2 text-sm">
                Cancel
              </Button>
              {step === 1 && (
                <Button
                  onClick={handleNext}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg"
                >
                  Continue
                </Button>
              )}
              {step === 2 && (
                <Button
                  onClick={handleDelete}
                  disabled={!isConfirmationValid}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete All Data
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
