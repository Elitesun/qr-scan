'use client';

import { useState } from 'react';
import { useCamera } from './hooks/useCamera';
import { useAgeVerification } from './hooks/useAgeVerification';

export default function Home() {
  const { videoRef, canvasRef, isCameraOn, error, startCamera, stopCamera, takePicture } = useCamera();
  const { verifyAge, isVerifying, verificationResult, error: verifyError, resetVerification } = useAgeVerification();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleTakePicture = () => {
    const imageData = takePicture();
    if (imageData) {
      setCapturedImage(imageData);
      resetVerification();
    }
  };

  const handleVerifyAge = async () => {
    if (capturedImage) {
      await verifyAge(capturedImage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center w-full px-4 py-6 sm:py-16 md:py-24">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ transform: 'scaleX(-1)' }}
          className={`w-full max-w-2xl border border-black aspect-video object-cover ${isCameraOn ? '' : 'hidden'}`}
        />

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && (
          <div className="w-full max-w-2xl mt-4">
            {/* Show preview only on mobile */}
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full border-2 border-black sm:hidden"
            />

            {verificationResult && (
              <div className={`mt-4 p-6 rounded-lg flex items-center justify-center gap-4 ${verificationResult.isAdult
                ? 'bg-green-100 border-2 border-green-600'
                : 'bg-red-100 border-2 border-red-600'
                }`}>
                {verificationResult.isAdult ? (
                  <>
                    <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-xl font-bold text-green-800">+18 ans</p>
                      <p className="text-sm text-green-700">Accès autorisé</p>
                    </div>
                  </>
                ) : (
                  <>
                    <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div>
                      <p className="text-xl font-bold text-red-800">-18 ans</p>
                      <p className="text-sm text-red-700">Accès refusé</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mt-6">
          {isCameraOn ? (
            <>
              <button
                onClick={handleTakePicture}
                className="flex-1 px-6 py-3 bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors font-medium rounded"
              >
                Take photo
              </button>
              <button
                onClick={stopCamera}
                className="flex-1 px-6 py-3 bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 transition-colors font-medium rounded"
              >
                Stop Camera
              </button>
            </>
          ) : (
            <button
              onClick={startCamera}
              className="w-full px-6 py-3 bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors font-medium rounded"
            >
              Start Camera
            </button>
          )}

          {capturedImage && !verificationResult && (
            <button
              onClick={handleVerifyAge}
              disabled={isVerifying}
              className="flex-1 px-6 py-3 bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>

        {(error || verifyError) && (
          <p className="text-sm sm:text-base mt-4 text-center px-4 text-red-600">{error || verifyError}</p>
        )}
      </div>
    </div>
  );
}
