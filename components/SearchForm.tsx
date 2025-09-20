
import React from 'react';

interface SearchFormProps {
  query: string;
  onQueryChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onVoiceClick: () => void;
  isListening: boolean;
  onCameraClick: () => void;
  imagePreviewUrl: string | null;
  onClearImage: () => void;
  browserSupportsSpeechRecognition: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ 
  query, 
  onQueryChange, 
  onSearch, 
  isLoading,
  onVoiceClick,
  isListening,
  onCameraClick,
  imagePreviewUrl,
  onClearImage,
  browserSupportsSpeechRecognition
}) => {
  const hasContent = !!query.trim() || !!imagePreviewUrl;

  return (
    <form onSubmit={onSearch} className="space-y-6">
      <label htmlFor="product-query" className="block text-lg font-semibold text-gray-700">
        Consultá por un producto
      </label>

      {imagePreviewUrl ? (
        <div className="relative group">
          <img src={imagePreviewUrl} alt="Vista previa del producto" className="w-full h-auto max-h-60 object-contain rounded-lg border border-gray-300" />
          <button
            type="button"
            onClick={onClearImage}
            disabled={isLoading}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-50"
            aria-label="Eliminar imagen"
          >
            &times;
          </button>
        </div>
      ) : (
        <div className="relative">
          <textarea
            id="product-query"
            value={query}
            onChange={onQueryChange}
            placeholder="Ej: Galletitas 'Frutigran' o compara: Leche La Serenisima, Yogur Yogurísimo..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-shadow duration-200 resize-none h-28"
            rows={3}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Ingresa un producto, una lista de ingredientes, o varios productos separados por comas para comparar.
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="submit"
          disabled={isLoading || !hasContent}
          className="flex-grow flex items-center justify-center bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analizando...
            </>
          ) : (
            <>
              <i className="fa-solid fa-magnifying-glass mr-2"></i>
              Analizar
            </>
          )}
        </button>
        {browserSupportsSpeechRecognition && (
          <button
            type="button"
            onClick={onVoiceClick}
            disabled={isLoading || !!imagePreviewUrl}
            className={`w-full sm:w-auto px-4 py-3 rounded-lg font-bold text-white transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`}
            aria-label={isListening ? "Detener dictado" : "Iniciar dictado por voz"}
          >
            <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
          </button>
        )}
        <button
          type="button"
          onClick={onCameraClick}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Escanear producto con la cámara"
        >
          <i className="fa-solid fa-camera"></i>
        </button>
      </div>
    </form>
  );
};
