# Markdown Settings

## Required

- `SPELLBOOK_MD_PATH`: The directory that contains the markdown files to be processed.

- `SPELLBOOK_CONTENT_APP`: The app to write all of the generated templates for.

```python
SPELLBOOK_MD_PATH = BASE_DIR / "markdown_content"
SPELLBOOK_CONTENT_APP = "my_app"
```

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

{% a href="/docs/Commands/spellbook_md" .super-link %}
Continue to the Spellbook MD Command
{% enda %}