# The Reset Studio

A static implementation of the Claude Design mockup `Reset Studio Homepage.dc.html`,
plus the Services section built on top of it.

No build step, no dependencies. Open `index.html`, or serve the folder:

```sh
npx http-server -p 8080
```

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The home page — semantic markup, one section per block of the mockup |
| `about/index.html` | The About page — the story, the philosophy, and Dr. Candy Ellis |
| `services/index.html` | The Services page — both categories, all fifteen services as cards, and Together pricing |
| `services/<slug>/index.html` | One page per service |
| `first-visit/index.html` | The First Visit page — how a first visit goes, how to prepare, and the FAQs |
| `memberships/index.html` | The Memberships page — the three tiers, founding memberships and gift cards |
| `policies/cancellation/index.html` | The cancellation and no-show policy, linked from every footer |
| `booking.js` | The Boulevard self-booking overlay — loads the injector and opens it from every booking button |
| `styles.css` | All styling for every page. Palette, type and layout tokens live in `:root` |
| `assets/` | Logo, the five photographs from the mockup, eleven abstract fields, and Dr. Candy Ellis' portrait |

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
services band, `convergeRing` on the promise band.

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

## Services

Fifteen services sit under `services/`, in two categories.

**Wellness & Recovery** — Contrast Therapy, Infrared Sauna, SaunaDome + PEMF,
Red Light Therapy, Flowpresso® Therapy, NormaTec® Compression, Zenthesia
Vibroacoustic, Stretch + Breath Reset, Reset Roadmap with Dr. Candy. These were
the site's "Modalities". The word is gone: the source
catalogue calls the category Wellness and Recovery, the service pages already
said so in their `Category` fact row, and the site now says it everywhere —
header panel, footer column, breadcrumb, home page band and the listing itself.

**Chiropractic Care** — Chiropractic Consultation, Chiropractic Adjustments, Dry
Needling, Spinal Decompression, Electrical Stimulation, Therapeutic Ultrasound.
Provided by `Dr. Candy, LLC`, an independent practice operating within the
studio, which is why these pages carry a `Provided by` fact and the footer
carries the attribution and disclaimer.

**Two pages are delisted rather than deleted.** `cold-plunge/` and
`neuro-light-therapy/` are off the nav, the footer, the ticker and every
card grid, because neither launches as a standalone bookable service. The cold
plunge is part of Contrast Therapy; neurological light is an optional
enhancement to Zenthesia Vibroacoustic, folded into that page as its own block.
Both files stay live and reframed, so any link already in the wild still lands
somewhere honest and points at the service the content moved into. Neither page
carries a booking button any more.

**Durations and prices** live in three places that have to agree: the `.facts`
block on the detail page, the `.service__meta` line on every card that links to
it, and the Together table on the services page. `scratchpad`-style one-off
scripts are how the card copy was last normalized across all of them; the
canonical values are the launch menu below.

| Service | Duration | Single | Together |
| --- | --- | --- | --- |
| NormaTec® Compression | 30 min | $45 | 2 — $90 · 3 — $135 |
| Full-Body Red Light | 20 min | $45 | 2 — $69 |
| Infrared Sauna | 30 min | $49 | 2 — $69 · 3 — $89 · 4 — $109 |
| SaunaDome + PEMF | 30 min | $59 | 2 — $99 |
| Zenthesia Vibroacoustic | 30 min | $59 | 2 — $89 |
| Contrast Therapy | ~45 min | $79 | 2 — $119 |
| Flowpresso® | 40 min | $89 | — |
| Stretch + Breath Reset | 15 min | $45 | — |
| Reset Roadmap with Dr. Candy | 30 min | $79 | — |

Together is for guests who chose to come in with each other. Nothing on the site
should imply strangers are placed in a private room together, and compression is
a room of three loungers rather than a single-guest space.

**Where the copy comes from.** Most of these pages — taglines, summaries,
equipment notes, the narrative, the benefit list, the "commonly booked for" tags
and the three-step session walkthrough — came verbatim from
`src/data/services.ts` of the `carl641/theresetstudio` Astro site. The launch
edits since then rewrote durations, prices, the Zenthesia rename and the
wellness claims, and `saunadome-pemf/`, `stretch-breath-reset/` and
`reset-roadmap/` are new pages built on the same template. Wellness copy
uses *supports* / *may help* / *designed for* / *commonly used for*, and avoids
cure, fix and guarantee language.

**Page shape**, following the source site's own information architecture:

1. Hero — breadcrumb, name, tagline, summary, a
   `Session / Equipment or Provided by / Category` fact row and a booking button
2. `What it is` — the two intro paragraphs, with `What it supports` and
   `Commonly booked for` in a rail alongside
