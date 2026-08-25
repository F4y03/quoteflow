# QuoteFlow Pixel Quest Design System

Status: Active source of truth  
Applies to: Dashboard, Quote Editor, document preview chrome, Work Hub, Calendar, Daily Update, Import Modal, Image Template Editor, and all future QuoteFlow UI.

## Design thesis

QuoteFlow is a professional work-management product presented as an optimistic 16-bit fantasy adventure. Game language adds identity and progress feedback, while information hierarchy, readable Thai copy, form usability, and document accuracy remain primary.

## Core principles

1. Existing functionality and data are preserved. Visual changes must not replace or fake business behavior.
2. Game decoration belongs to application chrome, navigation, progress, actions, and grouping. The generated quotation document remains clean and printable.
3. All meaningful text stays as HTML. Raster artwork contains no labels, numbers, controls, or essential information.
4. Use hard pixel-like edges, nested borders, and short offset shadows. Avoid glassmorphism, soft floating SaaS cards, large blur, and rounded-pill UI.
5. Use restrained animation and honor `prefers-reduced-motion`.

## Tokens

Canonical CSS tokens live in `src/pixel-rpg.css`.

### Color

- `--px-night-950 #02091c`: page background and deepest shadow
- `--px-night-900 #06122e`: primary dark surface
- `--px-night-800 #102452`: raised blue surface
- `--px-blue #2b78f2`: informational and Work Hub actions
- `--px-violet #844ff0`: create/new actions
- `--px-green #44b84b`: active, ready, and success states
- `--px-gold #ffc83d`: focus, important CTA, totals, and frame ornament
- `--px-paper #f5daa0`: quotation tool card and parchment surfaces
- `--px-ink #f6f7ff`: primary text on dark surfaces
- `--px-muted #b9c9ea`: supporting text on dark surfaces
- `--px-line #294477`: default dark-surface border

Status meaning must include text or a symbol; color alone is insufficient.

### Typography

- Thai/body: IBM Plex Sans Thai, Noto Sans Thai, system UI fallback
- HUD numbers and compact labels: system monospace
- Page heading: 28–44px, weight 900, tight tracking, hard 2–3px text shadow only on dark game chrome
- Section heading: 18–24px, weight 800–900
- Body: 13–16px, line height 1.55–1.75
- Never use a decorative pixel font for long Thai paragraphs or form controls.

### Spacing and shape

- Spacing follows a 4px base: 4, 8, 12, 16, 20, 24, 32, 40.
- Common controls: minimum height 44px.
- Corners: 2–5px for game chrome; 0–3px for inset panels. Avoid pills except compact status badges.
- Standard frame: 2–3px colored outer border, 2px dark inset line, 4–7px hard downward shadow.
- Hover may translate upward by at most 1–3px without moving surrounding layout.

## Component rules

### Navigation HUD

- Navy star-field surface with a four-pixel bottom separator.
- Active destination has a green banner/underline plus visible text.
- Coin/count display uses tabular monospace figures.
- Icon-only controls require an accessible name.

### Sidebar / quest menu

- Persistent on desktop; removed from normal flow below 820px while top navigation remains available.
- Active menu is green, available destinations are indigo, unavailable destinations are visibly disabled.
- Player progress is secondary information and stays at the sidebar bottom.

### Hero

- Uses original pixel artwork with left-side quiet space for HTML content.
- Copy lives in a high-contrast nested frame; CTA uses gold.
- At mobile widths, artwork becomes atmosphere and the copy panel becomes nearly opaque.

### Tool cards

- Quotation uses parchment/gold; Work Hub uses royal blue.
- Each card has a title, real description, readiness state, and one clear action.
- Do not add fake statistics or inactive decorative controls.

### Forms and editor panels

- Dark navy nested frames, persistent visible labels, high-contrast inputs.
- Inputs use a 2px blue-gray border and gold focus indicator.
- Destructive actions remain separated and clearly labeled.

### Planner / Daily Work Update

- Calendar and Daily Work Update use dark nested quest frames on desktop and mobile; do not use white application panels or white calendar-day grids.
- The calendar is the navigation region and Daily Work Update is the journal region. Keep both visually distinct with royal-blue, violet, gold, and semantic status accents.
- Completed, pending, in-progress, blocker, and tomorrow cards must keep their semantic accent color while retaining readable light text on dark surfaces.
- Only the selected calendar day uses the gold active treatment; other days remain calm navy.

### Document preview

- Surrounding workspace uses Pixel Quest chrome.
- The A4 quotation itself remains white, neutral, legible, and print-safe.
- Game textures, stars, HUD elements, and pixel fonts must not appear in printed output.

### Modals

- Strong scrim, nested royal-blue frame, visible title, clear close/cancel path.
- Primary action is gold, blue, green, or violet according to meaning.
- Errors include explanatory text and recovery action where applicable.

## Responsive behavior

- Desktop >1080px: full HUD, 238px sidebar, two tool cards.
- Tablet 821–1080px: 190px sidebar, reduced hero copy width, optional HUD metadata hidden.
- Mobile <=820px: sidebar removed, top navigation scrolls horizontally, one-column cards, hero content overlays artwork.
- Narrow mobile <=560px: full-width primary actions, compact padding, no horizontal page overflow.
- Mobile simplification rule: use at most one ornamental frame per content region. Remove nested hard shadows and duplicate borders before reducing font size or control width.
- Calendar days use calm navy surfaces on mobile; only the selected day uses gold. Avoid grids of high-luminance white buttons on dark pages.
- At 700px and below, Calendar and Daily Work Update are sequential single-column regions. Daily summary cards, blocker fields, and the save action must never share a cramped multi-column row.
- Reflow quote line items for reading: the description occupies a full row, quantity and unit may share a row, and price occupies a full row when space is limited.
- Generated document tables may scroll within their own preview surface when comparison columns cannot reflow.

## Accessibility and interaction

- WCAG 2.2 AA is the baseline.
- All controls use native semantic elements.
- Focus uses a 3px gold outline with dark separation.
- Primary/frequent targets are at least 44×44 CSS pixels.
- Reduced motion disables hover translation and decorative motion.
- Never place essential text only inside generated artwork.
- Modal focus management and Escape behavior should be added when related modal logic is next modified.

## Asset policy

- Current hero: `public/assets/quoteflow-pixel-hero.png`.
- Assets must be original and must not reproduce copyrighted characters, logos, or scenes.
- Prefer one meaningful scene over many decorative images.
- Use `image-rendering: pixelated` for deliberate pixel-art assets.

## Verification

Before delivery:

1. Check `/` dashboard plus Quote Editor and Work Hub flows.
2. Check 375px, 820px, 1080px, and desktop widths.
3. Check keyboard focus, dark contrast, long Thai text, and reduced motion.
4. Confirm the A4 print view remains neutral.
5. Run `npx tsc --noEmit` and `npm run build`.
