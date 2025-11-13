const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// Configuration
const APP_URL = process.env.APP_URL || "https://qr-scan-lake.vercel.app/";
const OUTPUT_DIR = path.join(__dirname, "..", "public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "qr-code.png");
const OUTPUT_SVG = path.join(OUTPUT_DIR, "qr-code.svg");

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
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    console.log(`✅ PNG QR code generated: ${OUTPUT_FILE}`);

    // Generate SVG QR Code
    await QRCode.toFile(OUTPUT_SVG, APP_URL, {
      type: "svg",
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    console.log(`✅ SVG QR code generated: ${OUTPUT_SVG}`);

    // Generate HTML file with QR code
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #fff;
      gap: 20px;
    }
    img {
      max-width: 300px;
      width: 100%;
      display: block;
    }
    a {
      color: #0066cc;
      font-size: 12px;
      font-family: monospace;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <img src="qr-code.svg" alt="QR Code" />
  <a href="${APP_URL}" target="_blank">${APP_URL}</a>
</body>
</html>`;

    const htmlFile = path.join(OUTPUT_DIR, "qr-code.html");
    fs.writeFileSync(htmlFile, htmlContent);
    console.log(`✅ HTML page generated: ${htmlFile}`);

    console.log("\n🎉 QR codes generated!");
  } catch (error) {
    console.error("❌ Error generating QR code:", error);
    process.exit(1);
  }
}

generateQRCode();
