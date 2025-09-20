
import { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const browserSupportsSpeechRecognition = !!SpeechRecognition;

export const useSpeechRecognition = (onTranscript: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const onResult = useCallback((event: any) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + ' ';
      }
    }
    if (finalTranscript) {
      onTranscript(finalTranscript);
    }
  }, [onTranscript]);

  const onEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  const onError = useCallback((event: any) => {
    console.error('Speech recognition error', event.error);
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-AR';

    recognition.addEventListener('result', onResult);
    recognition.addEventListener('end', onEnd);
    recognition.addEventListener('error', onError);

    recognitionRef.current = recognition;

    return () => {
      recognition.removeEventListener('result', onResult);
      recognition.removeEventListener('end', onEnd);
      recognition.removeEventListener('error', onError);
      recognition.stop();
    };
  }, [onResult, onEnd, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false); // Manually set state in case 'end' event doesn't fire immediately
    }
  }, [isListening]);

  return {
    isListening,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
  };
};
