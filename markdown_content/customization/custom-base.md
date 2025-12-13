---
title: Custom Base Templates
published: 2025-12-12
modified: 2025-12-12
tags:
  - customization
  - templates
  - layout
---

Spellbook provides a complete sidebar layout out of the box. You can wrap it inside your existing site, replace it entirely, or use it standalone.

## Two Approaches

### SPELLBOOK_BASE_EXTEND_FROM

Wraps Spellbook's sidebar layout inside your existing base template. Your site's header, footer, and navigation stay intact.
```python
SPELLBOOK_BASE_EXTEND_FROM = 'base.html'
```

### SPELLBOOK_MD_BASE_TEMPLATE

Replaces Spellbook's layout entirely. You control everything—sidebar, TOC, metadata, navigation.
```python
SPELLBOOK_MD_BASE_TEMPLATE = 'my_app/custom_layout.html'
```

---

## Using EXTEND_FROM

The simplest way to integrate Spellbook into an existing site.

### Setup
```python
# settings.py
SPELLBOOK_MD_PATH = BASE_DIR / 'docs'
SPELLBOOK_MD_APP = 'docs'
SPELLBOOK_BASE_EXTEND_FROM = 'base.html'
```

### Your Base Template

Add one block where Spellbook renders:
```django
{% verbatim %}
<!-- base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
    <link rel="stylesheet" href="{% static 'css/main.css' %}">
</head>
<body>
    <nav>
        <!-- Your site navigation -->
    </nav>
    
    <main>
        {% block spellbook %}
        <!-- Spellbook sidebar + content renders here -->
        {% endblock %}
    </main>
    
    <footer>
        <!-- Your site footer -->
    </footer>
</body>
</html>
{% endverbatim %}
```

{~ alert type="info" ~}
The block must be named `spellbook` (not `spellbook_md`). Spellbook auto-generates a wrapper template that extends your base and includes the full sidebar layout.
{~~}

### What Gets Generated

When you run `python manage.py spellbook_md`, Spellbook creates:
```
docs/
└── templates/
    └── docs/
        └── spellbook_base.html  ← Auto-generated wrapper
```

This wrapper extends your base and includes Spellbook's sidebar layout. You never edit this file—it's regenerated on each run.

### Per-App Configuration

For multi-app setups:
```python
SPELLBOOK_MD_PATH = [BASE_DIR / 'docs', BASE_DIR / 'blog']
SPELLBOOK_MD_APP = ['docs', 'blog']
SPELLBOOK_BASE_EXTEND_FROM = ['base.html', 'blog/base.html']
```

---

## Using BASE_TEMPLATE

Full control over the layout. You're responsible for rendering the sidebar, TOC, metadata, and navigation.

### Setup
```python
# settings.py
SPELLBOOK_MD_PATH = BASE_DIR / 'docs'
SPELLBOOK_MD_APP = 'docs'
SPELLBOOK_MD_BASE_TEMPLATE = 'docs/spellbook_base.html'
```

### Minimal Custom Template

At minimum, you need the content block:
```django
{% verbatim %}
<!-- docs/spellbook_base.html -->
{% extends 'base.html' %}
{% load spellbook_tags %}

{% block content %}
    {% spellbook_styles %}
    {% block spellbook_md %}{% endblock %}
{% endblock %}
{% endverbatim %}
```

{~ alert type="warning" ~}
The block must be named `spellbook_md`. This is where your rendered markdown content appears.
{~~}

### Full Custom Template

Recreate the sidebar layout with your own structure:
```django
{% verbatim %}
<!-- docs/spellbook_base.html -->
{% extends 'base.html' %}
{% load spellbook_tags %}
{% load static %}

{% block extra_css %}
    {% spellbook_styles %}
    <link rel="stylesheet" href="{% static 'django_spellbook/css_modules/sidebar_left.css' %}">
{% endblock %}

{% block content %}
<div class="spellbook-container">
    <div class="spellbook-layout">
        <nav class="spellbook-toc">
            {% if is_directory_index %}
                {% directory_metadata %}
            {% else %}
                {% page_metadata %}
            {% endif %}
            
            {% include "django_spellbook/tocs/sidebar_toc.html" %}
            
            {% if user.is_staff %}
                {% if is_directory_index %}
                    {% directory_metadata "for_dev" %}
                {% else %}
                    {% page_metadata "for_dev" %}
                {% endif %}
            {% endif %}
        </nav>
        
        <main class="spellbook-content">
            {% page_header %}
            {% block spellbook_md %}{% endblock %}
        </main>
    </div>
</div>
{% endblock %}
{% endverbatim %}
```

