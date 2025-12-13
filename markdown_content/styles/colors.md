---
title: Color Classes
published: 2025-12-12
modified: 2025-12-12
tags:
  - styles
  - css
  - colors
  - reference
---

All color utilities are theme-aware. They reference CSS variables that change based on your `SPELLBOOK_THEME` setting.

## Background Colors

### Core Colors
```html
<div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">Primary</div>
<div class="sb-bg-secondary sb-text-text sb-p-3 sb-rounded">Secondary</div>
<div class="sb-bg-accent sb-text-text sb-p-3 sb-rounded">Accent</div>
<div class="sb-bg-neutral sb-text-text sb-p-3 sb-rounded">Neutral</div>
```

{~ div hx-get="/api/v1/styles/preview/bg-core/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

### Status Colors
```html
<div class="sb-bg-success sb-text-text sb-p-3 sb-rounded">Success</div>
<div class="sb-bg-warning sb-text-text sb-p-3 sb-rounded">Warning</div>
<div class="sb-bg-error sb-text-text sb-p-3 sb-rounded">Error</div>
<div class="sb-bg-info sb-text-text sb-p-3 sb-rounded">Info</div>
```

{~ div hx-get="/api/v1/styles/preview/bg-status/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

### Specialty Colors
```html
<div class="sb-bg-emphasis sb-text-text sb-p-3 sb-rounded">Emphasis</div>
<div class="sb-bg-subtle sb-text-text sb-p-3 sb-rounded">Subtle</div>
<div class="sb-bg-distinct sb-text-text sb-p-3 sb-rounded">Distinct</div>
<div class="sb-bg-aether sb-text-text sb-p-3 sb-rounded">Aether</div>
<div class="sb-bg-artifact sb-text-text sb-p-3 sb-rounded">Artifact</div>
<div class="sb-bg-sylvan sb-text-text sb-p-3 sb-rounded">Sylvan</div>
<div class="sb-bg-danger sb-text-text sb-p-3 sb-rounded">Danger</div>
```

{~ div hx-get="/api/v1/styles/preview/bg-specialty/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

### System Colors
```html
<div class="sb-bg-background sb-text-text sb-p-3 sb-rounded">Page background</div>
<div class="sb-bg-surface sb-text-text sb-p-3 sb-rounded">Surface (cards, panels)</div>
```

{~ div hx-get="/api/v1/styles/preview/bg-system/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

### Base Colors
```html
<div class="sb-bg-black sb-text-white sb-p-3 sb-rounded">Black</div>
<div class="sb-bg-white sb-text-text sb-p-3 sb-rounded">White</div>
<div class="sb-bg-transparent sb-text-text sb-p-3 sb-rounded">Transparent</div>
```

{~ div hx-get="/api/v1/styles/preview/bg-base/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

---

## Text Colors
```html
<span class="sb-text-primary sb-font-bold">Primary text</span>
<span class="sb-text-secondary sb-font-bold">Secondary text</span>
<span class="sb-text-accent sb-font-bold">Accent text</span>
<span class="sb-text-neutral sb-font-bold">Neutral text</span>
<span class="sb-text-success sb-font-bold">Success text</span>
<span class="sb-text-warning sb-font-bold">Warning text</span>
<span class="sb-text-error sb-font-bold">Error text</span>
<span class="sb-text-info sb-font-bold">Info text</span>
<span class="sb-text-text sb-font-bold">Text (default)</span>
<span class="sb-text-text-secondary sb-font-bold">Text Secondary (muted)</span>
```

{~ div hx-get="/api/v1/styles/preview/text-colors/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 .sb-bg-surface ~}
Loading preview...
{~~}

---

## Border Colors

Requires a border width class (`sb-border`, `sb-border-2`, etc.):
```html
<div class="sb-border-2 sb-border-primary sb-p-3 sb-rounded">Primary border</div>
<div class="sb-border-2 sb-border-secondary sb-p-3 sb-rounded">Secondary border</div>
<div class="sb-border-2 sb-border-accent sb-p-3 sb-rounded">Accent border</div>
<div class="sb-border-2 sb-border-success sb-p-3 sb-rounded">Success border</div>
```

{~ div hx-get="/api/v1/styles/preview/border-colors/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

---

## Opacity Variants

Every color has 25%, 50%, and 75% opacity variants. Works for backgrounds, text, and borders.

{~ alert type=info ~}
Spellbook Color Utilities also support `10` and `90` for opacity variants!
{~~}


### Background Opacity
```html
<div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">100%</div>
<div class="sb-bg-primary-90 sb-text-text sb-p-3 sb-rounded">90%</div>
<div class="sb-bg-primary-75 sb-text-text sb-p-3 sb-rounded">75%</div>
<div class="sb-bg-primary-50 sb-text-text sb-p-3 sb-rounded">50%</div>
<div class="sb-bg-primary-25 sb-text-text sb-p-3 sb-rounded">25%</div>
<div class="sb-bg-primary-10 sb-text-text sb-p-3 sb-rounded">10%</div>
```

{~ div hx-get="/api/v1/styles/preview/opacity-bg/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

### Text Opacity
```html
<span class="sb-text-primary sb-font-bold">100%</span>
<span class="sb-text-primary-75 sb-font-bold">75%</span>
<span class="sb-text-primary-50 sb-font-bold">50%</span>
<span class="sb-text-primary-25 sb-font-bold">25%</span>
```

{~ div hx-get="/api/v1/styles/preview/opacity-text/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 .sb-bg-surface ~}
Loading preview...
{~~}

### Border Opacity
```html
<div class="sb-border-2 sb-border-primary sb-p-3 sb-rounded">100%</div>
<div class="sb-border-2 sb-border-primary-75 sb-p-3 sb-rounded">75%</div>
<div class="sb-border-2 sb-border-primary-50 sb-p-3 sb-rounded">50%</div>
<div class="sb-border-2 sb-border-primary-25 sb-p-3 sb-rounded">25%</div>
```

{~ div hx-get="/api/v1/styles/preview/opacity-border/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

---

## Hover States

Prefix any color class with `sb-hover:` for hover effects.

### Background Hover
```html
<div class="sb-bg-white sb-hover:bg-primary sb-hover:text-white sb-text-text sb-p-3 sb-rounded sb-transition sb-cursor-pointer">
    White → Primary on hover
</div>
<div class="sb-bg-surface sb-hover:bg-accent sb-hover:text-white sb-p-3 sb-rounded sb-transition sb-cursor-pointer">
    Surface → Accent on hover
</div>
```

{~ div hx-get="/api/v1/styles/preview/hover-bg/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

### Text Hover
```html
<span class="sb-text-secondary sb-hover:text-primary sb-font-bold sb-transition sb-cursor-pointer">
    Secondary → Primary on hover
</span>
<span class="sb-text-primary sb-hover:text-accent sb-font-bold sb-transition sb-cursor-pointer">
    Primary → Accent on hover
</span>
```

{~ div hx-get="/api/v1/styles/preview/hover-text/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 .sb-bg-surface ~}
Loading preview...
{~~}

### Border Hover
```html
<div class="sb-border-2 sb-border-secondary sb-hover:border-primary sb-p-3 sb-rounded sb-transition sb-cursor-pointer">
    Border changes on hover
</div>
```

{~ div hx-get="/api/v1/styles/preview/hover-border/" hx-trigger="load" .sb-p-3 .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

---

## Color Reference

{~ card title="All Available Colors" ~}
**Core:** primary, secondary, accent, neutral

**Status:** success, warning, error, info

**Specialty:** emphasis, subtle, distinct, aether, artifact, sylvan, danger

**System:** background, surface, text, text-secondary

**Base:** black, white, transparent
{~~}

{~ card title="All Modifiers" ~}
**Opacity:** -10, -25, -50, -75, -90

**Hover:** sb-hover:bg-*, sb-hover:text-*, sb-hover:border-*
{~~}

---

## Next Steps

{~ accordion title="Themes" ~}
The presets that define what these colors actually look like. Pick one or customize your own.

[View Themes →](/docs/themes/)
{~~}

{~ accordion title="Spacing Classes" ~}
Padding, margin, and gap utilities.

[View Spacing →](/docs/styles/spacing/)
{~~}