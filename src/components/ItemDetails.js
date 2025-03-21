import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getItemDetails = async () => {
      try {
        const data = await api.fetchItem(id);
        setItem(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch item details');
        setLoading(false);
        console.error(err);
      }
    };

    getItemDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2>Item Details</h2>
      </div>
      <div className="card-body">
        <h5 className="card-title">ID: {item.id}</h5>
        <p className="card-text"><strong>Field 1:</strong> {item.field1}</p>
        <p className="card-text"><strong>Field 2:</strong> {item.field2}</p>
        <p className="card-text"><strong>Created At:</strong> {new Date(item.created_at).toLocaleString()}</p>
        <Link to="/" className="btn btn-primary">Back to List</Link>
      </div>
    </div>
  );
}

export default ItemDetails;