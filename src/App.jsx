import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard'; // Importa el componente Dashboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Define la ruta del Dashboard */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;