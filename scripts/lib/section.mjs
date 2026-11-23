// Header of a numbered section, like the SectionHead of djason-chery.dev: a mint label "01 · ABOUT" above a large title
// in wide capitals on the left, a short text on the right, a hairline under them
import sharp from 'sharp'
import { LINE, MINT, MUTED, PAPER, eyebrow, grain, ground, save, svg } from './draw.mjs'
import { bearing, fitSize, fonts, paragraph, textPath, wrap } from './text.mjs'

const WIDTH = 1600
const HEIGHT = 300
const MARGIN = 88

export const section = async (number, copy, file) => {
    const { display, text } = fonts
    const title = copy.title.toUpperCase()
    const size = fitSize(display, title, 92, 900)
    const titleBase = 214
    const lines = wrap(text, copy.text, 32, 470)
    const textTop = titleBase - (lines.length - 1) * 42
    const body = [
        `<defs><radialGradient id="light" cx="0.12" cy="0.2" r="0.7"><stop offset="0" stop-color="${MINT}" stop-opacity="0.07"/><stop offset="1" stop-color="${MINT}" stop-opacity="0"/></radialGradient></defs>`,
        `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#light)"/>`,
        eyebrow(`${String(number).padStart(2, '0')} · ${copy.label}`, { x: MARGIN, y: 100, size: 28 }),
        textPath(display, title, { x: MARGIN - bearing(display, title, size), y: titleBase, size, fill: PAPER }),
        paragraph(text, lines, { x: WIDTH - MARGIN - 470, y: textTop, size: 32, leading: 42, fill: MUTED }),
        `<rect x="${MARGIN}" y="${HEIGHT - 44}" width="${WIDTH - 2 * MARGIN}" height="2" fill="${LINE}"/>`,
    ].join('')
    const image = sharp(ground(WIDTH, HEIGHT)).composite([{ input: svg(WIDTH, HEIGHT, body), left: 0, top: 0 }, grain(WIDTH, HEIGHT)])
    return save(image, file)
}
