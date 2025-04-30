## python manage.py spellbook_md

This command will take your directory full of markdown files (or nested directories) and transform them into dynamic HTML templates. It then generates views, URLs, and navigation based on your content's file structure.

### Command Usage

```bash
python manage.py spellbook_md
```

Options:

- `--continue-on-error`: Continue processing files even if some fail
- `--report-level`: Level of detail in the report (`minimal`, `detailed`, or `debug`) [default: `detailed`]
- `--report-format`: Format of the report (`text`, `json`, or `none` to suppress) [default: `text`]
- `--report-output`: File path to save the report (default: print to stdout)

### Basic Configuration

#### **Required Settings**

```python
SPELLBOOK_MD_PATH = BASE_DIR / "markdown_content"
SPELLBOOK_MD_APP = "my_app"
```

#### **Recommended Settings**

```python
SPELLBOOK_MD_BASE_TEMPLATE = 'django_spellbook/bases/sidebar_left.html'
```

- `SPELLBOOK_MD_BASE_TEMPLATE` (default: `None`): Specifies a template that will wrap all rendered markdown content. The default `None` simply shows the rendered markdown without additional styling.
- The built-in `sidebar_left.html` template includes styling and a navigation menu based on your content structure. You can [view the source here](https://github.com/smattymatty/django_spellbook/blob/main/django_spellbook/templates/django_spellbook/bases/sidebar_left.html).


```python
SPELLBOOK_MD_TITLEFY = True  # Default: True
```

- When `True`, capitalizes first letters of words in titles and converts dashes to spaces

### URL Configuration

#### **URL Prefix Setting**

```python
SPELLBOOK_MD_URL_PREFIX = "docs"  # Content will be at /docs/
```

- This setting determines the URL prefix for accessing your markdown content
- If not specified, content will be available at the root URL

### Template Configuration

#### **Base Template Setting**

```python
# Single base template for all content
SPELLBOOK_MD_BASE_TEMPLATE = 'my_app/custom_base.html'
```

- This setting determines the base template used to wrap your markdown content
- If not specified, content will be rendered without a wrapping template

#### **Multiple Base Templates**

For multi-source configurations, you can specify different base templates for each source:

```python
# Different templates for different sources
SPELLBOOK_MD_PATH = [BASE_DIR / "docs", BASE_DIR / "blog"]
SPELLBOOK_MD_APP = ["docs_app", "blog_app"]
SPELLBOOK_MD_BASE_TEMPLATE = ["docs/base.html", "blog/base.html"]
```

- Each source will use its corresponding base template
- The number of templates should match the number of sources
- If a single template is provided for multiple sources, it will be applied to all of them

### Multi-Source Configuration

Django Spellbook supports processing multiple source directories to different destination apps:

```python
# Multiple source configuration
SPELLBOOK_MD_PATH = [
    BASE_DIR / "docs_content",
    BASE_DIR / "blog_content"
]
SPELLBOOK_MD_APP = [
    "docs_app",
    "blog_app"
]
SPELLBOOK_MD_URL_PREFIX = [
    "docs",   # Content at /docs/
    "blog"    # Content at /blog/
]
SPELLBOOK_MD_BASE_TEMPLATE = [
    "docs/base.html",   # Custom template for docs
    "blog/base.html"    # Different template for blog
]
```

With this configuration:

- Markdown files from `docs_content` are processed to `docs_app`, accessible at `/docs/`, and use `docs/base.html`
- Markdown files from `blog_content` are processed to `blog_app`, accessible at `/blog/`, and use `blog/base.html`
- Each app maintains its own set of templates, views, and URLs

Default behaviors for multi-source configurations:

- URL Prefixes: First app gets empty prefix (root URL), subsequent apps use their app name
- Base Templates: If not specified, no base template is used; if a single template is provided, it's applied to all sources

### Accessing Your Content

To make your content accessible, include Django Spellbook's URLs in your project's `urls.py`:

```python
# urls.py
urlpatterns = [
    # Mount at the root for best URLs
    path('', include('django_spellbook.urls')),
    # Or use a prefix if needed
    # path('content/', include('django_spellbook.urls')),
]
```

{~ accordion title="Command Process" ~}
When you run the command, it:

1. Discovers all markdown files in your configured directories
2. Processes them with Spellbook's enhanced markdown parser
3. Generates templates in each destination app, using the specified base templates
4. Creates view functions for each processed file
5. Sets up URL patterns based on file paths and configured prefixes
6. Builds navigation tables of contents for each source
{~~}

{% div .sb-p-4 .sb-mb-4 %}
{% a href="/docs/Markdown/introduction" .super-link %}
Read Next: Markdown Module Introduction
{% enda %}
{% enddiv %}