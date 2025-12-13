---
title: Configuration
published: 2025-12-12
modified: 2025-12-12
tags:
  - settings
  - configuration
  - reference
---

All Django Spellbook settings live in your `settings.py` file.

## Required Settings

These two settings are mandatory. Without them, `spellbook_md` won't run.

### SPELLBOOK_MD_PATH
```python
# Single directory
SPELLBOOK_MD_PATH = BASE_DIR / 'docs'

# Multiple directories
SPELLBOOK_MD_PATH = [
    BASE_DIR / 'docs',
    BASE_DIR / 'blog',
]
```

{~ card title="SPELLBOOK_MD_PATH" footer="Required" ~}
Where your markdown files live.

**Type:** `Path`, `str`, or `list`
{~~}

### SPELLBOOK_MD_APP
```python
# Single app
SPELLBOOK_MD_APP = 'my_app'

# Multiple apps (must match SPELLBOOK_MD_PATH length)
SPELLBOOK_MD_APP = ['docs_app', 'blog_app']
```

{~ card title="SPELLBOOK_MD_APP" footer="Required" ~}
Which Django app receives the generated templates, views, and URLs. Must be in `INSTALLED_APPS`.

**Type:** `str` or `list[str]`
{~~}

---

## Layout & Templates

### SPELLBOOK_MD_BASE_TEMPLATE
```python
# Use default sidebar layout (recommended)
# Just don't set it - this is the default

# Use your own template
SPELLBOOK_MD_BASE_TEMPLATE = 'my_app/base.html'

# No wrapper - raw HTML only
SPELLBOOK_MD_BASE_TEMPLATE = None

# Per-app templates
SPELLBOOK_MD_BASE_TEMPLATE = ['docs/base.html', 'blog/base.html']
```

{~ card title="SPELLBOOK_MD_BASE_TEMPLATE" footer="Default: django_spellbook/bases/sidebar_left.html" ~}
Template that wraps your rendered content. Your custom template needs one block: `{% verbatim %}{% block spellbook_md %}{% endverbatim %}`

**Type:** `str`, `None`, or `list`
{~~}

{~ accordion title="Full custom template example" ~}
```django
{% verbatim %}
<!-- my_app/base.html -->
{% extends 'base.html' %}
{% load spellbook_tags %}

{% block content %}
<div class="docs-container">
    {% block spellbook_md %}{% endblock %}
</div>
{% endblock %}

{% block extra_css %}
{% spellbook_styles %}
{% endblock %}
{% endverbatim %}
```
{~~}

### SPELLBOOK_BASE_EXTEND_FROM
```python
# Wrap Spellbook's sidebar inside your site's base template
SPELLBOOK_BASE_EXTEND_FROM = 'base.html'

# Per-app base templates
SPELLBOOK_BASE_EXTEND_FROM = ['base.html', 'blog/base.html']
```

{~ card title="SPELLBOOK_BASE_EXTEND_FROM" footer="Default: None (Spellbook renders standalone)" ~}
Wraps Spellbook's entire sidebar layout inside your existing base template. Spellbook auto-generates a wrapper template that extends your base and includes the sidebar, TOC, and content.

**Type:** `str` or `list`
{~~}

Your base template needs one block where Spellbook renders:
```django
{% verbatim %}
<!-- base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>My Site</title>
    <!-- Your site's CSS/JS -->
</head>
<body>
    <nav><!-- Your site navigation --></nav>
    
    {% block spellbook %}
    <!-- Spellbook sidebar + content renders here -->
    {% endblock %}
    
    <footer><!-- Your site footer --></footer>
</body>
</html>
{% endverbatim %}
```

{~ alert type="info" ~}
**EXTEND_FROM vs BASE_TEMPLATE**

- `SPELLBOOK_BASE_EXTEND_FROM` - Wraps the *entire* Spellbook layout (sidebar + content) inside your template
- `SPELLBOOK_MD_BASE_TEMPLATE` - Replaces Spellbook's layout entirely with your own

Use `EXTEND_FROM` when you want Spellbook's sidebar but need your site's header/footer. Use `BASE_TEMPLATE` when you want complete control over the layout.
{~~}

[Learn more about custom bases →](/docs/customization/custom-base/)

---

## URL Routing

### SPELLBOOK_MD_URL_PREFIX
```python
# Content at /docs/
SPELLBOOK_MD_URL_PREFIX = 'docs'

# Content at root /
SPELLBOOK_MD_URL_PREFIX = ''

# Per-app prefixes
SPELLBOOK_MD_URL_PREFIX = ['docs', 'blog']
```

