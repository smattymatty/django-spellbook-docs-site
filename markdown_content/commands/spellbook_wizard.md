---
title: Spellbook Wizard
published: 2025-12-12
modified: 2025-12-12
tags:
  - commands
  - wizard
  - cli
  - tools
---

Interactive menu for common Spellbook tasks. No flags to memorize.
```bash
python manage.py spellbook_wizard
```

---

## Main Menu
```
Spellbook Wizard

  [1] Batch process
  [2] Validate

  [0] Exit

>
```

Type a number and press Enter. `[0]` exits or goes back.

---

## Batch Process

Run markdown processing commands.
```
Batch Process

  [1] Process markdown (spellbook_md)

  [0] ← Back

>
```

### Process Markdown

Runs `spellbook_md` — the full pipeline:

1. Discovers SpellBlocks from all apps
2. Finds markdown files in `SPELLBOOK_MD_PATH`
3. Processes SpellBlocks and markdown
4. Generates Django views, URLs, templates
5. Creates sitemaps and navigation

Same as running:
```bash
python manage.py spellbook_md
```

---

## Validate

Check your content for issues.
```
🔍 Validate

  [1] Validate frontmatter (spellbook_validate)
  [2] Find dead links

  [0] ← Back

>
```

### Validate Frontmatter

Checks every markdown file for required metadata.

**Required fields:**

| Field | Type | Example |
|-------|------|---------|
| `title` | string | `"Getting Started"` |
| `published` | date (YYYY-MM-DD) | `2025-12-12` |
| `author` | string | `"Jane Doe"` |
| `tags` | list (≥1 item) | `["guide", "setup"]` |

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

Run interactive fix? (y/n):
```

**Interactive fix mode:**

When issues are found, you can fix them one by one:
```
Fixing: docs/getting-started.md

Missing: author
Enter author (or 'skip'): Jane Doe
✓ Added author

tags: must have at least 1 item
Enter tags (comma-separated, or 'skip'): guide, tutorial
✓ Added tags

File updated!
```

**Shortcuts:**
- `today` — inserts current date for `published` field
- `skip` — skip this field, leave unfixed

### Find Dead Links

{~ alert type="warning" ~}
Coming soon. This feature is planned but not yet implemented.
{~~}

Will scan markdown files for broken internal links and missing pages.

---

## Standalone Commands

Every wizard action is also available as a direct command.

### spellbook_validate
```bash
# Audit mode (report only)
python manage.py spellbook_validate

# Interactive fix mode
python manage.py spellbook_validate --fix

# Specific directory
python manage.py spellbook_validate --source-path /path/to/content
```

### spellbook_md
```bash
python manage.py spellbook_md
```

---

## When to Use the Wizard

{~ card title="Use the Wizard When..." ~}
- You're new to Spellbook
- You forget command names or flags
- You want guided validation with fixes
- You prefer menus over typing commands
{~~}

{~ card title="Use Direct Commands When..." ~}
- You're in a CI/CD pipeline
- You're scripting deployments
- You know exactly what you need
- Speed matters more than guidance
{~~}

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0` | Back / Exit |
| `Ctrl+C` | Exit immediately |
| Number | Select menu option |
| `Enter` | Confirm selection |

---

## Next Steps

{~ accordion title="spellbook_md Command" ~}
Full reference for the markdown processing command.

[View spellbook_md →](/docs/commands/spellbook-md/)
{~~}

{~ accordion title="Configuration" ~}
Settings that control how Spellbook processes your content.

[View Configuration →](/docs/configuration/)
{~~}

{~ accordion title="Frontmatter Reference" ~}
All available frontmatter fields and their effects.

[View Frontmatter →](/docs/frontmatter/)
{~~}