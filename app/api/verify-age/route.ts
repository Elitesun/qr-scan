import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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
        const filepath = join(process.cwd(), 'public', 'uploads', filename);

        // Save the file server-side
        await writeFile(filepath, buffer);

        // Simulate age verification 
        const isAdult = simulateAgeVerification();

        // Log for server-side tracking
        console.log(`Age verification: ${filename} - Result: ${isAdult ? '+18' : '-18'}`);

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
