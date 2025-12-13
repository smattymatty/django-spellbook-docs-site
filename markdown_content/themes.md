---
title: Themes
published: 2025-12-12
modified: 2025-12-12
tags:
  - themes
  - colors
  - presets
---

Django Spellbook includes nine color presets. Pick one in your settings and every SpellBlock, sidebar, and utility class adapts automatically.

## Using a Preset
```python
# settings.py
SPELLBOOK_THEME = 'arcane'
```

That's it. Run `python manage.py spellbook_md` and your content renders with the new colors.

## Available Presets

### default

Blue and gray. Professional, readable, familiar.
```python
SPELLBOOK_THEME = 'default'
```

{~ card footer="Primary: #2563eb | Accent: #d97706" ~}
The classic Spellbook look. Blue primary actions, amber accents, gray supporting elements. Works everywhere.
{~~}

---

### arcane

Purple and gold. Mysterious, magical, dramatic.
```python
SPELLBOOK_THEME = 'arcane'
```

{~ card footer="Primary: #7c3aed | Accent: #d97706" ~}
Deep violet primary with golden spell glows. For documentation that feels like a grimoire.
{~~}

---

### celestial

Sky blue and gold. Light, airy, divine.
```python
SPELLBOOK_THEME = 'celestial'
```

{~ card footer="Primary: #0284c7 | Accent: #d97706" ~}
Heavenly blues with sacred gold accents. Clean and uplifting.
{~~}

---

### forest

Green and brown. Natural, grounded, earthy.
```python
SPELLBOOK_THEME = 'forest'
```

{~ card footer="Primary: #15803d | Accent: #ea580c" ~}
Deep forest greens with autumn orange accents. Organic and calm.
{~~}

---

### ocean

Blue and cyan. Deep, fluid, aquatic.
```python
SPELLBOOK_THEME = 'ocean'
```

{~ card footer="Primary: #0369a1 | Accent: #0891b2" ~}
Ocean depths and coastal teals. Cool and refreshing.
{~~}

---

### phoenix

Red and orange. Fiery, bold, energetic.
```python
SPELLBOOK_THEME = 'phoenix'
```

{~ card footer="Primary: #dc2626 | Accent: #ea580c" ~}
Flame reds with ember orange. For content that demands attention.
{~~}

---

### shadow

Monochrome grays. Dark, minimal, focused.
```python
SPELLBOOK_THEME = 'shadow'
```

{~ card footer="Primary: #374151 | Accent: #6b7280" ~}
Pure grayscale palette. No color distraction, maximum readability.
{~~}

---

### enchanted

Pink and gold. Magical, whimsical, vibrant.
```python
SPELLBOOK_THEME = 'enchanted'
```

{~ card footer="Primary: #db2777 | Accent: #ca8a04" ~}
Bright magical pinks with fairy gold. Playful and memorable.
{~~}

---

### pastel

Soft violet and amber. Gentle, soft, approachable.
```python
SPELLBOOK_THEME = 'pastel'
```

{~ card footer="Primary: #7c3aed | Accent: #d97706" ~}
Darker pastels that meet accessibility standards while staying soft. Easy on the eyes.
{~~}

---

## Quick Customization

Override specific colors while keeping the rest of a preset:
```python
SPELLBOOK_THEME = {
    'preset': 'ocean',
    'colors': {
        'primary': '#0EA5E9',
        'accent': '#F59E0B',
    }
}
```

This starts with the ocean preset and replaces just the primary and accent colors.

---

## Custom Colors

Define your own palette from scratch:
```python
SPELLBOOK_THEME = {
    'name': 'corporate',
    'colors': {
        'primary': '#1E40AF',
        'secondary': '#64748B',
        'accent': '#F59E0B',
    }
}
```

Undefined colors fall back to the default theme values.

---

## Color Categories

Each theme defines colors in four groups:

**Core** - Your brand identity
- `primary` - Main action color (buttons, links, active states)
- `secondary` - Supporting color (borders, muted elements)
- `accent` - Highlight color (calls to action, badges)
- `neutral` - Background elements

**Status** - User feedback
- `success` - Positive outcomes
- `warning` - Caution states
- `error` - Problems and failures
- `info` - Informational messages

**Specialty** - Extended palette
- `emphasis` - Strong highlights
- `subtle` - Soft backgrounds
- `distinct` - Differentiation
- `aether`, `artifact`, `sylvan`, `danger` - Theme-specific accents

**System** - Page structure
- `background` - Page background
- `surface` - Card and panel backgrounds
- `text` - Primary text color
- `text-secondary` - Muted text

---

## Accessibility

All presets are WCAG AA compliant with a minimum 4.5:1 contrast ratio. The colors were specifically chosen to be readable while maintaining their visual character.

---

## Next Steps

{~ accordion title="Custom Themes" ~}
Build a complete theme from scratch. Define every color, add custom color names, and create a cohesive brand experience.

[Create Custom Themes →](/docs/customization/custom-themes/)
{~~}

{~ accordion title="Color Classes" ~}
The CSS utility classes that use these theme colors. Backgrounds, text, borders, and hover states.

[View Color Classes →](/docs/styles/colors/)
{~~}