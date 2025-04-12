## Markdown Parsing and Rendering

Django Spellbook's markdown processor offers a more flexible and Django-like approach to markdown parsing by extending traditional markdown syntax with Django template-like tags and 'SpellBlocks' of reusable content components.

### Why Use Spellbook's Markdown Parser?

This parser goes beyond the standard markdown syntax by including Django-inspired tags directly in your markdown files. This allows for more structured and semantic HTML, especially useful for projects that need finer control over styling and element attributes, like setting classes or IDs directly in markdown. This means you can write markdown that integrates more seamlessly with your Django templates.

### Example: Add Structured HTML Elements Directly in Markdown

```markdown
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

### Example: SpellBlocks, re-usable Content Components

Spellblocks are reusable content components that can be embedded directly in your markdown content. They provide a powerful way to create rich, interactive content while maintaining the simplicity of markdown syntax.

```markdown
{~ alert type="warning" ~}
Warning: This is an important notice!
{~~}
```

{~ alert type="warning" ~}
Warning: This is an important notice!
{~~}

{~ alert type="info" ~}
Be sure to include the `% spellbook_styles %` tag in your base template if you want to use the built-in styles.
{~~}


```markdown
{~ card title="Quick Start" footer="Updated: Today" ~}
1. Install the package
2. Add to `INSTALLED_APPS`
3. Start writing magical markdown!
{~~}
```

{~ card title="Quick Start" footer="Updated: Today" ~}
1. Install the package
2. Add to `INSTALLED_APPS`
3. Start writing magical markdown!
{~~}

Those are two examples of built-in Spellblocks. You can also create your own custom Spellblocks by extending the `BasicSpellBlock` class and registering them with the `SpellBlockRegistry`. See the [documentation on Spellblocks](/docs/Markdown/spellblocks) for more information.

### Commands

Render your markdown files with: `python manage.py spellbook_md`

This command will process markdown files in the specified directory from `settings.py`, rendering them as HTML and storing them in your app's templates directory. The rendered templates are accessible for further use in Django views, providing seamless markdown-based content management.

Learn more [here](/docs/Commands/spellbook_md).

### Settings

To configure the paths and templates used by Django Spellbook, add the following settings to your settings.py:

- `SPELLBOOK_MD_PATH`: Specifies the path where markdown files are stored.

```python
# settings.py
SPELLBOOK_MD_PATH = BASE_DIR / 'markdown_files'
```

- `SPELLBOOK_MD_APP`: Sets the app where processed markdown files will be saved.

```python
# settings.py
SPELLBOOK_MD_APP = 'my_app'
```

- `SPELLBOOK_MD_BASE_TEMPLATE`: If specified, this base template will wrap all markdown-rendered templates, allowing for consistent styling across your markdown content.

```python
# settings.py
SPELLBOOK_MD_BASE_TEMPLATE = 'my_app/sb_base.html'
```

The base template must have a block named `spellbook_md` that will be used to wrap the rendered markdown content. Here is a basic example of a base template:

```html
{% verbatim %}
<!-- my_app/sb_base.html -->
{% extends 'base.html' %}
<div class="spellbook-md">{% block spellbook_md %} {% endblock %}</div>
{% endverbatim %}
```

#### Multiple Source-Destination Pairs

Django Spellbook now supports processing multiple source directories to different destination apps in a single command:

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
```

With this configuration, markdown files from `docs_content` will be processed to the `docs_app`, and files from `blog_content` will be processed to the `blog_app`. Each app will have its own independent set of templates, views, and URLs.

## Accessing Your Spellbook Markdown Content

After running the markdown processing command, your content will be organized within your specified content app's templates under `templates/spellbook_md/`. These files are created automatically in your app directory based on your `SPELLBOOK_MD_APP` setting.

To make your markdown-rendered pages accessible from the browser, add a path in your main `urls.py`:

```python
# my_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # other paths...
    path('spellbook/', include('django_spellbook.urls')),
    # other includes...
]
```

This setup maps your processed markdown files to URLs prefixed with `/spellbook/`, making it easy to access all converted content as if it were part of your Django app. Each markdown file is available at a route based on its relative path in `SPELLBOOK_MD_PATH`, automatically linking your processed markdown content for seamless browsing.

### How Views and URLs Are Generated

When you run the command, Django Spellbook processes all markdown files in the source directories specified by `SPELLBOOK_MD_PATH`. Here's a step-by-step breakdown of how URLs and views are generated during this process:

1. Parsing Markdown Files:

- Each markdown file is read and converted to HTML using Spellbook's markdown parser, which supports Django-like tags for more flexible styling and layout options.
- During this step, Spellbook builds a `ProcessedFile` object for each markdown file, which includes details like the original file path, the processed HTML, the template path, and a relative URL (derived from the markdown file's path and name).

2. Creating Templates:

- The processed HTML is saved as a template in the corresponding app under `templates/spellbook_md/`. This directory is automatically created if it doesn't already exist.
- If `SPELLBOOK_MD_BASE_TEMPLATE` is set, the generated HTML will be wrapped in an extended base template, allowing you to keep a consistent look across your content.

3. Generating Views:

- For each markdown file, Spellbook generates a corresponding view function, which is responsible for rendering the processed HTML template.
- These view functions are added to `views.py` in the `django_spellbook` app. Each view function is named dynamically based on the file's relative path, ensuring unique view names that align with the file structure.

**Here's an example of a generated view function for a markdown file at** `articles/guide.md`:

```python
# django_spellbook/views.py
def view_articles_guide(request):
    context = {} # Auto Generated Context for things like metadata and TOC
    return render(request, 'my_app/spellbook_md/articles/guide.html')
```

4. Defining URL Patterns:

- For each view function, Spellbook creates a URL pattern that maps the relative URL of the markdown file to its view.
- These URL patterns are written to `urls.py` in the `django_spellbook` app, allowing for centralized management of the markdown routes.
- For example, the markdown file `articles/guide.md` would be available at the URL `spellbook/articles/guide/`, if `spellbook/` is the URL prefix added in your main `urls.py`.

5. Processing Multiple Source-Destination Pairs:

- When multiple source-destination pairs are configured, Spellbook processes each pair sequentially.
- Each destination app receives its own set of templates, views, and URLs for the content from its corresponding source directory.
- This allows you to organize your content into logical groups, each managed by a different app.

6. Accessing the Generated URLs and Views:

- By including `path('spellbook/', include('django_spellbook.urls'))` in your project's main `urls.py`, you make all generated URLs accessible under the `spellbook/` prefix.
- This setup means that each markdown file is automatically served at a unique, human-readable URL based on its path and name.

{% a href="/docs/Markdown/quick-start" .super-link %}
Read Next: Markdown Module Quick Start
{% enda %}