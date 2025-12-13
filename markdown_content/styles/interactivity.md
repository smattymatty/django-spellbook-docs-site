---
title: Interactivity Classes
published: 2025-12-13
modified: 2025-12-13
tags:
  - styles
  - css
  - interactivity
  - reference
---

Cursor, selection, pointer events, scroll behavior, and focus states.

---

## Cursor

| Class | Cursor |
|-------|--------|
| `sb-cursor-auto` | Browser default |
| `sb-cursor-default` | Default arrow |
| `sb-cursor-pointer` | Hand pointer |
| `sb-cursor-wait` | Loading spinner |
| `sb-cursor-text` | Text I-beam |
| `sb-cursor-move` | Move crosshair |
| `sb-cursor-not-allowed` | Disabled circle |
| `sb-cursor-grab` | Open hand |
| `sb-cursor-grabbing` | Closed hand |
| `sb-cursor-ew-resize` | East-west resize |

---

## User Select

Control whether users can select text.

| Class | Effect |
|-------|--------|
| `sb-select-none` | Cannot select |
| `sb-select-text` | Can select text |
| `sb-select-all` | Select all on click |
| `sb-select-auto` | Browser default |

---

## Pointer Events

Control whether an element receives pointer events.

| Class | Effect |
|-------|--------|
| `sb-pointer-events-none` | Clicks pass through |
| `sb-pointer-events-auto` | Normal behavior |
| `sb-pointer-events-inherit` | Inherit from parent |

---

## Resize

Control whether an element is resizable.

| Class | Effect |
|-------|--------|
| `sb-resize-none` | Not resizable |
| `sb-resize` | Resize both directions |
| `sb-resize-y` | Resize vertically |
| `sb-resize-x` | Resize horizontally |

---

## Scroll Behavior

| Class | Effect |
|-------|--------|
| `sb-scroll-smooth` | Smooth scrolling |
| `sb-scroll-auto` | Instant scrolling |
| `sb-scroll-touch` | Momentum scrolling (iOS) |

### Overscroll

| Class | Effect |
|-------|--------|
| `sb-overscroll-auto` | Default behavior |
| `sb-overscroll-contain` | Prevent scroll chaining |
| `sb-overscroll-none` | No overscroll effects |

---

## Focus States

| Class | Effect |
|-------|--------|
| `sb-focus:outline` | Outline on focus |
| `sb-focus-visible:outline` | Outline on keyboard focus only |
| `sb-focus-within:outline` | Outline when child is focused |
| `sb-focus-none` | Remove focus outline |

Focus styles use a 2px solid outline with 2px offset, colored by `--focus-ring-color`.

---

## Disabled State

| Class | Effect |
|-------|--------|
| `sb-disabled` | Disables pointer events |

Combine with `sb-opacity-50` and `sb-cursor-not-allowed` for full disabled styling.

---

## Common Patterns

### Clickable Card
```html
<div class="sb-cursor-pointer sb-transition-all sb-hover:shadow-lg">
  Click me
</div>
```

### Non-Selectable UI
```html
<nav class="sb-select-none">
  Navigation items users shouldn't select
</nav>
```

### Disabled Button
```html
<button class="sb-opacity-50 sb-cursor-not-allowed sb-disabled" disabled>
  Disabled
</button>
```

### Overlay That Passes Clicks
```html
<div class="sb-absolute sb-inset-0 sb-pointer-events-none">
  Decorative overlay - clicks pass through to content below
</div>
```

### Resizable Textarea
```html
<textarea class="sb-resize-y sb-border sb-rounded sb-p-2">
  Drag bottom edge to resize
</textarea>
```

### Smooth Scroll Container
```html
<html class="sb-scroll-smooth">
  <!-- Anchor links will scroll smoothly -->
</html>
```

### Modal Scroll Lock
```html
<div class="sb-overscroll-contain sb-overflow-y-auto sb-h-screen">
  Modal content - scrolling won't escape to body
</div>
```

### Keyboard-Only Focus
```html
<button class="sb-focus-visible:outline">
  Only shows focus ring for keyboard users
</button>
```

### Draggable Item
```html
<div class="sb-cursor-grab sb-active:cursor-grabbing" draggable="true">
  Drag me
</div>
```

---

## Accessibility Note

Focus styles are critical for keyboard navigation. Avoid using `sb-focus-none` unless you provide an alternative focus indicator.

The `sb-scroll-smooth` class respects `prefers-reduced-motion` — users with motion sensitivity get instant scrolling automatically.

---

## Related

- [Effects Classes](/docs/styles/effects/) — Transitions for interactive states
- [Color Classes](/docs/styles/colors/) — Hover background/text colors
- [Layout Classes](/docs/styles/layout/) — Overflow for scroll containers