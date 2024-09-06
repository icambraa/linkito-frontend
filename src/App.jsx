import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import PasswordProtectedLink from './pages/PasswordProtectedLink';
import ContactPage from './pages/ContactPage'; 
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
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
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