{~ card title="SPELLBOOK_MD_URL_PREFIX" footer="Default: '' for single app, app names for multi-app" ~}
Prefix for generated URL patterns.

**Type:** `str` or `list[str]`

**Default behavior for multi-app:** First app gets empty prefix (root), other apps use their app name.
{~~}

---

## Theming

### SPELLBOOK_THEME
```python
# Use a preset
SPELLBOOK_THEME = 'arcane'

# Custom colors
SPELLBOOK_THEME = {
    'colors': {
        'primary': '#3B82F6',
        'secondary': '#64748B',
        'accent': '#F59E0B',
    }
}

# Extend a preset
SPELLBOOK_THEME = {
    'preset': 'ocean',
    'colors': {
        'primary': '#0EA5E9',
    }
}
```

{~ card title="SPELLBOOK_THEME" footer="Default: 'default'" ~}
Visual theme for your content. Use a preset name or provide custom colors.

**Type:** `str` or `dict`
{~~}

{~ accordion title="Available presets" ~}
- **default** - Blue and gray, professional
- **arcane** - Purple and gold, mysterious
- **celestial** - Light and airy, divine
- **forest** - Green and brown, natural
- **ocean** - Blue and cyan, aquatic
- **phoenix** - Red and orange, fiery
- **shadow** - Monochrome, dark
- **enchanted** - Pink and gold, magical
- **pastel** - Soft colors, gentle
{~~}

{~ accordion title="Available color keys" ~}
- **Core:** primary, secondary, accent, neutral
- **Status:** error, warning, success, info
- **Specialty:** emphasis, subtle, distinct
- **System:** background, surface, text, text-secondary
{~~}

---

## Metadata Display

### SPELLBOOK_MD_METADATA_BASE
```python
# Custom templates for all apps
SPELLBOOK_MD_METADATA_BASE = (
    'my_app/metadata/user.html',
    'my_app/metadata/dev.html'
)

# Per-app templates
SPELLBOOK_MD_METADATA_BASE = [
    ('docs/meta_user.html', 'docs/meta_dev.html'),
    ('blog/meta_user.html', 'blog/meta_dev.html'),
]
```

{~ card title="SPELLBOOK_MD_METADATA_BASE" footer="Default: built-in templates" ~}
Templates for the `{% verbatim %}{% show_metadata %}{% endverbatim %}` tag. Tuple is `(user_template, dev_template)`.

**Type:** `tuple` or `list[tuple]`
{~~}

---

## Multi-App Configuration

When using multiple source directories, all list settings must have the same length:
```python
SPELLBOOK_MD_PATH = [
    BASE_DIR / 'docs',
    BASE_DIR / 'blog', 
    BASE_DIR / 'wiki',
]

SPELLBOOK_MD_APP = ['docs', 'blog', 'wiki']

SPELLBOOK_MD_URL_PREFIX = ['docs', 'blog', 'wiki']

SPELLBOOK_MD_BASE_TEMPLATE = [
    'docs/base.html',
    'blog/base.html',
    None,  # wiki uses default
]
```

{~ alert type="info" ~}
Each index corresponds across all settings. Index 0 of PATH goes to index 0 of APP with index 0 of URL_PREFIX.
{~~}

---

## Quick Reference

{~ card title="All Settings" ~}
- **SPELLBOOK_MD_PATH** - Markdown source directory *(required)*
- **SPELLBOOK_MD_APP** - Target Django app *(required)*
- **SPELLBOOK_MD_URL_PREFIX** - URL path prefix *(default: '')*
- **SPELLBOOK_MD_BASE_TEMPLATE** - Wrapper template *(default: sidebar layout)*
- **SPELLBOOK_THEME** - Color theme *(default: 'default')*
- **SPELLBOOK_MD_METADATA_BASE** - Metadata templates *(default: built-in)*
{~~}

---

## Minimal Example
```python
# settings.py
INSTALLED_APPS = [
    # ...
    'django_spellbook',
    'my_app',
]

SPELLBOOK_MD_PATH = BASE_DIR / 'docs'
SPELLBOOK_MD_APP = 'my_app'
```

That's it. Everything else has sensible defaults.

## Next Steps

{~ accordion title="Template Tags" ~}
The Django template tags that power Spellbook layouts. Include styles, display metadata, render the table of contents, and use SpellBlocks directly in your Django templates.

[View Template Tags →](/docs/template-tags/)
{~~}

{~ accordion title="SpellBlocks" ~}
The component library you'll use in your markdown. Alerts, cards, accordions, heroes, progress bars, and HTML element blocks for HTMX and Alpine.js.

[Browse SpellBlocks →](/examples/introduction/)
{~~}