---
title: Custom SpellBlocks
published: 2025-12-12
modified: 2025-12-12
tags:
  - customization
  - spellblocks
  - python
---

Create your own SpellBlocks to extend Spellbook with custom components. Three steps: define the class, create the template, use it.

---

## Quick Start

### 1. Create spellblocks.py

In any Django app, create a `spellblocks.py` file. Spellbook auto-discovers it.
```python
# my_app/spellblocks.py
from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry

@SpellBlockRegistry.register()
class WarningBoxBlock(BasicSpellBlock):
    name = 'warningbox'
    template = 'my_app/blocks/warningbox.html'
```

### 2. Create the Template
```django
{% verbatim %}
<!-- my_app/templates/my_app/blocks/warningbox.html -->
<div class="warning-box">
    <strong>⚠️ Warning</strong>
    {{ content|safe }}
</div>
{% endverbatim %}
```

### 3. Use It
```markdown
{~ warningbox ~}
This action cannot be undone.
{~~}
```

That's it. Your block is now available in all markdown files and Django templates.

---

## How It Works

### Auto-Discovery

When Spellbook processes markdown, it imports `spellblocks.py` from every installed Django app. The `@SpellBlockRegistry.register()` decorator registers your block automatically.
```
my_project/
├── my_app/
│   ├── spellblocks.py      ← Auto-discovered
│   └── templates/
│       └── my_app/
│           └── blocks/
│               └── warningbox.html
```

### The BasicSpellBlock Class

Every SpellBlock inherits from `BasicSpellBlock`:
```python
from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry

@SpellBlockRegistry.register()
class MyBlock(BasicSpellBlock):
    name = 'myblock'           # Required: block name in markdown
    template = 'path/to.html'  # Required: Django template path
```

| Attribute | Description |
|-----------|-------------|
| `name` | The name used in markdown: `{~ name ~}` |
| `template` | Path to the Django template |
| `self.content` | Raw content between `{~ ~}` and `{~~}` |
| `self.kwargs` | Dictionary of parameters passed to the block |

---

## Adding Parameters

Override `get_context()` to handle parameters:
```python
@SpellBlockRegistry.register()
class PricingBlock(BasicSpellBlock):
    name = 'pricing'
    template = 'my_app/blocks/pricing.html'
    
    def get_context(self):
        context = super().get_context()  # Gets 'content' automatically
        
        # Extract parameters with defaults
        context['plan'] = self.kwargs.get('plan', 'Basic')
        context['price'] = self.kwargs.get('price', '$0')
        context['period'] = self.kwargs.get('period', 'month')
        context['featured'] = self.kwargs.get('featured', False)
        
        return context
```

Template:
```django
{% verbatim %}
<!-- my_app/templates/my_app/blocks/pricing.html -->
<div class="pricing-card {% if featured %}featured{% endif %}">
    <h3>{{ plan }}</h3>
    <div class="price">{{ price }}<span>/{{ period }}</span></div>
    <div class="features">
        {{ content|safe }}
    </div>
</div>
{% endverbatim %}
```

Usage:
```markdown
{~ pricing plan="Pro" price="$29" period="month" featured="true" ~}
- Unlimited projects
- Priority support
- Custom domain
{~~}
```

---

## Parameter Validation

Add validation in `get_context()`:
```python
@SpellBlockRegistry.register()
class StatusBlock(BasicSpellBlock):
    name = 'status'
    template = 'my_app/blocks/status.html'
    
    VALID_STATUSES = {'online', 'offline', 'maintenance', 'unknown'}
    
    def get_context(self):
        context = super().get_context()
        
        status = self.kwargs.get('status', 'unknown').lower()
        
        if status not in self.VALID_STATUSES:
            # Log warning and fall back to default
            print(f"Invalid status '{status}'. Using 'unknown'.")
            status = 'unknown'
        
        context['status'] = status
        context['label'] = self.kwargs.get('label', status.title())
        
        return context
```

---

## Processing Content

`super().get_context()` calls `process_content()` which converts markdown to HTML. You can customize this:
```python
@SpellBlockRegistry.register()
class CodeExampleBlock(BasicSpellBlock):
    name = 'codeexample'
    template = 'my_app/blocks/codeexample.html'
    
    def get_context(self):
        context = super().get_context()
        
        # 'content' is already processed markdown → HTML
        # Access raw content via self.content
        context['raw'] = self.content
        context['language'] = self.kwargs.get('language', 'python')
        context['title'] = self.kwargs.get('title', '')
        
        return context
```

For blocks that shouldn't process markdown (like raw code), skip `super()`:
```python
def get_context(self):
    return {
        'content': self.content,  # Raw, unprocessed
        'language': self.kwargs.get('language', 'text'),
    }
```

---

## Type Conversion Helpers

