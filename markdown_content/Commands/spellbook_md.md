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

### Command Process

When you run the command, it:

1. Discovers all markdown files in your configured directories
2. Processes them with Spellbook's enhanced markdown parser
3. Generates templates in each destination app, using the specified base templates
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

4. **Custom Base Templates**:

   - Create two different base templates with distinct layouts
   - Configure settings to use different templates for different sources
   - Run the command and verify each source uses its assigned template
   - Compare how the same content appears with different base templates

5. **Reporting Options**:

   - Run the command with `--report-level=minimal` to see the condensed output
   - Generate a JSON report with `--report-format=json --report-output=report.json`
   - Examine the JSON structure and how it differs from the text output
   - Try the debug level to see the additional information provided for troubleshooting


### Reporting Options

The `spellbook_md` command includes flexible reporting options to customize the output for different use cases:

#### Report Levels

Control the amount of information included in the report:

- `--report-level=minimal`: Only show a high-level summary of processing results
- `--report-level=detailed`: Include detailed information about each file (default)
- `--report-level=debug`: Include additional diagnostic information for troubleshooting

#### Report Formats

Choose how the report information is presented:

- `--report-format=text`: Human-readable text output (default)
- `--report-format=json`: Machine-readable JSON format for use in scripts or CI pipelines
- `--report-format=none`: Suppress the report entirely

#### Report Output

Direct the report to a file instead of standard output:

- `--report-output=path/to/file.txt`: Save the report to the specified file
- `--report-output=path/to/file.json`: Useful when combined with `--report-format=json`

#### Examples

```bash
# Get minimal output for CI pipelines
python manage.py spellbook_md --report-level=minimal

# Save a detailed JSON report to a file
python manage.py spellbook_md --report-format=json --report-output=report.json

# Run quietly with no report
python manage.py spellbook_md --report-format=none

# Get maximum information for debugging
python manage.py spellbook_md --report-level=debug
```

These reporting options help integrate the `spellbook_md` command into different workflows and provide the right level of information for each use case.

**Bonus**: Try the `--continue-on-error` flag with some intentionally malformed markdown files to see how the command handles errors.
