import { clsx } from "clsx";
import { MoreVertical } from "lucide-react";

export function DataGrid({
  data = [],
  columns = 3,
  renderItem,
  className,
  gap = 4,
  ...props
}) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  const gapSizes = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  };

  return (
    <div
      className={clsx(
        "grid",
        gridCols[columns] || gridCols[3],
        gapSizes[gap] || "gap-4",
        className
      )}
      {...props}
    >
      {data.map((item, index) => (
        <div key={item.id || index}>
          {renderItem ? (
            renderItem(item, index)
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {item.title || item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DataGrid;
