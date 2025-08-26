# Theme System

**Transform your site's entire color scheme with Django Spellbook's powerful Python-based theme system.**

{~ alert type="success" ~}
**New in 0.1.16!** The theme system lets you define your entire site's color palette in Python, with automatic CSS variable generation, opacity variants, and 9 beautiful presets ready to use.
{~~}

## What Are Themes?

Themes are complete color schemes that automatically style every component in Django Spellbook. Instead of managing CSS files, you define colors in your Django settings and the system handles everything else.

### Key Features

- **Python Configuration**: Define themes in `settings.py`, not CSS
- **Automatic Variants**: Every color gets 25%, 50%, and 75% opacity versions
- **No Build Process**: CSS variables generated at runtime
- **Session-Based Switching**: Users can switch themes dynamically
- **Dark Mode Ready**: Built-in support for light/dark modes
- **100% Compatible**: Works with all existing Spellbook components

## Quick Start

### Using a Preset Theme

Add to your `settings.py`:

```python
from django_spellbook.theme import THEMES_WITH_MODES

# Use the 'arcane' preset
SPELLBOOK_THEME = THEMES_WITH_MODES['arcane']['modes']['light']
```

That's it! Your entire site now uses the Arcane theme.

### Creating a Custom Theme

```python
SPELLBOOK_THEME = {
    'colors': {
        'primary': '#FF6B35',      # Your brand color
        'secondary': '#F77B71',    # Supporting color
        'accent': '#FFD700',       # Call-to-action color
        'neutral': '#A8716A',      # Borders, dividers
        
        # Status colors
        'error': '#DC2626',
        'warning': '#FFAA00',
        'success': '#16A34A',
        'info': '#3B82F6',
        
        # System colors
        'background': '#FFFFFF',
        'surface': '#F9FAFB',
        'text': '#1F2937',
        'text-secondary': '#6B7280',
    },
    'generate_variants': True  # Creates opacity versions
}
```

## Available Presets

Django Spellbook includes 9 carefully crafted themes, each with light and dark modes:

### 🔷 Default
The classic blue theme - professional and clean. Perfect for documentation sites and dashboards.

### 🔮 Arcane
Deep purple mysteries with golden spell glows. Ideal for magical or creative projects.

### ⭐ Celestial
Divine light magic with sky blues and gold. Great for spiritual or inspirational content.

### 🌲 Forest
Woodland greens and earth tones. Natural and calming for eco-friendly sites.

### 🌊 Ocean
Deep sea blues and aquatic enchantments. Perfect for marine or water-related projects.

### 🔥 Phoenix
Fire colors with oranges and reds. Dynamic and energetic for bold brands.

### 🌑 Shadow
Monochrome shadow magic. Minimalist and sophisticated.

### ✨ Enchanted
Bright magical pinks and fairy gold. Fun and whimsical for creative projects.

### 🌸 Pastel
Soft, gentle enchantment colors. Soothing and friendly.

## How Themes Work

### 1. CSS Variable Generation

When you define a theme, Django Spellbook automatically generates CSS variables:

```css
:root {
  --primary-color: #FF6B35;
  --primary-color-25: color-mix(in srgb, #FF6B35 25%, transparent);
  --primary-color-50: color-mix(in srgb, #FF6B35 50%, transparent);
  --primary-color-75: color-mix(in srgb, #FF6B35 75%, transparent);
  /* ... and more for each color */
}
```

### 2. Utility Classes

All color utilities automatically use theme variables:

```django
<!-- These classes use your theme colors -->
<div class="sb-bg-primary">Primary background</div>
<div class="sb-text-accent">Accent text</div>
<div class="sb-border-secondary">Secondary border</div>

<!-- Opacity variants work too -->
<div class="sb-bg-primary-50">50% opacity primary</div>
```

### 3. Component Styling

Every Spellbook component adapts to your theme:

{~ alert type="info" ~}
This alert uses your theme's info color!
{~~}

{~ card title="Themed Card" ~}
Cards automatically use surface colors and proper text colors from your theme.
{~~}

## Theme Colors Explained

### Core Semantic Colors

- **primary**: Main brand color for buttons, links, and emphasis
- **secondary**: Supporting color for less prominent elements
- **accent**: High-contrast color for CTAs and highlights
- **neutral**: Subtle color for borders and dividers

### Status Colors

- **success**: Positive feedback and success states
- **warning**: Caution messages and warnings
- **error**: Error states and destructive actions
- **info**: Informational messages and tips

### Extended Colors

- **emphasis**: Content that needs special attention
- **subtle**: Very light backgrounds for quiet sections
- **distinct**: Unique elements that stand apart
- **aether**: Mystical purple for magical elements
- **artifact**: Golden color for special items
- **sylvan**: Nature green for organic elements
- **danger**: High-alert color for critical actions

### System Colors

- **background**: Main page background
- **surface**: Card and elevated element backgrounds
- **text**: Primary text color
- **text-secondary**: Less prominent text

## Advanced Configuration

### Custom Color Names

Add your own semantic colors:

```python
SPELLBOOK_THEME = {
    'colors': {
        # ... standard colors ...
    },
    'custom_colors': {
        'brand': '#FF00FF',     # Use as sb-bg-brand
        'special': '#00FF00',   # Use as sb-text-special
        'highlight': '#FFFF00', # Use as sb-border-highlight
    }
}
```

### Disabling Opacity Variants

For smaller CSS output:

```python
SPELLBOOK_THEME = {
    'colors': { ... },
    'generate_variants': False  # No opacity versions
}
```

### Using RGB/RGBA Colors

