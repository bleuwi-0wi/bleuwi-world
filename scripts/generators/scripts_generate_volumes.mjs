import fs from 'fs';
import path from 'path';

const outDir = 'src/data/encyclopedia';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to count words
function countWords(str) {
  return str.replace(/[^\w\u0600-\u06FF]+/g, ' ').trim().split(/\s+/).length;
}

console.log('Generating Volume 1 to 10 for BLEUWI WORLD (100,000+ Words)...');
