# Markdown Processing with Django Spellbook

Django Spellbook's markdown processor offers a more flexible and Django-like approach to markdown parsing by extending traditional markdown syntax with Django template-like tags and 'SpellBlocks' of reusable content components.

## Why Use Spellbook's Markdown Parser?

This parser goes beyond the standard markdown syntax by including Django-inspired tags directly in your markdown files. This allows for more structured and semantic HTML, especially useful for projects that need finer control over styling and element attributes, like setting classes or IDs directly in markdown. This means you can write markdown that integrates more seamlessly with your Django templates.

## Example: Add Structured HTML Elements Directly in Markdown

```django
{% verbatim %}
{% div .container #main-container data-analytics="true" %}
## Section Title
Content with *markdown* support
{% enddiv %}
{% endverbatim %}
```

Renders to:

```django
<div class="container" id="main-container" data-analytics="true">
  <h2>Section Title</h2>
  <p>Content with <em>markdown</em> support</p>
</div>
```

Paired with powerful libraries like HTMX, this can create dynamic and interactive interfaces that are both visually appealing and highly functional without ever having to leave your markdown files.

## Example: SpellBlocks, re-usable Content Components

Spellblocks are reusable content components that can be embedded directly in your markdown content. They provide a powerful way to create rich, interactive content while maintaining the simplicity of markdown syntax.

{~ alert type="warning" ~}
Warning: This is an important notice!
{~~}

```django
{~ alert type="warning" ~}
Warning: This is an important notice!
{~~}
```

{~ alert type="info" ~}
{% verbatim %}Be sure to include the `% spellbook_styles %` tag in your base template if you want to use the built-in styles.{% endverbatim %}
{~~}

{~ card title="Quick Start" footer="Updated: Today" ~}
1. Install the package
2. Add to `INSTALLED_APPS`
3. Start writing magical markdown!
{~~}

Those are just a few examples of built-in Spellblocks. You can also create your own custom Spellblocks by extending the `BasicSpellBlock` class and registering them with the `SpellBlockRegistry`. See the [documentation on Spellblocks](/docs/Markdown/spellblocks) for more information.

```django
{~ card title="Quick Start" footer="Updated: Today" ~}
1. Install the package
2. Add to `INSTALLED_APPS`
3. Start writing magical markdown!
{~~}
```

## Commands

Render your markdown files with: `python manage.py spellbook_md`

This command will process markdown files in the specified directory from `settings.py`, rendering them as HTML and storing them in your app's templates directory. The rendered templates are accessible for further use in Django views, providing seamless markdown-based content management.

Learn more [here](/docs/Commands/spellbook_md).

## Settings

To configure the paths, templates, and URL prefixes used by Django Spellbook, add the following settings to your settings.py:

### Basic Configuration

```python
# settings.py
SPELLBOOK_MD_PATH = BASE_DIR / 'markdown_files'
SPELLBOOK_MD_APP = 'my_app'
```

- `SPELLBOOK_MD_PATH`: Specifies the path where markdown files are stored.
- `SPELLBOOK_MD_APP`: Sets the app where processed markdown files will be saved.
- `SPELLBOOK_MD_URL_PREFIX`: (Optional) Customizes the URL prefix for your markdown content.
- `SPELLBOOK_MD_BASE_TEMPLATE`: (Optional) Specifies a base template to wrap all markdown-rendered templates.

```python
# settings.py
SPELLBOOK_MD_BASE_TEMPLATE = 'my_app/sb_base.html'
SPELLBOOK_MD_URL_PREFIX = 'content'  # Will be available at /content/
```

The base template must have a block named `spellbook_md` that will be used to wrap the rendered markdown content:

```django
{% verbatim %}
<!-- my_app/sb_base.html -->
{% extends 'base.html' %}
<div class="spellbook-md">{% block spellbook_md %} {% endblock %}</div>
{% endverbatim %}
```

### Multiple Source-Destination Pairs

Django Spellbook supports processing multiple source directories to different destination apps in a single command:

```python
# settings.py

# Multiple source-destination pairs
SPELLBOOK_MD_PATH = [
    BASE_DIR / "docs_content",
    BASE_DIR / "blog_content"
]
SPELLBOOK_MD_APP = [
    "docs_app",
    "blog_app"
]
# Optional custom URL prefixes for each app
SPELLBOOK_MD_URL_PREFIX = [
    "docs",  # Will be available at /docs/
    "blog"   # Will be available at /blog/
]
```

With this configuration:
- Content from `docs_content` will be processed to the `docs_app` and available at `/docs/`
- Content from `blog_content` will be processed to the `blog_app` and available at `/blog/`
- Each app maintains its own set of templates, views, and URLs

### Default URL Prefix Behavior

If `SPELLBOOK_MD_URL_PREFIX` is not specified:

- For single app configurations, the default URL prefix is an empty string (content is available at the root URL).
- For multiple apps, the first app gets an empty URL prefix, and subsequent apps use their app name as the prefix.