3. `What the session is like` — the three-step walkthrough, numbered
4. `Booked in the same visit as` — the `pairsWith` cards
5. A sage CTA band reusing the promise band's rings

**The listing page** at `services/` is the source site's `/services/` page
mapped onto patterns this site already had: the tan converging-lines band for
the hero (with a three-fact row added for the two category counts and the
clinical entity), the sand `.services` grid for Wellness & Recovery, the About
page's sage `.why` band to introduce Chiropractic Care and its attribution, the
same grid again on cream for the six chiropractic cards, and the memberships
page's `.pk` cards for the three combinations people actually book together.

**Navigation.** "Services" in the header is a link to `services/` that reveals a
panel of both categories side by side on hover or keyboard focus. There is no
JavaScript: the trigger is a real link, so a tap or a click always lands on the
listing page, and below 900px the panel is dropped and the link alone carries
the menu. The footer carries a column per category, and a legal line naming the
practice that provides chiropractic care.

**No build step, but shared chrome.** The header, footer and CTA band are
duplicated across the nineteen HTML files rather than templated. Editing one means
editing all of them — they were generated together and are byte-identical apart
from the current-page `aria-current` and the `../` prefixes on subpage links.

## About

`about/index.html` is the About page, moved across from
`https://carl641.github.io/theresetstudio/about/` — the `src/pages/about.astro`
page of the `carl641/theresetstudio` Astro site. Every word is lifted verbatim:
the hero, the four story paragraphs, the "Why we exist" band, the five
principles, and Dr. Candy's three-paragraph biography with her four credentials.
The two interpolated values are resolved to the strings the source site renders
from `src/data/site.ts` — the signature line under "Why we exist" is
`site.tagline`, and the practice named in the last biography paragraph is
`site.clinicalEntity`.

**Translated to this site's chrome, not restyled.** The Astro page ships its own
scoped CSS; here each block maps onto a pattern the site already had:

- The `PageHero` becomes `.page-hero` in a new `--solo` variant — the service
  heroes carry a photograph beside the copy, this one is copy alone
- The story and practitioner sections are `.about-split`, a grid of `.prose`
  against a framed image, sharing the prose measures and the 4/5 frame used
  everywhere else
- The numbered principles reuse `.steps` / `.step` from the service pages,
  which already number their items with `decimal-leading-zero` in tan. The
  "Our Philosophy" eyebrow above them is this site's own section pattern, and
  the only label on the page that is not from the source
- The `CtaBand` becomes the site's own `.cta-band`, rings and all
- Only "Why we exist" is new: a sage band set left rather than centred, so it
  reads as a statement instead of another promise band

**The portrait.** `assets/drcandy.jpeg` is the photograph of Dr. Candy that was
uploaded to the repository; it fills what was a `portrait-placeholder.webp` slot
on the source page. It is a 3648×5472 camera original at 4 MB, so the page
loads `assets/dr-candy-ellis.webp` — the same photograph at 1200×1800, which is
twice the width the 4/5 frame ever renders. Re-encoding also drops the EXIF
block, which carried GPS coordinates. The original stays in `assets/` as the
master; regenerate the WebP from it if the crop or the frame ever changes. The
story section keeps the abstract light field the source page had there
(`assets/about-story.webp`), on the same terms as the service placeholders: it
is decorative, carries an empty `alt`, and wants a real photograph.

**Navigation.** "About" is now the first item in the header nav and the first
link in the footer's Explore column, on all nineteen pages.

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
- The four moments reuse `.steps` / `.step` from the service pages in a
  `--plain` variant on cream. `.steps__list--timed` swaps the leading-zero
  counter for the moment in the visit, so the two-column rhythm is unchanged
- The preparation lists are new `.prep` cards on the sand band, and each list is
  the site's own `.rail__list` with its tan dashes
- The accordion is native `<details>` / `<summary>`, so it needs no JavaScript
  and every answer stays in the page for search and for find-on-page. The
  chevron is a rotated border corner
- The `CtaBand` is the site's `.cta-band`. The source's secondary "View services"
  button points at the Services listing, which is this site's equivalent

The source page also emits `FAQPage` structured data. No page on this site
carries JSON-LD yet, so it was left out rather than added in isolation.

## Memberships

`memberships/index.html` is moved across from
`https://carl641.github.io/theresetstudio/memberships/` — the
`src/pages/memberships.astro` page, with its content from
`src/data/memberships.ts`. The tier section has since been rebuilt for launch;
the benefits grid and the gift card paragraph are still the source page's.

