import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(__dirname, 'public', 'qr-code.png');

async function generate() {
  const url = 'https://www.linkedin.com/in/heltonj866';
  await QRCode.toFile(dest, url, {
    width: 600,
    margin: 2,
    color: {
      dark: '#090d16',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });
  console.log('Generated real scannable QR code at:', dest);
}

generate().catch(console.error);
