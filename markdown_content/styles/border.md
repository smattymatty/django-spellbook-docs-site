---
title: Border Classes
published: 2025-12-13
modified: 2025-12-13
tags:
  - styles
  - css
  - borders
  - reference
---

Border width, style, radius, and individual side controls.

---

## Border Width

### All Sides

| Class | Width |
|-------|-------|
| `sb-border-0` | 0 |
| `sb-border` | 1px |
| `sb-border-2` | 2px |
| `sb-border-3` | 3px |
| `sb-border-4` | 4px |
| `sb-border-8` | 8px |

### Individual Sides (1px)

| Class | Side |
|-------|------|
| `sb-border-t` | Top |
| `sb-border-r` | Right |
| `sb-border-b` | Bottom |
| `sb-border-l` | Left |

### Individual Sides (2px)

| Class | Side |
|-------|------|
| `sb-border-t-2` | Top |
| `sb-border-r-2` | Right |
| `sb-border-b-2` | Bottom |
| `sb-border-l-2` | Left |

### Individual Sides (4px)

| Class | Side |
|-------|------|
| `sb-border-t-4` | Top |
| `sb-border-r-4` | Right |
| `sb-border-b-4` | Bottom |
| `sb-border-l-4` | Left |

### Individual Sides (8px)

| Class | Side |
|-------|------|
| `sb-border-t-8` | Top |
| `sb-border-r-8` | Right |
| `sb-border-b-8` | Bottom |
| `sb-border-l-8` | Left |

---

## Border Style

| Class | Style |
|-------|-------|
| `sb-border-solid` | Solid |
| `sb-border-dashed` | Dashed |
| `sb-border-dotted` | Dotted |
| `sb-border-double` | Double |
| `sb-border-none` | None |

---

## Border Radius

### Shorthand Classes

| Class | Value |
|-------|-------|
| `sb-rounded-none` | 0 |
| `sb-rounded-sm` | 0.125rem (2px) |
| `sb-rounded` | 0.25rem (4px) |
| `sb-rounded-md` | 0.375rem (6px) |
| `sb-rounded-lg` | 0.5rem (8px) |
| `sb-rounded-full` | 9999px (circle) |

### Verbose Classes

| Class | Value |
|-------|-------|
| `sb-border-radius-none` | 0 |
| `sb-border-radius-sm` | 0.125rem (2px) |
| `sb-border-radius` | 0.25rem (4px) |
| `sb-border-radius-md` | 0.375rem (6px) |
| `sb-border-radius-lg` | 0.5rem (8px) |
| `sb-border-radius-xl` | 0.75rem (12px) |
| `sb-border-radius-2xl` | 1rem (16px) |
| `sb-border-radius-3xl` | 1.5rem (24px) |
| `sb-border-radius-full` | 9999px (circle) |

---

## Border Colors

Border colors use theme variables. See [Color Classes](/docs/styles/colors/) for the full list.

| Class | Color |
|-------|-------|
| `sb-border-primary` | Primary theme color |
| `sb-border-secondary` | Secondary theme color |
| `sb-border-accent` | Accent color |
| `sb-border-neutral` | Neutral color |
| `sb-border-error` | Error/danger color |
| `sb-border-warning` | Warning color |
| `sb-border-success` | Success color |
| `sb-border-info` | Info color |

### With Opacity

| Class | Effect |
|-------|--------|
| `sb-border-primary-25` | 25% opacity |
| `sb-border-primary-50` | 50% opacity |
| `sb-border-primary-75` | 75% opacity |
| `sb-border-neutral-25` | 25% opacity |
| `sb-border-neutral-50` | 50% opacity |

### Hover States

| Class | Effect |
|-------|--------|
| `sb-hover:border-primary` | Primary on hover |
| `sb-hover:border-secondary` | Secondary on hover |
| `sb-hover:border-accent` | Accent on hover |

---

## Common Patterns

### Basic Card Border
```html
<div class="sb-border sb-border-neutral-25 sb-rounded-lg sb-p-4">
  Card with subtle border
</div>
```

### Accent Left Border
```html
<div class="sb-border-l-4 sb-border-primary sb-pl-4 sb-py-2">
  Highlighted content with left accent
</div>
```

### Input Field
```html
<input class="sb-border sb-border-neutral-50 sb-rounded sb-px-3 sb-py-2 
              sb-hover:border-primary sb-transition-all" 
       type="text">
```

### Divider Line
```html
<hr class="sb-border-t sb-border-neutral-25 sb-my-6">
```

### Circular Avatar
```html
<img class="sb-w-16 sb-h-16 sb-rounded-full sb-border-2 sb-border-white" 
     src="..." alt="Avatar">
```

### Dashed Upload Area
```html
<div class="sb-border-2 sb-border-dashed sb-border-neutral-50 sb-rounded-lg 
            sb-p-8 sb-text-center sb-hover:border-primary sb-transition-all">
  Drop files here
</div>
```

### Bottom Border Only
```html
<div class="sb-border-b sb-border-neutral-25 sb-pb-4 sb-mb-4">
  Section with bottom divider
</div>
```

### Pill Badge
```html
<span class="sb-border sb-border-primary sb-rounded-full sb-px-3 sb-py-1 sb-text-sm">
  Badge
</span>
```

### Focus Ring (via border)
```html
<button class="sb-border-2 sb-border-transparent sb-rounded 
               sb-focus:border-primary sb-transition-all">
  Focusable Button
</button>
```

---

## Related

- [Color Classes](/docs/styles/colors/) — Full list of border color options
- [Layout Classes](/docs/styles/layout/) — Border radius with `sb-rounded-*`
- [Effects Classes](/docs/styles/effects/) — Box shadows for depth