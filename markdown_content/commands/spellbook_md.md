---
title: spellbook_md
published: 2025-12-12
modified: 2025-12-12
tags:
  - commands
  - reference
---

# spellbook_md

The main event. This command reads your markdown files and generates everything Django needs to serve them as pages.

## Usage
```bash
python manage.py spellbook_md
```

That's it. Run it after changing your markdown files, and your site updates.

{~ hero layout="image_top_text_bottom" image_src="https://i.imgur.com/2oJBgpR.png" image_alt="spellbook_md command output" min_height="auto" bg_color="surface" ~}
*Example output from spellbook_md* 
- **Generates views, URLs, templates, and manifests for navigation** 
- **Supports multi-app workflows** 
{~~}

{~ img src="https://i.imgur.com/2oJBgpR.png" alt="Command output" caption="Example output from spellbook_md" ~}{~~}

## What It Does

For each markdown file in your source directory, the command:

1. **Parses frontmatter** - YAML metadata becomes template context
2. **Renders SpellBlocks** - Components like `{~ alert ~}` become HTML
3. **Converts markdown** - Standard markdown processing with syntax highlighting
4. **Generates templates** - Output lands in `{app}/templates/{app}/spellbook/`
5. **Creates views** - One view function per page
6. **Wires URLs** - Routes matching your folder structure
7. **Builds navigation** - Previous/next links and table of contents
8. **Writes manifest** - `spellbook_manifest.json` for sitemap integration

## Required Settings
```python
# settings.py
SPELLBOOK_MD_PATH = BASE_DIR / 'docs'
SPELLBOOK_MD_APP = 'my_app'
```

| Setting | Type | Description |
|---------|------|-------------|
| `SPELLBOOK_MD_PATH` | `Path` or `list[Path]` | Where your markdown files live |
| `SPELLBOOK_MD_APP` | `str` or `list[str]` | Which app receives the generated files |

The app must be in `INSTALLED_APPS`.

## Optional Settings
```python
# settings.py
SPELLBOOK_MD_URL_PREFIX = 'docs'
SPELLBOOK_MD_BASE_TEMPLATE = 'my_app/base.html'
```

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `SPELLBOOK_MD_URL_PREFIX` | `str` or `list[str]` | `''` | URL prefix for generated routes |
| `SPELLBOOK_MD_BASE_TEMPLATE` | `str` or `None` | `'django_spellbook/bases/sidebar_left.html'` | Template that wraps your content |

Set `SPELLBOOK_MD_BASE_TEMPLATE = None` to get raw HTML without any wrapper.

## Command Options
```bash
python manage.py spellbook_md --continue-on-error
python manage.py spellbook_md --report-level=minimal
python manage.py spellbook_md --report-format=json --report-output=report.json
```

| Option | Values | Description |
|--------|--------|-------------|
| `--continue-on-error` | flag | Keep processing if a file fails |
| `--report-level` | `minimal`, `detailed`, `debug` | How much output to show |
| `--report-format` | `text`, `json`, `none` | Output format |
| `--report-output` | filepath | Save report to file instead of stdout |

## Multi-Source Configuration

Process multiple markdown directories into different apps:
```python
SPELLBOOK_MD_PATH = [
    BASE_DIR / 'docs',
    BASE_DIR / 'blog',
]
SPELLBOOK_MD_APP = ['docs_app', 'blog_app']
SPELLBOOK_MD_URL_PREFIX = ['docs', 'blog']
SPELLBOOK_MD_BASE_TEMPLATE = [None, 'blog/base.html']
```

Lists must be the same length. Each index corresponds across all settings.

## Generated Files

After running the command, you'll find:
```
my_app/
├── templates/
│   └── my_app/
│       └── spellbook/
│           ├── index.html
│           ├── getting-started.html
│           └── api/
│               └── reference.html
├── spellbook_urls.py
├── spellbook_views.py
└── spellbook_manifest.json
```

Include the URLs in your project:
```python
# urls.py
from django.urls import path, include

urlpatterns = [
    path('docs/', include('my_app.spellbook_urls')),
]
```

## Error Handling

The command fails fast by default. If one file has a syntax error, processing stops.

Use `--continue-on-error` to process everything and see all errors at once:
```bash
python manage.py spellbook_md --continue-on-error
```

The summary report shows which files succeeded and which failed.