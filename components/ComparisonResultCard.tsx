import React from 'react';
import type { ProductAnalysis } from '../types';
import { ShareButton } from './ShareButton';

interface ComparisonResultCardProps {
  results: ProductAnalysis[];
}

interface ComparisonItemProps {
  result: ProductAnalysis;
  isRecommended?: boolean;
}

const ComparisonItem: React.FC<ComparisonItemProps> = ({ result, isRecommended }) => {
  const isSafe = result.isSafe;
  const cardBorderColor = isSafe ? 'border-green-400' : 'border-red-400';
  const cardBgColor = isSafe ? 'bg-green-50' : 'bg-red-50';
  const titleColor = isSafe ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`relative rounded-lg border ${cardBorderColor} ${cardBgColor} p-4 transition-all`}>
      {isRecommended && (
        <div className="absolute top-0 right-4 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <i className="fa-solid fa-star"></i>
          Opción Recomendada
        </div>
      )}
      <h3 className={`text-xl font-bold ${titleColor} mb-2`}>{result.productName}</h3>
      <div className="flex items-center mb-3">
        {isSafe ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <i className="fa-solid fa-check-circle mr-2"></i>
            Apto para Celíacos
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <i className="fa-solid fa-times-circle mr-2"></i>
            No Apto / Riesgoso
          </span>
        )}
      </div>
      <p className="text-sm text-gray-700">{result.reasoning}</p>
      {result.warnings && result.warnings.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-yellow-700 mb-1 flex items-center">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              Advertencias
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
              {result.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};

export const ComparisonResultCard: React.FC<ComparisonResultCardProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }
  
  const sortedResults = [...results].sort((a, b) => Number(b.isSafe) - Number(a.isSafe));
  
  const shareText = `Comparación de Celia-IA: ${results.map(r => `${r.productName} (${r.isSafe ? '✔️ Apto' : '❌ No Apto'})`).join(', ')}. Descubre más en Celia-IA.`;
  const recommended = sortedResults.find(r => r.isSafe);
  const shareTitle = recommended 
    ? `Comparación de Celia-IA: La mejor opción es ${recommended.productName}`
    : 'Comparación de Celia-IA';

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-md transition-all duration-300 animate-fade-in">
       <ShareButton
        title={shareTitle}
        text={shareText}
        className="absolute top-4 right-4 sm:top-6 sm:right-6"
      />
       <div className="flex items-center gap-4 mb-6">
        <div className="inline-block bg-blue-100 text-blue-700 p-3 rounded-full">
            <i className="fa-solid fa-scale-balanced text-2xl"></i>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 pr-12">Resultado de la Comparación</h2>
      </div>

      <div className="space-y-6 pt-2">
        {sortedResults.map((result, index) => (
          <ComparisonItem 
            key={index} 
            result={result} 
            isRecommended={index === 0 && result.isSafe}
          />
        ))}
      </div>
    </div>
  );
};