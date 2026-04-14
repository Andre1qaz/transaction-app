import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TransactionList from './pages/TransactionList';
import TransactionForm from './pages/TransactionForm';
import TransactionDetail from './pages/TransactionDetail';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f4f7fb', fontFamily: 'Segoe UI, sans-serif' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<TransactionList />} />
          <Route path="/add" element={<TransactionForm mode="add" />} />
          <Route path="/edit/:id" element={<TransactionForm mode="edit" />} />
          <Route path="/detail/:id" element={<TransactionDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;