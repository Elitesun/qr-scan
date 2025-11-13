import { useState } from 'react';

export type AgeVerificationResult = {
    isAdult: boolean; // true if +18, false if -18
    filename: string;
    message?: string;
};

export function useAgeVerification() {
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<AgeVerificationResult | null>(null);
    const [error, setError] = useState('');

    const verifyAge = async (imageData: string): Promise<AgeVerificationResult | null> => {
        if (!imageData) return null;

        setIsVerifying(true);
        setError('');
        setVerificationResult(null);

        try {
            const response = await fetch('/api/verify-age', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData })
            });

            const data = await response.json();

            if (response.ok) {
                setVerificationResult(data);
                setIsVerifying(false);
                return data;
            } else {
                setError(data.error || 'Verification failed');
                setIsVerifying(false);
                return null;
            }
        } catch (err) {
            setError('Error during verification');
            setIsVerifying(false);
            return null;
        }
    };

    const resetVerification = () => {
        setVerificationResult(null);
        setError('');
    };

    return {
        verifyAge,
        isVerifying,
        verificationResult,
        error,
        resetVerification
    };
}
