import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PasswordProtectedLink() {
  const { shortUrl } = useParams(); // Cambiado a useParams para obtener el parámetro de la URL
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const response = await fetch(`http://localhost:8080/api/links/${shortUrl}/access`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.originalUrl; // Redirige a la URL original
      } else {
        setError('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Hubo un problema al verificar la contraseña. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg animate-fade-in-up">
          <div className="flex flex-col items-center space-y-4">
            <Lock className="w-16 h-16 text-green-500" />
            <h1 className="text-3xl font-bold text-green-500">Enlace Protegido</h1>
            <p className="text-center text-gray-300">
              Este enlace está protegido con contraseña. Por favor, ingresa la contraseña para acceder al contenido.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                required
                className="w-full p-3 rounded-md border-2 border-green-500 focus:outline-none focus:border-green-600 bg-gray-700 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                'Verificando...'
              ) : (
                <>
                  Acceder al contenido
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md animate-fade-in" role="alert">
              {error}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
