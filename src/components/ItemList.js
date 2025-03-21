import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ItemList() {
  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available tables on component mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to fetch data from the 'items' endpoint
        try {
          const itemsData = await api.fetchItems();
          if (itemsData && Array.isArray(itemsData) && itemsData.length > 0) {
            setItems(itemsData);
            setLoading(false);
            return; // If successful, exit early
          }
        } catch (itemsError) {
          console.warn("Couldn't fetch items, falling back to tables list", itemsError);
        }
        
        // If items endpoint failed or returned empty, get available tables
        const availableTables = await api.getTables();
        setTables(availableTables);
        
        // If tables are available, select the first one by default
        if (availableTables && availableTables.length > 0) {
          setSelectedTable(availableTables[0]);
          await fetchTableData(availableTables[0]);
        } else {
          setError('No tables found in the database');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching database information:', err);
        setError('Failed to connect to the database server');
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Fetch data for a specific table
  const fetchTableData = async (tableName) => {
    try {
      setLoading(true);
      const data = await api.getTableData(tableName);
      setTableData(data);
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching data from table ${tableName}:`, err);
      setError(`Failed to fetch data from table ${tableName}`);
      setLoading(false);
    }
  };

  // Handle table selection change
  const handleTableChange = async (e) => {
    const tableName = e.target.value;
    setSelectedTable(tableName);
    await fetchTableData(tableName);
  };

  // Handle item deletion (for the 'items' endpoint)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  // Retry loading data
  const handleRetry = async () => {
    setError(null);
    
    if (selectedTable) {
      await fetchTableData(selectedTable);
    } else {
      try {
        const itemsData = await api.fetchItems();
        setItems(itemsData);
      } catch (err) {
        const availableTables = await api.getTables();
        setTables(availableTables);
        
        if (availableTables && availableTables.length > 0) {
          setSelectedTable(availableTables[0]);
          await fetchTableData(availableTables[0]);
        }
      }
    }
  };

  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) {
    return (
      <div className="alert alert-danger">
        <p>{error}</p>
        <button className="btn btn-outline-primary mt-2" onClick={handleRetry}>
          Retry
        </button>
      </div>
    );
  }

  // Display for regular items from 'items' endpoint
  if (items && items.length > 0) {
    return (
      <div>
        <h2>All Items</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Field 1</th>
                <th>Field 2</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.field1}</td>
                  <td>{item.field2}</td>
                  <td>{item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</td>
                  <td>
                    <Link to={`/items/${item.id}`} className="btn btn-info btn-sm me-2">View</Link>
                    <Link to={`/edit/${item.id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  // Display for database tables
  return (
    <div>
      <h2>Database Explorer</h2>
      
      {/* Table list */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Available Tables</h5>
            </div>
            <div className="card-body">
              {tables.length === 0 ? (
                <p>No tables found in the database.</p>
              ) : (
                <div className="list-group">
                  {tables.map(table => (
                    <Link 
                      key={table} 
                      to={`/table/${table}`} 
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      {table}
                      <span className="badge bg-primary rounded-pill">View</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Table preview */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Table Preview</h5>
            </div>
            <div className="card-body">
              {/* Table selector */}
              {tables.length > 0 && (
                <div className="mb-3">
                  <label htmlFor="tableSelect" className="form-label">Select Table:</label>
                  <select 
                    id="tableSelect" 
                    className="form-select" 
                    value={selectedTable || ''} 
                    onChange={handleTableChange}
                  >
                    {tables.map(table => (
                      <option key={table} value={table}>{table}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Preview data (limited) */}
              {selectedTable && tableData.data.length > 0 && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Showing first {Math.min(3, tableData.data.length)} of {tableData.data.length} rows</span>
                    <Link to={`/table/${selectedTable}`} className="btn btn-sm btn-primary">
                      View Full Table
                    </Link>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                      <thead className="table-light">
                        <tr>
                          {tableData.columns.slice(0, 5).map(col => (
                            <th key={col.name}>{col.name}</th>
                          ))}
                          {tableData.columns.length > 5 && <th>...</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.data.slice(0, 3).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {tableData.columns.slice(0, 5).map(col => (
                              <td key={`${rowIndex}-${col.name}`}>
                                {row[col.name] !== null ? String(row[col.name]).substring(0, 20) : 'NULL'}
                                {row[col.name] !== null && String(row[col.name]).length > 20 ? '...' : ''}
                              </td>
                            ))}
                            {tableData.columns.length > 5 && <td>...</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {selectedTable && tableData.data.length === 0 && (
                <p>No data found in this table.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemList;