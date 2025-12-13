---
title: Frontmatter Reference
published: 2025-12-12
modified: 2025-12-12
tags:
  - reference
  - frontmatter
  - metadata
---

Frontmatter is YAML metadata at the top of your markdown files. It controls how pages are processed, displayed, and indexed.
```yaml
---
title: My Page Title
published: 2025-12-12
author: Jane Doe
tags:
  - guide
  - tutorial
---

Your content starts here...
```

---

## Required Fields

These fields are validated by `spellbook_validate`:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title displayed in navigation and headers |
| `published` | date | Publication date (YYYY-MM-DD format) |
| `author` | string | Content author |
| `tags` | list | At least one tag for categorization |
```yaml
---
title: Getting Started Guide
published: 2025-12-12
author: Storm Developments
tags:
  - quickstart
  - beginner
---
```

{~ alert type="info" ~}
Files without frontmatter still work — the filename becomes the title and defaults are used for other fields.
{~~}

---

## Date Fields

### published

Primary publication date. Used for sorting and sitemap `<lastmod>`.
```yaml
published: 2025-12-12
```

**Aliases** (first found is used):
- `published`
- `published_at`
- `date`
- `created`
- `created_at`

### modified

Last modification date. Takes precedence over `published` for sitemap `<lastmod>`.
```yaml
modified: 2025-12-15
```

**Aliases** (first found is used):
- `modified`
- `modified_at`
- `updated`
- `updated_at`

**Accepted formats:**
- `2025-12-12` (YYYY-MM-DD)
- `2025-12-12T10:30:00` (ISO datetime)

---

## Visibility

### is_public

Controls whether the page is publicly accessible and included in sitemaps.
```yaml
is_public: false  # Hidden from sitemap, but page still generated
```

**Default:** `true`

**Accepted values:** `true`, `false`, `yes`, `no`, `1`, `0`

---

## Navigation

### prev / next

Override automatic prev/next navigation. By default, Spellbook auto-generates sequential navigation alphabetically within each directory.

**Path format** (same app):
```yaml
prev: getting-started
next: advanced-topics
```

**Namespaced format** (cross-app):
```yaml
prev: blog:intro-post
next: docs:chapter-2
```

**Disable navigation:**
```yaml
prev: null
next: null
```

{~ card title="Auto Navigation" ~}
If you don't specify `prev`/`next`, Spellbook automatically links pages alphabetically within each directory. Most sites never need manual overrides.
{~~}

---

## Sitemap Control

### sitemap_priority

Search engine priority hint (0.0 to 1.0).
```yaml
sitemap_priority: 0.9  # High priority page
```

**Default:** Omitted (search engines use their own judgment)

### sitemap_changefreq

How often the page is likely to change.
```yaml
sitemap_changefreq: daily
```

**Values:** `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`

**Default:** `weekly`

### sitemap_exclude

Exclude from sitemap while keeping page public.
```yaml
sitemap_exclude: true  # Page exists but not in sitemap.xml
```

**Default:** `false`

---

## Custom Metadata

Any field not in the reserved list becomes custom metadata, accessible in templates via `metadata.custom_meta`.
```yaml
---
title: Product Page
published: 2025-12-12
author: Marketing Team
tags:
  - product

# Custom fields:
product_id: SKU-12345
price: 99.99
featured: true
category: electronics
---
```

**Access in templates:**
```django
{% verbatim %}
{{ metadata.custom_meta.product_id }}
{{ metadata.custom_meta.price }}
{% if metadata.custom_meta.featured %}★ Featured{% endif %}
{% endverbatim %}
```

**Reserved fields** (not available in `custom_meta`):
- `title`, `author`, `tags`, `is_public`
- `published`, `published_at`, `date`, `created`, `created_at`
- `modified`, `modified_at`, `updated`, `updated_at`
- `prev`, `next`
- `sitemap_priority`, `sitemap_changefreq`, `sitemap_exclude`

---

## Complete Example
```yaml
---
# Required
title: Complete Django Spellbook Guide
published: 2025-12-01
author: Storm Developments
tags:
  - django
  - spellbook
  - complete-guide

# Optional dates
modified: 2025-12-12

# Visibility
is_public: true

# Navigation overrides
prev: introduction
next: docs:advanced-config

# Sitemap
sitemap_priority: 0.8
sitemap_changefreq: weekly

# Custom metadata
difficulty: intermediate
reading_time: 15 min
version: 0.2.2
---

Your content here...
```

---

## Validation

Check all your files for frontmatter issues:
```bash
# Audit mode (report only)
python manage.py spellbook_validate

# Interactive fix mode
python manage.py spellbook_validate --fix

# Via wizard
python manage.py spellbook_wizard
# Select [2] Validate → [1] Validate frontmatter
```

**Example output:**
```
❌ docs/getting-started.md
   • Missing: author
   • tags: must have at least 1 item

❌ blog/old-post.md
   • published: invalid date format "Dec 2025" (expected YYYY-MM-DD)

────────────────────────────────
⚠️  2 pages with issues
✅ 45 pages valid
```

---

## Quick Reference

{~ card title="Required" ~}
`title` · `published` · `author` · `tags`
{~~}

{~ card title="Dates" ~}
`published` (or `date`, `created`)

`modified` (or `updated`)

Format: `YYYY-MM-DD`
{~~}

{~ card title="Visibility & Navigation" ~}
`is_public`: true/false

`prev`: path or app:page

`next`: path or app:page
{~~}

{~ card title="Sitemap" ~}
`sitemap_priority`: 0.0–1.0

`sitemap_changefreq`: daily, weekly, etc.

`sitemap_exclude`: true/false
{~~}

---

## Next Steps

{~ accordion title="Spellbook Wizard" ~}
Interactive tool for validating and fixing frontmatter.

[View Wizard →](/docs/commands/spellbook-wizard/)
{~~}

{~ accordion title="Sitemaps" ~}
How Spellbook generates and manages sitemaps.

[View Sitemaps →](/docs/sitemaps/)
{~~}

{~ accordion title="Custom Base Templates" ~}
Access frontmatter data in your templates.

[View Custom Templates →](/docs/customization/custom-base/)
{~~}