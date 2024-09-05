import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa el AuthContext

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>; // Puedes mostrar un spinner u otra señal de carga
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de inicio
    return <Navigate to="/" />;
  }

  // Si está autenticado, muestra el contenido protegido (ej. Dashboard)
  return children;
};

export default ProtectedRoute;
