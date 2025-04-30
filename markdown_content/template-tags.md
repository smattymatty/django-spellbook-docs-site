# Template Tags

Django Spellbook includes several useful template tags to enhance your templates with markdown-specific features. These tags help with presenting table of contents, metadata, styling, and URL handling for your markdown-generated content.

## Loading the Template Tags

To use these template tags, you need to load them at the top of your Django template:

```django
{% verbatim %}
{% load spellbook_tags %}
{% endverbatim %}
```

## Available Template Tags

### sidebar_toc

Generates a structured table of contents based on your markdown content hierarchy for display in a sidebar.

**Syntax**:
```django
{% verbatim %}
{% sidebar_toc %}
{% endverbatim %}
```

{~ alert type="info" ~}
This tag requires a `toc` variable in the template context. The Django Spellbook views automatically provide this when using the built-in base templates.
{~~}

When rendered, this tag produces a hierarchical navigation menu based on your markdown files directory structure.

### spellbook_styles

Includes the Spellbook's default styles in your template. These styles ensure proper rendering of SpellBlocks, code highlighting, and other markdown-specific features.

**Syntax**:
```django
{% verbatim %}
{% spellbook_styles %}
{% endverbatim %}
```

{~ card title="Best Practice" ~}
Include this tag in your base template's `<head>` section to ensure consistent styling across all your markdown-rendered pages.
{~~}

### spellbook_url

Does what Django's built-in `url` tag does, but for markdown-generated content.

{~ alert type="info" ~}
`blog/tech/first-blog-post` will be converted to `blog:tech_first-blog-post` before being passed to the `url` of the generated context of each markdown file. `/` will be replaced with `_` and all dashes will remain.
{~~}

**Syntax**:
```django
{% verbatim %}
{% spellbook_url 'docs:folder_first-page' %}
{% endverbatim %}
```

**Examples**:

```django
{% verbatim %}
<a href="{% spellbook_url 'tutorials:beginner_getting-started' %}">Getting Started</a> <
{% endverbatim %}
```

If the URL can't be reversed, it will return the original path.

### dash_strip

Removes leading dashes from a string. This is particularly useful for cleaning up file names when displaying them as titles or navigation items.

**Syntax**:
```django
{% verbatim %}
{% dash_strip string %}
{% endverbatim %}
```

**Examples**:

```django
{% verbatim %}
<h1>{% dash_strip "---introduction" %}</h1>
<!-- Renders as: <h1>introduction</h1> -->
{% endverbatim %}
```

### show_metadata

Displays metadata in a formatted way. This tag is designed to present page metadata such as author, date, tags, etc.

1. User-Facing Metadata:

```django
{% verbatim %}
{% load spellbook_tags %}
{% show_metadata %}
{% endverbatim %}
```

You can include this tag in your spellbook base template to display metadata for the current page. This page contains the following metadata:

- **Title** {{ metadata.title }}
- **Created** At {{ metadata.created_at }}
- **Tags** {{ metadata.tags }}
- **Custom** **Meta** {{ metadata.custom_meta }}
- **Word** **Count** {{ metadata.word_count }}
- **Reading** **Time** {{ metadata.reading_time_minutes }}
- **Prev** **Page** {{ metadata.prev_page }} *(optional)*
- **Next** **Page** {{ metadata.next_page }} *(optional)*

TODO: Add an author field to the metadata and update the defeault metadata template to display it.

2. Developer-Facing Metadata:

```django
{% verbatim %}
{% load spellbook_tags %}
{% if user.is_authenticated and user.is_staff %}
    {% show_metadata 'for_dev' %}
{% endif %}
{% endverbatim %}
```

You can include this tag in your spellbook base template to display metadata for the current page.

This page contains the following metadata:

- URL {{ metadata.url_path }}

TODO: Add more fields that developers can use to debug and troubleshoot their content.

Features:

- Automatic date tracking (created)

- Reading time estimates

- Content navigation links

- Custom key-value pairs

- Responsive grid layout

