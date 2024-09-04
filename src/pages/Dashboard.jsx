import React, { useState } from 'react';
import Header from '../components/Header'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import Footer from '../components/Footer'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import { PlusCircle, Trash2, QrCode } from 'lucide-react';

export default function Dashboard() {
  const [newUrl, setNewUrl] = useState('');
  const [password, setPassword] = useState('');
  const [links, setLinks] = useState([
    { id: 1, originalUrl: 'https://example.com', shortUrl: 'https://linkito.com/abc123', clicks: 150, createdAt: '2023-05-01' },
    { id: 2, originalUrl: 'https://anotherexample.com', shortUrl: 'https://linkito.com/def456', clicks: 75, createdAt: '2023-05-05' },
  ]);

  const handleCreateLink = (e) => {
    e.preventDefault();
    console.log('Creating link:', newUrl, password);
    setNewUrl('');
    setPassword('');
  };

  const handleDeleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleGenerateQR = (shortUrl) => {
    console.log('Generating QR code for:', shortUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-900 to-gray-800 text-white flex flex-col">
      <Header /> {/* Mostrar el Header */}
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-semibold mb-4 text-green-500">Create New Shortened URL</h2>
            <form onSubmit={handleCreateLink} className="flex mb-8 animate-fade-in-up">
              <input
                type="url"
                placeholder="Enter URL to shorten"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
                className="p-3 w-80 rounded-l-md border-2 border-green-500 focus:outline-none focus:border-green-600 bg-white text-gray-800"
              />
              <input
                type="password"
                placeholder="Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 w-60 border-t-2 border-b-2 border-green-500 focus:outline-none focus:border-green-600 bg-white text-gray-800"
              />
              <button type="submit" className="bg-green-500 text-white p-3 rounded-r-md hover:bg-green-600 transition duration-300 flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Create
              </button>
            </form>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-semibold mb-4 text-green-500">Your Shortened Links</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="py-2 px-4">Original URL</th>
                    <th className="py-2 px-4">Short URL</th>
                    <th className="py-2 px-4">Clicks</th>
                    <th className="py-2 px-4">Created At</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-b border-gray-700">
                      <td className="py-2 px-4">{link.originalUrl}</td>
                      <td className="py-2 px-4">{link.shortUrl}</td>
                      <td className="py-2 px-4">{link.clicks}</td>
                      <td className="py-2 px-4">{link.createdAt}</td>
                      <td className="py-2 px-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleGenerateQR(link.shortUrl)} className="text-green-500 hover:text-green-400">
                            <QrCode className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteLink(link.id)} className="text-red-500 hover:text-red-400">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-500">Total Clicks</h2>
              <div className="text-4xl font-bold">225</div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-500">Most Popular Link</h2>
              <div className="text-lg font-semibold">https://linkito.com/abc123</div>
              <div className="text-sm text-gray-400">150 clicks</div>
            </div>
          </div>
        </div>
      </main>
      <Footer /> {/* Mostrar el Footer dd*/}
    </div>
  );
}
