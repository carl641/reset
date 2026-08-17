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
| `about/index.html` | The About page — the story, the philosophy, and Dr. Candy Ellis |
| `modalities/index.html` | The Modalities listing — all eight modalities as cards |
| `modalities/<slug>.html` | One page per modality |
| `first-visit/index.html` | The First Visit page — how a first visit goes, how to prepare, and the FAQs |
| `memberships/index.html` | The Memberships page — the two tiers, packages and gift cards |
| `styles.css` | All styling for every page. Palette, type and layout tokens live in `:root` |
| `assets/` | Logo, the five photographs from the mockup, five abstract fields, and Dr. Candy Ellis' portrait |

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
duplicated across the thirteen HTML files rather than templated. Editing one means
editing all of them — they were generated together and are byte-identical apart
from the current-page `aria-current` and the `../` prefixes on subpage links.

## About

`about/index.html` is the About page, moved across from
`https://carl641.github.io/theresetstudio/about/` — the `src/pages/about.astro`
page of the `carl641/theresetstudio` Astro site. Every word is lifted verbatim:
the hero, the four story paragraphs, the "Why we exist" band, the five
principles, and Dr. Ellis' three-paragraph biography with her four credentials.
The two interpolated values are resolved to the strings the source site renders
from `src/data/site.ts` — the signature line under "Why we exist" is
`site.tagline`, and the practice named in the last biography paragraph is
`site.clinicalEntity`.

**Translated to this site's chrome, not restyled.** The Astro page ships its own
scoped CSS; here each block maps onto a pattern the site already had:

- The `PageHero` becomes `.page-hero` in a new `--solo` variant — the modality
  heroes carry a photograph beside the copy, this one is copy alone
- The story and practitioner sections are `.about-split`, a grid of `.prose`
  against a framed image, sharing the prose measures and the 4/5 frame used
  everywhere else
- The numbered principles reuse `.steps` / `.step` from the modality pages,
  which already number their items with `decimal-leading-zero` in tan. The
  "Our Philosophy" eyebrow above them is this site's own section pattern, and
  the only label on the page that is not from the source
- The `CtaBand` becomes the site's own `.cta-band`, rings and all
- Only "Why we exist" is new: a sage band set left rather than centred, so it
  reads as a statement instead of another promise band

**The portrait.** `assets/drcandy.jpeg` is the photograph of Dr. Ellis that was
uploaded to the repository; it fills what was a `portrait-placeholder.webp` slot
on the source page. It is a 3648×5472 camera original at 4 MB, so the page
loads `assets/dr-candy-ellis.webp` — the same photograph at 1200×1800, which is
twice the width the 4/5 frame ever renders. Re-encoding also drops the EXIF
block, which carried GPS coordinates. The original stays in `assets/` as the
master; regenerate the WebP from it if the crop or the frame ever changes. The
story section keeps the abstract light field the source page had there
(`assets/about-story.webp`), on the same terms as the modality placeholders: it
is decorative, carries an empty `alt`, and wants a real photograph.

**Navigation.** "About" is now the first item in the header nav and the first
link in the footer's Explore column, on all thirteen pages.

## First Visit

`first-visit/index.html` is moved across from
`https://carl641.github.io/theresetstudio/first-visit/` — the
`src/pages/first-visit.astro` page of the `carl641/theresetstudio` Astro site,
with its FAQ accordion filled from `src/data/faqs.ts`. Every word is verbatim:
the hero, the four moments of a first visit, the four preparation lists, the
screening paragraph, and all twenty questions across their five groups.
`site.clinicalEntity` in the screening paragraph resolves to `Dr. Candy, LLC`.

**Mapped onto patterns the site already had**, rather than restyled:

- The `PageHero` is `.page-hero--solo`, as on the About page
- The four moments reuse `.steps` / `.step` from the modality pages in a
  `--plain` variant on cream. `.steps__list--timed` swaps the leading-zero
  counter for the moment in the visit, so the two-column rhythm is unchanged
- The preparation lists are new `.prep` cards on the sand band, and each list is
  the site's own `.rail__list` with its tan dashes
- The accordion is native `<details>` / `<summary>`, so it needs no JavaScript
  and every answer stays in the page for search and for find-on-page. The
  chevron is a rotated border corner
- The `CtaBand` is the site's `.cta-band`. The source's secondary "View services"
  button points at the Modalities listing, which is this site's equivalent

The source page also emits `FAQPage` structured data. No page on this site
carries JSON-LD yet, so it was left out rather than added in isolation.

## Memberships

`memberships/index.html` is moved across from
`https://carl641.github.io/theresetstudio/memberships/` — the
`src/pages/memberships.astro` page, with its content from
`src/data/memberships.ts`. Verbatim again: both tiers with their positioning and
inclusions, the pause-and-attribution note, the four membership benefits, the
three packages and the gift card paragraph.

- The two tiers are a new `.tiers` grid. The higher tier is `.tier--lift`: the
  sage band from elsewhere on the site, raised 36px above its neighbour, exactly
  as the source page raises it. Stacked below 1040px the offset is dropped
- Tier inclusions are `.rail__list` again; on the sage card the tan dash and
  stone copy fall away, so both step up to sand
- The benefits are a two-column `.benefits` grid on the sand band, packages are
  `.pk` cards on cream, and gift cards reuse the home page's `.split` band with
  the sauna-bench photograph
- The `CtaBand` is `.cta-band`, its secondary button pointing at First Visit

**Pricing is a placeholder.** `$189` and `$329` are the numbers the source data
file carries, and it marks them as unconfirmed. Both need checking against the
booking system before launch; the HTML says so at the tier block.

**Navigation.** "First Visit" and "Membership" join the header nav before
"Visit", and the footer's Explore column on every page. The home page's "Plan
your first visit" and "Explore Membership" links and the About page's "What to
expect" button now point at these two pages instead of `#`.

## Before launch

Placeholder content carried over from the mockup: the address, hours and email
in the footer, and every `href="#"` (all "Book Your Reset" / "Book a Reset"
buttons, the per-modality "Book …" buttons, both membership tier buttons, and
"Buy a gift card" — the source site points that last one at its contact page,
which this site does not have). The photographs are stock imagery from the
mockup and should be replaced with the studio's own.

The About page adds two more of those. "Chiropractic consultation" and "All
chiropractic services" point at `/services/…` on the source site, and this site
has no chiropractic content, so they carry `href="#"` rather than a link that
would 404. They need either real pages here or an explicit link across to the
Astro site. ("What to expect" was the third; it now points at First Visit.)

The two membership prices are unconfirmed — see the Memberships section above.

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
