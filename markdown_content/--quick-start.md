---
title: Quick Start
published: 2025-12-12
modified: 2025-12-12
tags:
  - setup
  - installation
  - quickstart
---

Get Django Spellbook running in five minutes.

## 1. Install
```bash
pip install django-spellbook
```

## 2. Configure Settings
```python
# settings.py

INSTALLED_APPS = [
    # ...
    'django_spellbook',
    'my_app',  # Your app that will hold generated templates
]

SPELLBOOK_MD_PATH = BASE_DIR / 'docs'
SPELLBOOK_MD_APP = 'my_app'
```

## 3. Create a Markdown File
```bash
mkdir docs
```
```md
<!-- docs/index.md -->
---
title: Welcome
---

# Hello, Spellbook

This is your first page.

{~ alert type="success" ~}
It works!
{~~}
```

## 4. Run the Command
```bash
python manage.py spellbook_md
```

You'll see:
```
SpellbookMarkdownEngine: Markdown to HTML conversion complete.
Generating URLs and views...
Successfully processed 1 files for my_app
```

## 5. Wire Up URLs
```python
# urls.py
from django.urls import path, include

urlpatterns = [
    path('docs/', include('my_app.spellbook_urls')),
]
```

## 6. Visit Your Page

Start the dev server and open `http://localhost:8000/docs/`

You've got a styled page with sidebar navigation, table of contents, and theme support - no templates written.

---

## What Just Happened

Spellbook read your markdown, converted it to a Django template, generated a view function and URL pattern, and wrapped everything in a responsive layout.

Your file structure:
```
my_app/
├── templates/
│   └── my_app/
│       └── spellbook/
│           └── index.html
├── spellbook_urls.py
├── spellbook_views.py
└── spellbook_manifest.json
```

---

## Next Steps

## Add More Pages

Create more `.md` files in your docs folder. Folder structure becomes URL structure:

```
docs/
├── index.md          → /docs/
├── getting-started.md → /docs/getting-started/
└── api/
    ├── index.md      → /docs/api/
    └── reference.md  → /docs/api/reference/
```

Run `python manage.py spellbook_md` after changes.

## Use Spellblocks

SpellBlocks are components you embed in markdown:
```md
{~ card title="Feature" ~}
Cards for highlighting content.
{~~}

{~ alert type="warning" ~}
Alerts for important notices.
{~~}

{~ accordion title="Expandable" ~}
Accordions for collapsible sections.
{~~}
```

[Browse all SpellBlocks →](/examples/introduction/)

## Pick a Theme

Nine built-in themes. Add to settings:
```python
SPELLBOOK_THEME = 'arcane'  # or ocean, forest, ember, etc.
```

[Explore themes →](/styles/themes/)

## Customize the Layout

Use your own base template:
```python
SPELLBOOK_MD_BASE_TEMPLATE = 'my_app/base.html'
```

Your template needs one block:
```django
{% verbatim %}
{% block spellbook_md %}{% endblock %}
{% endverbatim %}
```

[Configuration reference →](/docs/configuration/)
