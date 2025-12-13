---
title: Sitemaps
published: 2025-12-12
modified: 2025-12-12
tags:
  - seo
  - sitemaps
  - configuration
---

Django Spellbook integrates with Django's sitemap framework to automatically generate SEO-friendly sitemaps from your markdown content.

---

## Quick Setup

**1. Create sitemaps.py in your project:**
```python
# myproject/sitemaps.py
from django_spellbook.sitemaps import SpellbookSitemap

sitemaps = {
    'spellbook': SpellbookSitemap,
}
```

**2. Add sitemap URL to urls.py:**
```python
# myproject/urls.py
from django.contrib.sitemaps.views import sitemap
from .sitemaps import sitemaps

urlpatterns = [
    # ... your other URLs
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
]
```

**3. Visit `/sitemap.xml`** — your sitemap is ready.

---

## How It Works

When you run `python manage.py spellbook_md`:

1. Spellbook processes all markdown files
2. Generates a `spellbook_manifest.json` in each content app
3. The manifest contains page paths, titles, and dates

When a search engine requests `/sitemap.xml`:

1. Django calls `SpellbookSitemap`
2. It reads the manifest files
3. Returns all public pages with their metadata

{~ alert type="info" ~}
Sitemaps are generated dynamically at request time, so they're always up-to-date with your latest `spellbook_md` run.
{~~}

---

## Output Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-site.com/docs/intro/</loc>
    <lastmod>2025-12-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-site.com/docs/guide/</loc>
    <lastmod>2025-12-10</lastmod>
    <changefreq>weekly</changefreq>
  </url>
</urlset>
```

---

## Per-Page Control

Control sitemap behavior with frontmatter:
```yaml
---
title: Important Page
published: 2025-12-01
modified: 2025-12-12

# Sitemap options
sitemap_priority: 0.9
sitemap_changefreq: daily
---
```

### sitemap_priority

Hint to search engines about page importance (0.0 to 1.0).
```yaml
sitemap_priority: 0.9  # High priority
sitemap_priority: 0.3  # Low priority
```

**Default:** Omitted (search engines decide)

### sitemap_changefreq

How often the content is likely to change.
```yaml
sitemap_changefreq: daily
```

| Value | Use Case |
|-------|----------|
| `always` | Live data, real-time content |
| `hourly` | News, frequently updated |
| `daily` | Blog posts, active content |
| `weekly` | Documentation, guides |
| `monthly` | Reference material |
| `yearly` | Archives, historical |
| `never` | Permanent content |

**Default:** `weekly`

### sitemap_exclude

Keep page public but exclude from sitemap.
```yaml
sitemap_exclude: true
```

Useful for: landing pages you promote differently, duplicate content, utility pages.

### is_public

Exclude page from sitemap AND make it private.
```yaml
is_public: false
```

Page is still generated but hidden from sitemap.

---

## Multi-App Support

`SpellbookSitemap` automatically discovers all apps in `SPELLBOOK_MD_APP`.

**For manual control:**
```python
from django_spellbook.sitemaps import SpellbookSitemap

sitemaps = {
    'docs': SpellbookSitemap(app_names=['docs_app']),
    'blog': SpellbookSitemap(app_names=['blog_app']),
}
```

This creates separate sitemap sections, useful for large sites.

---

## Mixing with Other Sitemaps

Combine Spellbook pages with your existing Django sitemaps:
```python
from django.contrib.sitemaps import Sitemap
from django_spellbook.sitemaps import SpellbookSitemap
from myapp.models import Product, BlogPost

class ProductSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.8

    def items(self):
        return Product.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.updated_at

class BlogPostSitemap(Sitemap):
    changefreq = 'daily'

    def items(self):
        return BlogPost.objects.filter(published=True)

sitemaps = {
    'products': ProductSitemap,
    'blog': BlogPostSitemap,
    'spellbook': SpellbookSitemap,  # All Spellbook pages
}
```

---

## Date Handling

`<lastmod>` uses dates from frontmatter:

1. `modified` (or `modified_at`, `updated`, `updated_at`) — preferred
2. `published` (or `published_at`, `date`, `created`, `created_at`) — fallback
```yaml
---
title: My Page
published: 2025-12-01
modified: 2025-12-12  # ← This is used for lastmod
---
```

If no date is found, `<lastmod>` is omitted.

---

## The Manifest File

Each content app gets a `spellbook_manifest.json`:
```json
{
  "generated_at": "2025-12-12T14:32:00Z",
  "app_name": "docs_app",
  "url_prefix": "docs",
  "pages": [
    {
      "path": "/docs/intro/",
      "title": "Introduction",
      "lastmod": "2025-12-12"
    },
    {
      "path": "/docs/guide/",
      "title": "User Guide",
      "lastmod": "2025-12-10"
    }
  ]
}
```

**Automatic filtering:**
- Pages with `is_public: false` are excluded
- Pages with `sitemap_exclude: true` are excluded

---

## Troubleshooting

### Empty sitemap

**Check:** Did you run `spellbook_md` after adding content?
```bash
python manage.py spellbook_md
```

**Check:** Are all pages set to `is_public: false`?

### Missing pages

**Check:** Does the page have `sitemap_exclude: true`?

**Check:** Is the manifest file generated?
```bash
ls your_app/spellbook_manifest.json
```

### Wrong URLs

**Check:** Is your `SPELLBOOK_MD_URL_PREFIX` configured correctly?
```python
SPELLBOOK_MD_URL_PREFIX = ['docs', 'blog']  # Matches SPELLBOOK_MD_APP order
```

---

## Quick Reference

{~ card title="Setup" ~}
1. Create `sitemaps.py` with `SpellbookSitemap`
2. Add `path('sitemap.xml', ...)` to `urls.py`
3. Run `spellbook_md` to generate manifests
{~~}

{~ card title="Frontmatter Options" ~}
`sitemap_priority`: 0.0–1.0

`sitemap_changefreq`: always, hourly, daily, weekly, monthly, yearly, never

`sitemap_exclude`: true/false

`is_public`: true/false
{~~}

{~ card title="Date Priority" ~}
1. `modified` (or aliases)
2. `published` (or aliases)
3. Omitted if no date
{~~}

---

## Next Steps

{~ accordion title="Frontmatter Reference" ~}
All available frontmatter fields.

[View Frontmatter →](/docs/frontmatter/)
{~~}

{~ accordion title="Configuration" ~}
Full settings reference for Spellbook.

[View Configuration →](/docs/configuration/)
{~~}

{~ accordion title="spellbook_md Command" ~}
The command that generates manifests.

[View spellbook_md →](/docs/commands/spellbook-md/)
{~~}