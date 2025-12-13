---
title: Typography Classes
published: 2025-12-13
modified: 2025-12-13
tags:
  - styles
  - css
  - typography
  - reference
---

Font families, sizes, weights, and text styling utilities.

---

## Font Family

| Class | Stack |
|-------|-------|
| `sb-font-sans` | System UI, Segoe UI, Roboto, Helvetica, Arial |
| `sb-font-serif` | Georgia, Cambria, Times New Roman, serif |
| `sb-font-mono` | SFMono, Menlo, Monaco, Consolas, monospace |

```html
<div class="sb-font-sans sb-text-text sb-text-lg">Sans-serif font</div>
<div class="sb-font-serif sb-text-text sb-text-lg">Serif font</div>
<div class="sb-font-mono sb-text-text sb-text-lg">Monospace font</div>
```

{~ div hx-get="/api/v1/styles/preview/typography-families/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Font Size

| Class | Size |
|-------|------|
| `sb-text-xs` | 0.75rem (12px) |
| `sb-text-sm` | 0.875rem (14px) |
| `sb-text-base` | 1rem (16px) |
| `sb-text-lg` | 1.125rem (18px) |
| `sb-text-xl` | 1.25rem (20px) |
| `sb-text-2xl` | 1.5rem (24px) |
| `sb-text-3xl` | 1.875rem (30px) |
| `sb-text-4xl` | 2.25rem (36px) |

```html
<div class="sb-text-sm sb-text-text">text-sm: 0.875rem (14px)</div>
<div class="sb-text-base sb-text-text">text-base: 1rem (16px)</div>
<div class="sb-text-lg sb-text-text">text-lg: 1.125rem (18px)</div>
<div class="sb-text-2xl sb-text-text">text-2xl: 1.5rem (24px)</div>
```

{~ div hx-get="/api/v1/styles/preview/typography-sizes/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Font Weight

| Class | Weight |
|-------|--------|
| `sb-bold` | 700 |
| `sb-font-bold` | 700 |
| `sb-font-semibold` | 600 |

```html
<div class="sb-text-text sb-text-lg">Normal weight</div>
<div class="sb-text-text sb-text-lg sb-font-semibold">Semibold: 600</div>
<div class="sb-text-text sb-text-lg sb-font-bold">Bold: 700</div>
```

{~ div hx-get="/api/v1/styles/preview/typography-weights/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Font Style

| Class | CSS |
|-------|-----|
| `sb-italic` | `font-style: italic` |

---

## Line Height

| Class | Value |
|-------|-------|
| `sb-leading-none` | 1 |
| `sb-leading-tight` | 1.25 |
| `sb-leading-snug` | 1.375 |
| `sb-leading-normal` | 1.5 |
| `sb-leading-relaxed` | 1.625 |
| `sb-leading-loose` | 2 |

---

## Letter Spacing

| Class | Value |
|-------|-------|
| `sb-tracking-tighter` | -0.05em |
| `sb-tracking-tight` | -0.025em |
| `sb-tracking-normal` | 0 |
| `sb-tracking-wide` | 0.025em |
| `sb-tracking-wider` | 0.05em |
| `sb-tracking-widest` | 0.1em |

---

## Text Alignment

| Class | CSS |
|-------|-----|
| `sb-text-left` | `text-align: left` |
| `sb-text-center` | `text-align: center` |
| `sb-text-right` | `text-align: right` |
| `sb-text-justify` | `text-align: justify` |

```html
<div class="sb-text-left sb-text-text sb-p-2 sb-bg-neutral-5">Left aligned</div>
<div class="sb-text-center sb-text-text sb-p-2 sb-bg-neutral-5">Center aligned</div>
<div class="sb-text-right sb-text-text sb-p-2 sb-bg-neutral-5">Right aligned</div>
```

{~ div hx-get="/api/v1/styles/preview/typography-alignment/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Text Decoration

### Decoration Line

| Class | CSS |
|-------|-----|
| `sb-underline` | `text-decoration-line: underline` |
| `sb-line-through` | `text-decoration-line: line-through` |
| `sb-no-underline` | `text-decoration-line: none` |

### Decoration Style

| Class | CSS |
|-------|-----|
| `sb-decoration-dotted` | `text-decoration-style: dotted` |
| `sb-decoration-dashed` | `text-decoration-style: dashed` |
| `sb-decoration-wavy` | `text-decoration-style: wavy` |

```html
<div class="sb-text-text sb-text-lg sb-underline">Underlined text</div>
<div class="sb-text-text sb-text-lg sb-line-through">Line-through text</div>
<div class="sb-text-text sb-text-lg sb-underline sb-decoration-wavy">Wavy underline</div>
```

{~ div hx-get="/api/v1/styles/preview/typography-decoration/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Text Transform

| Class | CSS |
|-------|-----|
| `sb-uppercase` | `text-transform: uppercase` |
| `sb-lowercase` | `text-transform: lowercase` |
| `sb-capitalize` | `text-transform: capitalize` |
| `sb-normal-case` | `text-transform: none` |

```html
<div class="sb-text-text sb-text-lg sb-uppercase">uppercase text</div>
<div class="sb-text-text sb-text-lg sb-lowercase">LOWERCASE TEXT</div>
<div class="sb-text-text sb-text-lg sb-capitalize">capitalize each word</div>
```

{~ div hx-get="/api/v1/styles/preview/typography-transform/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

---

## Word Break & Whitespace

### Word Break

| Class | CSS |
|-------|-----|
| `sb-break-normal` | Normal word break behavior |
| `sb-break-words` | `overflow-wrap: break-word` |
| `sb-break-all` | `word-break: break-all` |

### Whitespace

| Class | CSS |
|-------|-----|
| `sb-whitespace-normal` | `white-space: normal` |
| `sb-whitespace-nowrap` | `white-space: nowrap` |
| `sb-whitespace-pre` | `white-space: pre` |

---

## Common Patterns

### Page Title
```html
<h1 class="sb-text-4xl sb-font-bold sb-leading-tight sb-mb-4">
  Page Title
</h1>
```

{~ div hx-get="/api/v1/styles/preview/typography-patterns-title/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### Section Header
```html
<h2 class="sb-text-2xl sb-font-semibold sb-mb-3">
  Section Header
</h2>
```

### Body Text
```html
<p class="sb-text-base sb-leading-relaxed">
  Body text with comfortable line height for readability.
</p>
```

{~ div hx-get="/api/v1/styles/preview/typography-patterns-body/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### Small Print
```html
<p class="sb-text-sm sb-text-text-secondary">
  Secondary information in smaller text.
</p>
```

### Code Inline
```html
<code class="sb-font-mono sb-text-sm sb-bg-secondary-10 sb-px-1 sb-rounded">
  inline code
</code>
```

### All Caps Label
```html
<span class="sb-text-xs sb-uppercase sb-tracking-widest sb-font-semibold">
  Category Label
</span>
```

{~ div hx-get="/api/v1/styles/preview/typography-patterns-label/" hx-trigger="load" .sb-border .sb-border-neutral-25 .sb-rounded .sb-p-3 .sb-mb-4 ~}
Loading preview...
{~~}

### Truncated Text
```html
<p class="sb-whitespace-nowrap sb-overflow-hidden" style="text-overflow: ellipsis;">
  Long text that will be truncated with ellipsis...
</p>
```

---

## Related

- [Color Classes](/docs/styles/colors/) — Text colors with `sb-text-*`
- [Spacing Classes](/docs/styles/spacing/) — Margins and padding
- [Layout Classes](/docs/styles/layout/) — Text alignment in flex/grid contexts