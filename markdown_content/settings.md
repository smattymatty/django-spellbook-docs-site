# Markdown Settings

## Required

- `SPELLBOOK_MD_PATH`: The directory that contains the markdown files to be processed.

- `SPELLBOOK_MD_APP`: The app to write all of the generated templates for.

```python
SPELLBOOK_MD_PATH = BASE_DIR / "markdown_content"
SPELLBOOK_MD_APP = "my_app"
```

## Advanced Configuration

### Multiple Source-Destination Pairs

Django Spellbook supports processing multiple markdown sources to different destination apps:

```python
SPELLBOOK_MD_PATH = [
    BASE_DIR / "docs_content",
    BASE_DIR / "blog_content"
]
SPELLBOOK_MD_APP = [
    "docs_app",
    "blog_app"
]
```

### URL Prefixes

- `SPELLBOOK_MD_URL_PREFIX`: Customize the URL prefix for your markdown content.

```python
# Single source configuration
SPELLBOOK_MD_URL_PREFIX = "documentation"  # Content will be at /documentation/

# Multiple source configuration
SPELLBOOK_MD_URL_PREFIX = [
    "docs",   # First source at /docs/
    "blog"    # Second source at /blog/
]
# If no URL prefixes are specified, the default behavior applies:
# ['', 'blog_app']
```

If not specified, default URL prefixes will be:

- For single app: Empty string (content at root URL)
- For multiple apps: First app gets empty prefix, others use their app name as prefix

## Recommended

- `SPELLBOOK_MD_BASE_TEMPLATE` (default: `None`): The base template to use for the generated markdown files.

```python
SPELLBOOK_MD_BASE_TEMPLATE = 'django_spellbook/bases/sidebar_left.html'
```

Read more about creating a [base template](/docs/Markdown/base-template).

## Optional

- `SPELLBOOK_MD_TITLEFY` (default: `True`): When generating the title from the file's MetaData to be included within the table of contents or other places, Django Spellbook automatically capitalizes the first letter of each word longer than 2 characters, also converts all dashes into spaces.

```python
SPELLBOOK_MD_TITLEFY = True
```

- `SPELLBOOK_MD_METADATA_BASE` (default: ('django_spellbook/metadata/for_user.html', 'django_spellbook/metadata/for_dev.html')): The base template to use for the generated metadata of files when using the `% show_metadata %` template tag.

```python
SPELLBOOK_MD_METADATA_BASE = ('django_spellbook/metadata/for_user.html', 'django_spellbook/metadata/for_dev.html')

# This setting takes a tuple to apply to all sources, or a list to apply to each source individually
```


Read more about creating a [metadata template](/docs/Markdown/metadata).

{% div .sb-p-4 .sb-mb-4 %}
{% a href="/docs/Markdown/quick-start" .super-link %}
Read Next: Markdown Module Quick Start
{% enda %}
{% enddiv %}