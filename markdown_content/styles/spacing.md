---
title: Spacing Classes
published: 2025-12-12
modified: 2025-12-12
tags:
  - styles
  - css
  - spacing
  - reference
---

Padding, margin, and gap utilities for controlling space in your layouts.

---

## Spacing Scale

All spacing utilities use a consistent scale:

| Value | Size | Pixels |
|-------|------|--------|
| 0 | 0 | 0px |
| 1 | 0.25rem | 4px |
| 2 | 0.5rem | 8px |
| 3 | 1rem | 16px |
| 4 | 1.5rem | 24px |
| 6 | 2rem | 32px |
| 8 | 3rem | 48px |

---

## Padding

### p (all sides)
```html
<div class="sb-p-0 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-0: No padding</div>
<div class="sb-p-1 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-1: 0.25rem</div>
<div class="sb-p-2 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-2: 0.5rem</div>
<div class="sb-p-3 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-3: 1rem</div>
<div class="sb-p-4 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-4: 1.5rem</div>
<div class="sb-p-6 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-6: 2rem</div>
```

{~ div hx-get="/api/v1/styles/preview/spacing-p/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### px / py (horizontal / vertical)
```html
<div class="sb-px-6 sb-py-1 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">px-6 py-1: Wide horizontal</div>
<div class="sb-px-1 sb-py-4 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">px-1 py-4: Tall vertical</div>
```

{~ div hx-get="/api/v1/styles/preview/spacing-pxy/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### pt / pr / pb / pl (individual sides)
```html
<div class="sb-pt-4 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">pt-4: Padding top</div>
<div class="sb-pr-6 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">pr-6: Padding right</div>
<div class="sb-pb-4 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">pb-4: Padding bottom</div>
<div class="sb-pl-6 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">pl-6: Padding left</div>
```

{~ div hx-get="/api/v1/styles/preview/spacing-psides/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Margin

### m (all sides)
```html
<!-- Containers show the margin space -->
<div class="sb-bg-neutral-5 sb-p-1">
  <div class="sb-m-0 sb-bg-surface sb-text-text sb-p-2">m-0 inside container</div>
</div>
<div class="sb-bg-neutral-5 sb-p-1">
  <div class="sb-m-2 sb-bg-surface sb-text-text sb-p-2">m-2 inside container</div>
</div>
<div class="sb-bg-neutral-5 sb-p-1">
  <div class="sb-m-4 sb-bg-surface sb-text-text sb-p-2">m-4 inside container</div>
</div>
```

{~ div hx-get="/api/v1/styles/preview/spacing-m/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### mb (margin bottom) - Most common
```html
<div class="sb-bg-surface sb-text-text sb-p-3 sb-mb-2 sb-border-2 sb-border-neutral">mb-2: Small gap below</div>
<div class="sb-bg-surface sb-text-text sb-p-3 sb-mb-4 sb-border-2 sb-border-neutral">mb-4: Medium gap below</div>
<div class="sb-bg-surface sb-text-text sb-p-3 sb-mb-8 sb-border-2 sb-border-neutral">mb-8: Large gap below</div>
<div class="sb-bg-surface sb-text-text sb-p-3 sb-border-2 sb-border-neutral">Next element after gaps</div>
```

{~ div hx-get="/api/v1/styles/preview/spacing-mb/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Gap

Space between flex/grid children. Cleaner than margins.

{~ alert type="info" ~}
Gap requires `sb-flex` or `sb-grid` on the parent container.
{~~}

```html
<!-- gap-2 -->
<div class="sb-flex sb-gap-2">
  <div class="sb-bg-primary sb-text-text sb-p-3">A</div>
  <div class="sb-bg-primary sb-text-text sb-p-3">B</div>
  <div class="sb-bg-primary sb-text-text sb-p-3">C</div>
</div>

<!-- gap-4 -->
<div class="sb-flex sb-gap-4">
  <div class="sb-bg-primary sb-text-text sb-p-3">A</div>
  <div class="sb-bg-primary sb-text-text sb-p-3">B</div>
  <div class="sb-bg-primary sb-text-text sb-p-3">C</div>
</div>

<!-- gap-8 -->
<div class="sb-flex sb-gap-8">
  <div class="sb-bg-primary sb-text-text sb-p-3">A</div>
  <div class="sb-bg-primary sb-text-text sb-p-3">B</div>
  <div class="sb-bg-primary sb-text-text sb-p-3">C</div>
</div>
```

{~ div hx-get="/api/v1/styles/preview/spacing-gap/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Quick Reference

{~ card title="Padding" ~}
**All:** `sb-p-{0,1,2,3,4,6,8}`

**Axis:** `sb-px-*`, `sb-py-*`

**Sides:** `sb-pt-*`, `sb-pr-*`, `sb-pb-*`, `sb-pl-*`
{~~}

{~ card title="Margin" ~}
**All:** `sb-m-{0,1,2,3,4,6,8}`

**Axis:** `sb-mx-*`, `sb-my-*`

**Sides:** `sb-mt-*`, `sb-mr-*`, `sb-mb-*`, `sb-ml-*`

**Negative:** `sb-m-n*`, `sb-mt-n*`, etc.
{~~}

{~ card title="Gap" ~}
**Gap:** `sb-gap-{1,2,3,4,6,8}`

**Space Between:** `sb-space-x-*`, `sb-space-y-*`
{~~}

---

## Next Steps

{~ accordion title="Layout Classes" ~}
Flexbox, grid, and positioning utilities.

[View Layout →](/docs/styles/layout/)
{~~}

{~ accordion title="Color Classes" ~}
Background, text, and border colors.

[View Colors →](/docs/styles/colors/)
{~~}
