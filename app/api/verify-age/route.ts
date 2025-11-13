import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';

// Simulated  age verification function
// In production, this would call a real service
function simulateAgeVerification(): boolean {
    // For demo purposes: I will randomly return true (adult) or false (minor)
    return Math.random() > 0.5;
}

export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        // Remove the data:image/png;base64, prefix
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate filename with timestamp
        const filename = `verification-${Date.now()}.png`;

        // Save to the OS temp directory (works on Vercel & serverless environments)
        const filepath = join(os.tmpdir(), filename);
        try {
            await writeFile(filepath, buffer);
        } catch (e) {
            // If writing fails, don't block verification — log and continue
            console.warn('Could not write image to disk, continuing without saving:', e);
        }

        // Simulate age verification 
        const isAdult = simulateAgeVerification();

        return NextResponse.json({
            success: true,
            isAdult,
            filename,
            message: isAdult ? 'Access granted: Adult verified' : 'Access denied: Minor detected'
        });
    } catch (error) {
        console.error('Error during age verification:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
