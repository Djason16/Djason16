// Drawing parts shared by every image, in the art direction of djason-chery.dev and of the DC tool banners:
// ink ground with a faint vertical grid, aurora lights, grain, hairline rules, spaced labels.
// The images are drawn at twice their size on GitHub (1600 px for a column of about 800 px): 2 px here = 1 px there.
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'
import { fonts, textPath } from './text.mjs'

// Palette of the public pages of the site (assets/css/utils/variables.css)
export const INK = '#111417'
export const PAPER = '#eef1f3'
export const MUTED = '#a4b0b8'
export const MINT = '#7ee6a8'
// Rules: white at a low opacity, like --line
export const LINE = 'rgba(255,255,255,0.11)'

const LAYERS = new URL('../sources/layers/', import.meta.url)
const layer = (file) => new URL(file, LAYERS).pathname.replace(/^\/(\w:)/, '$1')

export const svg = (width, height, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`)
export const at = (input, left, top) => ({ input, left: Math.round(left), top: Math.round(top) })

// The ground: the ink and the grid of the banners (a thin line every `step` px, fading towards the bottom)
export const ground = (width, height, { step = 120, offset = 40, fade = 0.06 } = {}) => svg(width, height, `
<defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${fade}"/><stop offset="0.95" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<rect width="100%" height="100%" fill="${INK}"/>
${Array.from({ length: Math.ceil(width / step) }, (_, index) => `<rect x="${offset + index * step}" y="0" width="1.5" height="${height}" fill="url(#fade)"/>`).join('')}`)

// A layer of the banner model (an alpha mask) filled with a colour, at a size and an opacity
export const tinted = async (file, color, width, height, opacity = 1) => {
    const w = Math.max(1, Math.round(width))
    const h = Math.max(1, Math.round(height))
    let mask = sharp(layer(file)).resize(w, h, { fit: 'fill' }).extractChannel(0)
    if (opacity < 1) mask = sharp(await mask.png().toBuffer()).linear(opacity, 0)
    return sharp({ create: { width: w, height: h, channels: 3, background: color } }).joinChannel(await mask.png().toBuffer()).png().toBuffer()
}

// The three lights of the banner (2560 x 800, masks saved at half size), anchored on the right edge `right` of the image,
// squeezed by sx and sy; colors: medium, light, deep
const AURORA = [['aurora-1.png', 772], ['aurora-2.png', 1365], ['aurora-3.png', 1433]]
export const aurora = (colors, { right, top = 0, sx, sy, opacity = 1 }) => Promise.all(AURORA.map(async ([file, left], index) => {
    const { width, height } = await sharp(layer(file)).metadata()
    const input = await tinted(file, colors[index], width * 2 * sx, height * 2 * sy, opacity)
    return at(input, right - (2560 - left) * sx, top)
}))

export const logo = (width, color = PAPER) => tinted('logo-djason-chery.png', color, width, width * 82 / 298)

// The grain of the banners: grey noise at a very low opacity
export const grain = (width, height, alpha = 5) => {
    const pixels = Buffer.alloc(width * height * 4)
    let seed = 1607
    for (let index = 0; index < pixels.length; index += 4) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        pixels.fill(seed >> 23, index, index + 3)
        pixels[index + 3] = alpha
    }
    return { input: pixels, raw: { width, height, channels: 4 }, left: 0, top: 0 }
}

// Small label in spaced capitals (the .eyebrow of the site: Barlow Condensed semi bold, 0.22em)
export const eyebrow = (text, { x, y, size = 26, fill = MINT, anchor = 'start', tracking = 0.22 }) =>
    textPath(fonts.label, text.toUpperCase(), { x, y, size, fill, anchor, tracking })

// Writes a PNG with a palette (small files, the grain hides the steps of the gradients), lowering the quality until it
// weighs less than 290 KB; returns its size in KB
export const save = async (image, file) => {
    const pixels = await image.png().toBuffer()
    for (let quality = 88; ; quality -= 6) {
        const data = await sharp(pixels).png({ palette: true, quality, effort: 10, dither: 0.5, compressionLevel: 9 }).toBuffer()
        if (data.length < 290 * 1024 || quality <= 52) {
            writeFileSync(file, data)
            return Math.round(data.length / 1024)
        }
    }
}
