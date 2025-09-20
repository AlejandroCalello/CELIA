
import React, { useState, useCallback } from 'react';
import { analyzeProduct, analyzeImage, analyzeMultipleProducts } from './services/geminiService';
import type { ProductAnalysis, HistoryItem } from './types';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { HeroSection } from './components/HeroSection';
import { SearchForm } from './components/SearchForm';
import { Footer } from './components/Footer';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useHistory } from './hooks/useHistory';
import { CameraModal } from './components/CameraModal';
import { ComparisonResultCard } from './components/ComparisonResultCard';
import { HistorySection } from './components/HistorySection';

// Helper to convert data URL to base64
const toBase64 = (dataUrl: string): { base64: string; mimeType: string } => {
  const regex = /^data:(.+);base64,(.*)$/;
  const matches = dataUrl.match(regex);
  if (matches && matches.length === 3) {
    return { mimeType: matches[1], base64: matches[2] };
  }
  throw new Error('Invalid data URL.');
};

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const [analysisResult, setAnalysisResult] = useState<ProductAnalysis | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ProductAnalysis[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { history, addToHistory, clearHistory } = useHistory();
  
  const { 
    isListening, 
    startListening, 
    stopListening,
    browserSupportsSpeechRecognition 
  } = useSpeechRecognition((transcript) => {
    setQuery(prev => prev + transcript);
  });
  
  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClearBeforeSubmit = () => {
    setError(null);
    setAnalysisResult(null);
    setComparisonResult(null);
  };

  const handleSearch = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isListening) stopListening();

    const trimmedQuery = query.trim();

    if (!trimmedQuery && !capturedImage) {
      setError('Por favor, ingresa un producto, usa tu voz o escanea una imagen.');
      return;
    }

    setIsLoading(true);
    handleClearBeforeSubmit();

    const isComparison = !capturedImage && trimmedQuery.includes(',');

    try {
      if (capturedImage) {
        const { base64, mimeType } = toBase64(capturedImage);
        const result = await analyzeImage(base64, mimeType);
        setAnalysisResult(result);
        addToHistory({ type: 'image', data: result, query: result.productName });
      } else if (isComparison) {
        const results = await analyzeMultipleProducts(trimmedQuery);
        setComparisonResult(results);
        addToHistory({ type: 'comparison', data: results, query: trimmedQuery });
      } else {
        const result = await analyzeProduct(trimmedQuery);
        setAnalysisResult(result);
        addToHistory({ type: 'single', data: result, query: trimmedQuery });
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(`Hubo un error al analizar. ${errorMessage} Asegúrate de que tu clave de API sea correcta.`);
    } finally {
      setIsLoading(false);
    }
  }, [query, capturedImage, isListening, stopListening, addToHistory]);

  const handleImageCapture = (dataUrl: string) => {
    setQuery('');
    setCapturedImage(dataUrl);
    setAnalysisResult(null);
    setComparisonResult(null);
    setError(null);
    setIsCameraOpen(false);
  };
  
  const handleClearImage = () => {
    setCapturedImage(null);
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    handleClearBeforeSubmit();
    if (item.type === 'comparison') {
      setComparisonResult(item.data as ProductAnalysis[]);
    } else {
      setAnalysisResult(item.data as ProductAnalysis);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="container mx-auto px-4 py-8">
        <HeroSection />

        <div className="max-w-3xl mx-auto mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          <SearchForm
            query={query}
            onQueryChange={(e) => setQuery(e.target.value)}
            onSearch={handleSearch}
            isLoading={isLoading}
            onVoiceClick={handleVoiceClick}
            isListening={isListening}
            onCameraClick={() => setIsCameraOpen(true)}
            imagePreviewUrl={capturedImage}
            onClearImage={handleClearImage}
            browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
          />
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          {isLoading && <Loader />}
          {error && <ErrorDisplay message={error} />}
          {analysisResult && !comparisonResult && <AnalysisResultCard result={analysisResult} />}
          {comparisonResult && <ComparisonResultCard results={comparisonResult} />}
        </div>

        <HistorySection 
          history={history}
          onItemClick={handleHistoryItemClick}
          onClear={clearHistory}
          isLoading={isLoading}
        />
      </main>
      <Footer />
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleImageCapture}
      />
    </div>
  );
};

export default App;
