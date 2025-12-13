---
title: spellbook_validate
published: 2025-12-12
modified: 2025-12-12
tags:
  - commands
  - validation
  - cli
  - reference
---

Validate frontmatter in your markdown files. Find issues before they cause problems.
```bash
python manage.py spellbook_validate
```

---

## Quick Start

**Audit mode** (report issues, no changes):
```bash
python manage.py spellbook_validate
```

**Fix mode** (interactively repair issues):
```bash
python manage.py spellbook_validate --fix
```

---

## Options

| Option | Description |
|--------|-------------|
| `--fix` | Enable interactive fix mode |
| `--source-path PATH` | Override source path from settings |

### --fix

Walk through each issue and fix it interactively:
```bash
python manage.py spellbook_validate --fix
```

For each issue, you'll be prompted to enter a value or skip.

### --source-path

Validate a specific directory instead of using `SPELLBOOK_MD_PATH`:
```bash
python manage.py spellbook_validate --source-path /path/to/content
```

Useful for testing specific directories or validating content outside your main config.

---

## What It Validates

| Field | Requirement |
|-------|-------------|
| `title` | Required, non-empty string |
| `published` | Required, valid date (YYYY-MM-DD) |
| `author` | Required, non-empty string |
| `tags` | Required, list with at least 1 item |

### Valid Frontmatter
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

### Invalid Frontmatter
```yaml
---
title: My Page
published: Dec 2025      # ❌ Wrong format
# author: missing        # ❌ Required
tags: tutorial           # ❌ Must be a list
---
```

---

## Example Output

### Audit Mode
```
Validating: /home/user/project/docs

────────────────────────────────────────────────────────────

🔍 Validation Results

❌ docs/getting-started.md
   • Missing: author
   • tags: must have at least 1 item

❌ docs/api-reference.md
   • Missing: title

❌ blog/old-post.md
   • published: invalid date format "Dec 2025" (expected YYYY-MM-DD)

────────────────────────────────────────────────────────────
⚠️  3 pages with issues
✅ 42 pages valid

Run with --fix to interactively repair issues:
  python manage.py spellbook_validate --fix
```

### Fix Mode
```
────────────────────────────────────────────────────────────
🔧 Interactive Fix Mode

📄 getting-started.md

   Missing: author
   Enter author (or 'skip'): Jane Doe
   ✓ Added author

   tags: must have at least 1 item
   Enter tags (comma-separated, or 'skip'): guide, quickstart
   ✓ Added tags

   ✅ Updated getting-started.md

📄 api-reference.md

   Missing: title
   Enter title (or 'skip'): API Reference
   ✓ Added title

   ✅ Updated api-reference.md

────────────────────────────────────────────────────────────
✅ Fixed 2 pages
⏭️  Skipped 1 page
```

---

## Interactive Shortcuts

When prompted for input in fix mode:

| Input | Action |
|-------|--------|
| `skip` | Skip this field, leave unfixed |
| `today` | Insert current date (for `published` field) |
| Value | Use the entered value |

### Examples
```
Enter published (YYYY-MM-DD / 'today' / 'skip'): today
✓ Added published: 2025-12-12

Enter tags (comma-separated / 'skip'): guide, tutorial, setup
✓ Added tags

Enter author (or 'skip'): skip
Skipped
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success (all files valid or fixes applied) |
| 1 | Configuration error |

---

## Via Wizard

You can also run validation through the interactive wizard:
```bash
python manage.py spellbook_wizard
```
```
Spellbook Wizard

  [1] Batch process
  [2] Validate

  [0] Exit

> 2

🔍 Validate

  [1] Validate frontmatter (spellbook_validate)
  [2] Find dead links

  [0] ← Back

> 1
```

The wizard automatically prompts for interactive fixes when issues are found.

---

## Use Cases

### CI/CD Pipeline

Add validation to your deployment pipeline:
```bash
python manage.py spellbook_validate
if [ $? -ne 0 ]; then
    echo "Frontmatter validation failed"
    exit 1
fi
```

### Pre-commit Hook

Validate before committing:
```bash
#!/bin/bash
# .git/hooks/pre-commit
python manage.py spellbook_validate --source-path docs/
```

### Batch Fix New Content

After importing content from another system:
```bash
python manage.py spellbook_validate --fix --source-path imports/
```

---

## Troubleshooting

### "Please check your Django settings.py file"

Your `SPELLBOOK_MD_PATH` or `SPELLBOOK_MD_APP` settings are missing or invalid.
```python
# settings.py
SPELLBOOK_MD_PATH = 'content/'
SPELLBOOK_MD_APP = 'myapp'
```

### Date format errors

Dates must be in `YYYY-MM-DD` format:
```yaml
# ❌ Wrong
published: Dec 12, 2025
published: 12/12/2025
published: 2025/12/12

# ✅ Correct
published: 2025-12-12
```

### Tags must be a list

Even for a single tag, use list syntax:
```yaml
# ❌ Wrong
tags: tutorial

# ✅ Correct
tags:
  - tutorial
```

---

## Related Commands

{~ accordion title="spellbook_md" ~}
Process markdown files into Django views and templates.

[View spellbook_md →](/docs/commands/spellbook-md/)
{~~}

{~ accordion title="spellbook_wizard" ~}
Interactive menu for all Spellbook commands.

[View Wizard →](/docs/commands/spellbook-wizard/)
{~~}

---

## Next Steps

{~ accordion title="Frontmatter Reference" ~}
All available frontmatter fields and their effects.

[View Frontmatter →](/docs/frontmatter/)
{~~}

{~ accordion title="Configuration" ~}
Full settings reference for Spellbook.

[View Configuration →](/docs/configuration/)
{~~}