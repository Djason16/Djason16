// The banner at the top of the profile: the name laid out like the logo of the site (DJASON, a mint rule, CHERY), the job in a
// mint label, one sentence, a bottom bar like the opening of djason-chery.dev, a mint aurora on the right
import sharp from 'sharp'
import { HERO } from './content.mjs'
import { LINE, MINT, MUTED, PAPER, at, aurora, eyebrow, grain, ground, logo, save, svg } from './draw.mjs'
import { bearing, capHeight, fonts, measure, paragraph, textPath, wrap } from './text.mjs'

const WIDTH = 1600
const HEIGHT = 880
const MARGIN = 88
const MINT_AURORA = ['#7ee6a8', '#96f0be', '#3fb37a']

export const hero = async (lang, file) => {
    const copy = HERO[lang]
    const { display, text } = fonts
    const size = 220
    const name = 'DJASON'
    const nameX = MARGIN - bearing(display, name, size)
    const nameWidth = measure(display, name, size)
    const nameBase = 300 + capHeight(display, size)
    const small = size * 0.5
    const secondBase = nameBase + 36 + capHeight(display, small)
    const right = nameX + nameWidth - bearing(display, name, size)
    const secondWidth = measure(display, 'CHERY', small)
    const ruleY = secondBase - capHeight(display, small) / 2 - 3
    const lines = wrap(text, copy.sentence, 40, 1180)
    const sentenceBase = secondBase + 92
    const barTop = HEIGHT - 112
    const barBase = barTop + 56 + 9
    // The middle text centred between the two others
    const labelWidth = (value) => measure(fonts.label, value.toUpperCase(), 24, 0.22)
    const barMiddle = (MARGIN + 32 + labelWidth(copy.bar[0]) + WIDTH - MARGIN - labelWidth(copy.bar[2])) / 2
    const body = [
        `<defs><radialGradient id="light" cx="0.3" cy="0.55" r="0.55"><stop offset="0" stop-color="${MINT}" stop-opacity="0.10"/><stop offset="1" stop-color="${MINT}" stop-opacity="0"/></radialGradient></defs>`,
        `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#light)"/>`,
        eyebrow(copy.top, { x: WIDTH - MARGIN, y: 100, size: 24, anchor: 'end' }),
        `<rect x="0" y="152" width="${WIDTH}" height="2" fill="${LINE}"/>`,
        eyebrow(copy.eyebrow, { x: MARGIN, y: 252, size: 28 }),
        textPath(display, name, { x: nameX, y: nameBase, size, fill: PAPER }),
        `<rect x="${right - secondWidth - 250}" y="${ruleY}" width="200" height="6" fill="${MINT}"/>`,
        textPath(display, 'CHERY', { x: right, y: secondBase, size: small, fill: PAPER, anchor: 'end' }),
        paragraph(text, lines, { x: MARGIN, y: sentenceBase, size: 40, leading: 52, fill: MUTED }),
        `<rect x="0" y="${barTop}" width="${WIDTH}" height="2" fill="${LINE}"/>`,
        `<circle cx="${MARGIN + 7}" cy="${barBase - 9}" r="7" fill="${MINT}"/>`,
        eyebrow(copy.bar[0], { x: MARGIN + 32, y: barBase, size: 24, fill: PAPER }),
        eyebrow(copy.bar[1], { x: barMiddle, y: barBase, size: 24, fill: MUTED, anchor: 'middle' }),
        eyebrow(copy.bar[2], { x: WIDTH - MARGIN, y: barBase, size: 24, fill: MUTED, anchor: 'end' }),
    ].join('')
    const image = sharp(ground(WIDTH, HEIGHT)).composite([
        ...await aurora(MINT_AURORA, { right: WIDTH, top: 0, sx: 0.5, sy: HEIGHT / 800, opacity: 0.55 }),
        { input: svg(WIDTH, HEIGHT, body), left: 0, top: 0 },
        at(await logo(196), MARGIN, 50),
        grain(WIDTH, HEIGHT),
    ])
    return save(image, file)
}
