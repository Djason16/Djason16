// The end of the page: a mint label, a large title, one line, the logo, a mint aurora (the contact links stay text under it)
import sharp from 'sharp'
import { FOOTER } from './content.mjs'
import { LINE, MINT, MUTED, PAPER, at, aurora, eyebrow, grain, ground, logo, save, svg } from './draw.mjs'
import { bearing, capHeight, fitSize, fonts, textPath } from './text.mjs'

export const footer = async (lang, file) => {
    const copy = FOOTER[lang]
    const width = 1600
    const height = 420
    const margin = 88
    const title = copy.title.toUpperCase()
    const size = fitSize(fonts.display, title, 100, 1100)
    const titleBase = 150 + capHeight(fonts.display, size)
    const body = [
        `<rect x="0" y="0" width="${width}" height="2" fill="${LINE}"/>`,
        eyebrow(copy.label, { x: margin, y: 116, size: 28 }),
        textPath(fonts.display, title, { x: margin - bearing(fonts.display, title, size), y: titleBase, size, fill: PAPER }),
        `<rect x="${margin}" y="${titleBase + 48}" width="166" height="10" fill="${MINT}"/>`,
        textPath(fonts.text, copy.text, { x: margin, y: height - 70, size: 36, fill: MUTED }),
    ].join('')
    const image = sharp(ground(width, height)).composite([
        ...await aurora(['#7ee6a8', '#96f0be', '#3fb37a'], { right: width, top: 0, sx: 0.42, sy: height / 800, opacity: 0.6 }),
        { input: svg(width, height, body), left: 0, top: 0 },
        at(await logo(250), width - margin - 250, height - 70 - 250 * 82 / 298 + 4),
        grain(width, height),
    ])
    return save(image, file)
}
