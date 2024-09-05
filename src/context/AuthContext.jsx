import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase'; // Importa correctamente tu configuración de Firebase

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setLoading(false); // Una vez que Firebase responde, dejamos de estar en modo "loading"
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {!loading && children} {/* Solo renderizamos los hijos si ya terminó de cargar */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
