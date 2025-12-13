---
title: Template Tags
published: 2025-12-12
modified: 2025-12-12
tags:
  - reference
  - templates
  - tags
---

Template tags for use in your Django templates. Load them with `{% verbatim %}{% load spellbook_tags %}{% endverbatim %}`.

## Styles & Theming

### spellbook_styles

Injects CSS variables and theme styles into your page. Required if you're using a custom base template.
```django
{% verbatim %}
{% load spellbook_tags %}

<head>
    {% spellbook_styles %}
</head>
{% endverbatim %}
```

{~ card title="spellbook_styles" footer="No arguments" ~}
Generates a `<style>` tag with CSS custom properties based on your `SPELLBOOK_THEME` setting. Place it in your `<head>` before any Spellbook CSS files.
{~~}

---

## Metadata Display

### show_metadata / page_metadata

Displays page metadata (published date, reading time, tags, word count).
```django
{% verbatim %}
{% load spellbook_tags %}

{# User-facing metadata #}
{% show_metadata %}

{# Developer metadata (URL paths, namespaces) #}
{% show_metadata 'for_dev' %}

{# Alias - same as show_metadata #}
{% page_metadata %}
{% page_metadata 'for_dev' %}
{% endverbatim %}
```

{~ card title="show_metadata" footer="Arguments: display_type (optional)" ~}
**display_type:** `'for_user'` (default) or `'for_dev'`

User view shows: title, published date, reading time, tags, word count.

Dev view shows: URL path, namespace, namespaced URL. Useful for debugging.
{~~}

{~ accordion title="Restrict dev metadata to staff users" ~}
```django
{% verbatim %}
{% if user.is_staff %}
    {% show_metadata 'for_dev' %}
{% endif %}
{% endverbatim %}
```
{~~}

### directory_metadata

Displays metadata for directory index pages (total pages, subdirectories).
```django
{% verbatim %}
{% load spellbook_tags %}

{% directory_metadata %}
{% directory_metadata 'for_dev' %}
{% endverbatim %}
```

{~ card title="directory_metadata" footer="Arguments: display_type (optional)" ~}
**display_type:** `'for_user'` (default) or `'for_dev'`

Only renders on directory index pages. Returns empty string on regular content pages.
{~~}

---

## Navigation

### sidebar_toc

Renders the table of contents in the sidebar.
```django
{% verbatim %}
{% load spellbook_tags %}

<nav class="spellbook-toc">
    {% sidebar_toc %}
</nav>
{% endverbatim %}
```

{~ card title="sidebar_toc" footer="No arguments | Requires 'toc' in context" ~}
Renders a nested list of all pages in your content directory. Highlights the current page. Requires the `toc` variable in template context (automatically provided by Spellbook views).
{~~}

### page_header

Renders the page title, author, and prev/next navigation.
```django
{% verbatim %}
{% load spellbook_tags %}

<main>
    {% page_header %}
    {% block spellbook_md %}{% endblock %}
</main>
{% endverbatim %}
```

{~ card title="page_header" footer="No arguments" ~}
Displays: back link to parent directory, page title from frontmatter, author (if set), and previous/next page links.
{~~}

---

## SpellBlocks in Templates

### spellblock

Render SpellBlocks directly in Django templates without writing markdown.
```django
{% verbatim %}
{% load spellbook_tags %}

{% spellblock 'alert' type='warning' %}
    <p>This is a warning message.</p>
{% endspellblock %}

{% spellblock 'card' title='Welcome' footer='Updated today' %}
    <p>Card content with {{ template_variable }}</p>
{% endspellblock %}
{% endverbatim %}
```

{~ card title="spellblock" footer="Arguments: block_name, **kwargs" ~}
**block_name:** Name of the SpellBlock (`'alert'`, `'card'`, `'accordion'`, etc.)

**kwargs:** Block-specific parameters (same as markdown syntax)

Content between tags is passed to the block. Supports template variables and nested tags.
{~~}

{~ accordion title="All available blocks" ~}
- `alert` - type: info, success, warning, error
- `card` - title, footer
- `accordion` - title, open
- `hero` - layout, image_src, image_alt, min_height, bg_color
- `progress` - value, max, label
- `quote` - author, source
- `div`, `span`, `section`, `article`, `nav`, `aside`, `header`, `footer` - any HTML attributes
{~~}

---

## Utility Tags

### spellbook_url

Convert a TOC URL path to a Django URL.
```django
{% verbatim %}
{% load spellbook_tags %}

<a href="{% spellbook_url 'docs:getting-started' %}">Getting Started</a>
{% endverbatim %}
```

{~ card title="spellbook_url" footer="Arguments: url_path" ~}
**url_path:** Namespaced URL path (e.g., `'myapp:page-name'`)

Returns the reversed URL. Returns `'# Not Found'` if the path doesn't exist.
{~~}

### dash_strip

Remove leading dashes from a string. Useful for cleaning up auto-generated names.
```django
{% verbatim %}
{{ "-my-page-name"|dash_strip }}
{# Output: my-page-name #}
{% endverbatim %}
```

{~ card title="dash_strip" footer="Filter" ~}
Strips leading dashes from strings. Used internally for TOC display names.
{~~}

---

## Complete Example

Custom base template using all the tags:
```django
{% verbatim %}
<!-- my_app/spellbook_base.html -->
{% extends 'base.html' %}
{% load spellbook_tags %}
{% load static %}

{% block extra_head %}
    {% spellbook_styles %}
    <link rel="stylesheet" href="{% static 'django_spellbook/css_modules/sidebar_left.css' %}">
{% endblock %}

{% block content %}
<div class="spellbook-layout">
    <nav class="spellbook-toc">
        {% if is_directory_index %}
            {% directory_metadata %}
        {% else %}
            {% page_metadata %}
        {% endif %}
        
        {% sidebar_toc %}
        
        {% if user.is_staff %}
            {% if is_directory_index %}
                {% directory_metadata 'for_dev' %}
            {% else %}
                {% page_metadata 'for_dev' %}
            {% endif %}
        {% endif %}
    </nav>
    
    <main class="spellbook-content">
        {% page_header %}
        {% block spellbook_md %}{% endblock %}
    </main>
</div>
{% endblock %}
{% endverbatim %}
```

---

## Next Steps

{~ accordion title="Configuration" ~}
All the settings that control how Spellbook processes your markdown and generates templates.

[View Configuration →](/docs/configuration/)
{~~}

{~ accordion title="SpellBlocks" ~}
The component library you'll use in your markdown. Alerts, cards, accordions, heroes, and more.

[Browse SpellBlocks →](/docs/spellblocks/introduction/)
{~~}