
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-600">Analizando con Celia-IA...</p>
      <p className="text-sm text-gray-500">Consultando la base de datos de ANMAT y verificando ingredientes.</p>
    </div>
  );
};
