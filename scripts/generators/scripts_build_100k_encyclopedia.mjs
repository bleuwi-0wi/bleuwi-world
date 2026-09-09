import fs from 'fs';
import path from 'path';

const outDir = 'src/data/encyclopedia';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Starting generation of 100,000+ Word Authority Encyclopedia...');
