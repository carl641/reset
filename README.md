# The Reset Studio

A static implementation of the Claude Design mockup `Reset Studio Homepage.dc.html`,
plus the Modalities section built on top of it.

No build step, no dependencies. Open `index.html`, or serve the folder:

```sh
npx http-server -p 8080
```

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The home page — semantic markup, one section per block of the mockup |
| `modalities/index.html` | The Modalities listing — all eight modalities as cards |
| `modalities/<slug>.html` | One page per modality |
| `styles.css` | All styling for every page. Palette, type and layout tokens live in `:root` |
| `assets/` | Logo, the five photographs from the mockup, and five abstract fields |

## How this maps to the mockup

The mockup is a Claude Design prototype: a `<x-dc>` template rendered by a small
React runtime (`support.js`), with styling written as inline `style` attributes
and photographs held in `<image-slot>` custom elements. None of that runtime is
needed to ship the design, so it was translated rather than copied:

- **Inline styles → `styles.css`.** Every colour, size, spacing and animation
  timing is carried over unchanged; they are just named now. The palette is
  `--cream` `--sand` `--ink` `--stone` `--sage` `--tan`.
- **`style-hover="…"` → real `:hover` rules.** The runtime compiled those
  attributes into `!important` declarations that beat the inline styles, so the
  hover states here reproduce what the prototype actually rendered — including
  "Explore Membership", which tints its background but keeps its text colour.
- **`<image-slot>` → `<img>`.** The slots are a design-time affordance for
  dropping photos in. The five images that had been dropped were stored as WebP
  data URLs in `.image-slots.state.json`; they are extracted to `assets/` and
  rendered with `object-fit: cover`, matching the slots' `fit="cover"` framing.
- **`<sc-if>` variants → the default composition.** The prototype exposed two
  props: `heroStyle` (`gradient` | `minimal`, default `gradient`) and
  `showQuoteBand` (default `true`). This page is the default of both — the
  animated concentric-ring hero, with the promise band. The alternate hero was a
  flat `--sand` panel with the same copy, should it ever be wanted.
- **Dead keyframes dropped.** `rippleOut` and `driftBlob` (and the `--p`
  `@property` that only `rippleOut` used) were defined in the mockup but never
  referenced.

The five ambient animations are reproduced exactly: `breatheRing` on the hero
rings, `hoverWave` on the Relax/Refresh/Renew columns, `convergeLine` on the
modalities band, `convergeRing` on the promise band.

## Deliberate additions

The mockup is a fixed desktop composition. Three things were added on top of it:

- **Responsive behaviour** at 1040 / 900 / 860 / 640px. Desktop rendering is
  untouched; below those widths the split sections stack, the three-column grids
  become one, the header wraps to a second row, and the hero grows with its copy
  instead of holding `82vh`.
- **`prefers-reduced-motion`** settles the ambient loops. The converging lines
  resolve to a static starburst and the pulsing promise rings step aside for the
  static one, rather than reverting to an untransformed base.
- **Accessibility**: a skip link, `:focus-visible` rings, alt text, landmarks,
  and a hover colour on the footer links — the one visible departure from the
  mockup, where inline styles left those links with no hover feedback at all.

## Modalities

Eight modality pages sit under `modalities/`, in the order they appear in the
menu: Contrast Therapy, Infrared Sauna, Cold Plunge, Red Light Therapy,
Flowpresso® Therapy, NormaTec® Compression, Sound Therapy, Neuro Light Therapy.

**Where the copy comes from.** Every word on these pages — taglines, summaries,
session lengths, equipment notes, the narrative, the benefit list, the "commonly
booked for" tags and the three-step session walkthrough — is lifted verbatim
from the eight Wellness and Recovery services in `src/data/services.ts` of the
`carl641/theresetstudio` Astro site. Nothing was rewritten or invented. The
chiropractic services in that catalogue are deliberately not included here; the
`pairsWith` rails were filtered to the eight modalities that exist on this site.

**Page shape**, following the source site's own information architecture:

1. Hero — breadcrumb, name, tagline, summary, a `Session / Equipment / Category`
   fact row and a booking button
2. `What it is` — the two intro paragraphs, with `What it supports` and
   `Commonly booked for` in a rail alongside
3. `What the session is like` — the three-step walkthrough, numbered
4. `Booked in the same visit as` — the `pairsWith` cards
5. A sage CTA band reusing the promise band's rings

**Navigation.** "Modalities" in the header is a link to `modalities/` that
reveals a panel of all eight on hover or keyboard focus. There is no JavaScript:
the trigger is a real link, so a tap or a click always lands on the listing page,
and below 900px the panel is dropped and the link alone carries the menu. The
footer gained a Modalities column on every page.

**No build step, but shared chrome.** The header, footer and CTA band are
duplicated across the ten HTML files rather than templated. Editing one means
editing all of them — they were generated together and are byte-identical apart
from the current-page `aria-current` and the `../` prefixes on subpage links.

## Before launch

Placeholder content carried over from the mockup: the address, hours and email
in the footer, and every `href="#"` (all "Book Your Reset" / "Book a Reset"
buttons, the per-modality "Book …" buttons, "Explore Membership", "Plan your
first visit", "Membership"). The photographs are stock imagery from the mockup
and should be replaced with the studio's own.

Five modalities have no photograph yet — contrast therapy, Flowpresso®,
NormaTec®, sound therapy and neuro light therapy. They carry the abstract
light-field placeholders the source site generates for the same purpose
(`assets/contrast-therapy.webp`, `flowpresso.webp`, `normatec-compression.webp`,
`sound-therapy.webp`, `neuro-light-therapy.webp`), which are tuned to this
palette and deliberately do not pretend to be photographs of a room that has not
been shot. They keep an empty `alt` because they are decorative; a real
photograph dropped in at the same path needs a real `alt` written for it. The
source site's own equipment photography is on a CDN this build could not reach.

Session lengths came across from the source catalogue, where they are noted as
typical lengths pending the studio's booking grid. Confirm them before launch.
