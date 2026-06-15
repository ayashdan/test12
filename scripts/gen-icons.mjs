import sharp from 'sharp'
import { mkdirSync } from 'fs'

function makeSVG(size) {
  const s = size
  const r = s * 0.22  // corner radius

  // Football dimensions - very elongated so it's clearly a football not a circle
  const cx = s * 0.5
  const cy = s * 0.54
  const rx = s * 0.36
  const ry = s * 0.22

  const lx = cx + s * 0.04  // lace x center
  const lTop = cy - ry * 0.75
  const lBot = cy + ry * 0.75
  const lw = s * 0.08  // lace stitch width
  const sw = s * 0.028  // stroke width

  const numSize = s * 0.145
  const numY = s * 0.255

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${s}" y2="${s}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#16a34a"/>
      <stop offset="100%" stop-color="#14532d"/>
    </linearGradient>
    <linearGradient id="ball" x1="${cx-rx}" y1="${cy-ry}" x2="${cx+rx}" y2="${cy+ry}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#7c2d12"/>
    </linearGradient>
  </defs>

  <!-- Green background -->
  <rect width="${s}" height="${s}" rx="${r}" fill="url(#bg)"/>

  <!-- Score numbers -->
  <text x="${cx - s*0.21}" y="${numY}" font-family="monospace" font-size="${numSize}" font-weight="900" fill="#ffffff" text-anchor="middle" opacity="0.95">21</text>
  <text x="${cx + s*0.21}" y="${numY}" font-family="monospace" font-size="${numSize}" font-weight="900" fill="#facc15" text-anchor="middle" opacity="0.95">17</text>

  <!-- Football body - wide ellipse -->
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#ball)"/>

  <!-- White end stripes -->
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="white" stroke-width="${sw * 2.5}" stroke-dasharray="${ry * 1.2} ${rx * 6}" opacity="0.35"/>

  <!-- Lace center line -->
  <line x1="${lx}" y1="${lTop}" x2="${lx}" y2="${lBot}" stroke="white" stroke-width="${sw}" stroke-linecap="round"/>

  <!-- Lace stitches (5 of them) -->
  ${[0,1,2,3,4].map(i => {
    const y = lTop + (lBot - lTop) * i / 4
    return `<line x1="${lx}" y1="${y}" x2="${lx + lw}" y2="${y}" stroke="white" stroke-width="${sw}" stroke-linecap="round"/>`
  }).join('\n  ')}
</svg>`
}

mkdirSync('public/icons', { recursive: true })

for (const size of [192, 512]) {
  const svg = Buffer.from(makeSVG(size))
  await sharp(svg).png().toFile(`public/icons/icon-${size}-v2.png`)
  console.log(`Generated icon-${size}-v2.png`)
}
