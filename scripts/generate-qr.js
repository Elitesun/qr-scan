const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Configuration
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'qr-code.png');
const OUTPUT_SVG = path.join(OUTPUT_DIR, 'qr-code.svg');

async function generateQRCode() {
  try {
    console.log(`Generating QR code for URL: ${APP_URL}`);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate PNG QR Code
    await QRCode.toFile(OUTPUT_FILE, APP_URL, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    console.log(`✅ PNG QR code generated: ${OUTPUT_FILE}`);

    // Generate SVG QR Code
    await QRCode.toFile(OUTPUT_SVG, APP_URL, {
      type: 'svg',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    console.log(`✅ SVG QR code generated: ${OUTPUT_SVG}`);

    // Generate HTML file with QR code
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Age Verification QR Code</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 500px;
    }
    h1 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 28px;
    }
    .subtitle {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }
    img {
      max-width: 100%;
      height: auto;
      border: 2px solid #eee;
      border-radius: 10px;
      padding: 20px;
      background: white;
    }
    .url {
      margin-top: 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
      word-break: break-all;
      font-family: monospace;
      font-size: 14px;
      color: #555;
    }
    .instructions {
      margin-top: 20px;
      padding: 15px;
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      text-align: left;
      font-size: 14px;
      line-height: 1.6;
    }
    @media print {
      body {
        background: white;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Age Verification System</h1>
    <p class="subtitle">Scan to verify your age</p>
    <img src="qr-code.svg" alt="QR Code" />
    <div class="url">${APP_URL}</div>
    <div class="instructions">
      <strong>📱 Instructions:</strong><br>
      1. Open your phone's camera<br>
      2. Point it at this QR code<br>
      3. Tap the notification to open<br>
      4. Follow the age verification process
    </div>
  </div>
</body>
</html>`;

    const htmlFile = path.join(OUTPUT_DIR, 'qr-code.html');
    fs.writeFileSync(htmlFile, htmlContent);
    console.log(`✅ HTML page generated: ${htmlFile}`);

    console.log('\n🎉 All QR codes generated successfully!');
    console.log('\nGenerated files:');
    console.log(`  - PNG: public/qr-code.png`);
    console.log(`  - SVG: public/qr-code.svg`);
    console.log(`  - HTML: public/qr-code.html`);
    console.log('\nTo view the HTML page:');
    console.log(`  Open: ${APP_URL}/qr-code.html`);
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
    process.exit(1);
  }
}

generateQRCode();
