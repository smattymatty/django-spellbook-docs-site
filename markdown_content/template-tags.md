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

**Syntax**:
```django
{% verbatim %}
{% show_metadata %}
{% endverbatim %}
```

{~ alert type="warning" ~}
This tag's implementation is currently a placeholder. Check the documentation for updates in future releases for full functionality.
{~~}
