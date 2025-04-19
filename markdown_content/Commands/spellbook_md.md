## python manage.py spellbook_md

This command will take your directory full of markdown files (or nested directories) and transform them into dynamic HTML templates. It then generates views, URLs, and navigation based on your content's file structure.

### Command Usage

```bash
python manage.py spellbook_md
```

Options:

- `--continue-on-error`: Continue processing files even if some fail

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

#### **Optional Settings**

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
```

With this configuration:

- Markdown files from `docs_content` are processed to `docs_app` and accessible at `/docs/`
- Markdown files from `blog_content` are processed to `blog_app` and accessible at `/blog/`
- Each app maintains its own set of templates, views, and URLs

If URL prefixes aren't specified, the default behavior is:

- First app gets empty prefix (root URL)
- Subsequent apps use their app name as the prefix

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

### Command Process

When you run the command, it:

1. Discovers all markdown files in your configured directories
2. Processes them with Spellbook's enhanced markdown parser
3. Generates templates in each destination app
4. Creates view functions for each processed file
5. Sets up URL patterns based on file paths and configured prefixes
6. Builds navigation tables of contents for each source

{% div .sb-p-4 .sb-mb-4 %}
{% a href="/docs/Markdown/introduction" .super-link %}
Read Next: Markdown Module Introduction
{% enda %}
{% enddiv %}

{~ practice difficulty="Beginner" timeframe="15-20 minutes" impact="High" focus="Command Usage" ~}
### Command Practice Challenge

Try these exercises to master the `spellbook_md` command:

1. **Basic Command Usage**:

   - Create a simple markdown file with a heading and some content
   - Configure the required settings in your project
   - Run the command and verify the file was processed successfully
   - View the generated template, view function, and URL pattern


2. **URL Prefix Configuration**:

   - Configure a custom URL prefix for your content
   - Run the command again and verify your content is accessible at the new URL
   - Try changing the URL prefix and observe how the URLs are updated

3. **Multi-Source Setup**:

   - Create a second directory with markdown files
   - Configure settings for multiple source-destination pairs
   - Run the command and verify both sources are processed correctly
   - Check that the content is accessible at the expected URLs

**Bonus**: Try the `--continue-on-error` flag with some intentionally malformed markdown files to see how the command handles errors.
{~~}
