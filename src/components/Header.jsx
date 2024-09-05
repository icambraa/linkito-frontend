import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../../firebase'; // Asegúrate de que la ruta sea correcta
import { LogOut } from 'lucide-react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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
      await auth.signOut(); // Esperar a que Firebase cierre la sesión
      navigate('/'); // Redirigir al homepage
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="w-full p-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold text-green-500">Linkito</h1>
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
    </header>
  );
}