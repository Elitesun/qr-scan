'use client';

import { useState, useEffect } from 'react';
import { useCamera } from './hooks/useCamera';
import { useAgeVerification } from './hooks/useAgeVerification';

export default function Home() {
  const { videoRef, canvasRef, isCameraOn, error, startCamera, stopCamera, takePicture } = useCamera();
  const { verifyAge, isVerifying, verificationResult, error: verifyError, resetVerification } = useAgeVerification();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (verificationResult) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [verificationResult]);

  const handleTakePicture = () => {
    const imageData = takePicture();
    if (imageData) {
      setCapturedImage(imageData);
      stopCamera(); // Stop camera after taking photo
      resetVerification();
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    resetVerification();
    setShowToast(false);
    startCamera(); // Restart camera
  };

  const handleUpload = async () => {
    if (capturedImage) {
      await verifyAge(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col sm:relative sm:min-h-screen sm:bg-gray-100">
      {/* Toast Notification */}
      {showToast && verificationResult && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${verificationResult.isAdult
          ? 'bg-green-100 border-2 border-green-600'
          : 'bg-red-100 border-2 border-red-600'
          }`}>
          {verificationResult.isAdult ? (
            <>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-bold text-green-800">+18 ans</p>
                <p className="text-sm text-green-700">Accès autorisé</p>
              </div>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div>
                <p className="font-bold text-red-800">-18 ans</p>
                <p className="text-sm text-red-700">Accès refusé</p>
              </div>
            </>
          )}
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex flex-col items-center w-full h-full flex-1 sm:px-4 sm:py-16 md:py-24">

        {/* Show video when camera is on and no image is captured */}
        {!capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ transform: 'scaleX(-1)' }}
            className={`w-full h-full sm:max-w-2xl sm:h-auto sm:border sm:border-black sm:aspect-video object-cover ${isCameraOn ? '' : 'hidden'}`}
          />
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Show captured image when available */}
        {capturedImage && (
          <div className="w-full h-full sm:max-w-2xl sm:h-auto flex flex-col">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full sm:h-auto sm:border-2 sm:border-black sm:aspect-video object-cover"
            />
          </div>
        )}

        {/* Two-button interface */}
        <div
          className="absolute bottom-0 left-0 right-0 sm:relative flex flex-col sm:flex-row gap-3 w-full sm:max-w-2xl sm:mt-6 px-4 py-6 sm:px-0 sm:py-0 bg-gradient-to-t from-black/80 to-transparent sm:bg-transparent"
        >
          {!capturedImage ? (
            <>
              {/* Camera is active - show Take Photo and Stop Camera */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-1 sm:gap-3">
                {/* Red circular shutter button for mobile, regular button for desktop */}
                <button
                  onClick={handleTakePicture}
                  disabled={!isCameraOn}
                  className="w-20 h-20 rounded-full bg-red-600 border-4 border-white hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:h-auto sm:rounded sm:border-0 sm:flex-1 sm:px-6 sm:py-3 sm:font-medium"
                >
                  <span className="hidden sm:inline">Take Photo</span>
                </button>

                <button
                  onClick={stopCamera}
                  disabled={!isCameraOn}
                  className="px-6 py-3 bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 transition-colors font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed sm:flex-1"
                >
                  Stop Camera
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Image captured - show Retake Photo and Upload */}
              <button
                onClick={handleRetakePhoto}
                disabled={isVerifying}
                className="flex-1 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retake Photo
              </button>
              <button
                onClick={handleUpload}
                disabled={isVerifying || !!verificationResult}
                className="flex-1 px-6 py-3 bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Uploading...' : 'Upload'}
              </button>
            </>
          )}
        </div>

        {(error || verifyError) && (
          <p className="text-sm sm:text-base mt-4 text-center px-4 text-red-600">{error || verifyError}</p>
        )}
      </div>
    </div>
  );
}
