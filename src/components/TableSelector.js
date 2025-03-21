// src/components/TableSelector.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TableSelector() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tables');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tables: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTables(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tables: ' + err.message);
        setLoading(false);
        console.error(err);
      }
    };

    fetchTables();
  }, []);

  if (loading) return <div>Loading tables...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>Database Tables</h2>
      <div className="list-group mt-4">
        {tables.length === 0 ? (
          <p>No tables found in the database.</p>
        ) : (
          tables.map(table => (
            <Link 
              key={table} 
              to={`/table/${table}`} 
              className="list-group-item list-group-item-action"
            >
              {table}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default TableSelector;