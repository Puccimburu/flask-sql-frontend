import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AddItem() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableColumns, setTableColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch available tables on component mount
  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const tablesData = await api.getTables();
        setTables(tablesData);
      } catch (err) {
        setError('Failed to fetch tables');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Fetch table schema when a table is selected
  useEffect(() => {
    if (!selectedTable) return;

    const fetchTableSchema = async () => {
      setLoading(true);
      try {
        const schemaData = await api.getTableSchema(selectedTable);
        setTableColumns(schemaData.columns);
        
        // Initialize form data with empty values for each column
        const initialFormData = {};
        schemaData.columns.forEach(column => {
          initialFormData[column.name] = '';
        });
        setFormData(initialFormData);
      } catch (err) {
        setError(`Failed to fetch schema for ${selectedTable}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTableSchema();
  }, [selectedTable]);

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const emptyFields = Object.entries(formData)
      .filter(([key, value]) => value === '')
      .map(([key]) => key);
      
    if (emptyFields.length > 0) {
      setError(`Please fill in all fields. Missing: ${emptyFields.join(', ')}`);
      return;
    }

    try {
      await api.createItem(selectedTable, formData);
      navigate('/');
    } catch (err) {
      setError('Failed to create item');
      console.error(err);
    }
  };

  if (loading && tables.length === 0) {
    return <div>Loading tables...</div>;
  }

  return (
    <div>
      <h2>Add New Item</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Table selection */}
      <div className="form-group mb-4">
        <label htmlFor="tableSelect">Select Database Table:</label>
        <select
          id="tableSelect"
          className="form-control"
          value={selectedTable}
          onChange={handleTableChange}
        >
          <option value="">-- Select a table --</option>
          {tables.map(table => (
            <option key={table.name} value={table.name}>
              {table.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic form based on selected table */}
      {selectedTable && (
        <form onSubmit={handleSubmit}>
          <h3>Add Item to {selectedTable}</h3>
          
          {loading ? (
            <div>Loading form fields...</div>
          ) : (
            <>
              {tableColumns.map(column => (
                <div className="form-group mb-3" key={column.name}>
                  <label htmlFor={column.name}>{column.name}</label>
                  <input
                    type={getInputType(column.type)}
                    className="form-control"
                    id={column.name}
                    name={column.name}
                    value={formData[column.name] || ''}
                    onChange={handleInputChange}
                    required={!column.nullable}
                  />
                  {column.description && (
                    <small className="form-text text-muted">{column.description}</small>
                  )}
                </div>
              ))}
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                Submit
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}

// Helper function to determine input type based on column data type
function getInputType(columnType) {
  switch (columnType.toLowerCase()) {
    case 'number':
    case 'int':
    case 'integer':
    case 'float':
    case 'double':
      return 'number';
    case 'date':
      return 'date';
    case 'datetime':
      return 'datetime-local';
    case 'boolean':
    case 'bool':
      return 'checkbox';
    case 'password':
      return 'password';
    case 'email':
      return 'email';
    default:
      return 'text';
  }
}

export default AddItem;