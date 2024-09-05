import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth, signInWithGoogle } from '../../firebase'; // Asegúrate de que la ruta sea correcta
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
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
              className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 flex items-center space-x-2 shadow-sm border border-gray-600"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 flex items-center space-x-2 shadow-sm border border-gray-600"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5 bg-white rounded-full p-0.5"
              />
              <span>Entrar con Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}