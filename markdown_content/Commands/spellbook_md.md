## python manage.py spellbook_md

This command will take your directory full of markdown files (or nested directories) and transform them into dynamic HTML templates. Then, it will generate views, URLs, and Navigation based on your content's file structure.

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

- The default of `SPELLBOOK_MD_BASE_TEMPLATE` is `None`, which will simply just show the rendered markdown content. This built-in base template includes a few styles, and a sidebar with a navigation menu based on your `SPELLBOOK_MD_PATH` directory structure.
- The source for the built-in base template is available [here](https://github.com/smattymatty/django_spellbook/blob/main/django_spellbook/templates/django_spellbook/bases/sidebar_left.html). You can override this template by specifying a different path in your settings. You can read more about customising the base template [here](#).

#### **Optional Settings**

```python
SPELLBOOK_MD_TITLEFY = True
```

- The default of `SPELLBOOK_MD_TITLEFY` is `True`. This will ensure the title of your markdown files are capitalized and converts dashes to spaces.

### Multi-Source Configuration

Django Spellbook supports processing multiple source directories to different destination apps. This is useful for organizing content across different sections of your site.

#### **Multiple Source-Destination Pairs**

```python
# For multiple source configuration
SPELLBOOK_MD_PATH = [
    BASE_DIR / "docs_content",
    BASE_DIR / "blog_content"
]
SPELLBOOK_MD_APP = [
    "docs_app",
    "blog_app"
]
```

With this configuration:

- Markdown files from `docs_content` will be processed to the `docs_app`
- Markdown files from `blog_content` will be processed to the `blog_app`
- Each app will have its own independent set of templates, views, and URLs

#### **Accessing Multi-Source Content**

When using multiple source-destination pairs, include the main URLs module in your project's `urls.py`:

```python
# urls.py
urlpatterns = [
    path('content/', include('django_spellbook.urls')),
]
```

This will make your content available at paths like:

- `/content/docs_app/page-name/`
- `/content/blog_app/post-name/`

Each app's content gets its own URL namespace based on the app name, ensuring no conflicts between content from different sources.

{% a href="/docs/Markdown/introduction" .super-link %}
Read Next: Markdown Module Introduction
{% enda %}