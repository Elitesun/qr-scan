import { useState } from 'react';
import { verifyAgeAction, type AgeVerificationResult } from '../actions/verifyAge';

export type { AgeVerificationResult };

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
            // Call server action instead of API endpoint
            const data = await verifyAgeAction(imageData);

            setVerificationResult(data);
            setIsVerifying(false);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error during verification');
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
