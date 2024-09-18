import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth, signInWithGoogle } from '../../firebase';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginClick = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isOnDashboard = location.pathname === '/dashboard';

  return (
    <header className="w-full p-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-4xl font-bold text-green-500 hover:text-green-400 transition duration-300">
          Linkito
        </Link>
        <div className="flex items-center space-x-6">
          {isAuthenticated && !isOnDashboard && (
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogoutClick}
              className="text-gray-300 hover:text-white transition duration-300"
              aria-label="Cerrar Sesión"
            >
              <LogOut size={24} />
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={handleLoginClick}
                className="flex items-center justify-start bg-white text-gray-700 rounded-full h-10 pl-2 pr-2 hover:pr-6 w-10 hover:w-40 transition-all duration-300 ease-in-out overflow-hidden group"
                aria-label="Iniciar Sesión con Google"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-6 h-6 flex-shrink-0"
                />
                <span className="ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                  Iniciar sesión
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}