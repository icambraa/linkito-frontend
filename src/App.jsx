import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import PasswordProtectedLink from './pages/PasswordProtectedLink';
import ContactPage from './pages/ContactPage'; // Import the new ContactPage
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route path="/contact" element={<ContactPage />} /> {/* Add this new route */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;