Parameters from markdown are always strings. Convert them:
```python
@SpellBlockRegistry.register()
class RatingBlock(BasicSpellBlock):
    name = 'rating'
    template = 'my_app/blocks/rating.html'
    
    def _to_bool(self, value, default=False):
        """Convert string to boolean."""
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.lower() in ['true', '1', 'yes', 'y']
        return default
    
    def _to_int(self, value, default=0):
        """Convert string to integer."""
        try:
            return int(value)
        except (ValueError, TypeError):
            return default
    
    def get_context(self):
        context = super().get_context()
        
        context['stars'] = self._to_int(self.kwargs.get('stars'), 5)
        context['max_stars'] = self._to_int(self.kwargs.get('max'), 5)
        context['show_count'] = self._to_bool(self.kwargs.get('show_count'), True)
        
        return context
```

---

## Complete Example: Testimonial Block

Here's a full example with validation, type conversion, and styling:

**spellblocks.py:**
```python
# my_app/spellblocks.py
from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry

@SpellBlockRegistry.register()
class TestimonialBlock(BasicSpellBlock):
    name = 'testimonial'
    template = 'my_app/blocks/testimonial.html'
    
    VALID_STYLES = {'default', 'minimal', 'featured'}
    
    def get_context(self):
        context = super().get_context()
        
        # Required fields
        context['author'] = self.kwargs.get('author', 'Anonymous')
        
        # Optional fields with defaults
        context['role'] = self.kwargs.get('role', '')
        context['company'] = self.kwargs.get('company', '')
        context['image'] = self.kwargs.get('image', '')
        context['rating'] = self._parse_rating(self.kwargs.get('rating'))
        
        # Validated style
        style = self.kwargs.get('style', 'default').lower()
        context['style'] = style if style in self.VALID_STYLES else 'default'
        
        return context
    
    def _parse_rating(self, value):
        """Parse rating as integer 1-5, or None."""
        if not value:
            return None
        try:
            rating = int(value)
            return max(1, min(5, rating))  # Clamp to 1-5
        except (ValueError, TypeError):
            return None
```

**Template:**
```django
{% verbatim %}
<!-- my_app/templates/my_app/blocks/testimonial.html -->
<blockquote class="testimonial testimonial--{{ style }}">
    {% if image %}
    <img src="{{ image }}" alt="{{ author }}" class="testimonial__avatar">
    {% endif %}
    
    <div class="testimonial__content">
        {{ content|safe }}
    </div>
    
    {% if rating %}
    <div class="testimonial__rating">
        {% for i in "12345" %}
            {% if forloop.counter <= rating %}★{% else %}☆{% endif %}
        {% endfor %}
    </div>
    {% endif %}
    
    <footer class="testimonial__author">
        <cite>{{ author }}</cite>
        {% if role or company %}
        <span class="testimonial__meta">
            {% if role %}{{ role }}{% endif %}
            {% if role and company %}, {% endif %}
            {% if company %}{{ company }}{% endif %}
        </span>
        {% endif %}
    </footer>
</blockquote>
{% endverbatim %}
```

**Usage:**
```markdown
{~ testimonial author="Sarah Chen" role="CTO" company="TechCorp" rating="5" style="featured" image="/static/images/sarah.jpg" ~}
Django Spellbook transformed how we manage documentation. What used to take days now takes hours.
{~~}
```

---

## Using Spellbook Styles

Your templates can use Spellbook's utility classes:
```django
{% verbatim %}
<div class="sb-card sb-p-4 sb-border sb-border-radius-lg sb-shadow-sm sb-mb-3">
    <div class="sb-text-primary sb-bold">{{ title }}</div>
    <div class="sb-text-secondary sb-mt-2">{{ content|safe }}</div>
</div>
{% endverbatim %}
```

This gives your custom blocks the same look and feel as built-in blocks.

---

## Debugging

### Block Not Found

If your block isn't discovered:

1. Check the file is named `spellblocks.py` (not `spellblock.py`)
2. Check your app is in `INSTALLED_APPS`
3. Check for import errors—run `python manage.py shell` and try `from my_app.spellblocks import *`

### Template Not Found

If the template isn't found:

1. Check the path matches your `template` attribute
2. Verify the template exists in `my_app/templates/...`
3. Run `python manage.py findstatic` to debug template discovery

### View Registered Blocks
```python
from django_spellbook.blocks import SpellBlockRegistry

# List all registered blocks
print(SpellBlockRegistry._registry.keys())

# Check if your block is registered
print(SpellBlockRegistry.get_block('myblock'))
```

---

## Next Steps

{~ accordion title="SpellBlocks Reference" ~}
See all built-in SpellBlocks for inspiration.

[View SpellBlocks →](/docs/spellblocks/)
{~~}

{~ accordion title="Style Classes" ~}
Use Spellbook's utility classes in your templates.

[View Styles →](/docs/styles/introduction/)
{~~}

{~ accordion title="Themes" ~}
Make your blocks theme-aware with CSS variables.

[View Themes →](/docs/themes/)
{~~}