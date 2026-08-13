# The Reset Studio — homepage

A static implementation of the Claude Design mockup `Reset Studio Homepage.dc.html`.

No build step, no dependencies. Open `index.html`, or serve the folder:

```sh
npx http-server -p 8080
```

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The page — semantic markup, one section per block of the mockup |
| `styles.css` | All styling. Palette, type and layout tokens live in `:root` |
| `assets/` | Logo plus the five photographs from the mockup |

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

## Before launch

Placeholder content carried over from the mockup: the address, hours and email
in the footer, and every `href="#"` (both "Book Your Reset" CTAs, "Explore
Membership", "More Modalities", "Plan your first visit", "Membership", "Gift a
Reset"). The photographs are stock imagery from the mockup and should be
replaced with the studio's own.
