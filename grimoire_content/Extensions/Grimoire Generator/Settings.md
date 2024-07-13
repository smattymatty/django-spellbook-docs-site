# Settings
## Required Settings
These Settings must be on, or the app won't work!
`GRIMOIRE_CONTENT_DIR`: The directory that holds the markdown files/more directories.
`GRIMOIRE_CONTENT_APP`: The app to write all of the generated templates for.
**Example:**
```python
GRIMOIRE_CONTENT_DIR = BASE_DIR / 'grimoire_content'
GRIMOIRE_CONTENT_APP = 'docs'
```
## Optional Settings
`GRIMOIRE_STRUCTURE_SORT_KEY`: str Defaults to 'name'.
**Options:**
* * 'name'
* * 'title'
* 'last_modified'
`GRIMOIRE_STRUCTURE_SORT_REVERSE`: bool Defaults to ''False"