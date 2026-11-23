// Texts of the images (hero, section headers, contact banner), in English and French (the READMEs say the same: README.md and README.fr.md)
export const LANGS = ['en', 'fr']

export const HERO = {
    en: {
        top: 'Open to freelance missions',
        eyebrow: 'Full-stack web developer · Compositing & VFX',
        sentence: 'I build fast, clean websites, web apps and dev tools, and I edit and composite video.',
        bar: ['djason-chery.dev', 'Based in France · Freelance · Remote or on-site', 'Web · Video · VFX'],
    },
    fr: {
        top: 'Disponible en freelance',
        eyebrow: 'Développeur web full-stack · Compositing & VFX',
        sentence: 'Je crée des sites, des applications web et des outils de développement, et je fais du montage et du compositing vidéo.',
        bar: ['djason-chery.dev', 'Basé en France · Freelance · À distance ou sur place', 'Web · Vidéo · VFX'],
    },
}

// The numbered sections of the profile: label (eyebrow), title, short text on the right
export const SECTIONS = [
    {
        slug: 'about',
        en: { label: 'About', title: 'Who I am', text: 'Websites and web apps end to end, my own dev tools, and video post-production.' },
        fr: { label: 'À propos', title: 'Qui je suis', text: 'Des sites et applications web de A à Z, mes propres outils, et de la post-production vidéo.' },
    },
    {
        slug: 'tools',
        en: { label: 'DC Tools', title: 'Tools I built', text: 'Free to start, with a Pro plan, for Windows, macOS and Linux.' },
        fr: { label: 'Outils DC', title: 'Mes outils', text: 'Gratuits pour commencer, avec une offre Pro, pour Windows, macOS et Linux.' },
    },
    {
        slug: 'work',
        en: { label: 'Featured work', title: 'Selected projects', text: 'My portfolio and back office, and two demo sites, live and open source.' },
        fr: { label: 'Projets à la une', title: 'Projets phares', text: 'Mon portfolio et mon back office, et deux sites de démonstration, en ligne et open source.' },
    },
    {
        slug: 'stack',
        en: { label: 'Stack', title: 'What I work with', text: 'From the first page to the server, and on to the edit suite.' },
        fr: { label: 'Compétences', title: 'Mes outils de travail', text: 'De la première page au serveur, jusqu\'à la salle de montage.' },
    },
    {
        slug: 'stats',
        en: { label: 'Stats', title: 'On GitHub', text: 'Updated every day from my public activity.' },
        fr: { label: 'Statistiques', title: 'Sur GitHub', text: 'Mises à jour chaque jour depuis mon activité publique.' },
    },
]

export const FOOTER = {
    en: { label: 'Contact', title: 'Let\'s work together', text: 'Open to freelance missions · Remote or on-site' },
    fr: { label: 'Contact', title: 'Travaillons ensemble', text: 'Disponible pour des missions freelance · À distance ou sur place' },
}
