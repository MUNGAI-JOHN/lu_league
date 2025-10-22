// src/components/ui/table.tsx
import type { ReactNode, HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}
export const Table = ({ children, className, ...props }: TableProps) => (
  <div className={`overflow-x-auto rounded-lg border ${className || ""}`}>
    <table className="w-full border-collapse" {...props}>
      {children}
    </table>
  </div>
);

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}
export const TableHeader = ({ children, className, ...props }: TableHeaderProps) => (
  <thead className={`bg-gray-50 text-left ${className || ""}`} {...props}>
    {children}
  </thead>
);

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}
export const TableBody = ({ children, className, ...props }: TableBodyProps) => (
  <tbody className={className} {...props}>{children}</tbody>
);

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}
export const TableRow = ({ children, className, ...props }: TableRowProps) => (
  <tr className={`border-b last:border-b-0 ${className || ""}`} {...props}>
    {children}
  </tr>
);

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}
export const TableCell = ({ children, className, ...props }: TableCellProps) => (
  <td className={`px-4 py-2 whitespace-nowrap text-sm ${className || ""}`} {...props}>
    {children}
  </td>
);

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}
export const TableHead = ({ children, className, ...props }: TableHeadProps) => (
  <th className={`px-4 py-2 font-medium text-gray-700 uppercase tracking-wider ${className || ""}`} {...props}>
    {children}
  </th>
);