```python
# Default behavior with multiple apps (no SPELLBOOK_MD_URL_PREFIX specified)
SPELLBOOK_MD_PATH = [
    BASE_DIR / "docs_content",
    BASE_DIR / "blog_content"
]
SPELLBOOK_MD_APP = [
    "docs_app",
    "blog_app"
]
# Equivalent to:
# SPELLBOOK_MD_URL_PREFIX = ['', 'blog_app']
```

Learn more about settings [here](/docs/settings).

## Accessing Your Spellbook Markdown Content

After running the markdown processing command, your content will be organized within your specified app's templates under `templates/spellbook_md/`. These files are created automatically in your app directory based on your `SPELLBOOK_MD_APP` setting.

To make your markdown-rendered pages accessible from the browser, add a path in your main `urls.py`:

```python
# my_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # other paths...
    path('', include('django_spellbook.urls')),
    # other includes...
]
```

### URL Structure

The URL structure for your content depends on your settings:

#### Single Source Configuration

For a single source configuration:

```python
SPELLBOOK_MD_PATH = BASE_DIR / 'content'
SPELLBOOK_MD_APP = 'my_app'
SPELLBOOK_MD_URL_PREFIX = 'docs'  # Optional
```

Your content will be available at:

- `/docs/page-name/`
- `/docs/folder/sub-page/`

If no URL prefix is specified, content will be available at:

- `/page-name/`
- `/folder/sub-page/`

#### Multiple Source Configuration

When using multiple source-destination pairs:

```python
SPELLBOOK_MD_PATH = [BASE_DIR / 'docs', BASE_DIR / 'blog']
SPELLBOOK_MD_APP = ['docs_app', 'blog_app']
SPELLBOOK_MD_URL_PREFIX = ['documentation', 'articles']  # Optional
# if no URL prefixes are specified, the default behavior applies:
# ['', 'blog_app']
```

Your content will be organized under app-specific prefixes:

- `/documentation/installation/`
- `/articles/first-post/`

If no URL prefixes are specified, the default behavior applies:

- `/installation/`  (First app gets empty root URL)
- `/blog_app/first-post/`  (Subsequent apps use app name as prefix)

## How Views and URLs Are Generated

When you run the command, Django Spellbook processes all markdown files in the configured source directories. The process involves:

1. **Parsing Markdown Files:**

   - Converting markdown to HTML with Spellbook's enhanced parser
   - Creating ProcessedFile objects with metadata and relative URLs

2. **Creating Templates:**

   - Saving processed HTML as templates in each app's templates directory
   - Wrapping content in a base template if SPELLBOOK_MD_BASE_TEMPLATE is specified

3. **Generating Views:**

   - Creating a view function for each markdown file
   - Adding these functions to app-specific view modules

4. **Defining URL Patterns:**

   - Creating URL patterns based on the relative paths of markdown files
   - Organizing patterns under the configured URL prefixes
   - Adding these patterns to app-specific URL modules

5. **Linking Apps to Main URLs:**

   - Including each app's URL module in django_spellbook.urls
   - Using the specified URL prefixes to organize content hierarchically

By including `path('', include('django_spellbook.urls'))` in your project's main `urls.py`, all your content becomes accessible through their respective URL prefixes.

{~ quote author="Django Spellbook Developer" ~}
URL prefixes give you the flexibility to organize your content in a way that makes sense for your project. Whether you need separate sections for documentation, blog posts, or any other content type, Django Spellbook makes it simple to create and maintain a structured information architecture.
{~~}

{~ alert type="info" ~}
Remember: For the cleanest URLs, you can mount Django Spellbook at the root of your site with `path('', include('django_spellbook.urls'))`, letting your content shine without unnecessary path segments.
{~~}

{~ card title="Need Help?" footer="Happy coding with Django Spellbook!" ~}
If you encounter any issues or have questions about URL prefixes or any other aspect of Django Spellbook, please [open an issue](https://github.com/smattymatty/django_spellbook/issues) on GitHub.
{~~}

{% div .sb-p-4 .sb-mb-4 %}
{% a href="/docs/Markdown/quick-start" .super-link %}
Read Next: Markdown Module Quick Start
{% enda %}
{% enddiv %}

{~ practice difficulty="Beginner" timeframe="15-20 minutes" impact="High" focus="URL Configuration" ~}
### URL Prefix Challenge

Try these exercises to practice using Django Spellbook's URL prefix functionality:

1. **Basic Setup**: 

   - Create a Django project with Django Spellbook installed
   - Add a `markdown_files` directory with a few sample .md files
   - Configure Spellbook to process these files and serve them at the URL prefix "docs"
   - Run the command and verify your content is accessible at `/docs/your-file/`

2. **Multiple Sources**:

   - Create a second markdown directory for blog content
   - Configure Spellbook to process both sources to different apps
   - Set up custom URL prefixes for each source
   - Verify that both content types are accessible at their respective URLs

**Bonus**: Create a custom URL pattern using Django's patterns to add a "latest" URL that redirects to your most recent blog post.
{~~}

