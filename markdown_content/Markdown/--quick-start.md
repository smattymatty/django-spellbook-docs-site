# Quick Start

Install the library: `pip install django-spellbook`

Update your settings:

```python
# settings.py

INSTALLED_APPS = [
    ...
    'django_spellbook',
    'my_app', # for SPELLBOOK_CONTENT_APP
    ...
]

# required settings
SPELLBOOK_MD_PATH = BASE_DIR / "markdown_content"
SPELLBOOK_CONTENT_APP = "my_app"

# recommended setting
SPELLBOOK_MD_BASE_TEMPLATE = 'django_spellbook/bases/base_sidebar_left.html'
```

Update your core project's urls:

```python
# urls.py
from django.urls import path, include

urlpatterns = [
    ...
    path('anything/', include('django_spellbook.urls')),
    ...
]
```

Run the command: `python manage.py spellbook_md`

You can now navigate to `anything/filename` to see your rendered markdown content.

The `SPELLBOOK_MD_BASE_TEMPLATE` setting is defaulted to `None`, which will simply show the rendered markdown content. For beginners, it's recommended to use the built-in base template, which includes a few styles, and a sidebar with a navigation menu based on your `SPELLBOOK_MD_PATH` directory structure.

The source for the built in base template is available [here](https://github.com/smattymatty/django_spellbook/blob/main/django_spellbook/templates/django_spellbook/bases/sidebar_left.html).

{% a href="/docs/Markdown/navigation" .super-link %}
Read Next: Navigating your Content
{% enda %}