- The three tiers are a `.tiers` grid. The middle tier is `.tier--lift`: the
  sage band from elsewhere on the site, raised 36px above its neighbours, as the
  source page raised its higher tier. Cards give up padding at 1180px and the
  grid stacks at 1040px, where the offset is dropped
- Tier inclusions are `.rail__list` again; on the sage card the tan dash and
  stone copy fall away, so both step up to sand
- Each tier carries a `.tier__founding` line under its price, so the founding
  benefit reads next to the regular rate rather than as a promo banner
- The benefits are a two-column `.benefits` grid on the sand band, and gift cards
  reuse the home page's `.split` band with the sauna-bench photograph
- The `CtaBand` is `.cta-band`, its secondary button pointing at First Visit

**The launch tiers** are RESET 4 at $199, RESET 8 at $299 and RESET 16 at $479
per month, all on a six-month commitment, with unused included visits rolling
over for thirty days and no further. RESET 16 is the high-frequency tier and is
explicitly not unlimited. Chiropractic care is not included in any membership —
it is separate clinical care on its own booking path — and the session bundles
that used to sit below the tiers are gone.

**Founding memberships** are framed as exclusivity rather than a sale: the first
fifty members only, presented as two benefit lines (15% off the first six months,
or 25% off paid in full) rather than a percentage banner. The `.founding` band
appears on both the home page and the memberships page, and both state that
membership continues at the regular rate after the six-month founding period.

**Navigation.** "First Visit" and "Membership" join the header nav and the
footer's Explore column on every page. "The Experience" and "Visit" have since
been dropped from the header nav — they were the only two items pointing at
anchors on the home page rather than at pages of their own. Both still sit in
the footer's Explore column, so the sections remain reachable. The home page's "Plan
your first visit" and "Explore Membership" links and the About page's "What to
expect" button now point at these two pages instead of `#`.

## Booking

Every booking button on the site opens the Boulevard self-booking overlay.
`booking.js` loads Boulevard's injector once per page, calls `blvd.init()` with
the studio's `businessId`, and opens the overlay from any element carrying
`data-blvd-book` — the header's "Book a Reset", the hero and CTA-band buttons,
the per-service "Book …" buttons, both membership tier buttons, and the About
page's "Chiropractic consultation". Adding a booking button anywhere else is one
attribute; nothing needs registering.

The buttons keep `href="#"` and the handler cancels the jump, so the markup
still reads as a link and a click never scrolls the page. A click that lands
before the injector has finished downloading is held and replayed once it loads,
rather than being dropped.

Boulevard can open the overlay directly on a service or category rather than at
the menu. `booking.js` supports that through two optional attributes on any
booking button — `data-blvd-path` and `data-blvd-visit-type`, which become
Boulevard's `urlParams` — but neither is set anywhere yet, because the service
ids come out of the Boulevard dashboard. Filling them in on the service pages
would send each "Book <service>" button straight to that service. The Together
option is priced on the site but still has to be configured as a group visit in
Boulevard — `data-blvd-visit-type="GROUP_VISIT"` is what those buttons will
need.

## Before launch

Placeholder content still carried over from the mockup: the hours in the footer,
and "Buy a gift card" — the source site points that one at its contact page,
which this site does not have, and Boulevard sells gift cards through a separate
hosted page rather than the booking overlay. The footer address is now the real
one: 485 Providence St, Suite 100, Huntsville, AL 35806, in Village of
Providence. The photographs are stock imagery from the mockup and should be
replaced with the studio's own.

Three pages borrow an existing photograph rather than carrying one of their own:
`saunadome-pemf/` uses the sauna-bench field, `stretch-breath-reset/`
the studio console, and `reset-roadmap/` the portrait of Dr. Candy in the
front room. The first two keep an empty `alt` on their cards; all three want
their own photography.

Ten services have no photograph of their own: contrast therapy, Flowpresso®,
NormaTec®, Zenthesia, neurological light, and all six chiropractic services. They carry the abstract light-field placeholders the source site
generates for the same purpose, named after their slug in `assets/`, which are
tuned to this palette and deliberately do not pretend to be photographs of a
room that has not been shot. They keep an empty `alt` because they are
decorative; a real photograph dropped in at the same path needs a real `alt`
written for it. The source site's own equipment photography is on a CDN this
build could not reach.

The source catalogue gives therapeutic ultrasound the same placeholder as
NormaTec®; this site uses `field-slate` for it instead, so no two cards on the
services page carry the same image.

Session lengths and prices are the launch menu in the Services section above.
They are set in three places per service — the detail page's `.facts` block, the
`.service__meta` line on every card linking to it, and the Together table on the
services page — so a change to one is a change to all three.

Booking buttons still point at `#` and open the Boulevard overlay at its menu;
that was deliberate and is unchanged by the launch edits.
