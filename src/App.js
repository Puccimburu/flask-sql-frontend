import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import AddItem from './components/AddItem';
import EditItem from './components/EditItem';
import TableSelector from './components/TableSelector';
import TableViewer from './components/TableViewer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetails />} />
            <Route path="/add" element={<AddItem />} />
            <Route path="/edit/:id" element={<EditItem />} />
            <Route path="/tables" element={<TableSelector />} />
            <Route path="/table/:tableName" element={<TableViewer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;