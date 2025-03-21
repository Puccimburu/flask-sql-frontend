import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = {
  // General table operations
  getTables: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/tables`);
    return response.data;
  },
  
  getTableData: async (tableName) => {
    const response = await axios.get(`${API_BASE_URL}/api/table/${tableName}`);
    return response.data;
  },
  
  searchTable: async (tableName, searchTerm, column = '') => {
    const params = new URLSearchParams();
    params.append('q', searchTerm);
    if (column) {
      params.append('column', column);
    }
    const response = await axios.get(`${API_BASE_URL}/api/search/${tableName}?${params.toString()}`);
    return response.data;
  },
  
  // Items-specific operations (using the 'your_table' endpoints)
  fetchItems: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items`);
      return response.data;
    } catch (error) {
      // If 'your_table' doesn't exist, try to get all tables instead
      if (error.response && error.response.status === 404) {
        console.warn("'your_table' not found. Fetching available tables instead.");
        return [];
      }
      throw error;
    }
  },
  
  getItem: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/api/items/${id}`);
    return response.data;
  },
  
  createItem: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/api/items`, data);
    return response.data;
  },
  
  updateItem: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/api/items/${id}`, data);
    return response.data;
  },
  
  deleteItem: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/api/items/${id}`);
    return response.data;
  },
  
  // Health check and debugging
  testConnection: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/db-test`);
    return response.data;
  }
};

export default api;