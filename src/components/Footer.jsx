// src/components/Footer.js
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full p-6 text-center">
      <p>
        <a href="#" className="hover:underline">Acerca de</a> | 
        <a href="#" className="hover:underline">Contacto</a> | 
        <a href="#" className="hover:underline">Política de Privacidad</a>
      </p>
    </footer>
  );
}