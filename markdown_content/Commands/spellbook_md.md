## python manage.py spellbook_md

This command will take your directory full of markdown files (or nested directories) and transform them into dynamic HTML templates. Then, it will generate views, URLs, and Navigation based on your content's file structure.

#### **These Settings are required**

```python
SPELLBOOK_MD_PATH = BASE_DIR / "markdown_content"
SPELLBOOK_CONTENT_APP = "my_app"
```

#### **These Settings are recommended**

```python
SPELLBOOK_MD_BASE_TEMPLATE = 'django_spellbook/bases/sidebar_left.html'
```

- The default of `SPELLBOOK_MD_BASE_TEMPLATE` is `None`, which will simply just show the rendered markdown content. This built in base template includes a few styles, and a sidebar with a navigation menu based on your `SPELLBOOK_MD_PATH` directory structure.
- The source for the built in base template is available [here](https://github.com/smattymatty/django_spellbook/blob/main/django_spellbook/templates/django_spellbook/bases/sidebar_left.html). You can override this template by specifying a different path in your settings. You can read more about customising the base template [here](#).

#### These Settings are optional

```python
SPELLBOOK_MD_TITLEFY = True
```

- The default of `SPELLBOOK_MD_TITLEFY` is `True`. This will ensure the title of your markdown files are capitilized and converts dashes to spaces.

{% a href="/docs/Markdown/quick-start" .super-link %}
Read Next: Markdown Module Quick Start
{% enda %}