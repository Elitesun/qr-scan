import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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
        const filename = `capture-${Date.now()}.png`;
        const filepath = join(process.cwd(), 'public', 'uploads', filename);

        // Save the file
        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            filename
        });
    } catch (error) {
        console.error('Error saving image:', error);
        return NextResponse.json(
            { error: 'Failed to save image' },
            { status: 500 }
        );
    }
}
