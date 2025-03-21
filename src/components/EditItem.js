import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getItem = async () => {
      try {
        const data = await api.fetchItem(id);
        setField1(data.field1);
        setField2(data.field2);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch item');
        setLoading(false);
        console.error(err);
      }
    };

    getItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!field1 || !field2) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await api.updateItem(id, { field1, field2 });
      navigate('/');
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="field1">Field 1</label>
          <input
            type="text"
            className="form-control"
            id="field1"
            value={field1}
            onChange={(e) => setField1(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="field2">Field 2</label>
          <input
            type="text"
            className="form-control"
            id="field2"
            value={field2}
            onChange={(e) => setField2(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

export default EditItem;