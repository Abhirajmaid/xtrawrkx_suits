import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Card, Button } from "../../../../components/ui";

export default function ColumnVisibilityModal({
  isOpen,
  onClose,
  columns,
  visibleColumns,
  onVisibilityChange,
}) {
  const [localVisibility, setLocalVisibility] = useState({});

  // Initialize local visibility state when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialVisibility = {};
      columns.forEach((col) => {
        initialVisibility[col.key] = visibleColumns.includes(col.key);
      });
      setLocalVisibility(initialVisibility);
    }
  }, [isOpen, columns, visibleColumns]);

  const handleToggle = (columnKey) => {
    const newVisibility = {
      ...localVisibility,
      [columnKey]: !localVisibility[columnKey],
    };
    setLocalVisibility(newVisibility);
    
    // Apply changes immediately (real-time)
    // Get all column keys that are visible
    const newVisibleColumns = columns
      .map((col) => col.key)
      .filter((key) => newVisibility[key] === true);
    onVisibilityChange(newVisibleColumns);
  };

  const handleReset = () => {
    const defaultVisibility = {};
    columns.forEach((col) => {
      defaultVisibility[col.key] = true;
    });
    setLocalVisibility(defaultVisibility);
    
    // Apply reset immediately
    const allColumnKeys = columns.map((col) => col.key);
    onVisibilityChange(allColumnKeys);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        glass={true}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Column Visibility
                </h2>
                <p className="text-sm text-gray-500">
                  Show or hide columns in the table
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Column List */}
          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {column.label}
                </span>
                <button
                  onClick={() => handleToggle(column.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    localVisibility[column.key]
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {localVisibility[column.key] ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-medium">Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span className="text-xs font-medium">Hidden</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-800 mr-auto"
            >
              Reset to Default
            </Button>
            <Button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

