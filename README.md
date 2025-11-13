# QR Code Age Verification App

A Next.js application for age verification through photo capture and analysis. This app provides a mobile-first camera interface for capturing photos and verifying age through a simulated API.

## Features

- 📸 **Native Camera Experience**: Full-screen camera interface on mobile devices with a circular red shutter button
- 🔄 **Simple Workflow**: Take photo → Review → Upload or Retake
- ✅ **Age Verification**: Simulated age verification with toast notifications
- 📱 **Mobile-First Design**: Optimized for mobile with desktop support

### QR Code Generation

Generate a QR code for the app:

```bash
pnpm generate-qr
```

## How It Works

1. **Camera Access**: App requests camera permission and displays full-screen viewfinder
2. **Take Photo**: Tap the red circular button to capture a photo
3. **Review**: The captured image replaces the camera view
4. **Upload**: Submit the photo for age verification
5. **Verification**: Receive a toast notification (top-right) indicating verification result
6. **Retake**: Optionally retake the photo if needed

## Project Structure

```
qr-scan/
├── app/
│   ├── api/
│   │   ├── save-image/     # Image storage endpoint
│   │   └── verify-age/     # Age verification endpoint
│   ├── hooks/
│   │   ├── useCamera.ts          # Camera management hook
│   │   ├── useAgeVerification.ts # Age verification logic
│   │   └── useImageSave.ts       # Image saving utility
│   ├── globals.css         # Global styles and animations
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main camera interface
├── public/
│   └── qr-code.html        # QR code for sharing
└── scripts/
    └── generate-qr.js      # QR code generator
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Biome**: Fast linter and formatter
- **MediaDevices API**: Camera access

### there is a python version of this project but nextjs own was easy for quick testing on vercel

## Development

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm generate-qr` - Generate QR code
