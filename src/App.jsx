import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import PasswordProtectedLink from './pages/PasswordProtectedLink';
import { AuthProvider } from './context/AuthContext'; // Importa tu AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Importa el ProtectedRoute

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/password-protected/:shortUrl" element={<PasswordProtectedLink />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
