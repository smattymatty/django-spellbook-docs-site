---
title: Effects Classes
published: 2025-12-13
modified: 2025-12-13
tags:
  - styles
  - css
  - effects
  - reference
---

Shadows, filters, transitions, transforms, and visual effects.

---

## Box Shadow

| Class | Effect |
|-------|--------|
| `sb-shadow-none` | No shadow |
| `sb-shadow-sm` | Subtle shadow |
| `sb-shadow` | Default shadow |
| `sb-shadow-md` | Medium shadow |
| `sb-shadow-lg` | Large shadow |
| `sb-shadow-xl` | Extra large shadow |
| `sb-shadow-inner` | Inset shadow |

---

## Opacity

| Class | Value |
|-------|-------|
| `sb-opacity-0` | 0 |
| `sb-opacity-10` | 0.1 |
| `sb-opacity-25` | 0.25 |
| `sb-opacity-40` | 0.4 |
| `sb-opacity-50` | 0.5 |
| `sb-opacity-60` | 0.6 |
| `sb-opacity-75` | 0.75 |
| `sb-opacity-80` | 0.8 |
| `sb-opacity-90` | 0.9 |
| `sb-opacity-100` | 1 |

### Hover Opacity

| Class | Effect |
|-------|--------|
| `sb-hover:opacity-80` | 80% opacity on hover |
| `sb-hover:opacity-100` | Full opacity on hover |

---

## Blur

| Class | Value |
|-------|-------|
| `sb-blur-none` | 0 |
| `sb-blur-sm` | 2px |
| `sb-blur` | 4px |
| `sb-blur-md` | 6px |
| `sb-blur-lg` | 8px |
| `sb-blur-xl` | 12px |

---

## Brightness

| Class | Value |
|-------|-------|
| `sb-brightness-0` | 0% |
| `sb-brightness-50` | 50% |
| `sb-brightness-75` | 75% |
| `sb-brightness-100` | 100% (normal) |
| `sb-brightness-125` | 125% |
| `sb-brightness-150` | 150% |

---

## Contrast

| Class | Value |
|-------|-------|
| `sb-contrast-0` | 0% |
| `sb-contrast-50` | 50% |
| `sb-contrast-75` | 75% |
| `sb-contrast-100` | 100% (normal) |
| `sb-contrast-125` | 125% |
| `sb-contrast-150` | 150% |

---

## Transitions

### Transition Property

| Class | Properties |
|-------|------------|
| `sb-transition-all` | All properties |
| `sb-transition-bg` | Background color |
| `sb-transition-color` | Text color |

### Duration

| Class | Time |
|-------|------|
| `sb-duration-75` | 75ms |
| `sb-duration-100` | 100ms |
| `sb-duration-150` | 150ms |
| `sb-duration-200` | 200ms |
| `sb-duration-300` | 300ms |
| `sb-duration-500` | 500ms |

### Timing Function

| Class | Easing |
|-------|--------|
| `sb-ease-linear` | Linear |
| `sb-ease-in` | Ease in |
| `sb-ease-out` | Ease out |
| `sb-ease-in-out` | Ease in-out |
| `sb-ease-bounce` | Bounce effect |

### Delay

| Class | Time |
|-------|------|
| `sb-delay-75` | 75ms |
| `sb-delay-100` | 100ms |
| `sb-delay-150` | 150ms |
| `sb-delay-300` | 300ms |
| `sb-delay-500` | 500ms |

---

## Transforms

### Scale

| Class | Value |
|-------|-------|
| `sb-scale-0` | 0 |
| `sb-scale-50` | 0.5 |
| `sb-scale-75` | 0.75 |
| `sb-scale-90` | 0.9 |
| `sb-scale-95` | 0.95 |
| `sb-scale-100` | 1 |
| `sb-scale-105` | 1.05 |
| `sb-scale-110` | 1.1 |
| `sb-scale-125` | 1.25 |
| `sb-scale-150` | 1.5 |

### Rotate

| Class | Value |
|-------|-------|
| `sb-rotate-0` | 0deg |
| `sb-rotate-45` | 45deg |
| `sb-rotate-90` | 90deg |
| `sb-rotate-180` | 180deg |

### Translate

| Class | Value |
|-------|-------|
| `sb-translate-x-0` | 0 |
| `sb-translate-x-1` | 0.25rem |
| `sb-translate-x-2` | 0.5rem |
| `sb-translate-x-4` | 1rem |
| `sb-translate-y-0` | 0 |
| `sb-translate-y-1` | 0.25rem |
| `sb-translate-y-2` | 0.5rem |
| `sb-translate-y-4` | 1rem |

### Skew

| Class | Value |
|-------|-------|
| `sb-skew-x-0` | 0deg |
| `sb-skew-x-3` | 3deg |
| `sb-skew-x-6` | 6deg |
| `sb-skew-x-12` | 12deg |
| `sb-skew-y-0` | 0deg |
| `sb-skew-y-3` | 3deg |
| `sb-skew-y-6` | 6deg |
| `sb-skew-y-12` | 12deg |

---

## Common Patterns

### Hover Card Effect
```html
<div class="sb-shadow sb-transition-all sb-duration-200 sb-hover:shadow-lg sb-hover:scale-105">
  Card with lift effect on hover
</div>
```

### Fade In Element
```html
<div class="sb-opacity-0 sb-transition-all sb-duration-300" 
     x-show="visible" 
     x-transition:enter="sb-opacity-100">
  Fading content
</div>
```

### Image Hover Brightness
```html
<img class="sb-brightness-100 sb-transition-all sb-duration-200 sb-hover:brightness-110" 
     src="..." alt="...">
```

### Disabled State
```html
<button class="sb-opacity-50 sb-cursor-not-allowed" disabled>
  Disabled Button
</button>
```

### Smooth Background Transition
```html
<a class="sb-bg-primary sb-transition-bg sb-duration-150 sb-hover:bg-primary-75">
  Hover me
</a>
```

### Glassmorphism Effect
```html
<div class="sb-bg-white-50 sb-blur-sm sb-rounded-lg sb-shadow-lg">
  Frosted glass panel
</div>
```

---

## Accessibility

Spellbook respects `prefers-reduced-motion`. When users have reduced motion enabled:

- `sb-scroll-smooth` falls back to `auto`
- All animations and transitions are reduced to near-instant (0.01ms)

This happens automatically — no additional classes needed.

---

## Related

- [Color Classes](/docs/styles/colors/) — Background and text colors for hover states
- [Layout Classes](/docs/styles/layout/) — Positioning for transformed elements
- [Interactivity Classes](/docs/styles/interactivity/) — Cursor and pointer events