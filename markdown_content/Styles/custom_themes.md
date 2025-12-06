# Creating Custom Themes

**Build beautiful, customizable color schemes using just Python dictionaries - no CSS required!**

{~ alert type="success" ~}
The Django Spellbook theme system lets you define your entire site's color palette in `settings.py` using simple Python dictionaries. Change colors site-wide without touching a single CSS file!
{~~}

## The Magic of Python-Based Themes

Instead of managing scattered CSS files, you define your theme as a Python dictionary in your Django settings. The system automatically:

- Generates all CSS variables at runtime
- Creates opacity variants (25%, 50%, 75%) for every color
- Applies themes per-session or site-wide
- Works with all existing Spellbook components

## Your First Custom Theme

Add this to your `settings.py`:

```python
# settings.py

SPELLBOOK_THEME = {
    'colors': {
        # Your brand colors
        'primary': '#FF6B35',      # Main brand color
        'secondary': '#F77B71',    # Supporting color
        'accent': '#FFD700',       # Call-to-action color
        'neutral': '#A8716A',      # Borders, dividers
        
        # Status colors (keep these semantic)
        'error': '#DC2626',        # Red for errors
        'warning': '#FFAA00',      # Orange for warnings
        'success': '#16A34A',      # Green for success
        'info': '#3B82F6',         # Blue for information
        
        # UI colors
        'background': '#FFFFFF',   # Main background
        'surface': '#F9FAFB',      # Cards, elevated elements
        'text': '#1F2937',         # Primary text
        'text-secondary': '#6B7280', # Muted text
    },
    'generate_variants': True  # Creates opacity versions (recommended)
}
```

That's it! Your entire site now uses your custom colors. Every Spellbook component automatically adapts.

## Understanding Theme Colors

### Core Semantic Colors

These are your main brand colors:

```python
'colors': {
    'primary': '#8B4513',    # Main brand identity
    'secondary': '#D2691E',  # Supporting brand color
    'accent': '#FFD700',     # High-contrast CTAs
    'neutral': '#A0826D',    # Subtle elements
}
```

### Status Colors

Keep these predictable for good UX:

```python
'colors': {
    'success': '#10B981',    # Always greenish
    'warning': '#F59E0B',    # Always yellow/orange
    'error': '#EF4444',      # Always reddish
    'info': '#3B82F6',       # Always blueish
}
```

### System Colors

Control the overall look and feel:

```python
'colors': {
    'background': '#FFFFFF',     # Page background
    'surface': '#F9FAFB',        # Card backgrounds
    'text': '#111827',           # Main text color
    'text-secondary': '#6B7280', # Muted text
}
```

## Real-World Theme Examples

### Corporate Professional

```python
SPELLBOOK_THEME = {
    'colors': {
        # Navy and gold corporate palette
        'primary': '#003366',
        'secondary': '#004080',
        'accent': '#FFB800',
        'neutral': '#657786',
        
        # Standard status colors
        'error': '#CC0000',
        'warning': '#FF9900',
        'success': '#007700',
        'info': '#0066CC',
        
        # Clean, professional backgrounds
        'background': '#FFFFFF',
        'surface': '#F7F9FA',
        'text': '#14171A',
        'text-secondary': '#657786',
    }
}
```

### Startup Modern

```python
SPELLBOOK_THEME = {
    'colors': {
        # Gradient-friendly purple to pink
        'primary': '#7C3AED',
        'secondary': '#EC4899',
        'accent': '#06B6D4',
        'neutral': '#94A3B8',
        
        # Friendly status colors
        'error': '#F87171',
        'warning': '#FBBF24',
        'success': '#34D399',
        'info': '#60A5FA',
        
        # Light, airy feel
        'background': '#FAFAFA',
        'surface': '#FFFFFF',
        'text': '#1E293B',
        'text-secondary': '#64748B',
    }
}
```

### Dark Mode Theme

```python
SPELLBOOK_THEME = {
    'colors': {
        # Brighter colors for dark backgrounds
        'primary': '#60A5FA',
        'secondary': '#A78BFA',
        'accent': '#FBBF24',
        'neutral': '#4B5563',
        
        # Lighter status colors for visibility
        'error': '#F87171',
        'warning': '#FCD34D',
        'success': '#6EE7B7',
        'info': '#93C5FD',
        
        # Dark backgrounds
        'background': '#0F172A',
        'surface': '#1E293B',
        'text': '#F1F5F9',
        'text-secondary': '#CBD5E1',
    }
}
```

## Advanced: Theme with Modes

Create a theme that supports both light and dark modes:

