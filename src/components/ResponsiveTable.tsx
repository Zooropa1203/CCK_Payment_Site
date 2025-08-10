import type { ReactNode } from 'react';

import { useIsMobile } from '../hooks/useMatchMedia';

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  className?: string;
}

interface ResponsiveTableProps {
  columns: TableColumn[];
  data: any[];
  caption?: string;
  className?: string;
}

export default function ResponsiveTable({
  columns,
  data,
  caption,
  className = ''
}: ResponsiveTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={`responsive-table-mobile ${className}`}>
        {caption && <div className="table-caption">{caption}</div>}
        {data.map((row, index) => (
          <div key={index} className="table-card">
            {columns.map(column => (
              <div key={column.key} className="table-card-row">
                <div className="table-card-label" data-label={column.label}>
                  {column.label}
                </div>
                <div className="table-card-value">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`responsive-table-desktop ${className}`}>
      <table className="table">
        {caption && <caption className="table-caption">{caption}</caption>}
        <thead>
          <tr>
            {columns.map(column => (
              <th 
                key={column.key} 
                scope="col"
                className={column.className}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map(column => (
                <td key={column.key} className={column.className}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
