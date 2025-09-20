
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
      <div className="flex">
        <div className="py-1"><i className="fa-solid fa-circle-xmark mr-4 text-2xl"></i></div>
        <div>
          <p className="font-bold">¡Ups! Ocurrió un error</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
