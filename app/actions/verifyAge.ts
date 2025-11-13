'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';

// Simulated age verification function
// In production, this would call a real service
function simulateAgeVerification(): boolean {
    // For demo purposes: randomly return true (adult) or false (minor)
    return Math.random() > 0.5;
}

export type AgeVerificationResult = {
    success: boolean;
    isAdult: boolean;
    filename: string;
    message: string;
};

export async function verifyAgeAction(imageData: string): Promise<AgeVerificationResult> {
    try {
        if (!imageData) {
            throw new Error('No image provided');
        }

        // Remove the data:image/png;base64, prefix
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate filename with timestamp
        const filename = `verification-${Date.now()}.png`;

        // Try to save to public/uploads first (for local dev), fall back to temp dir (for Vercel)
        let filepath: string;
        let savedSuccessfully = false;

        // First attempt: save to public/uploads (works locally, viewable)
        try {
            filepath = join(process.cwd(), 'public', 'uploads', filename);
            await writeFile(filepath, buffer);
            savedSuccessfully = true;
        } catch (e) {
            // Second attempt: save to OS temp directory (works on Vercel)
            try {
                filepath = join(os.tmpdir(), filename);
                await writeFile(filepath, buffer);
                savedSuccessfully = true;
            } catch (tempError) {
                // Silent fail - verification continues regardless
            }
        }

        // Simulate age verification
        const isAdult = simulateAgeVerification(); return {
            success: true,
            isAdult,
            filename,
            message: isAdult ? 'Access granted: Adult verified' : 'Access denied: Minor detected'
        };
    } catch (error) {
        throw new Error('Verification failed');
    }
}