```python
SPELLBOOK_THEME = {
    'colors': {
        'primary': 'rgb(255, 107, 53)',
        'secondary': 'rgba(247, 123, 113, 0.9)',
        # CSS named colors work too
        'accent': 'goldenrod',
    }
}
```

## Theme Middleware

The theme system includes middleware that:

1. **Checks for theme in session**: Allows per-user theme preferences
2. **Applies theme configuration**: Generates CSS variables on each request
3. **Handles theme switching**: Via the `/themes/` interface

To enable session-based theme switching, ensure the middleware is in your settings:

```python
MIDDLEWARE = [
    # ... other middleware ...
    'sb_theme.middleware.ThemeMiddleware',
]
```

## Theme Switcher Interface

Visit `/themes/` on your site to:
- Preview all available themes
- See complete color palettes
- Test components with different themes
- Switch themes with one click

The Theme Builder at `/theme-builder/` lets you:
- Visually create custom themes
- Export Python configuration
- Preview on real layouts
- Fine-tune every color

## Using Themes in Templates

### Basic Usage

```django
<!-- Background colors -->
<div class="sb-bg-primary">Primary background</div>
<div class="sb-bg-accent-50">50% accent background</div>

<!-- Text colors -->
<p class="sb-text-secondary">Secondary text</p>
<span class="sb-text-error">Error message</span>

<!-- Borders -->
<div class="sb-border sb-border-primary">Primary border</div>
```

### Dynamic Theme Colors

Get current theme colors in views:

```python
from django_spellbook.theme import SpellbookTheme

def my_view(request):
    # Get current theme from session or settings
    theme = SpellbookTheme(settings.SPELLBOOK_THEME)
    primary_color = theme.get_color('primary').value
    # Use color value as needed
```

## Migration Guide

### From CSS to Theme System

Before (CSS):
```css
.my-button {
    background-color: #3b82f6;
    color: white;
}
```

After (using theme):
```django
<button class="sb-bg-primary sb-text-white">
    Click me
</button>
```

### Compatibility

The theme system is 100% backward compatible:
- Existing sites work without changes
- You can gradually adopt themes
- Mix themed and non-themed styles freely

## Best Practices

### 1. Choose Semantic Names

Use color names that describe purpose, not appearance:
- ✅ `primary`, `accent`, `warning`
- ❌ `blue`, `yellow`, `red`

### 2. Test Contrast

Ensure text is readable on backgrounds:
```django
<!-- Good contrast -->
<div class="sb-bg-primary sb-text-white">

<!-- May have poor contrast -->
<div class="sb-bg-warning sb-text-accent">
```

### 3. Use Opacity Variants

For subtle effects without new colors:
```django
<div class="sb-bg-primary-25 sb-border sb-border-primary">
    Subtle primary container
</div>
```

### 4. Consistent Status Colors

Keep status colors predictable:
- Green = Success
- Yellow/Orange = Warning
- Red = Error
- Blue = Info

## Troubleshooting

### Theme Not Applying

1. Check `SPELLBOOK_THEME` is set in settings
2. Verify middleware is installed
3. Clear browser cache
4. Check template has `{% spellbook_styles %}`

### Colors Look Wrong

1. Validate color format (hex, rgb, or CSS name)
2. Check for typos in color values
3. Ensure proper contrast ratios
4. Test in different browsers

### Performance

Themes are lightweight:
- CSS generated once per request
- Variables cached in browser
- No JavaScript required
- Minimal overhead (~1ms)

## Examples in Action

### Status Messages

{~ alert type="success" ~}
**Success!** Your theme is working perfectly.
{~~}

{~ alert type="warning" ~}
**Warning:** Themes may cause excessive creativity.
{~~}

{~ alert type="error" ~}
**Error:** Unable to return to boring colors.
{~~}

### Color Palette Display

<div class="sb-grid sb-grid-cols-4 sb-gap-2 sb-mb-4">
    <div class="sb-p-4 sb-bg-primary sb-text-white sb-text-center sb-rounded">Primary</div>
    <div class="sb-p-4 sb-bg-secondary sb-text-white sb-text-center sb-rounded">Secondary</div>
    <div class="sb-p-4 sb-bg-accent sb-text-white sb-text-center sb-rounded">Accent</div>
    <div class="sb-p-4 sb-bg-neutral sb-text-white sb-text-center sb-rounded">Neutral</div>
</div>

### Opacity Demonstration

<div class="sb-space-y-2 sb-mb-4">
    <div class="sb-p-3 sb-bg-primary-25 sb-border sb-border-primary">25% Primary</div>
    <div class="sb-p-3 sb-bg-primary-50 sb-border sb-border-primary">50% Primary</div>
    <div class="sb-p-3 sb-bg-primary-75 sb-border sb-border-primary">75% Primary</div>
    <div class="sb-p-3 sb-bg-primary sb-text-white">100% Primary</div>
</div>

## Next Steps

Ready to theme your site?

1. **Try a preset**: Add `SPELLBOOK_THEME` to settings
2. **Visit `/themes/`**: See all themes in action
3. **Customize colors**: Create your perfect palette
4. **Use the builder**: `/theme-builder/` for visual editing

{~ alert type="info" ~}
**Pro Tip:** Start with a preset theme close to your vision, then customize individual colors as needed. The theme builder makes this process visual and fun!
{~~}

{% a href="/themes/" .sb-btn .sb-btn-primary %}
Explore Themes Live →
{% enda %}

{% a href="/docs/Styles/colors" .super-link %}
Learn About Color Utilities
{% enda %}