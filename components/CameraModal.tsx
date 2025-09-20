
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("No se pudo acceder a la cámara. Asegúrate de haber otorgado los permisos.");
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl z-10" aria-label="Cerrar modal">
          &times;
        </button>
        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Escanear Producto</h3>
        {error ? (
          <div className="text-center p-8 text-red-600">
            <p><i className="fa-solid fa-circle-xmark mr-2"></i>{error}</p>
            <button onClick={startCamera} className="mt-4 bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600">
              Intentar de nuevo
            </button>
          </div>
        ) : (
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
             <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
             <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full h-full border-4 border-white border-dashed rounded-lg opacity-50" aria-hidden="true"></div>
             </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleCapture}
            disabled={!stream || !!error}
            className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-110"
            aria-label="Capturar foto"
          >
            <i className="fa-solid fa-camera"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
