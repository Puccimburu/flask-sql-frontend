// src/components/TableViewer.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function TableViewer() {
  const { tableName } = useParams();
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/table/${tableName}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch table data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTableData(data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch table data: ${err.message}`);
        setLoading(false);
        console.error(err);
      }
    };

    fetchTableData();
  }, [tableName]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setIsSearching(true);
    try {
      let url = `http://localhost:8080/api/search/${tableName}?q=${encodeURIComponent(searchTerm)}`;
      if (searchColumn) {
        url += `&column=${encodeURIComponent(searchColumn)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTableData(data);
      setIsSearching(false);
    } catch (err) {
      setError(`Search failed: ${err.message}`);
      setIsSearching(false);
      console.error(err);
    }
  };

  const handleReset = async () => {
    setSearchTerm('');
    setSearchColumn('');
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/table/${tableName}`);
      const data = await response.json();
      setTableData(data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to reset search: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading table data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const textColumns = tableData.columns.filter(
    column => column.type.startsWith('character') || ['text', 'varchar'].includes(column.type)
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Table: {tableName}</h2>
        <Link to="/tables" className="btn btn-secondary">Back to Tables</Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
            >
              <option value="">All text columns</option>
              {textColumns.map(column => (
                <option key={column.name} value={column.name}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <button 
              type="submit" 
              className="btn btn-primary me-2" 
              disabled={isSearching || !searchTerm}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Results count */}
      {tableData.count !== undefined && (
        <div className="alert alert-info">
          Found {tableData.count} result{tableData.count !== 1 ? 's' : ''}
        </div>
      )}

      <div className="table-responsive">
        {tableData.data.length === 0 ? (
          <p>No data in this table.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                {tableData.columns.map(column => (
                  <th key={column.name}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {tableData.columns.map(column => (
                    <td key={column.name}>
                      {row[column.name] !== null ? String(row[column.name]) : 'NULL'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TableViewer;