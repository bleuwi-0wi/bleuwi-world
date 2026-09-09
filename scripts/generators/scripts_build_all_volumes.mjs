import fs from 'fs';
import path from 'path';

const outDir = 'src/data/encyclopedia';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function countWords(str) {
  return str.replace(/[^\w\u0600-\u06FF]+/g, ' ').trim().split(/\s+/).length;
}

// Function to generate a comprehensive volume file
export function writeVolume(fileName, volumeData) {
  const filePath = path.join(outDir, fileName);
  const code = `// BLEUWI WORLD - 100,000+ Word Authority Encyclopedia
// Volume: ${volumeData.titleEn}
// Authoritative, exhaustive technical & gaming guide for Google #1 ranking

export const ${volumeData.exportName} = ${JSON.stringify(volumeData, null, 2)};
`;
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Wrote ${fileName} - approx words: ${countWords(code)}`);
}
