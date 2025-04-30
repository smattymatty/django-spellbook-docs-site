# Base Templates in Django Spellbook

{~ alert type="info" ~}
This guide explains how to use base templates with Django Spellbook to create consistent layouts for your markdown-rendered content.
{~~}

## What Are Base Templates?

Base templates in Django Spellbook allow you to wrap your markdown-rendered content within a consistent layout structure. This is especially useful for:

- Adding navigation, headers, and footers
- Including site-wide styles and scripts
- Creating a consistent look and feel across all content
- Integrating your markdown content with your main site design

{~ card title="Key Benefit" ~}
With base templates, your markdown content can seamlessly integrate with the rest of your Django application's design, while maintaining the simplicity of markdown authoring.
{~~}

## Setting Up Your Base Template

### Step 1: Create the Base Template File

First, create a template file in your app's templates directory. For example, if your app is named `my_app`, create `my_app/templates/my_app/sb_base.html`:

```django
{% verbatim %}
{% extends 'base.html' %}
{% load static %}
{% load spellbook_tags %}

{% block title %}{{ metadata.title|default:"Documentation" }} - My Site{% endblock %}

{% block content %}
  <div class="documentation-layout">
    <!-- Optional sidebar navigation -->
    <aside class="sidebar">
      <!-- Your site navigation here -->
    </aside>
    
    <!-- Spellbook content will be placed inside this block -->
    <main class="spellbook-content">
      {% show_metadata %}
      <div class="spellbook-md">
        {% block spellbook_md %}{% endblock %}
      </div>
    </main>
  </div>
{% endblock %}

{% block extra_css %}
  {% spellbook_styles %}
  <link rel="stylesheet" href="{% static 'my_app/css/documentation.css' %}">
{% endblock %}
{% endverbatim %}
```

{~ alert type="warning" ~}
Your base template **must** include a block named `spellbook_md`. This is where Django Spellbook will insert the rendered markdown content.
{~~}

### Step 2: Configure Spellbook to Use Your Base Template

In your `settings.py` file, set the `SPELLBOOK_MD_BASE_TEMPLATE` setting to point to your base template:

```python
# Single source configuration
SPELLBOOK_MD_PATH = BASE_DIR / 'markdown_files'
SPELLBOOK_MD_APP = 'my_app'
SPELLBOOK_MD_BASE_TEMPLATE = 'my_app/sb_base.html'
```

If you have multiple source-destination pairs, you can specify different base templates for each:

```python
# Multiple source-destination pairs with different base templates
SPELLBOOK_MD_PATH = [
    BASE_DIR / "docs_content",
    BASE_DIR / "blog_content"
]
SPELLBOOK_MD_APP = [
    "docs_app",
    "blog_app"
]
SPELLBOOK_MD_BASE_TEMPLATE = [
    "docs_app/docs_base.html",
    "blog_app/blog_base.html"
]
```

Alternatively, you can share a single base template across all sources:

```python
# Multiple source-destination pairs with a shared base template
SPELLBOOK_MD_PATH = [
    BASE_DIR / "docs_content",
    BASE_DIR / "blog_content"
]
SPELLBOOK_MD_APP = [
    "docs_app",
    "blog_app"
]
SPELLBOOK_MD_BASE_TEMPLATE = "shared/common_base.html"  # Used for all sources
```

### Step 3: Run the Spellbook MD Command

Process your markdown files to apply the base template:

```bash
python manage.py spellbook_md
```

Your markdown content will now be wrapped within your base template when rendered.

## Accessing Metadata in Base Templates

One of the powerful features of base templates is the ability to access metadata from your markdown files:

{~ accordion title="Available Metadata" ~}
Within your base template, you have access to:

- `metadata.title` - The title from the markdown frontmatter
- `metadata.created_at` - Creation date
- `metadata.author` - Content author
- `metadata.tags` - List of tags
- `metadata.custom_meta` - Any custom metadata fields
- `metadata.word_count` - Approximate word count
- `metadata.reading_time_minutes` - Estimated reading time
- `metadata.prev_page` / `metadata.next_page` - Navigation links (if available)

This allows you to dynamically customize your template based on the content.
{~~}

### Example: Using Metadata for SEO

