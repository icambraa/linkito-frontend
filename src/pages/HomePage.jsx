import React, { useState, useCallback, useEffect } from 'react';
import { ArrowRight, CheckCircle, HelpCircle, Check, Copy, Lock, Clock, ExternalLink, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../../firebase'; // Asegúrate de que la ruta sea correcta

// Componente Toast
const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 flex items-center">
      <CheckCircle className="mr-2" size={18} />
      {message}
    </div>
  );
};

export default function HomePage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [password, setPassword] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLinks, setUserLinks] = useState([]);
  const [showUserLinks, setShowUserLinks] = useState(false);
  const [newLinkIndex, setNewLinkIndex] = useState(-1);
  const [showToast, setShowToast] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setIsAuthenticated(false);
      }
    });

    // Load user links from local storage
    const storedLinks = JSON.parse(localStorage.getItem('userLinks') || '[]');
    setUserLinks(storedLinks);
    if (storedLinks.length > 0) {
      setTimeout(() => setShowUserLinks(true), 100);
    }

    return () => unsubscribe();
  }, [navigate]);

  const handleLoginClick = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  const handleShortenClick = async () => {
    if (!originalUrl) {
      alert("Por favor ingresa una URL válida.");
      return;
    }

    try {
      const response = await fetch('https://linkito-backend-2.onrender.com/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: originalUrl.trim(),
          password: usePassword ? password : undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newShortenedUrl = `https://linkito-backend-2.onrender.com/${data.shortUrl}`;
        setShortenedUrl(newShortenedUrl);

        // Add the new link to userLinks and save to local storage
        const newUserLinks = [{ original: originalUrl, shortened: newShortenedUrl, hasPassword: usePassword }, ...userLinks].slice(0, 5);
        setUserLinks(newUserLinks);
        localStorage.setItem('userLinks', JSON.stringify(newUserLinks));
        setNewLinkIndex(0);
        if (!showUserLinks) {
          setTimeout(() => setShowUserLinks(true), 100);
        }
        setShowToast(true); // Mostrar el toast
      } else {
        console.error('Error al acortar la URL:', response.statusText);
        alert("Hubo un problema al acortar la URL. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error('Error al acortar la URL:', error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  const handleCopyClick = useCallback((url, index) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLinkId(index);
      setTimeout(() => setCopiedLinkId(null), 2000);
    });
  }, []);

  const handleDeleteLink = (index) => {
    const newUserLinks = userLinks.filter((_, i) => i !== index);
    setUserLinks(newUserLinks);
    localStorage.setItem('userLinks', JSON.stringify(newUserLinks));
    if (newUserLinks.length === 0) {
      setShowUserLinks(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <main className="flex-grow flex px-4 py-8 overflow-hidden">
        <style jsx>{`
          @keyframes slideInFromRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideToLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-16.67%);
            }
          }
          @keyframes slideInFromTop {
            0% {
              transform: translateY(-100%);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-in-right {
            animation: slideInFromRight 0.5s ease-out forwards;
          }
          .animate-slide-to-left {
            animation: slideToLeft 0.5s ease-out forwards;
          }
          .animate-slide-in-top {
            animation: slideInFromTop 0.5s ease-out forwards;
          }
        `}</style>
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row justify-center items-start">
          <div className={`w-full ${showUserLinks ? 'lg:w-2/3' : 'lg:w-full'} flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${showUserLinks ? 'animate-slide-to-left' : ''}`}>
            <h1 className="text-5xl font-bold text-green-500 mb-6 mt-6">Acortador de URL's</h1>
            <p className="text-xl mb-6 text-center">Acorta y encripta tus links de forma fácil y rápida</p>
            
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-5 w-full max-w-md">
              <div className="flex items-start">
                <Clock className="w-6 h-6 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">URL's temporales</p>
                  <p className="text-sm mt-1">
                    Las URL creadas sin registrarse duran 24 horas. ¿Necesitas más tiempo? 
                    <button 
                      onClick={handleLoginClick} 
                      className="text-yellow-800 underline ml-1 inline-flex items-center"
                    >
                      Regístrate
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-8 w-full max-w-md">
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Pega tu URL aquí"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="p-3 flex-grow rounded-l-md border-2 border-green-500 focus:outline-none focus:border-green-600 bg-white text-gray-800"
                />
                <button
                  onClick={handleShortenClick}
                  className="bg-green-500 text-white p-3 rounded-r-md hover:bg-green-600 transition duration-300"
                >
                  Acortar
                </button>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="usePassword"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="usePassword" className="text-sm">Proteger con contraseña</label>
              </div>
              {usePassword && (
                <div className="mb-2">
                  <input
                    type="password"
                    placeholder="Ingresa una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 w-full rounded-md border-2 border-green-500 focus:outline-none focus:border-green-600 bg-white text-gray-800"
                  />
                </div>
              )}
            </div>

            <div className="mb-8 w-full">
              <h2 className="text-4xl font-semibold mb-16 text-center">¿Por qué utilizar Linkito?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3">
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
            </div>
          </div>

          {/* Lista de enlaces del usuario no logueado */}
          {showUserLinks && (
            <div className="w-full lg:w-1/3 lg:pl-8 mt-8 lg:mt-0 animate-slide-in-right">
              <h3 className="text-2xl font-semibold mb-4 mt-16">Tus enlaces recientes</h3>
              <ul className="space-y-4">
                {userLinks.map((link, index) => (
                  <li 
                    key={index} 
                    className={`bg-gray-700 p-4 rounded-md ${index === newLinkIndex ? 'animate-slide-in-top' : ''}`}
                    onAnimationEnd={() => {
                      if (index === newLinkIndex) {
                        setNewLinkIndex(-1);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <a href={link.shortened} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors duration-200 truncate mr-2">
                        {link.shortened}
                      </a>
                      {link.hasPassword && <Lock size={16} className="text-yellow-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-400 mb-2 truncate">{link.original}</p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleCopyClick(link.shortened, index)}
                        className={`flex items-center transition-colors duration-200 ${
                          copiedLinkId === index ? 'text-green-400' : 'text-green-500 hover:text-green-400'
                        }`}
                        aria-label="Copiar al portapapeles"
                      >
                        {copiedLinkId === index ? (
                          <>
                            <Check size={18} className="mr-1" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy size={18} className="mr-1" />
                            Copiar
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteLink(index)}
                        className="text-red-500 hover:text-red-400 transition-colors duration-200 flex items-center"
                        aria-label="Eliminar enlace"
                      >
                        <Trash2 size={18} className="mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Toast 
        message="¡URL creada con éxito!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}