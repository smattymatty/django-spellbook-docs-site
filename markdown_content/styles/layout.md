---
title: Layout Classes
published: 2025-12-13
modified: 2025-12-13
tags:
  - styles
  - css
  - layout
  - reference
---

Control element display, positioning, sizing, and arrangement with layout utilities.

---

## Display

| Class | CSS |
|-------|-----|
| `sb-block` | `display: block` |
| `sb-inline` | `display: inline` |
| `sb-inline-block` | `display: inline-block` |
| `sb-flex` | `display: flex` |
| `sb-grid` | `display: grid` |
| `sb-hidden` | `display: none` |

---

## Flexbox

### Container
```html
<div class="sb-flex">Flex container</div>
```

### Direction

| Class | CSS |
|-------|-----|
| `sb-flex-row` | `flex-direction: row` |
| `sb-flex-col` | `flex-direction: column` |
| `sb-flex-row-reverse` | `flex-direction: row-reverse` |
| `sb-flex-col-reverse` | `flex-direction: column-reverse` |

**Responsive variants:** `sb-sm:flex-row`, `sb-md:flex-col`, `sb-lg:flex-row-reverse`

```html
<div class="sb-flex sb-flex-row sb-gap-2">
  <div class="sb-bg-primary sb-text-text sb-w-1/3 sb-p-3 sb-rounded">1</div>
  <div class="sb-bg-primary sb-text-text sb-w-1/3 sb-p-3 sb-rounded">2</div>
  <div class="sb-bg-primary sb-text-text sb-w-1/3 sb-p-3 sb-rounded">3</div>
</div>
```

