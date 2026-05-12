# PawKasa — Premium Cat Scratching Boards

> The Journey with Cats, PawKasa. A premium cat care brand designing scratching boards, hideaways, and playgrounds for feline joy and human style.

## Tech Stack

| Category        | Technology                                       |
| --------------- | ------------------------------------------------ |
| Framework       | [Astro 5](https://astro.build)                   |
| Styling         | [Tailwind CSS 3](https://tailwindcss.com)        |
| UI Components   | Astro (`.astro`) + optional React 18 integration |
| Typography      | Fredoka (display), Nunito (headings), DM Sans (body), Noto Sans SC (CJK) |
| Icons           | Inline SVG (Lucide-style)                        |
| Deployment      | Vercel                                           |

## Project Structure

```
pawkasa-astro/
├── astro.config.mjs            # Astro config (integrations, site URL)
├── tailwind.config.mjs         # Tailwind theme, fonts, brand colors
├── package.json                # Dependencies & scripts
├── public/
│   └── images/                 # Static product & lifestyle images
│       ├── hero-pets.jpg
│       ├── grooming.jpg
│       ├── product-*.jpg
│       └── products-flatlay.jpg
└── src/
    ├── styles/
    │   └── global.css          # CSS variables, Tailwind directives, animations
    ├── layouts/
    │   └── Layout.astro        # Base HTML shell + SEO meta
    ├── components/
    │   ├── Header.astro        # Sticky nav + mobile menu
    │   ├── Footer.astro        # Newsletter subscription + links
    │   └── SubscriptionPopup.astro  # Email capture modal (3s delay)
    ├── data/
    │   └── products.ts         # Product catalog (8 products x 4 categories)
    └── pages/
        ├── index.astro         # Homepage (full landing page)
        ├── about.astro         # About / brand story
        ├── products.astro      # Product listing
        ├── contact.astro       # Contact page
        └── 404.astro           # Not found page
```

## Architecture

### Component Tree

```
Layout.astro  ← SEO meta, Open Graph, global CSS
├── Header.astro
│   ├── Announcement bar (Free US Shipping)
│   ├── Logo + Desktop nav
│   ├── Search / Account / Cart icons
│   └── Mobile hamburger menu (vanilla JS toggle)
├── <slot /> (page content)
│   └── index.astro (homepage)
│       ├── Hero section (marquee, CTA, floating badge)
│       ├── Why PawKasa (4 value props grid)
│       ├── Shop by Category (4 categories)
│       ├── Best Sellers (product cards with sold counts)
│       ├── New Arrivals (product cards)
│       ├── Why we built PawKasa (founder story + image)
│       ├── Customer Reviews (4 review cards with ratings, photos, verified badge, buy links)
│       ├── Trust & Quality (FSC / Non-Toxic / BSCI / ISO 9001 / Secure Payment)
│       └── CTA (Give your cat a home they deserve -> Shop cat houses)
├── Footer.astro
│   ├── Newsletter subscribe form
│   ├── Social links (Instagram, YouTube, TikTok)
│   ├── Footer nav (Explore, Contact, Follow)
│   └── Copyright
└── SubscriptionPopup.astro  ← full-screen modal (vanilla JS)
```

### Data Flow

- **Static Data**: Product catalog lives in `src/data/products.ts` as a typed array. Pages import directly.
- **No external APIs**: All content is static — pages are pre-rendered at build time.
- **Client-side interactivity**: Header mobile menu, footer subscribe form, and subscription popup use vanilla JS (no framework overhead).

## Design System

### Brand Colors

| Token               | HSL                    | Usage                          |
| -------------------- | ---------------------- | ------------------------------ |
| `brand-orange`      | `22 100% 59%`          | Primary CTA, brand identity    |
| `brand-cream`       | `44 100% 68%`          | Warm accent backgrounds        |
| `brand-blue`        | `192 66% 74%`          | Calm accents, trust signals    |
| `brand-mint`        | `155 43% 82%`          | Fresh, playful accents         |
| `brand-ink`         | `15 30% 24%`           | Primary text, dark backgrounds |

All colors defined as CSS custom properties in `:root` -> `@layer base` -> consumed by Tailwind via `hsl(var(--xxx))` pattern. Dark mode variant defined under `.dark` class.

### Typography Scale

- **Display**: `font-display` -> Fredoka (600-700) — hero headlines, KPI numbers, logo
- **Headings**: `font-heading` -> Nunito (700) — section titles, card headings
- **Body**: `font-sans` -> DM Sans (400-500) + Noto Sans SC for CJK fallback
- **Spacing**: Container max-width 1400px (2xl), generous `py-24` section padding

### UI Conventions

- **Border radius**: `--radius: 1rem` (lg), `rounded-3xl` / `rounded-[2rem]` throughout
- **Shadows**: `shadow-soft` (orange tint) and `shadow-blue` (blue tint) for depth
- **Cards**: `bg-card` + `border border-border` + `rounded-3xl` pattern
- **Buttons**: Full-round pills (`rounded-full`), `h-12` (48px) touch target
- **Animations**: CSS-only — marquee scrolling, float keyframe (hero badge)

## Pages

### Homepage (`/`)

The main landing page structured as a vertical narrative:

| #   | Section                | Purpose                                            |
| --- | ---------------------- | -------------------------------------------------- |
| 1   | Hero                   | Brand hook, CTA, marquee strip, floating badge     |
| 2   | Why PawKasa            | 4-card value proposition (Eco / Play / Indoor / Easy) |
| 3   | Shop by Category       | 4-category navigation grid (City/Wander/Game/Pawty) |
| 4   | Best Sellers           | Product cards with sold-count social proof         |
| 5   | New Arrivals           | Latest products, muted card style                  |
| 6   | Why we built PawKasa   | Founder story with image (who -> why narrative)     |
| 7   | Customer Reviews       | 4 review cards: star ratings, user avatar, verified badge, buy link |
| 8   | Trust & Quality        | FSC / Non-Toxic / BSCI / ISO 9001 / Secure Payment badges |
| 9   | CTA                    | "Give your cat a home they deserve" -> Shop cat houses |

### About (`/about`), Products (`/products`), Contact (`/contact`)

Static informational pages following the same brand styling conventions.

### 404 (`/404`)

Custom not-found page with brand styling.

## Scripts

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

## Getting Started

```bash
git clone https://github.com/besteric/pawkasa.git
cd pawkasa
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Deployment

The project is deployed on Vercel with GitHub integration. Pushing to `main` triggers automatic deployment to production at [pawkasa.com](https://pawkasa.com).

## Image Assets

| File                     | Usage                       |
| ------------------------ | --------------------------- |
| `hero-pets.jpg`          | Hero section cat image      |
| `grooming.jpg`           | About / popup banner        |
| `product-*.jpg`          | Product card thumbnails     |
| `products-flatlay.jpg`   | Hero / product page banner  |
