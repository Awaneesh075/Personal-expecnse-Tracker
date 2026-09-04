import React, { useState } from 'react';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchKey?: keyof T;
  itemsPerPage?: number;
}

export function DataTable<T extends Record<string, any>>({ 
  columns, 
  data, 
  searchable = true, 
  searchKey,
  itemsPerPage = 10 
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchKey) return data;
    return data.filter(item => {
      const val = item[searchKey];
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  // Paginate
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.tableContainer}>
      {searchable && searchKey && (
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder={`Search by ${String(searchKey)}...`}
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
      
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, i) => (
              <tr key={i} className={styles.tr}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </span>
          <div className={styles.pageControls}>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span style={{ padding: '0.25rem 0.5rem' }}>Page {currentPage} of {totalPages}</span>
            <button 
              className={styles.pageBtn} 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
