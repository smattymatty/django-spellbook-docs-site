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

Converts a TOC url path to a proper Django URL. This is useful for generating navigation links that work with Django's URL system.

**Syntax**:
```django
{% verbatim %}
{% spellbook_url 'path/to/page' %}
{% endverbatim %}
```

**Examples**:

```django
{% verbatim %}
<a href="{% spellbook_url 'docs/getting-started' %}">Getting Started</a>
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

## Customizing Template Tags

If you want to customize how these template tags render, you can override their templates:

1. Create a directory in your app's templates: `templates/django_spellbook/tocs/` or `templates/django_spellbook/data/`
2. Copy the original templates from the Django Spellbook package
3. Modify the templates to suit your needs

{~ practice difficulty="Beginner" timeframe="10 minutes" focus="Template Integration" ~}
### Practice: Add Spellbook Styles to Your Base Template

1. Open your base template file
2. Load the spellbook template tags: `{% verbatim %}{% load spellbook_tags %}{% endverbatim %}`
3. Add the styles to your `<head>` section: `{% verbatim %}{% spellbook_styles %}{% endverbatim %}`
4. Test your template to see the Spellbook styles applied to your markdown content
{~~}

## Example: Complete Sidebar Template

Here's an example of how to use these template tags in a sidebar template:

```django
{% verbatim %}
{% load spellbook_tags %}

<!DOCTYPE html>
<html>
<head>
    <title>{{ page_title }}</title>
    {% spellbook_styles %}
</head>
<body>
    <div class="sidebar">
        {% sidebar_toc %}
    </div>
    <div class="content">
        <h1>{% dash_strip page_title %}</h1>
        {% show_metadata %}
        
        {% block content %}{% endblock %}
    </div>
</body>
</html>
{% endverbatim %}
```

{~ quote author="Django Documentation" source="Template Tags and Filters" ~}
Custom template tags are a powerful way to extend Django's template language, allowing you to define your own functionality beyond what's included with the built-in tag library.
{~~}

{% a href="/docs/Templatetags/custom" .super-link %}
Read Next: Creating Custom Template Tags
{% enda %}