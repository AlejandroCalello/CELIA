
import React from 'react';
import type { HistoryItem, ProductAnalysis } from '../types';

interface HistorySectionProps {
  history: HistoryItem[];
  onItemClick: (item: HistoryItem) => void;
  onClear: () => void;
  isLoading: boolean;
}

const timeAgo = (timestamp: number): string => {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) return `hace segundos`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} hr`;

  const days = Math.floor(hours / 24);
  return `hace ${days} día(s)`;
};

const getStatusIcon = (item: HistoryItem): React.ReactNode => {
    if (item.type === 'comparison') {
        return <i className="fa-solid fa-scale-balanced text-blue-500" title="Comparación"></i>;
    }
    if (item.type === 'image') {
        return <i className="fa-solid fa-image text-purple-500" title="Análisis de imagen"></i>;
    }
    const result = item.data as ProductAnalysis;
    if (result.isSafe) {
        return <i className="fa-solid fa-check-circle text-green-500" title="Apto"></i>;
    }
    return <i className="fa-solid fa-times-circle text-red-500" title="No Apto / Riesgoso"></i>;
};


export const HistorySection: React.FC<HistorySectionProps> = ({ history, onItemClick, onClear, isLoading }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Historial de Búsqueda</h2>
          {history.length > 0 && (
            <button
              onClick={onClear}
              disabled={isLoading}
              className="text-sm text-gray-500 hover:text-red-600 font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              aria-label="Limpiar historial"
            >
              <i className="fa-solid fa-trash-can"></i>
              Limpiar Historial
            </button>
          )}
        </div>
        
        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100/75 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all flex items-center justify-between disabled:opacity-60 disabled:hover:bg-transparent"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-700 truncate">{item.query}</p>
                    <p className="text-xs text-gray-500">{timeAgo(item.timestamp)}</p>
                  </div>
                  <div className="ml-4 text-xl">
                    {getStatusIcon(item)}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">Tu historial de análisis aparecerá aquí.</p>
        )}
      </div>
    </div>
  );
};
