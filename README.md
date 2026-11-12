# Personal Portfolio

A single-page portfolio with a cream-and-navy editorial theme and **scroll-printed typography**: as you scroll, each word of the big statements gets printed in, one at a time.

Built with plain HTML, CSS and JavaScript — no build step, no dependencies.

## Palette

| Token | Colour | Used for |
| --- | --- | --- |
| Canvas | `#f3ecdf` | Page background (cream) |
| Navy | `#14304f` | Buttons, ticker band, contact and footer blocks, type accents |
| Ink | `#12263f` | Headings and body text |
| White | `#ffffff` | Type on navy blocks |
| Paper | `#fbf7ee` | Cards and panels |

Shadows are soft navy tints — no red and no pure black. Change the palette in one place at the top of `styles.css` (`:root`), plus the small override block at the bottom for colour-specific details.

## Hero

- The photo in `assets/portrait-cutout.png` has a transparent background, so the person stands directly on the cream page instead of inside a frame.
- The cutout is centred in the hero, with a soft navy halo and shadow behind it.
- Fonts: **Fraunces** for display type, **Manrope** for body copy, **DM Mono** for labels.
- A paper-unroll intro (two cream panels with navy rods) opens the page like rolled paper. It is CSS-only and is skipped when `prefers-reduced-motion` is on.

## Preview

- Double-click `index.html`, or
- Run a tiny local server in this folder:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open the printed URL.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content and structure |
| `styles.css` | Theme, layout, animations, responsive rules |
| `script.js` | Word printing, char animation, reveals, menu, clock, copy button |
| `assets/portrait.jpg` | Original photo (kept as a backup) |
| `assets/portrait-cutout.png` | Background-removed portrait used in the hero |

## What to personalise

The site currently uses **placeholders** so you can drop in your real details:

1. **Name** — search for `YOUR NAME` / `Your Name` in `index.html`.
   - Also update `<title>`, meta description, the portrait alt text, and the footer.
2. **Photo** — replace `assets/portrait-cutout.png` with your own cutout (transparent background, portrait orientation). Keep the filename, or update the `src` in `index.html`. `assets/portrait.jpg` is the untouched original.
3. **Role line** — the `hero-role` paragraph (`B.Tech Student / AI Tools Enthusiast`).
4. **About text** — the two paragraphs in the About section.
5. **Education** — the three cards in `#education`. The B.Tech entry is already set to **KG Reddy College of Engineering & Technology**; update the years and the intermediate/school placeholders.
6. **Skills**
   - AI tools: the `<ul class="chips">` list.
   - Soft skills: the `<ul class="skill-list">` list (communication, team handling, etc. are already there).
7. **Projects** — the three cards in `#work`. Replace titles, descriptions and tags.
8. **Contact** — email in the `mailto:` link and the `data-copy` attribute on the Copy button, plus the four social links (`href="#"` placeholders).
9. **Stats** — the three numbers in the About section.

## The scroll-print effect

Any element with `data-print` is split into word spans on load. On scroll, words are revealed in reading order based on how far the element has travelled up the viewport.

```html
<p class="print" data-print>
  Curiosity is my default setting. I like taking messy ideas ...
</p>
```

- Works on plain text only (no nested HTML inside a `data-print` element).
- Add/remove `data-print` to control which text animates.
- Hero title letters use `data-split` for the staggered entrance.
- `prefers-reduced-motion` disables the effects and shows all text immediately.

## Other details

- Sticky navigation with scrollspy and a mobile full-screen menu.
- Scroll progress bar, marquee ticker, cutout parallax, reveal-on-scroll, copy-email button and a live Hyderabad clock.
- Fully responsive down to 320px.
- Lighthouse (desktop): Accessibility 100, Best Practices 100, SEO 100.
- Fonts: Fraunces, Manrope and DM Mono via Google Fonts, with system fallbacks.


