---
name: production-ui-component-system
description: 'Build or extend production-ready interactive UI component systems with Next.js App Router, React, strict TypeScript, Tailwind CSS, clsx, tailwind-merge, dark mode, Framer Motion, accessible keyboard interactions, loading/error/empty states, and showcase demos. Use when creating reusable frontend components, design-system primitives, compound components, or polished interactive UI prototypes.'
argument-hint: '[component or workflow to build]'
user-invocable: true
disable-model-invocation: false
---

# Production UI Component System

## Outcome

Deliver a production-ready, reusable interactive component and a working showcase. The implementation must be modular, accessible, responsive, themeable, motion-ready, and easy to copy into another Next.js App Router project.

The default deliverables are:

- A component file with complete strict TypeScript props and Tailwind classes.
- A motion file containing reusable Framer Motion variants and keyframes.
- A demo or showcase page covering default, hover, active, disabled, loading, empty, error, and dark-mode states.
- Focused tests or an executable verification path for behavior and accessibility when the repository supports them.

## Before Editing

1. Inspect the repository starting at the nearest page, component, or failing behavior named by the user.
2. Identify the framework, App Router structure, styling setup, package manager, TypeScript strictness, and existing component conventions.
3. Check whether `clsx`, `tailwind-merge`, `framer-motion`, a theme provider, an icon library, and an established `cn` utility already exist.
4. Reuse local abstractions and visual language. Do not replace unrelated work or introduce a second styling system.
5. State one local implementation hypothesis and one cheap check that could disconfirm it before editing.
6. If the repository is not already a Next.js App Router project, decide whether the user asked for migration/scaffolding or whether the component should be implemented using the existing framework. Confirm only when the choice materially changes scope.

## Implementation Procedure

### 1. Define the contract

- Name the component and its user workflow.
- List visual states: default, hover, focus-visible, active/pressed, disabled, loading, empty, error, and selected/open where relevant.
- Define controlled and uncontrolled state only when the interaction needs both.
- Write strict interfaces for all public props, callback payloads, render slots, and data records.
- Document public props with concise TSDoc where their behavior is not obvious.

### 2. Establish the project primitives

- Use Next.js App Router conventions and add `'use client'` only to interactive client boundaries.
- Use React and strict TypeScript without `any` or unsafe casts.
- Use Tailwind CSS for component styling and define semantic CSS variables or theme tokens for light and dark themes.
- Implement or reuse a `cn(...inputs)` helper based on `clsx` and `tailwind-merge`.
- Add `framer-motion` only if absent and keep motion variants separate from visual component code.
- Use an existing icon library, preferably Lucide when available; provide tooltips for unfamiliar icon-only controls.
- Keep dependencies and configuration changes minimal and update package metadata through the repository package manager.

### 3. Build the visual and state layers

- Separate the visual component, state hooks, and compound subcomponents when the component has meaningful behavior or multiple coordinated parts.
- Prefer a compound API such as `Component`, `Component.Trigger`, `Component.Content`, and `Component.Item` when it makes composition clearer.
- Keep stable dimensions for controls, tiles, grids, counters, and other fixed-format elements so state changes do not shift layout.
- Use restrained borders, backdrop blur, soft depth, and gradients only where they support hierarchy. Preserve the existing product style when integrating into an established UI.
- Add meaningful entering, exiting, layout-shift, and staggered-list transitions with reduced-motion fallbacks. Do not animate every element.
- Include real skeleton, empty, and error rendering paths rather than placeholder text hidden in the default view.
- Make mobile layout intentional: controls must fit, text must wrap cleanly, and no interaction may depend on hover.

### 4. Implement accessibility

- Use semantic HTML first, then WAI-ARIA only when needed.
- Provide accessible names for icon-only buttons and meaningful descriptions for complex controls.
- Use the correct roles and attributes, including `aria-expanded`, `aria-controls`, `aria-selected`, `aria-disabled`, and `aria-live` where applicable.
- Ensure every interactive element is keyboard reachable and has a visible `:focus-visible` state with sufficient contrast.
- Implement the interaction model appropriate to the widget: Tab order, Arrow-key navigation, Home/End, Enter/Space activation, and Escape to close or cancel where relevant.
- Manage focus when opening, closing, removing, or loading content. Do not trap focus unless the pattern requires it.
- Respect `prefers-reduced-motion` and verify WCAG AA contrast for text, controls, and focus indicators.

### 5. Create the showcase

- Add a real route or page that renders the component with representative data.
- Include controls that let a reviewer exercise default, hover, active, disabled, loading, empty, error, selected/open, and dark-mode states.
- Demonstrate controlled behavior, keyboard behavior, responsive layout, and motion where applicable.
- Keep the showcase as a usable preview, not a marketing landing page. Avoid explanatory UI copy that merely describes obvious features.
- Include enough edge-case data to expose truncation, long labels, missing values, and dense layouts.

## Decision Points

- **Existing design system:** extend its tokens, APIs, and icon conventions; do not create parallel primitives.
- **No design system:** create the smallest local tokens and utility needed, then keep the component API portable.
- **Simple one-part component:** a single component is sufficient; separate files only when motion, state, or types have independent value.
- **Coordinated interactive parts:** use a state hook plus compound subcomponents and a stable context contract.
- **Modal, popover, combobox, menu, or dialog:** use a proven accessible primitive library already present; do not hand-roll focus management if a maintained local dependency exists.
- **No test runner:** provide a focused manual verification checklist and run the build/typecheck instead of inventing test infrastructure.
- **Motion package unavailable or unsuitable:** preserve the same component API with CSS transitions or a no-op motion adapter, while keeping the motion file integration-ready.
- **Dark mode already exists:** use its provider and token names. Otherwise implement a small class- or variable-based theme mechanism without forcing a global redesign.

## Verification Checklist

Run the narrowest available checks immediately after the first substantive edit, then rerun them after follow-up edits:

1. Typecheck the touched project with strict mode enabled.
2. Run the focused component test or existing accessibility test suite.
3. Run lint and the production build when configuration or dependencies changed.
4. Start the local dev server when a showcase route exists and inspect desktop and mobile viewports.
5. Exercise keyboard-only interaction: Tab, Shift+Tab, Enter/Space, Arrow keys, Home/End, and Escape as relevant.
6. Confirm focus visibility, contrast, screen-reader names, disabled semantics, and reduced-motion behavior.
7. Verify no console errors, hydration mismatches, layout shifts, or overflowing labels.
8. Report any checks unavailable in the repository and describe the remaining risk.

## Completion Standard

The task is complete only when the component, motion definitions, and showcase are wired into the application; public APIs are strictly typed; all required states have visible behavior; keyboard and screen-reader behavior are addressed; dark/light themes work; and the narrowest available executable validation has passed. Keep the final report concise and include changed files, validation commands, and any known limitations.
