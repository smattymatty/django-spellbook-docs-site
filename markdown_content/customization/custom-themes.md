---
title: Custom Themes
published: 2025-12-12
modified: 2025-12-12
tags:
  - themes
  - customization
  - colors
---

Build your own theme from scratch, extend a preset, or add custom brand colors.

## Building From Scratch

Define all your colors in a single dictionary:
```python
# settings.py
SPELLBOOK_THEME = {
    'name': 'corporate',
    'colors': {
        # Core
        'primary': '#1E40AF',
        'secondary': '#64748B',
        'accent': '#F59E0B',
        'neutral': '#6B7280',
        
        # Status
        'success': '#059669',
        'warning': '#D97706',
        'error': '#DC2626',
        'info': '#0284C7',
        
        # Specialty
        'emphasis': '#7C3AED',
        'subtle': '#F8FAFC',
        'distinct': '#0891B2',
        'aether': '#C026D3',
        'artifact': '#CA8A04',
        'sylvan': '#16A34A',
        'danger': '#991B1B',
        
        # System
        'background': '#FFFFFF',
        'surface': '#F8FAFC',
        'text': '#1F2937',
        'text-secondary': '#6B7280',
    }
}
```

Any color you don't define falls back to the default theme value.

---

## Color Reference

### Core Colors

Your brand identity.

| Key | Purpose |
|-----|---------|
| `primary` | Main action color. Buttons, links, active states. |
| `secondary` | Supporting color. Borders, muted elements. |
| `accent` | Highlight color. Calls to action, badges. |
| `neutral` | Background elements. Dividers, disabled states. |

### Status Colors

User feedback.

| Key | Purpose |
|-----|---------|
| `success` | Positive outcomes. Confirmations, completed actions. |
| `warning` | Caution states. Alerts, pending items. |
| `error` | Problems. Validation errors, failures. |
| `info` | Informational. Tips, notices, help text. |

### Specialty Colors

Extended palette for complex interfaces.

| Key | Purpose |
|-----|---------|
| `emphasis` | Strong highlights. Important callouts. |
| `subtle` | Soft backgrounds. Secondary containers. |
| `distinct` | Differentiation. Categories, tags. |
| `aether` | Theme accent. Ethereal, magical elements. |
| `artifact` | Theme accent. Historic, valuable elements. |
| `sylvan` | Theme accent. Natural, organic elements. |
| `danger` | High-contrast warning. Destructive actions. |

### System Colors

Page structure.

| Key | Purpose |
|-----|---------|
| `background` | Page background. |
| `surface` | Card and panel backgrounds. |
| `text` | Primary text color. |
| `text-secondary` | Muted text. Captions, hints. |

---

## Custom Color Names

Add your own color names that work with all utility classes:
```python
SPELLBOOK_THEME = {
    'colors': {
        'primary': '#1E40AF',
        # ... other standard colors
    },
    'custom_colors': {
        'brand': '#FF6600',
        'brand-dark': '#CC5200',
        'highlight': '#FFFF00',
    }
}
```

Custom colors become:

- CSS variables: `--brand-color`, `--highlight-color`
- Background classes: `sb-bg-brand`, `sb-bg-highlight`
- Text classes: `sb-text-brand`, `sb-text-highlight`
- Border classes: `sb-border-brand`, `sb-border-highlight`
- Opacity variants: `sb-bg-brand-25`, `sb-bg-brand-50`, `sb-bg-brand-75`
```html
<div class="sb-bg-brand sb-text-white sb-p-4">
    On-brand container
</div>

<span class="sb-text-brand-75">Slightly faded brand text</span>
```

---

## Extending Presets

### Dictionary Syntax

Override specific colors while keeping the rest:
```python
SPELLBOOK_THEME = {
    'preset': 'arcane',
    'colors': {
        'primary': '#9D4EDD',
        'accent': '#FFD700',
    }
}
```

### Using extend_preset()

For more control:
```python
from django_spellbook.theme import extend_preset

SPELLBOOK_THEME = extend_preset('ocean', {
    'name': 'deep-ocean',
    'colors': {
        'primary': '#0077B6',
        'surface': '#CAF0F8',
    }
})
```

This deep-merges the colors, so you only specify what changes.

---

## Dark Mode

Every preset has a dark variant. Use `get_theme_with_mode()`:
```python
from django_spellbook.theme import get_theme_with_mode

# Light mode (default)
SPELLBOOK_THEME = get_theme_with_mode('arcane', 'light')

# Dark mode
SPELLBOOK_THEME = get_theme_with_mode('arcane', 'dark')
```

The dark variants have:

- Lighter primary/accent colors for visibility on dark backgrounds
- Dark `background` and `surface` colors
- Light `text` and `text-secondary` colors
- Adjusted alert, card, and code block colors

### Building a Dark Theme From Scratch

Set dark system colors and the generator auto-adapts:
```python
SPELLBOOK_THEME = {
    'name': 'midnight',
    'colors': {
        # Lighter colors for dark backgrounds
        'primary': '#60A5FA',
        'secondary': '#9CA3AF',
        'accent': '#FBBF24',
        
        # Status colors (brighter for dark mode)
        'success': '#22C55E',
        'warning': '#FBBF24',
        'error': '#EF4444',
        'info': '#3B82F6',
        
        # Dark system colors
        'background': '#0F0F0F',
        'surface': '#1A1A1A',
        'text': '#F3F4F6',
        'text-secondary': '#9CA3AF',
    }
}
```

The generator detects dark mode from the `background` color luminance and adjusts alert backgrounds, card shadows, and code highlighting automatically.

---

## Supported Color Formats

All standard CSS color formats work:
```python
SPELLBOOK_THEME = {
    'colors': {
        # 6-digit hex
        'primary': '#3B82F6',
        
        # 3-digit hex (expanded to 6)
        'secondary': '#68A',
        
        # RGB
        'accent': 'rgb(245, 158, 11)',
        
        # RGBA
        'subtle': 'rgba(243, 244, 246, 0.5)',
        
        # CSS named colors
        'error': 'crimson',
    }
}
```

Invalid colors raise a `ValueError` with a helpful message:
```
ValueError: Invalid color format: #gg. 
Supported formats: hex (#RGB or #RRGGBB), rgb(r, g, b), rgba(r, g, b, a), or CSS color names.
```

---

## Disabling Opacity Variants

By default, every color generates 25%, 50%, and 75% opacity variants. Disable this if you don't need them:
```python
SPELLBOOK_THEME = {
    'colors': {...},
    'generate_variants': False,
}
```

---

## Accessibility

Aim for WCAG AA compliance:

- **4.5:1** minimum contrast for normal text
- **3:1** minimum contrast for large text and UI components

All built-in presets meet these standards. When building custom themes, test your color combinations with a contrast checker.

---

## Next Steps

{~ accordion title="Theme Presets" ~}
See all nine built-in presets and their color palettes.

[Browse Presets →](/docs/themes/)
{~~}

{~ accordion title="Color Classes" ~}
The utility classes that use your theme colors.

[View Color Classes →](/docs/styles/colors/)
{~~}