---

## The Default Layout

Spellbook's built-in `sidebar_left.html` provides:
```django
{% verbatim %}
{% load spellbook_tags %}
{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    {% spellbook_styles %}
    <link rel="stylesheet" href="{% static 'django_spellbook/css_modules/sidebar_left.css' %}">
</head>
<body class="sb-bg-background sb-text-text">
    <div class="spellbook-container">
        <div class="spellbook-layout">
            <nav class="spellbook-toc">
                {% if is_directory_index %}
                    {% directory_metadata %}
                {% else %}
                    {% page_metadata %}
                {% endif %}

                {% include "django_spellbook/tocs/sidebar_toc.html" %}

                {% if user.is_staff %}
                    {% if is_directory_index %}
                        {% directory_metadata "for_dev" %}
                    {% else %}
                        {% page_metadata "for_dev" %}
                    {% endif %}
                {% endif %}
            </nav>
            
            <main class="spellbook-content">
                {% page_header %}
                {% block spellbook_md %}{% endblock %}
            </main>
        </div>
    </div>
</body>
</html>
{% endverbatim %}
```

---

## Template Tags Reference

### spellbook_styles

Injects theme CSS variables. Required in `<head>`.
```django
{% verbatim %}
{% spellbook_styles %}
{% endverbatim %}
```

### page_metadata / directory_metadata

Displays metadata in the sidebar. Shows different info for pages vs directories.
```django
{% verbatim %}
{# User-facing metadata (dates, tags, reading time) #}
{% page_metadata %}
{% directory_metadata %}

{# Developer metadata (URL paths, namespaces) - staff only #}
{% page_metadata "for_dev" %}
{% directory_metadata "for_dev" %}
{% endverbatim %}
```

### page_header

Renders title, author, and prev/next navigation above the content.
```django
{% verbatim %}
{% page_header %}
{% endverbatim %}
```

### sidebar_toc

Renders the table of contents. Usually included via template:
```django
{% verbatim %}
{% include "django_spellbook/tocs/sidebar_toc.html" %}
{% endverbatim %}
```

---

## CSS Structure

### Container Classes

| Class | Purpose |
|-------|---------|
| `.spellbook-container` | Max-width wrapper (1200px) |
| `.spellbook-layout` | Grid container (sidebar + content) |
| `.spellbook-toc` | Sidebar navigation |
| `.spellbook-content` | Main content area |

### Grid Layout

Desktop (768px+): 3-column grid
```
| 250px sidebar | 800px content | flexible |
```

Mobile: Stacked layout with sidebar above content.

### Utility Classes

The body uses theme-aware utilities:
```html
<body class="sb-bg-background sb-text-text">
```

These adapt to your `SPELLBOOK_THEME` setting.

---

## Context Variables

These variables are available in your templates:

| Variable | Type | Description |
|----------|------|-------------|
| `toc` | dict | Table of contents tree |
| `metadata` | dict | Page frontmatter (title, author, dates, tags) |
| `current_url` | str | Current page URL name |
| `is_directory_index` | bool | True if this is a directory index page |
| `parent_directory_url` | str | URL name of parent directory |
| `parent_directory_name` | str | Display name of parent directory |
| `directory_stats` | dict | Stats for directory pages (total pages, subdirs) |

---

## Disabling the Wrapper

For raw HTML output with no template wrapper:
```python
SPELLBOOK_MD_BASE_TEMPLATE = None
```

Generated templates contain only the rendered HTML—no `{% verbatim %}{% extends %}{% endverbatim %}`, no blocks. Useful for embedding in other systems.

---

## Next Steps

{~ accordion title="Template Tags" ~}
Full reference for all available template tags.

[View Template Tags →](/docs/template-tags/)
{~~}

{~ accordion title="Themes" ~}
Customize the colors that these templates use.

[View Themes →](/docs/themes/)
{~~}