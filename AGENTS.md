# QuoteFlow project rules

## Frontend design system

All user-facing UI in this repository must follow [`design-system/quote-flow-pixel/MASTER.md`](design-system/quote-flow-pixel/MASTER.md).

- Preserve existing QuoteFlow business logic, state, import/export behavior, and stored data unless the user explicitly requests logic changes.
- Reuse the Pixel Quest tokens and component patterns before introducing new colors, borders, shadows, radii, icons, or motion.
- New pages must support keyboard focus, reduced motion, dark backgrounds, mobile reflow, and 44px primary touch targets.
- Generated raster artwork must be original, stored under `public/assets/`, have no embedded UI text, and retain an HTML/CSS fallback surface.
- Run `npx tsc --noEmit` and `npm run build` after frontend changes.

