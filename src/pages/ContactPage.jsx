import React from 'react'
import { Mail, Linkedin, FileText, ExternalLink } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <main className="flex-grow flex px-4 py-8 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-green-500 mb-6 mt-6">Contacto</h1>
          <p className="text-xl mb-6 text-center">Conéctate conmigo y explora mi trabajo</p>

          <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-3xl mb-8">
            <h2 className="text-3xl font-semibold text-green-500 mb-4">Sobre mí</h2>
            <p className="text-gray-300 mb-4">
              Soy <span className="text-green-400 font-semibold">Ignacio Cambra</span>, un recién graduado en Ingeniería Informática con una gran pasión por la tecnología y el desarrollo web. Actualmente, estoy buscando mi primera oportunidad laboral para aplicar mis conocimientos y crecer profesionalmente.
            </p>
            <p className="text-gray-300 mb-4">
              Mi portfolio demuestra mis habilidades como desarrollador full-stack, back-end y front-end. Incluye proyectos que reflejan mi capacidad para crear aplicaciones web dinámicas y responsivas.
            </p>
            <a 
              href="https://velvety-otter-5e112e.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-green-400 hover:text-green-300 transition duration-300"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Ver mi portfolio
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
            <a 
              href="https://www.linkedin.com/in/ignacio-cambra-027904326/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition duration-300"
            >
              <Linkedin className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">LinkedIn</h3>
              <p className="text-center text-gray-300">Conéctate conmigo profesionalmente</p>
            </a>
            <a 
              href="mailto:tucorreo@ejemplo.com" 
              className="flex flex-col items-center bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition duration-300"
            >
              <Mail className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-center text-gray-300">Envíame un mensaje directo</p>
            </a>
            <a 
              href="/cv.pdf" 
              download 
              className="flex flex-col items-center bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition duration-300"
            >
              <FileText className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">CV</h3>
              <p className="text-center text-gray-300">Descarga mi currículum</p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}