import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Asegúrate de tener configurado Firebase o el sistema de autenticación que uses

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar si el usuario está autenticado
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí se verifica si el usuario está autenticado, esto depende de tu sistema de autenticación
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true); // Usuario autenticado
      } else {
        setIsAuthenticated(false); // Usuario no autenticado
      }
    });

    return () => unsubscribe(); // Limpia el listener cuando el componente se desmonta
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    auth.signOut(); // Método para cerrar sesión
    navigate('/');
  };

  return (
    <header className="w-full p-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold text-green-500">Linkito</h1>
        {isAuthenticated ? (
          <button
            onClick={handleLogoutClick}
            className="bg-white text-green-500 font-semibold py-2 px-4 rounded hover:bg-green-100 transition duration-300 flex items-center"
          >
            Cerrar Sesión
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-white text-green-500 font-semibold py-2 px-4 rounded hover:bg-green-100 transition duration-300 flex items-center"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5 mr-2"
            />
            Iniciar Sesión con Google
          </button>
        )}
      </div>
    </header>
  );
}