```django
{% verbatim %}
{% block meta_tags %}
  <meta name="description" content="{{ metadata.custom_meta.description|default:'Documentation page' }}">
  {% if metadata.tags %}
    <meta name="keywords" content="{{ metadata.tags|join:', ' }}">
  {% endif %}
  <meta name="author" content="{{ metadata.author|default:'Site Author' }}">
  {% if metadata.created_at %}
    <meta property="article:published_time" content="{{ metadata.created_at|date:'c' }}">
  {% endif %}
{% endblock %}
{% endverbatim %}
```

## Including Navigational Elements

Your base template is an excellent place to add navigation based on the current content:

TODO: Add prev_page and next_page metadata

```django
{% verbatim %}
<nav class="content-navigation">
  {% if metadata.prev_page %}
    <a href="{{ metadata.prev_page.url }}" class="prev-link">
      &larr; {{ metadata.prev_page.title }}
    </a>
  {% endif %}
  
  {% if metadata.next_page %}
    <a href="{{ metadata.next_page.url }}" class="next-link">
      {{ metadata.next_page.title }} &rarr;
    </a>
  {% endif %}
</nav>
{% endverbatim %}
```

## Dynamic Content Based on Tags

You can conditionally show elements based on metadata:

```django
{% verbatim %}
{% if 'advanced' in metadata.tags %}
  <div class="advanced-notice">
    This is advanced content that assumes prior knowledge.
  </div>
{% endif %}

{% if metadata.custom_meta.difficulty == 'beginner' %}
  <div class="beginner-resources">
    <h3>Helpful Resources for Beginners</h3>
    <!-- Resources list -->
  </div>
{% endif %}
{% endverbatim %}
```

## Styling Your Base Template

### Including Spellbook Styles

Always include the Spellbook styles in your base template:

```django
{% verbatim %}
{% load spellbook_tags %}
{% spellbook_styles %}
{% endverbatim %}
```

This ensures that all SpellBlock components render correctly.

## Troubleshooting Base Templates

{~ accordion title="Template Not Applied" ~}
If your base template isn't being applied:

1. Verify the path is correct in `SPELLBOOK_MD_BASE_TEMPLATE`
2. Ensure the template file exists at the specified location
3. Check that your template includes the `% block spellbook_md % / % endblock %` block
4. Run `python manage.py spellbook_md` again to reprocess the files
{~~}

{~ accordion title="Missing Styles" ~}
If your SpellBlocks aren't styled correctly:

1. Make sure you've included `% spellbook_styles %` in your template
2. Check that the template is extending the correct base template
3. Verify CSS paths are correct if you're including custom styles
{~~}

{~ accordion title="Metadata Not Available" ~}
If metadata isn't available in your template:

1. Verify your markdown files include proper YAML frontmatter
2. Check that frontmatter is enclosed in triple-dashes (`---`)
3. Ensure key names follow the expected format
{~~}

## Advanced Base Template Techniques

### Different Templates Based on Content

You can create logic to use different layouts based on content metadata:

```django
{% verbatim %}
{% if 'landing' in metadata.tags %}
  {% include "my_app/landing_layout.html" %}
{% elif 'tutorial' in metadata.tags %}
  {% include "my_app/tutorial_layout.html" %}
{% else %}
  {% include "my_app/default_layout.html" %}
{% endif %}
{% endverbatim %}
```
{~ alert type="success" ~}
With base templates, you can transform simple markdown content into fully-featured, interactive documentation pages that seamlessly integrate with your site design.
{~~}

## Conclusion

Base templates are a powerful feature that bridges the simplicity of markdown authoring with the flexibility of Django's template system. By setting up a well-designed base template, you can ensure consistent presentation across all your documentation while still maintaining the ease of markdown-based content creation.

{~ quote author="Django Spellbook Team" ~}
The best documentation systems combine simplicity of authoring with richness of presentation. Base templates allow you to achieve both.
{~~}

{% a href="/docs/Markdown/navigation" .super-link %}
Read Next: Markdown Module Navigation
{% enda %}

{~ practice difficulty="Beginner" timeframe="30 minutes" impact="High" focus="Template Design" ~}
### Base Template Exercise

**Steps:**
1. Create a simple base template with:

   - A consistent header with site navigation
   - A sidebar for documentation navigation
   - The required `spellbook_md` block
   - Footer with site information

2. Configure your `settings.py` to use this template
3. Process your markdown files with `python manage.py spellbook_md`
4. View your rendered content to verify the template is applied correctly

**Benefits:**

- Learn how to structure a base template
- Practice integrating markdown content with site design
- Understand how metadata is passed to templates
{~~}