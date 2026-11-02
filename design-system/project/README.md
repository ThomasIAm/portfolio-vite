# Portfolio

A warm, soft-cornered system for a personal portfolio and blog: coral and amber on cream, teal as the cool counterpoint, Poppins headings over DM Sans body. Extracted from `thomasiam/portfolio-vite` (`src/index.css`, `tailwind.config.ts`, `src/components/ui`).

## Content fundamentals
- Plain, friendly first-person voice; short sentences, sentence case for headings and buttons.
- Developer touches are literal: code blocks use a terminal-style prompt glyph in `accent`.

## Visual foundations
- **Color:** HSL tokens in two themes (`light` first, `dark` via the `.dark` class). Page = `background`, surfaces = `card`, text = `foreground`, quiet text = `muted-foreground`. `primary` (coral) leads; `secondary` (amber) supports; `accent` (teal) is used sparingly. Brand gradient: 135deg `primary` to `secondary`.
- **Type:** headings in Poppins (`--font-display`), everything else DM Sans (`--font-sans`). Only Poppins 400 is loaded in the app, so semibold headings are synthesized there.
- **Shape:** generous radii. Base `radius-lg` 16px for buttons and cards; `radius-full` for badges.
- **Depth:** soft, warm shadows (`shadow-soft`, `shadow-card`); hover lifts 2-4px and swaps to `shadow-hover` (coral glow). Transitions 300ms ease-out.
- **Spacing:** 4px base; cards pad `space-6`; page gutter `space-6`, max container 1200px.
- **Focus:** 2px `ring` (coral) with 2px offset on every control.

## Components
Actions: Button. Surfaces: Card. Display: Badge, Avatar. Forms: Input, Textarea, Checkbox, Switch. Feedback: Alert, Progress, Skeleton. Navigation: Tabs, Accordion. Overlays: Dialog, Tooltip. Layout: Separator. Each has guidelines and a live preview. The app has ~50 shadcn/ui primitives on these same tokens; the rest (menus, select, sheet, calendar and so on) are not documented yet.

## Not synced
Fonts are hosted by Google Fonts (no files copied). Contrast flags: `primary-foreground` and `accent-foreground` on their fills fall below 4.5:1 in the light theme (kept from source). Last synced from commit a92d169 (tokens unchanged). Motion keyframes (`fade-up`, `fade-in`, `float`, accordion) are not representable in tokens.
