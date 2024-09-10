import React from 'react'
import { Heart, Link as LinkIcon, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-y-4">

      <div className="flex items-center text-gray-300 text-sm order-first md:order-none mb-4 md:mb-0">
          <span>Desarrollado por Ignacio Cambra con</span>
          <Heart className="w-4 h-4 text-red-500 mx-1" />
        </div>
        <div className="flex items-center text-gray-300 text-sm">
          <LinkIcon className="w-4 h-4 mr-1" />
          <span>Acortando enlaces desde 2024</span>
        </div>
      </div>
    </footer>
  )
}