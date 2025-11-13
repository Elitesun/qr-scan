
import { useState } from 'react';

export function useImageSave() {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const saveImage = async (imageData: string): Promise<boolean> => {
        if (!imageData) return false;

        setIsSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/save-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Image saved: ${data.filename}`);
                setIsSaving(false);
                return true;
            } else {
                setMessage('Failed to save image');
                setIsSaving(false);
                return false;
            }
        } catch (err) {
            setMessage('Error saving image');
            setIsSaving(false);
            return false;
        }
    };

    return {
        saveImage,
        isSaving,
        message,
        setMessage
    };
}
