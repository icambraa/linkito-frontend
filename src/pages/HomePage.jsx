import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../firebase'; // Asegúrate de que la ruta sea correcta
import { ArrowRight, CheckCircle, HelpCircle, Check, Copy } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomePage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const handleShortenClick = async () => {
    if (!originalUrl) {
      alert("Por favor ingresa una URL válida.");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: originalUrl.trim() }),
      });

      if (response.ok) {
        const data = await response.text();
        setShortenedUrl(`http://localhost:8080/${data}`);
      } else {
        console.error('Error al acortar la URL:', response.statusText);
        alert("Hubo un problema al acortar la URL. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error('Error al acortar la URL:', error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(shortenedUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [shortenedUrl]);

  const handleRegisterClick = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl font-bold text-green-500 mb-4 animate-fade-in-down">Simple URL Tools</h1>
        <p className="text-xl mb-8 text-center animate-fade-in-up">Acorta y encripta tus enlaces de forma fácil y rápida</p>
        <div className="flex mb-8 animate-fade-in-up">
          <input
            type="text"
            placeholder="Pega tu URL aquí"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="p-3 w-80 rounded-l-md border-2 border-green-500 focus:outline-none focus:border-green-600 bg-white text-gray-800"
          />
          <button
            onClick={handleShortenClick}
            className="bg-green-500 text-white p-3 rounded-r-md hover:bg-green-600 transition duration-300"
          >
            Acortar
          </button>
        </div>
        {shortenedUrl && (
          <div className="mb-12 flex items-center justify-center space-x-4 animate-fade-in-up">
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors duration-200"
            >
              {shortenedUrl}
            </a>
            <button
              onClick={handleCopyClick}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors duration-200 flex items-center"
              aria-label={isCopied ? "Copiado" : "Copiar al portapapeles"}
            >
              {isCopied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        )}
        {isCopied && (
          <p className="text-green-400 text-sm mb-4 animate-fade-in">¡Copiado al portapapeles!</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in-up">
          <div className="flex flex-col items-center">
            <ArrowRight className="w-12 h-12 text-green-500 mb-2" />
            <h3 className="text-xl font-semibold mb-2">Rápido y Sencillo</h3>
            <p className="text-center">Acorta tus URLs en segundos</p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
            <h3 className="text-xl font-semibold mb-2">Personalizable</h3>
            <p className="text-center">Crea enlaces personalizados</p>
          </div>
          <div className="flex flex-col items-center">
            <HelpCircle className="w-12 h-12 text-green-500 mb-2" />
            <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
            <p className="text-center">Estamos aquí para ayudarte</p>
          </div>
        </div>
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-2xl font-semibold mb-4">¿Por qué registrarse en Linkito?</h2>
          <ul className="list-disc list-inside">
            <li>Más de 1 millón de enlaces acortados</li>
            <li>100,000+ usuarios satisfechos</li>
            <li>Estadísticas detalladas de tus enlaces</li>
          </ul>
        </div>
        <button
          onClick={handleRegisterClick}
          className="bg-white text-green-500 font-semibold py-2 px-4 rounded hover:bg-green-50 hover:text-green-600 transition duration-300 animate-fade-in-up flex items-center"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5 mr-2"
          />
          Regístrate Gratis con Google
        </button>
      </main>
      <Footer />
    </div>
  );
}