import { clsx } from "clsx";

export function Table({
  columns = [],
  data = [],
  className,
  headerClassName,
  bodyClassName,
  rowClassName,
  onRowClick,
  ...props
}) {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx("min-w-full divide-y divide-gray-200", className)}
        {...props}
      >
        <thead className={clsx("bg-gray-50", headerClassName)}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={clsx(
                  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  column.headerClassName
                )}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={clsx("bg-white divide-y divide-gray-200", bodyClassName)}
        >
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={clsx(
                "hover:bg-gray-50 transition-colors",
                onRowClick && "cursor-pointer",
                rowClassName
              )}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={column.key || colIndex}
                  className={clsx(
                    "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                    column.className
                  )}
                >
                  {column.render
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
