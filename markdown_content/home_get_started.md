---
title: Get Started with Django Spellbook
---

## Get Started in Minutes

Django Spellbook integrates with your project by generating server-side code from markdown content:

```bash
pip install django-spellbook
```

Configure with these essential settings:

```python
INSTALLED_APPS = [
    'django_spellbook',
    'my_app',  # for SPELLBOOK_MD_APP
]

# Necessary for markdown parsing
SPELLBOOK_MD_PATH = BASE_DIR / 'markdown_files'
SPELLBOOK_MD_APP = 'my_app'

# Optional for markdown parsing - customize your base template
SPELLBOOK_MD_BASE_TEMPLATE = 'django_spellbook/bases/base_sidebar_left.html'
```

### Quick Setup Steps

1. **Install the package** using pip
2. **Add to INSTALLED_APPS** in your Django settings
3. **Configure paths** for your markdown content
4. **Run the command** to generate views and templates:
   ```bash
   python manage.py spellbook_md
   ```
5. **Start writing** magical markdown with SpellBlocks!

{~ alert type="success" ~}
**Pro Tip:** Check out our [Quick Start Guide](/docs/Markdown/quick-start/) for a complete walkthrough with examples!
{~~}