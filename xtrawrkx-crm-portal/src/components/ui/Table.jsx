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
    <div className="overflow-x-auto rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 transition-shadow duration-300">
      <table
        className={clsx("min-w-full rounded-3xl overflow-hidden", className)}
        {...props}
      >
        <thead
          className={clsx(
            "bg-white/90 backdrop-blur-lg border-b border-orange-200/50 shadow-sm",
            headerClassName
          )}
        >
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={clsx(
                  "px-6 py-5 text-left text-xs font-black text-gray-800 uppercase tracking-wider first:rounded-tl-3xl last:rounded-tr-3xl shadow-sm",
                  column.headerClassName
                )}
                style={
                  column.width
                    ? {
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.width,
                      }
                    : {}
                }
              >
                {column.title || column.label || ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={clsx(
            "bg-white/60 backdrop-blur-sm divide-y divide-white/20",
            bodyClassName
          )}
        >
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={clsx(
                "hover:bg-orange-50/50 hover:shadow-lg transition-all duration-300 group bg-white/40 shadow-sm hover:shadow-orange-100/50",
                onRowClick && "cursor-pointer",
                rowClassName
              )}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={column.key || colIndex}
                  className={clsx(
                    "px-6 py-4 text-sm text-gray-800 group-hover:text-gray-900 transition-colors duration-300",
                    column.className
                  )}
                  style={
                    column.width
                      ? {
                          width: column.width,
                          minWidth: column.width,
                          maxWidth: column.width,
                        }
                      : {}
                  }
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
