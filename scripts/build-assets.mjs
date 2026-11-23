// Builds the only images of the profile README into assets/ (npm install, then npm run build), in the art direction of
// djason-chery.dev: ink ground, mint accent, Archivo Expanded titles, Barlow Condensed labels, hairlines.
//   hero-<lang>.png                the banner at the top (name like the logo, job, one sentence)
//   section-<nn>-<slug>-<lang>.png the numbered section headers (01 · ABOUT ...)
//   footer-<lang>.png              the contact banner at the end of the page (Let's work together)
// Everything else in the READMEs is native GitHub (HTML tables, shields.io badges, skillicons.dev): adding a tool or a
// project is copying a block of the README, with its icon in assets/icons/. No image to build.
// Pass names to build only some of them: node scripts/build-assets.mjs hero section
import { mkdirSync } from 'node:fs'
import { LANGS, SECTIONS } from './lib/content.mjs'
import { footer } from './lib/footer.mjs'
import { hero } from './lib/hero.mjs'
import { section } from './lib/section.mjs'

const OUT = 'assets'
const only = process.argv.slice(2)
const wanted = (name) => only.length === 0 || only.includes(name)
const report = []
const write = async (draw, file, ...args) => report.push(`${file} ${await draw(...args, `${OUT}/${file}`)} KB`)

mkdirSync(OUT, { recursive: true })
for (const lang of LANGS) {
    if (wanted('hero')) await write(hero, `hero-${lang}.png`, lang)
    if (wanted('section')) {
        for (const [index, item] of SECTIONS.entries()) {
            const number = String(index + 1).padStart(2, '0')
            await write(section, `section-${number}-${item.slug}-${lang}.png`, index + 1, item[lang])
        }
    }
    if (wanted('footer')) await write(footer, `footer-${lang}.png`, lang)
}
console.log(report.join('\n'))