```python
# Custom theme with light/dark modes
MY_CUSTOM_THEME = {
    'name': 'my_brand',
    'modes': {
        'light': {
            'colors': {
                'primary': '#5B21B6',
                'secondary': '#7C3AED',
                'accent': '#FCD34D',
                'neutral': '#9CA3AF',
                'error': '#DC2626',
                'warning': '#F59E0B',
                'success': '#10B981',
                'info': '#3B82F6',
                'background': '#FFFFFF',
                'surface': '#FAFAFA',
                'text': '#111827',
                'text-secondary': '#6B7280',
            }
        },
        'dark': {
            'colors': {
                'primary': '#A78BFA',
                'secondary': '#C4B5FD',
                'accent': '#FDE047',
                'neutral': '#6B7280',
                'error': '#F87171',
                'warning': '#FBBF24',
                'success': '#6EE7B7',
                'info': '#93C5FD',
                'background': '#111827',
                'surface': '#1F2937',
                'text': '#F9FAFB',
                'text-secondary': '#D1D5DB',
            }
        }
    }
}

# Use based on user preference or time of day
import datetime

current_hour = datetime.datetime.now().hour
mode = 'dark' if current_hour >= 18 or current_hour < 6 else 'light'

SPELLBOOK_THEME = MY_CUSTOM_THEME['modes'][mode]
```

## Setting Up Theme Middleware

To enable dynamic theme switching (like we have on this site), add the middleware:

```python
# settings.py

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # ... other middleware ...
    'sb_theme.middleware.ThemeMiddleware',  # Add this
]

# Make sure sessions are enabled
INSTALLED_APPS = [
    'django.contrib.sessions',
    # ... other apps ...
    'sb_theme',  # Your theme app
]
```

### Creating the Middleware

Here's our battle-tested middleware with all bug fixes applied:

```python
# sb_theme/middleware.py

from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from django_spellbook.theme import SpellbookTheme

class ThemeMiddleware(MiddlewareMixin):
    """Apply theme configuration on each request."""
    
    def process_request(self, request):
        """Apply theme from session or settings."""
        # Get theme from session
        theme_name = request.session.get('theme', 'default')
        mode = request.session.get('mode', 'light')
        
        # Important: Handle special themes like 'magical'
        if theme_name == 'magical':
            # Load from your custom configuration
            from core.settings import MAGICAL_THEME_CONFIG
            if mode in MAGICAL_THEME_CONFIG.get('modes', {}):
                theme_config = MAGICAL_THEME_CONFIG['modes'][mode].copy()
                settings.SPELLBOOK_THEME = theme_config
        else:
            # Load from presets
            from django_spellbook.theme import get_theme_with_mode
            theme_config = get_theme_with_mode(theme_name, mode)
            if theme_config:
                settings.SPELLBOOK_THEME = theme_config
        
        # Create theme object for templates
        request.theme = SpellbookTheme(settings.SPELLBOOK_THEME)
```

## Custom Colors and Extensions

### Adding Your Own Semantic Colors

```python
SPELLBOOK_THEME = {
    'colors': {
        # Standard colors...
        'primary': '#FF6B35',
        
        # Add custom semantic colors
        'premium': '#FFD700',      # Gold for premium features
        'featured': '#FF1493',     # Hot pink for featured items
        'discount': '#00CED1',     # Turquoise for sales
        'archived': '#708090',     # Gray for old content
    }
}

# Use in templates:
# <div class="sb-bg-premium">Premium Feature</div>
# <span class="sb-text-discount">50% OFF</span>
```

### Brand-Specific Palettes

```python
# Example: E-commerce site with product categories
SPELLBOOK_THEME = {
    'colors': {
        'primary': '#FF6B35',
        'secondary': '#4ECDC4',
        
        # Product category colors
        'electronics': '#4A90E2',
        'fashion': '#E91E63',
        'home': '#8BC34A',
        'sports': '#FF5722',
        'books': '#795548',
    }
}
```

## Theme Switcher View

Here's a complete theme switcher implementation:

```python
# sb_theme/views.py

from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django_spellbook.theme import THEMES_WITH_MODES

def theme_switcher(request):
    """Display theme switcher interface."""
    current_theme = request.session.get('theme', 'default')
    current_mode = request.session.get('mode', 'light')
    
    # Get all available themes
    themes = []
    for name, config in THEMES_WITH_MODES.items():
        themes.append({
            'name': name,
            'display_name': name.title(),
            'has_dark': 'dark' in config.get('modes', {}),
            'colors': config['modes']['light']['colors']
        })
    
    return render(request, 'sb_theme/theme_switcher.html', {
        'themes': themes,
        'current_theme': current_theme,
        'current_mode': current_mode,
    })

@require_POST
def set_theme(request):
    """Set theme in session."""
    theme = request.POST.get('theme', 'default')
    mode = request.POST.get('mode', 'light')
    
    # Important: Save to session
    request.session['theme'] = theme
    request.session['mode'] = mode
    request.session.save()  # Ensure it's saved!
    
    # Return HTMX response or redirect
    if request.headers.get('HX-Request'):
        return render(request, 'sb_theme/theme_applied.html', {
            'theme': theme,
            'mode': mode
        })
    
    return redirect(request.META.get('HTTP_REFERER', '/'))
```

