# Understanding Metadata in Django Spellbook

{~ alert type="info" ~}
This guide explains how metadata works in Django Spellbook and demonstrates how to use the new metadata display system introduced in version 0.1.12.
{~~}

## What is Metadata in Django Spellbook?

Metadata in Django Spellbook refers to the information about your content that's defined at the top of your markdown files using YAML frontmatter. This structured data helps organize, categorize, and enhance your content beyond what's in the main body.

```yaml
---
title: Working with Spellbook Metadata
created_at: 2023-11-15
author: Django Spellbook Team
tags:
  - tutorial
  - metadata
  - configuration
custom_meta:
  difficulty: beginner
  category: documentation
---
# Markdown Content Title

**continue** writing your content here
```

## Available Metadata Fields

{~ accordion title="Standard Metadata Fields" open=true ~}
Django Spellbook processes the following standard metadata fields:

TODO: Add author field to the metadata and update the default metadata template to display it.

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Document title | `"Working with Metadata"` |
| `created_at` | Creation date | `2023-11-15` |
| `author` | Content author | `"Django Spellbook Team"` |
| `tags` | Content categories (list) | `["tutorial", "metadata"]` |
| `custom_meta` | Custom key-value pairs | `{"difficulty": "beginner"}` |
{~~}

{~ accordion title="Auto-Generated Metadata" ~}
In addition to the metadata you define explicitly, Django Spellbook automatically generates:

TODO: Add automatic prev_page and next_page metadata

| Field | Description |
|-------|-------------|
| `word_count` | Total words in the document |
| `reading_time_minutes` | Estimated reading time |
| `url_path` | URL path to the current page |
| `prev_page` | Link to previous page (if available) |
| `next_page` | Link to next page (if available) |
{~~}

## Displaying Metadata in Templates

Django Spellbook 0.1.12 introduces a powerful template tag that makes it easy to display metadata in your templates.

### User-Facing Metadata Display

The `% show_metadata %` tag renders a clean, user-friendly view of your content's metadata:

```django
{% verbatim %}
{% load spellbook_tags %}
{% show_metadata %}
{% endverbatim %}
```

{~ alert type="success" ~}
When included in your template, this renders metadata like title, creation date, tags, and reading time in a responsive, styled format that your readers will see.
{~~}

### Developer Metadata Display

For debugging and development purposes, you can display technical metadata:

```django
{% verbatim %}
{% load spellbook_tags %}
{% show_metadata 'for_dev' %}
{% endverbatim %}
```

{~ alert type="warning" ~}
It's recommended to only show developer metadata to authenticated staff users:
{~~}

```django
{% verbatim %}
{% if user.is_authenticated and user.is_staff %}
    {% show_metadata 'for_dev' %}
{% endif %}
{% endverbatim %}
```

## Using Metadata in Your Content

Beyond just displaying metadata, you can leverage it throughout your templates and content.

All metadata is available in your templates through the `metadata` context variable:

```django
{% verbatim %}
<h1>{{ metadata.title }}</h1>
<p>Published on: {{ metadata.created_at }}</p>

{% if metadata.tags %}
<div class="tags">
    {% for tag in metadata.tags %}
        <span class="tag">{{ tag }}</span>
    {% endfor %}
</div>
{% endif %}

<div class="reading-info">
    {{ metadata.word_count }} words 
    (approximately {{ metadata.reading_time_minutes }} minute read)
</div>
{% endverbatim %}
```

The automatic `prev_page` and `next_page` metadata enables easy content navigation:

TODO: Add prev_page and next_page metadata

```django
{% verbatim %}
<div class="navigation">
    {% if metadata.prev_page %}
        <a href="{{ metadata.prev_page.url }}" class="prev">
            &larr; Previous: {{ metadata.prev_page.title }}
        </a>
    {% endif %}
    
    {% if metadata.next_page %}
        <a href="{{ metadata.next_page.url }}" class="next">
            Next: {{ metadata.next_page.title }} &rarr;
        </a>
    {% endif %}
</div>
{% endverbatim %}
```

## Custom Metadata Applications

You can use custom metadata for dynamic content features:

```django
{% verbatim %}
{% if metadata.custom_meta.difficulty %}
    <div class="difficulty-badge 
                difficulty-{{ metadata.custom_meta.difficulty }}">
        {{ metadata.custom_meta.difficulty|title }} Level
    </div>
{% endif %}
{% endverbatim %}
```



## Best Practices for Metadata

1. **Be consistent** with your metadata structure across all content
2. **Use clear naming conventions** for custom metadata fields
3. **Keep titles concise** but descriptive
4. **Use ISO date format** (YYYY-MM-DD) for dates
5. **Choose specific tags** that help with content organization

{~ alert type="info" ~}
Remember that metadata isn't just for display—it can be used by search engines, content indexes, and programmatic content management.
{~~}

{~ practice difficulty="Intermediate" timeframe="15 minutes" impact="High" focus="Content Organization" ~}
### Enhanced Metadata Exercise

**Steps:**
1. Choose an existing markdown file in your project
2. Add or expand the metadata section with:
   - A descriptive title
   - Creation date
   - At least 3 relevant tags
   - 2-3 custom metadata fields
3. Update your base template to display this metadata
4. Explore how different metadata values affect the presentation

**Objective:**
Build a consistent metadata strategy for your content that improves both the user experience and your content management workflow.
{~~}

## Conclusion

Effective use of metadata transforms static content into a rich, interconnected information system. With Django Spellbook's metadata features, you can create more organized, navigable, and contextual content experiences for your users while simplifying your own content management.

{~ quote author="The Django Spellbook Team" ~}
Good metadata doesn't just describe your content—it extends and enhances it.
{~~}

{% a href="/docs/Markdown/navigation" .super-link %}
Read Next: Markdown Module Navigation
{% enda %}