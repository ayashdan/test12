import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'

function makeSVG(size) {
  const cx = size / 2
  const cy = size / 2
  const rx = size * 0.42
  const ry = size * 0.30
  const fontSize = size * 0.13
  const numY = size * 0.14
  const scoreOffset = size * 0.22
  const laceCenterX = cx + size * 0.05
  const laceTop = cy - ry * 0.65
  const laceBot = cy + ry * 0.65
  const laceStep = (laceBot - laceTop) / 5
  const laceWidth = size * 0.10
  const stripeY1 = cy - ry * 0.48
  const stripeY2 = cy + ry * 0.48
  const bg = '#0b1120'

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${bg}"/>

  <!-- Score numbers -->
  <text x="${cx - scoreOffset}" y="${numY}" font-family="monospace" font-size="${fontSize}" font-weight="900" fill="#22c55e" text-anchor="middle">21</text>
  <text x="${cx + scoreOffset}" y="${numY}" font-family="monospace" font-size="${fontSize}" font-weight="900" fill="#facc15" text-anchor="middle">17</text>

  <!-- Football body -->
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  </defs>
  <ellipse cx="${cx}" cy="${cy + size * 0.05}" rx="${rx}" ry="${ry}" fill="url(#g)"/>

  <!-- White stripes -->
  <path d="M${cx - rx * 0.65} ${stripeY1 + size * 0.05} Q${cx} ${stripeY1 - size * 0.05 + size * 0.05} ${cx + rx * 0.65} ${stripeY1 + size * 0.05}" stroke="white" stroke-width="${size * 0.025}" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M${cx - rx * 0.65} ${stripeY2 + size * 0.05} Q${cx} ${stripeY2 + size * 0.05 + size * 0.05} ${cx + rx * 0.65} ${stripeY2 + size * 0.05}" stroke="white" stroke-width="${size * 0.025}" fill="none" stroke-linecap="round" opacity="0.7"/>

  <!-- Lace center line -->
  <line x1="${laceCenterX}" y1="${laceTop + size * 0.05}" x2="${laceCenterX}" y2="${laceBot + size * 0.05}" stroke="white" stroke-width="${size * 0.025}" stroke-linecap="round"/>

  <!-- Lace stitches -->
  ${[0,1,2,3,4].map(i => `<line x1="${laceCenterX}" y1="${laceTop + i * laceStep + size * 0.05}" x2="${laceCenterX + laceWidth}" y2="${laceTop + i * laceStep + size * 0.05}" stroke="white" stroke-width="${size * 0.025}" stroke-linecap="round"/>`).join('\n  ')}
</svg>`
}

mkdirSync('public/icons', { recursive: true })

for (const size of [192, 512]) {
  const svg = Buffer.from(makeSVG(size))
  await sharp(svg).png().toFile(`public/icons/icon-${size}.png`)
  console.log(`Generated icon-${size}.png`)
}
