// Text of the images in the fonts of djason-chery.dev, drawn as SVG paths: GitHub shows the images as <img> and an image
// renderer does not load web fonts, so each letter is taken from the font file (fontkitten) and written as a path.
//   const display = loadFont('Archivo-Expanded-SemiBold.ttf')
//   textPath(display, 'DJASON', { x: 80, y: 300, size: 160, fill: '#eef1f3' })
import { readFileSync } from 'node:fs'
import { create } from 'fontkitten'

const FONTS = new URL('../sources/fonts/', import.meta.url)

export const loadFont = (file) => create(readFileSync(new URL(file, FONTS)))

// The fonts of the site: wide capitals of the logo for the titles, narrow Barlow Condensed for labels and texts
export const fonts = {
    display: loadFont('Archivo-Expanded-SemiBold.ttf'),
    label: loadFont('BarlowCondensed-SemiBold.ttf'),
    text: loadFont('BarlowCondensed-Regular.ttf'),
}

// Width in pixels of a line at a size; tracking: space added after each letter, in em (0.22 = the labels of the site)
export const measure = (font, text, size, tracking = 0) => {
    const glyphs = font.glyphsForString(text)
    const advance = glyphs.reduce((sum, glyph) => sum + glyph.advanceWidth, 0) * size / font.unitsPerEm
    return advance + tracking * size * Math.max(0, glyphs.length - 1)
}

// Height of the capitals at a size (to centre a line of capitals on a point)
export const capHeight = (font, size) => font.capHeight * size / font.unitsPerEm

// The largest size (up to max) at which a line fits in a width
export const fitSize = (font, text, max, width, tracking = 0) => Math.min(max, width / measure(font, text, 1, tracking))

// Left side bearing of the first letter at a size: the ink of a big title starts exactly on its margin
export const bearing = (font, text, size) => (font.glyphsForString(text)[0]?.bbox.minX ?? 0) * size / font.unitsPerEm

// One line as SVG paths; anchor: start, middle or end of x; y is the baseline
export const textPath = (font, text, { x, y, size, fill, tracking = 0, anchor = 'start', opacity = 1 }) => {
    const width = measure(font, text, size, tracking)
    const scale = size / font.unitsPerEm
    let pen = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
    const paths = font.glyphsForString(text).map((glyph) => {
        const d = glyph.path.toSVG()
        const path = d ? `<path transform="translate(${pen.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(5)} ${(-scale).toFixed(5)})" d="${d}"/>` : ''
        pen += glyph.advanceWidth * scale + tracking * size
        return path
    })
    return `<g fill="${fill}" opacity="${opacity}">${paths.join('')}</g>`
}

// A paragraph cut into lines no wider than a width (greedy, word by word)
export const wrap = (font, text, size, width) => {
    const lines = []
    let line = ''
    for (const word of text.split(' ')) {
        const next = line ? `${line} ${word}` : word
        if (line && measure(font, next, size) > width) {
            lines.push(line)
            line = word
        } else {
            line = next
        }
    }
    if (line) lines.push(line)
    return lines
}

// Several lines from a baseline, one under the other
export const paragraph = (font, lines, { x, y, size, leading, fill, opacity = 1 }) =>
    lines.map((line, index) => textPath(font, line, { x, y: y + index * leading, size, fill, opacity })).join('')
