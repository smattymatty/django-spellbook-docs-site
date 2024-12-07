# Markdown Settings

## Required

- `SPELLBOOK_MD_PATH`: The directory that contains the markdown files to be processed.

- `SPELLBOOK_CONTENT_APP`: The app to write all of the generated templates for.

## Recommended

{% verbatim %}
- `SPELLBOOK_MD_BASE_TEMPLATE` (default: `None`): The base template to use for the generated markdown files. The template must include a `spellbook_md` block/endblock. You should also include a `load spellbook_tags` tag to load the template tags. 

{~ alert type="success" ~}
The `spellbook_styles` tag is optional, if you want to use the built-in blocks and styles.
{~~}
{% endverbatim %}

## Optional

- `SPELLBOOK_MD_TITLEFY` (default: `True`): When generating the title from the file's MetaData to be included within the table of contents or other places, Django Spellbook automatically capitalizes the first letter of each word longer than 2 characters, and it also converts all dashes into spaces.

{% a href="/docs/Commands/spellbook_md" .super-link %}
Continue to the Spellbook MD Command
{% enda %}