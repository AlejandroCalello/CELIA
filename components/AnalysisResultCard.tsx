import React from 'react';
import type { ProductAnalysis } from '../types';
import { ShareButton } from './ShareButton';

interface AnalysisResultCardProps {
  result: ProductAnalysis;
}

const Tag: React.FC<{ text: string; color: string; icon: string }> = ({ text, color, icon }) => (
  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
    <i className={`fa-solid ${icon} mr-2`}></i>
    {text}
  </div>
);

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ result }) => {
  const isSafe = result.isSafe;
  const cardBorderColor = isSafe ? 'border-green-400' : 'border-red-400';
  const cardBgColor = isSafe ? 'bg-green-50' : 'bg-red-50';
  const titleColor = isSafe ? 'text-green-800' : 'text-red-800';

  const confidenceMap = {
    'Alta': { color: 'bg-blue-100 text-blue-800', icon: 'fa-check-circle' },
    'Media': { color: 'bg-yellow-100 text-yellow-800', icon: 'fa-exclamation-triangle' },
    'Baja': { color: 'bg-orange-100 text-orange-800', icon: 'fa-question-circle' },
    'Incierta': { color: 'bg-gray-100 text-gray-800', icon: 'fa-minus-circle' }
  };

  const confidenceStyle = confidenceMap[result.confidence] || confidenceMap['Incierta'];

  const shareText = `Análisis de Celia-IA para "${result.productName}": ${result.isSafe ? '✔️ Apto para celíacos.' : '❌ No apto / Riesgoso.'} Razón: ${result.reasoning.substring(0, 150)}... Descubre más en Celia-IA.`;

  return (
    <div className={`relative rounded-xl border ${cardBorderColor} ${cardBgColor} p-6 sm:p-8 shadow-md transition-all duration-300 animate-fade-in`}>
      <ShareButton
        title={`Análisis de Celia-IA: ${result.productName}`}
        text={shareText}
        className="absolute top-4 right-4 sm:top-6 sm:right-6"
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className={`text-2xl sm:text-3xl font-bold ${titleColor} pr-12`}>{result.productName}</h2>
        <Tag text={`Confianza: ${result.confidence}`} color={confidenceStyle.color} icon={confidenceStyle.icon} />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <i className={`fa-solid ${isSafe ? 'fa-shield-halved text-green-600' : 'fa-ban text-red-600'} mr-3`}></i>
            Veredicto
          </h3>
          <p className="text-gray-600">{result.reasoning}</p>
        </div>

        {result.warnings && result.warnings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center">
              <i className="fa-solid fa-triangle-exclamation mr-3"></i>
              Advertencias
            </h3>
            <ul className="list-disc list-inside space-y-1 text-yellow-800 bg-yellow-50 p-4 rounded-lg">
              {result.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {result.alternatives && result.alternatives.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
              <i className="fa-solid fa-lightbulb mr-3"></i>
              Alternativas Seguras
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.alternatives.map((alt, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};