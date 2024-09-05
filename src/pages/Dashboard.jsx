'use client'

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PlusCircle, Trash2, QrCode, Copy, CheckCircle, Lock, Unlock, Edit, Hash, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const [newUrl, setNewUrl] = useState('');
  const [password, setPassword] = useState('');
  const [tag, setTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [mostPopularLink, setMostPopularLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newLinkId, setNewLinkId] = useState(null);
  const [deletingLinkId, setDeletingLinkId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 10;

  const auth = getAuth();
  const tableRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          const [linksResponse, totalClicksResponse, mostPopularLinkResponse] = await Promise.all([
            fetch(`http://localhost:8080/api/links?userId=${uid}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`,
                'Content-Type': 'application/json',
              },
            }),
            fetch(`http://localhost:8080/api/stats/total-clicks?userId=${uid}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`,
                'Content-Type': 'application/json',
              },
            }),
            fetch(`http://localhost:8080/api/stats/most-popular?userId=${uid}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`,
                'Content-Type': 'application/json',
              },
            })
          ]);

          if (linksResponse.ok && totalClicksResponse.ok && mostPopularLinkResponse.ok) {
            const linksData = await linksResponse.json();
            const totalClicksData = await totalClicksResponse.json();
            const mostPopularLinkData = await mostPopularLinkResponse.json();

            const sortedLinks = linksData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setLinks(sortedLinks);
            setTotalClicks(totalClicksData.totalClicks);
            setMostPopularLink(mostPopularLinkData);
          } else {
            console.error('Error al obtener los datos:', linksResponse.statusText);
          }
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      } else {
        console.log('No hay un usuario autenticado.');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleCreateLink = async (e) => {
    e.preventDefault();
  
    if (!newUrl.trim()) return;
  
    try {
      const user = auth.currentUser;
      if (!user) return;
  
      const response = await fetch('http://localhost:8080/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          originalUrl: newUrl.trim(),
          password: showPasswordInput ? password : undefined,
          userId: user.uid,
          tag: tag.trim() || undefined,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const newLink = {
          id: data.id,
          originalUrl: data.originalUrl,
          shortUrl: `${data.shortUrl}`,
          clicks: data.clicks || 0,
          createdAt: data.createdAt || new Date().toISOString(),
          password: data.password,
          tag: data.tag,
        };
        
        setLinks(prevLinks => {
          const sortedLinks = [newLink, ...prevLinks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          return sortedLinks;
        });
        setNewLinkId(newLink.id);
  
        setNewUrl('');
        setPassword('');
        setTag('');
        setShowPasswordInput(false);
        setShowTagInput(false);

        if (tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        setTimeout(() => setNewLinkId(null), 500);
      } else {
        console.error('Error al acortar la URL:', response.statusText);
        alert("Hubo un problema al acortar la URL. Inténtalo de nuevo.");
      }
  
    } catch (error) {
      console.error('Error al acortar la URL:', error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  const handleDeleteLink = async (id, shortUrl) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
  
      setDeletingLinkId(id);

      const response = await fetch(`http://localhost:8080/api/links/${shortUrl}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
      });
  
      if (response.ok) {
        setTimeout(() => {
          setLinks(links.filter(link => link.id !== id));
          setDeletingLinkId(null);
        }, 500);
      } else {
        console.error('Error al eliminar el enlace:', response.statusText);
        alert("Hubo un problema al eliminar el enlace. Inténtalo de nuevo.");
        setDeletingLinkId(null);
      }
    } catch (error) {
      console.error('Error al eliminar el enlace:', error);
      alert("Hubo un problema al conectar con el servidor.");
      setDeletingLinkId(null);
    }
  };

  const handleGenerateQR = (shortUrl) => {
    setQrCodeUrl(shortUrl);
  };

  const handleCloseQR = () => {
    setQrCodeUrl(null);
  };

  const handleCopyLink = (id, shortUrl) => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopiedLinkId(id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }).catch(err => {
      console.error('Error al copiar la URL: ', err);
    });
  };

  const handleEditLink = (id) => {
    console.log('Editando enlace:', id);
    // Implementar la lógica de edición aquí
  };

  // Lógica de filtrado y paginación
  const filteredLinks = links.filter(link => 
    link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.tag && link.tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);

  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-gray-900 to-gray-800 text-white flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
          <p>Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="mt-16">
            <h2 className="text-4xl font-semibold mb-4 text-green-500 text-center">Acortar nueva URL</h2>
            <form onSubmit={handleCreateLink} className="flex flex-col items-center mb-8 animate-fade-in-up w-full">
              <div className="flex mb-4 w-full max-w-md relative">
                <button
                  type="button"
                  onClick={() => setShowTagInput(!showTagInput)}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${showTagInput ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 focus:outline-none transition-colors duration-300`}
                  aria-label="Añadir etiqueta"
                >
                  <Hash className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className={`absolute left-10 top-1/2 transform -translate-y-1/2 ${showPasswordInput ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 focus:outline-none transition-colors duration-300`}
                  aria-label="Proteger con contraseña"
                >
                  {showPasswordInput ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                </button>
                <input
                  type="text"
                  placeholder="Pega tu URL aquí"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                  className="p-3 pl-20 flex-grow rounded-l-md border-2 border-green-500 focus:outline-none focus:border-green-600 bg-white text-gray-800"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white p-3 rounded-r-md hover:bg-green-600 transition duration-300"
                >
                  Acortar
                </button>
              </div>
              {showTagInput && (
                <div className="mb-4 animate-slide-down w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Añadir etiqueta (opcional)"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="p-3 w-full rounded-md border-2 border-green-500 focus:outline-none focus:border-green-600 bg-white text-gray-800"
                  />
                </div>
              )}
              {showPasswordInput && (
                <div className="mb-4 animate-slide-down w-full max-w-md">
                  <input
                    type="password"
                    placeholder="Ingresa una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 w-full rounded-md border-2 border-green-500 focus:outline-none focus:border-green-600 bg-white text-gray-800"
                  />
                </div>
              )}
            </form>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-5/6 bg-gray-800 rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-green-500">Mis URL's</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar enlaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              <div className="overflow-x-auto" ref={tableRef}>
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="py-2 px-4 w-10"></th>
                      <th className="py-2 px-4">Etiqueta</th>
                      <th className="py-2 px-4">URL Corta</th>
                      <th className="py-2 px-4">URL Original</th>
                      <th className="py-2 px-4 text-center">Clics</th>
                      <th className="py-2 px-4">Fecha</th>
                      <th className="py-2 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLinks.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-gray-400">No se encontraron enlaces.</td>
                      </tr>
                    ) : (
                      currentLinks.map((link) => (
                        <tr 
                          key={link.id} 
                          className={`border-b border-gray-700 transition-all duration-500 ease-in-out ${
                            link.id === newLinkId ? 'animate-slide-down bg-green-900 bg-opacity-50' :
                            link.id === deletingLinkId ? 'animate-slide-up bg-red-900 bg-opacity-50' : ''
                          }`}
                        >
                          <td className="py-2 px-4 text-center">
                            {link.password ? (
                              <Lock className="h-4 w-4 text-yellow-500 mx-auto" aria-label="Enlace protegido con contraseña" />
                            ) : (
                              <Unlock className="h-4 w-4 text-green-500 mx-auto" aria-label="Enlace sin contraseña" />
                            )}
                          </td>
                          <td className="py-2 px-4">
                            {link.tag && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Hash className="h-3 w-3 mr-1" />
                                {link.tag}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleCopyLink(link.id, `http://localhost:8080/${link.shortUrl}`)} 
                                className="text-green-500 hover:text-green-400 focus:outline-none"
                                aria-label="Copiar URL corta"
                              >
                                {copiedLinkId === link.id ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                              <a href={`http://localhost:8080/${link.shortUrl}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                                {`http://localhost:8080/${link.shortUrl}`}
                              </a>
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                              <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                                {link.originalUrl}
                              </a>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-center">{link.clicks}</td>
                          <td className="py-2 px-4">{new Date(link.createdAt).toLocaleDateString()}</td>
                          <td className="py-2 px-4">
                            <div className="flex space-x-2">
                              <button onClick={() => handleGenerateQR(`http://localhost:8080/${link.shortUrl}`)} className="text-green-500 hover:text-green-400 focus:outline-none" aria-label="Generar código QR">
                                <QrCode className="h-5 w-5" />
                              </button>
                              <button onClick={() => handleEditLink(link.id)} className="text-blue-500 hover:text-blue-400 focus:outline-none" aria-label="Editar enlace">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button onClick={() => handleDeleteLink(link.id, link.shortUrl)} className="text-red-500 hover:text-red-400 focus:outline-none" aria-label="Eliminar enlace">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Controles de paginación actualizados */}
              <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out ${
                        currentPage === number + 1
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="lg:w-1/6 space-y-8 animate-fade-in-up">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-500">Total de clics</h2>
                <div className="text-4xl font-bold">{totalClicks}</div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-500">Enlace más popular</h2>
                {mostPopularLink ? (
                  <div className="relative group">
                    <div className="text-lg font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap cursor-pointer">
                      {mostPopularLink.shortUrl}
                    </div>
                    <div className="invisible group-hover:visible absolute z-10 p-2 bg-gray-700 rounded shadow-lg mt-2 text-sm max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {mostPopularLink.originalUrl}
                    </div>
                    <div className="text-sm text-gray-400">{mostPopularLink.clicks} clics</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">No hay enlaces disponibles</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {qrCodeUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Código QR</h3>
                <button onClick={handleCloseQR} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <QRCodeSVG value={qrCodeUrl} size={256} />
              <p className="mt-4 text-sm text-gray-600 text-center">{qrCodeUrl}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}