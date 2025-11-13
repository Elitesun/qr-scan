# Age Verification System - README

## Overview

This is a camera-based age verification system that captures a photo and simulates an AI/ML age detection service.

## Features

✅ Camera capture with live preview
✅ Server-side image saving
✅ Simulated age verification API
✅ Visual feedback (Green checkmark for +18, Red cross for -18)
✅ Mobile responsive design

## How It Works

### Frontend Flow:

1. Camera starts automatically
2. User takes a photo
3. Photo is sent to `/api/verify-age`
4. System displays result with visual indicators

### Backend Processing:

1. **Image Reception**: API receives base64 encoded image
2. **Server-Side Storage**: Image saved to `public/uploads/` with timestamp
3. **Age Verification**: Currently simulated (random result)
4. **Response**: Returns `{ isAdult: boolean, filename: string, message: string }`

## API Endpoint

### POST `/api/verify-age`

**Request:**

```json
{
  "image": "data:image/png;base64,..."
}
```

**Response (+18):**

```json
{
  "success": true,
  "isAdult": true,
  "filename": "verification-1234567890.png",
  "message": "Access granted: Adult verified"
}
```

**Response (-18):**

```json
{
  "success": true,
  "isAdult": false,
  "filename": "verification-1234567890.png",
  "message": "Access denied: Minor detected"
}
```

## Production Integration

### Replace Simulated Verification

In `app/api/verify-age/route.ts`, replace:

```typescript
const isAdult = simulateAgeVerification();
```

With your real AI service call:

```typescript
// Example with external AI service
const response = await fetch("https://your-ai-service.com/verify-age", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.AI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    image: base64Data,
    // Add other required parameters
  }),
});

const aiResult = await response.json();
const isAdult = aiResult.isAdult; // Adjust based on your AI service response
```

## Privacy & Data Considerations

### Server-Side Image Storage:

- Images are saved with timestamps
- Stored in `public/uploads/` directory
- **Security Note**: Consider moving to private storage in production
- **GDPR Compliance**: Implement data retention policies

### Recommended Improvements:

1. **Use Private Storage**: Store images outside `public/` folder
2. **Implement Cleanup**: Auto-delete images after verification
3. **Add Logging**: Track verification attempts for audit purposes
4. **Rate Limiting**: Prevent abuse of the API

## Environment Variables (for Production)

Create `.env.local`:

```env
AI_API_KEY=your_ai_service_api_key
AI_API_URL=https://your-ai-service.com
STORAGE_TYPE=local # or 's3', 'azure', etc.
```

## Files Structure

```
app/
├── page.tsx                    # Main UI component
├── hooks/
│   ├── useCamera.ts           # Camera control logic
│   ├── useAgeVerification.ts  # Age verification logic
│   └── useImageSave.ts        # (Old) Image save logic
└── api/
    ├── verify-age/
    │   └── route.ts           # Age verification API
    └── save-image/
        └── route.ts           # (Old) Simple image save API
```

## Notes

- Current verification is **simulated** (random 50/50 result)
- Images are saved server-side in `public/uploads/`
- System works on both mobile and desktop
- French language used for verification messages
