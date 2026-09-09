import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const assetsDir = path.join(__dirname, 'src', 'assets')

async function optimizeImages() {
  console.log('🚀 Starting Sharp In-Memory Image Optimization...')

  const targets = [
    { file: 'freefire-16.jpeg', quality: 80, width: 800 },
    { file: 'freefire-17.jpeg', quality: 80, width: 800 },
    { file: 'freefire-18.jpeg', quality: 80, width: 800 },
    { file: 'freefire-19.jpeg', quality: 80, width: 800 },
    { file: 'card-win-24.png', quality: 82, width: 800 },
    { file: 'card-win-25.png', quality: 82, width: 800 },
    { file: 'card-win-26.png', quality: 82, width: 800 },
    { file: 'card-video-5.jpg', quality: 82, width: 800 },
    { file: 'card-panels-7.jpg', quality: 82, width: 800 },
    { file: 'card-digital-6.jpg', quality: 82, width: 800 },
    { file: 'card-design-8.jpg', quality: 82, width: 800 },
    { file: '1.webp', quality: 80, width: 1200 },
    { file: '2.webp', quality: 80, width: 1200 },
    { file: '3.webp', quality: 80, width: 1200 },
    { file: '4.webp', quality: 80, width: 1200 },
    { file: 'game-gta-v.jpeg', quality: 82, width: 800 },
    { file: 'game-red-dead-2.jpeg', quality: 82, width: 800 },
    { file: 'game-fifa.jpg', quality: 82, width: 800 },
  ]

  let totalBefore = 0
  let totalAfter = 0

  for (const item of targets) {
    const filePath = path.join(assetsDir, item.file)
    if (!fs.existsSync(filePath)) continue

    const inputBuffer = fs.readFileSync(filePath)
    const beforeSize = inputBuffer.length
    totalBefore += beforeSize

    const ext = path.extname(item.file).toLowerCase()
    let pipeline = sharp(inputBuffer).resize({ width: item.width, withoutEnlargement: true })

    if (ext === '.png') {
      pipeline = pipeline.png({ quality: item.quality, compressionLevel: 9, effort: 7 })
    } else if (ext === '.jpeg' || ext === '.jpg') {
      pipeline = pipeline.jpeg({ quality: item.quality, mozjpeg: true })
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: item.quality, effort: 6 })
    }

    const outputBuffer = await pipeline.toBuffer()
    const afterSize = outputBuffer.length

    if (afterSize < beforeSize) {
      fs.writeFileSync(filePath, outputBuffer)
      totalAfter += afterSize
      const savings = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1)
      console.log(`✅ ${item.file}: ${(beforeSize / 1024).toFixed(0)}KB -> ${(afterSize / 1024).toFixed(0)}KB (-${savings}%)`)
    } else {
      totalAfter += beforeSize
      console.log(`ℹ️ ${item.file}: already optimal (${(beforeSize / 1024).toFixed(0)}KB)`)
    }
  }

  // Create hero video poster
  const posterPath = path.join(assetsDir, 'hero-video-poster.webp')
  const srcRef = path.join(assetsDir, 'card-video-5.jpg')
  if (fs.existsSync(srcRef)) {
    const posterBuf = await sharp(fs.readFileSync(srcRef))
      .resize({ width: 960, height: 540, fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer()
    fs.writeFileSync(posterPath, posterBuf)
    console.log(`🎬 Created hero video poster: hero-video-poster.webp (${(posterBuf.length / 1024).toFixed(0)}KB)`)
  }

  const overallSavings = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
  console.log(`\n🎉 Total image payload reduced from ${(totalBefore / 1024).toFixed(0)}KB to ${(totalAfter / 1024).toFixed(0)}KB (-${overallSavings}%)!`)
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err)
  process.exit(1)
})