## Using Themes in Templates

### Basic Color Classes

```django
<!-- Backgrounds -->
<div class="sb-bg-primary">Primary background</div>
<div class="sb-bg-surface">Surface background</div>

<!-- With opacity variants -->
<div class="sb-bg-primary-50">50% opacity primary</div>
<div class="sb-bg-accent-25">25% opacity accent</div>

<!-- Text colors -->
<p class="sb-text-primary">Primary text</p>
<span class="sb-text-error">Error message</span>

<!-- Borders -->
<div class="sb-border sb-border-neutral">Neutral border</div>
```

### Dynamic Theme Values in Templates

```django
<!-- Access current theme colors -->
<style>
    .my-custom-gradient {
        background: linear-gradient(
            to right,
            var(--primary-color),
            var(--secondary-color)
        );
    }
</style>
```

## Troubleshooting Common Issues

### Theme Not Applying?

Based on bugs we've fixed, check these:

1. **Middleware Order**: SessionMiddleware must come before ThemeMiddleware
2. **Session Not Saving**: Always call `request.session.save()`
3. **Settings Override**: Check that nothing is overwriting `SPELLBOOK_THEME` later
4. **Template Loading**: Ensure `{% spellbook_styles %}` is in your base template

### Custom Theme Not Recognized?

```python
# Problem: Custom theme like 'magical' not working
# Solution: Handle it explicitly in middleware

if theme_name == 'magical':
    from myapp.settings import MY_CUSTOM_THEME
    theme_config = MY_CUSTOM_THEME
else:
    # Use presets
    theme_config = get_theme_with_mode(theme_name, mode)
```

### Colors Look Wrong?

```python
# Ensure valid color formats
SPELLBOOK_THEME = {
    'colors': {
        'primary': '#FF6B35',     # ✅ Hex
        'secondary': 'rgb(247, 123, 113)',  # ✅ RGB
        'accent': 'goldenrod',    # ✅ CSS named color
        # 'bad': 'FF6B35',        # ❌ Missing #
        # 'invalid': '#GGGGGG',   # ❌ Invalid hex
    }
}
```

### Opacity Variants Not Working?

```python
# Make sure variants are enabled
SPELLBOOK_THEME = {
    'colors': { ... },
    'generate_variants': True  # Must be True!
}
```

## Performance Considerations

The theme system is incredibly lightweight:

- **No build process**: CSS generated at runtime
- **Cached efficiently**: Variables generated once per request
- **No JavaScript**: Pure CSS variables
- **Small footprint**: ~2KB of CSS for complete theme

## Quick Recipes

### Seasonal Themes

```python
import datetime

def get_seasonal_theme():
    month = datetime.datetime.now().month
    
    if month in [12, 1, 2]:  # Winter
        return {
            'colors': {
                'primary': '#0EA5E9',  # Ice blue
                'accent': '#E0F2FE',   # Snow white
                # ...
            }
        }
    elif month in [3, 4, 5]:  # Spring
        return {
            'colors': {
                'primary': '#84CC16',  # Fresh green
                'accent': '#FDE047',   # Sunshine yellow
                # ...
            }
        }
    # ... etc

SPELLBOOK_THEME = get_seasonal_theme()
```

### User Preference Themes

```python
# In your user profile model
class UserProfile(models.Model):
    theme_colors = models.JSONField(default=dict)
    
# In middleware or view
user_theme = request.user.profile.theme_colors
if user_theme:
    SPELLBOOK_THEME = {'colors': user_theme}
```

### A/B Testing Themes

```python
import random

# Test two different color schemes
THEME_A = {'colors': {'primary': '#FF6B35', ...}}
THEME_B = {'colors': {'primary': '#4ECDC4', ...}}

# Randomly assign (or use more sophisticated logic)
SPELLBOOK_THEME = random.choice([THEME_A, THEME_B])
```

## The Power of Python Dictionaries

Remember: **Your entire site's color scheme is just a Python dictionary!**

No more:
- Searching through CSS files
- Compiling SASS/LESS
- Managing CSS variables manually
- Worrying about specificity wars

Just update your dictionary, and every component adapts instantly. It's that simple!

{~ alert type="success" ~}
**Pro Tip**: Start with one of the 9 built-in presets, then customize just the colors you want to change. You don't need to define every color from scratch!
{~~}

## Next Steps

1. **Copy a starter theme** from the examples above
2. **Paste into your `settings.py`**
3. **Tweak the colors** to match your brand
4. **See instant results** across your entire site!

Visit `/themes/` on your site to preview how your theme looks with real components.

{% a href="/themes/" .sb-btn .sb-btn-primary %}
Try Theme Switcher →
{% enda %}

{% a href="/docs/Styles/themes" .super-link %}
Learn About Built-in Themes
{% enda %}