
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-center py-8 mt-16">
      <div className="container mx-auto px-4">
        <p className="font-semibold text-emerald-600">Celia-IA</p>
        <p className="text-sm mt-2 max-w-3xl mx-auto">
          <strong>Aviso Importante:</strong> Celia-IA es una herramienta de asistencia y no reemplaza el consejo médico profesional ni la verificación del etiquetado oficial 'Sin TACC' en los productos. Siempre consulte a su médico y verifique los empaques antes de consumir un producto.
        </p>
        <p className="text-xs mt-4 text-gray-500">
          Desarrollado con ♥ para la comunidad celíaca de Argentina.
        </p>
      </div>
    </footer>
  );
};
