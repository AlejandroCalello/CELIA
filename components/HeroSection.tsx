
import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-block bg-emerald-100 text-emerald-700 p-4 rounded-full mb-4">
        <i className="fa-solid fa-wheat-awn-circle-exclamation text-4xl"></i>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
        Bienvenido a <span className="text-emerald-500">Celia-IA</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
        Tu asistente inteligente para una vida sin gluten en Argentina.
        Ingresa un producto o sus ingredientes y deja que nuestra IA te diga si es seguro para vos.
      </p>
    </header>
  );
};
