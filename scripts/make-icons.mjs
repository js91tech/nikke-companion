import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#12080a"/>
  <path d="M96 352 L256 96 L416 352 Z" stroke="#e85d4c" stroke-width="24" fill="rgba(232,93,76,0.15)"/>
  <circle cx="256" cy="280" r="48" fill="#f0b429"/>
  <path d="M160 384h192" stroke="#a8928c" stroke-width="16" stroke-linecap="round"/>
</svg>`

const buf = Buffer.from(svg)
await sharp(buf).resize(192, 192).png().toFile('public/pwa-192.png')
await sharp(buf).resize(512, 512).png().toFile('public/pwa-512.png')
writeFileSync('public/favicon.svg', svg.replace('viewBox="0 0 512 512"', 'viewBox="0 0 512 512"'))
console.log('icons ok')
