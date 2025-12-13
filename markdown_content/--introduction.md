---
title: Introduction
published: 2025-12-12
---

# Django Spellbook

Markdown with components for Django.

## The Core

One function. Markdown in, HTML out, with full component support.
```python
from django_spellbook.parsers import spellbook_render

html = spellbook_render("""
# Welcome

{~ alert type="success" ~}
Your account is ready.
{~~}
""")
```

Use it in views, APIs, emails, admin panels, management commands—anywhere you have markdown and want HTML.

## SpellBlocks

Standard markdown covers text. SpellBlocks cover structure.
```markdown
{~ alert type="warning" ~}
This requires Django 5.0 or higher.
{~~}

{~ card title="Quick Install" ~}
`pip install django-spellbook`
{~~}
```

{~ alert type="warning" ~}
This requires Django 5.0 or higher.
{~~}

{~ card title="Quick Install" ~}
`pip install django-spellbook`
{~~}

Cards, alerts, accordions, quotes, heroes, progress bars—visual components embedded directly in markdown. They nest, support markdown inside, and you can create your own.

## Two Ways To Use It

### Programmatic

Call `spellbook_render()` anywhere:

- Database-backed content (CMS, blogs, user profiles)
- API endpoints that return rendered HTML
- Email templates with rich formatting
- Admin preview panels
- Dynamic content from any source

### File-Based

Run one command, get a full Django content system:
```bash
python manage.py spellbook_md
```

Spellbook processes a directory of markdown files and generates:

- Django templates with rendered content
- View functions for each page
- URL patterns matching your folder structure
- Sidebar navigation with table of contents
- Previous/next page links

Your folder hierarchy becomes your URL hierarchy. Frontmatter becomes page metadata. You write markdown, Spellbook handles the wiring.

**Good fit for:** Documentation sites, knowledge bases, content in version control, markdown-native workflows.

## Next Steps

{~ accordion title="Quick Start" open=true ~}
Get a working Spellbook site in five minutes. Install the package, add three settings, run one command.

[Go to Quick Start →](/docs/quick-start/)
{~~}

{~ accordion title="spellbook_render()" ~}
Use Spellbook programmatically in views, APIs, and anywhere else you need markdown-to-HTML conversion.

[View Function Docs →](/docs/spellbook-render/)
{~~}

{~ accordion title="SpellBlocks" ~}
The full component library. Alerts, cards, accordions, quotes, heroes, progress bars, and HTML element blocks for HTMX and Alpine.js.

[Browse SpellBlocks →](/examples/introduction/)
{~~}

{~ accordion title="Configuration" ~}
All the settings. Multiple source directories, URL prefixes, custom base templates, theme selection, and sitemap integration.

[View Configuration →](/docs/configuration/)
{~~}