{~ div hx-get="/api/v1/styles/preview/layout-flexbox-direction/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### Wrap

| Class | CSS |
|-------|-----|
| `sb-flex-wrap` | `flex-wrap: wrap` |
| `sb-flex-wrap-reverse` | `flex-wrap: wrap-reverse` |
| `sb-flex-nowrap` | `flex-wrap: nowrap` |

**Responsive variants:** `sb-sm:flex-wrap`, `sb-md:flex-nowrap`

### Justify Content

| Class | CSS |
|-------|-----|
| `sb-justify-start` | `justify-content: flex-start` |
| `sb-justify-end` | `justify-content: flex-end` |
| `sb-justify-center` | `justify-content: center` |
| `sb-justify-between` | `justify-content: space-between` |
| `sb-justify-around` | `justify-content: space-around` |
| `sb-justify-evenly` | `justify-content: space-evenly` |

```html
<div class="sb-flex sb-justify-center sb-gap-2">
  <div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">A</div>
  <div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">B</div>
  <div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">C</div>
</div>
```

{~ div hx-get="/api/v1/styles/preview/layout-flexbox-justify/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### Align Items

| Class | CSS |
|-------|-----|
| `sb-items-start` | `align-items: flex-start` |
| `sb-items-end` | `align-items: flex-end` |
| `sb-items-center` | `align-items: center` |
| `sb-items-baseline` | `align-items: baseline` |
| `sb-items-stretch` | `align-items: stretch` |

### Grow & Shrink

| Class | CSS |
|-------|-----|
| `sb-grow` | `flex-grow: 1` |
| `sb-grow-0` | `flex-grow: 0` |
| `sb-shrink` | `flex-shrink: 1` |
| `sb-shrink-0` | `flex-shrink: 0` |

### Gap

| Class | Value |
|-------|-------|
| `sb-gap-1` | 0.25rem (4px) |
| `sb-gap-2` | 0.5rem (8px) |
| `sb-gap-3` | 1rem (16px) |
| `sb-gap-4` | 1.5rem (24px) |
| `sb-gap-6` | 2rem (32px) |
| `sb-gap-8` | 3rem (48px) |

---

## Grid

### Container
```html
<div class="sb-grid sb-grid-cols-3 sb-gap-4">Grid layout</div>
```

### Columns

| Class | CSS |
|-------|-----|
| `sb-grid-cols-1` | `grid-template-columns: repeat(1, minmax(0, 1fr))` |
| `sb-grid-cols-2` | `grid-template-columns: repeat(2, minmax(0, 1fr))` |
| `sb-grid-cols-3` | `grid-template-columns: repeat(3, minmax(0, 1fr))` |
| `sb-grid-cols-4` | `grid-template-columns: repeat(4, minmax(0, 1fr))` |

**Responsive variants:** `sb-md:grid-cols-2`, `sb-md:grid-cols-3`, `sb-md:grid-cols-4`

```html
<div class="sb-grid sb-grid-cols-3 sb-gap-2">
  <div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">1</div>
  <div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">2</div>
  <div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">3</div>
</div>
```

{~ div hx-get="/api/v1/styles/preview/layout-grid/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Position

| Class | CSS |
|-------|-----|
| `sb-static` | `position: static` |
| `sb-relative` | `position: relative` |
| `sb-absolute` | `position: absolute` |
| `sb-fixed` | `position: fixed` |
| `sb-sticky` | `position: sticky` |

### Placement

| Class | CSS |
|-------|-----|
| `sb-inset-0` | `top: 0; right: 0; bottom: 0; left: 0` |
| `sb-top-0` | `top: 0` |
| `sb-right-0` | `right: 0` |
| `sb-bottom-0` | `bottom: 0` |
| `sb-left-0` | `left: 0` |

### Z-Index

| Class | CSS |
|-------|-----|
| `sb-z-0` | `z-index: 0` |
| `sb-z-10` | `z-index: 10` |
| `sb-z-20` | `z-index: 20` |
| `sb-z-30` | `z-index: 30` |
| `sb-z-40` | `z-index: 40` |
| `sb-z-50` | `z-index: 50` |
| `sb-z-auto` | `z-index: auto` |

---

## Width

### Fixed Widths

| Class | Value |
|-------|-------|
| `sb-w-0` | 0 |
| `sb-w-1` | 0.25rem (4px) |
| `sb-w-2` | 0.5rem (8px) |
| `sb-w-3` | 0.75rem (12px) |
| `sb-w-4` | 1rem (16px) |
| `sb-w-5` | 1.25rem (20px) |
| `sb-w-6` | 1.5rem (24px) |
| `sb-w-7` | 1.75rem (28px) |
| `sb-w-8` | 2rem (32px) |
| `sb-w-16` | 4rem (64px) |
| `sb-w-32` | 8rem (128px) |
| `sb-w-64` | 16rem (256px) |

### Percentage Widths

| Class | Value |
|-------|-------|
| `sb-w-1/2` | 50% |
| `sb-w-1/3` | 33.333% |
| `sb-w-2/3` | 66.666% |
| `sb-w-1/4` | 25% |
| `sb-w-3/4` | 75% |
| `sb-w-full` | 100% |

**Responsive variants:** `sb-sm:w-1/2`, `sb-md:w-1/3`, `sb-lg:w-full`, `sb-xl:w-1/2`

```html
<div class="sb-w-1/2 sb-bg-primary sb-text-text sb-p-3 sb-rounded">Half width (50%)</div>
<div class="sb-w-1/3 sb-bg-secondary sb-text-text sb-p-3 sb-rounded">Third width (33.333%)</div>
<div class="sb-w-full sb-bg-accent sb-text-text sb-p-3 sb-rounded">Full width (100%)</div>
```

{~ div hx-get="/api/v1/styles/preview/layout-width/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### Viewport Widths

| Class | Value |
|-------|-------|
| `sb-w-screen` | 100vw |
| `sb-w-50vw` | 50vw |
| `sb-w-75vw` | 75vw |

### Min/Max Width

| Class | Value |
|-------|-------|
| `sb-min-w-0` | 0 |
| `sb-min-w-full` | 100% |
| `sb-min-w-screen` | 100vw |
| `sb-max-w-xs` | 20rem (320px) |
| `sb-max-w-sm` | 24rem (384px) |
| `sb-max-w-md` | 28rem (448px) |
| `sb-max-w-lg` | 32rem (512px) |
| `sb-max-w-xl` | 36rem (576px) |
| `sb-max-w-full` | 100% |

---

## Height

### Fixed Heights

| Class | Value |
|-------|-------|
| `sb-h-0` | 0 |
| `sb-h-1` | 0.25rem (4px) |
| `sb-h-2` | 0.5rem (8px) |
| `sb-h-3` | 0.75rem (12px) |
| `sb-h-4` | 1rem (16px) |
| `sb-h-5` | 1.25rem (20px) |
| `sb-h-6` | 1.5rem (24px) |
| `sb-h-7` | 1.75rem (28px) |
| `sb-h-8` | 2rem (32px) |
| `sb-h-16` | 4rem (64px) |
| `sb-h-24` | 6rem (96px) |
| `sb-h-32` | 8rem (128px) |
| `sb-h-64` | 16rem (256px) |

### Special Heights

| Class | Value |
|-------|-------|
| `sb-h-auto` | auto |
| `sb-h-full` | 100% |
| `sb-h-screen` | 100vh |
| `sb-h-50vh` | 50vh |
| `sb-h-75vh` | 75vh |

### Min/Max Height

| Class | Value |
|-------|-------|
| `sb-min-h-0` | 0 |
| `sb-min-h-full` | 100% |
| `sb-min-h-screen` | 100vh |
| `sb-max-h-full` | 100% |
| `sb-max-h-screen` | 100vh |

---

## Aspect Ratio

| Class | Ratio |
|-------|-------|
| `sb-aspect-square` | 1 / 1 |
| `sb-aspect-video` | 16 / 9 |
| `sb-aspect-portrait` | 3 / 4 |
| `sb-aspect-wide` | 21 / 9 |

---

## Object Fit

For images and videos within constrained containers.

| Class | CSS |
|-------|-----|
| `sb-object-contain` | `object-fit: contain` |
| `sb-object-cover` | `object-fit: cover` |
| `sb-object-fill` | `object-fit: fill` |
| `sb-object-none` | `object-fit: none` |
| `sb-object-scale-down` | `object-fit: scale-down` |

---

## Overflow

| Class | CSS |
|-------|-----|
| `sb-overflow-auto` | `overflow: auto` |
| `sb-overflow-hidden` | `overflow: hidden` |
| `sb-overflow-visible` | `overflow: visible` |
| `sb-overflow-scroll` | `overflow: scroll` |
| `sb-overflow-x-auto` | `overflow-x: auto` |
| `sb-overflow-y-auto` | `overflow-y: auto` |

---

## Container

Centered container with responsive max-width.
```html
<div class="sb-container">Centered, responsive content</div>
```

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| < 640px | 100% | 0 |
| ≥ 640px | 640px | 0 |
| ≥ 768px | 768px | 0 |
| ≥ 1024px | 1024px | 1rem |
| ≥ 1280px | 1280px | 2rem |

---

## Border Radius

| Class | Value |
|-------|-------|
| `sb-rounded-none` | 0 |
| `sb-rounded-sm` | 0.125rem (2px) |
| `sb-rounded` | 0.25rem (4px) |
| `sb-rounded-md` | 0.375rem (6px) |
| `sb-rounded-lg` | 0.5rem (8px) |
| `sb-rounded-full` | 9999px |

---

## Responsive Breakpoints

All responsive variants use these breakpoints:

| Prefix | Min Width |
|--------|-----------|
| `sb-sm:` | 640px |
| `sb-md:` | 768px |
| `sb-lg:` | 1024px |
| `sb-xl:` | 1280px |

### Example: Responsive Grid
```html
<div class="sb-grid sb-grid-cols-1 sb-md:grid-cols-2 sb-lg:grid-cols-3 sb-gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

- Mobile: 1 column
- Tablet (768px+): 2 columns
- Desktop (1024px+): 3 columns

---

## Common Patterns

### Centered Content
```html
<div class="sb-flex sb-justify-center sb-items-center sb-h-screen">
  Centered vertically and horizontally
</div>
```

{~ div hx-get="/api/v1/styles/preview/layout-patterns-centered/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-mb-4 ~}
Loading preview...
{~~}

### Sidebar Layout
```html
<div class="sb-flex sb-flex-col sb-md:flex-row sb-gap-4">
  <aside class="sb-w-full sb-md:w-1/4">Sidebar</aside>
  <main class="sb-grow">Main content</main>
</div>
```

{~ div hx-get="/api/v1/styles/preview/layout-patterns-sidebar/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### Card Grid
```html
<div class="sb-grid sb-grid-cols-1 sb-md:grid-cols-2 sb-lg:grid-cols-3 sb-gap-6">
  <div class="sb-bg-surface sb-p-4 sb-rounded-lg">Card 1</div>
  <div class="sb-bg-surface sb-p-4 sb-rounded-lg">Card 2</div>
  <div class="sb-bg-surface sb-p-4 sb-rounded-lg">Card 3</div>
</div>
```

{~ div hx-get="/api/v1/styles/preview/layout-patterns-cards/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### Sticky Header
```html
<header class="sb-sticky sb-top-0 sb-z-50 sb-bg-background">
  Navigation
</header>
```

### Full-Width Image
```html
<div class="sb-w-full sb-aspect-video sb-overflow-hidden">
  <img src="..." class="sb-w-full sb-h-full sb-object-cover" alt="...">
</div>
```

---

## Related

- [Spacing Classes](/docs/styles/spacing/) — Padding, margin, and gap utilities
- [Color Classes](/docs/styles/colors/) — Background, text, and border colors