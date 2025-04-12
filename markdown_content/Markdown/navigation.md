# Navigating your Markdown Content

The `spellbook_md` command will generate a `TOC` variable in the `django_spellbook/views.py` file. This variable is inserted into the context of every spellbook view under 'toc'.

```python
# django_spellbook/views.py

TOC = {
    "title": "root",
    "url": "", # empty url for the root
    "children": { 
        "---introduction": {"title": "introduction", "url": "introduction"},
        "Commands": { # Commands is a directory
            "title": "Commands",
            "url": "Commands",
            "children": { # Directories have children
                "spellbook_md": {
                    "title": "spellbook_md",
                    "url": "Commands/spellbook_md",
                },
                "other_command": {
                    "title": "other_command",
                    "url": "Commands/other_command",
                },
            },
        },
        "Markdown": {
            "title": "Markdown",
            "url": "Markdown",
            "children": {
                ...
            },
        },
    },
}

```

Every markdown file that is processed by the `spellbook_md` command will be added to this `TOC`, alongside their 'title' (see [metadata](/docs/Markdown/metadata)) and 'url'. This is used to generate the navigation menu.

{~ alert type="info" ~}
{% verbatim %}Django Spellbook offers a built in `{% sidebar_toc %}` template tag that renders a responsive and interactive navigation menu based on the TOC structure.{% endverbatim %}
{~~}

The built-in [sidebar_toc.html](https://github.com/smattymatty/django_spellbook/blob/main/django_spellbook/templates/django_spellbook/tocs/sidebar_toc.html) uses a recursive approach to generate the navigation menu with [recursive/\_toc_sidebar.html](https://github.com/smattymatty/django_spellbook/blob/main/django_spellbook/templates/django_spellbook/recursive/_toc_sidebar.html). It also includes styles and JavaScript to make the navigation menu interactive.

## Example - Simple Custom Navigation Menu

```django
{% verbatim %} 
{% load spellbook_tags %}

<nav>
  <ul>
    {% for item in toc.children.values %}
    <li>
      <a href="{% spellbook_url item.url %}">{{ item.title }}</a>
      {% if item.children %}
      <ul>
        {% for child in item.children.values %}
        <li>
          <a href="{% spellbook_url child.url %}">{{ child.title }}</a>
        </li>
        {% endfor %}
      </ul>
      {% endif %}
    </li>
    {% endfor %}
  </ul>
</nav>
{% endverbatim %}
```

{~ alert type="info" ~}
{% verbatim %}The `{% spellbook_url %}` template tag will take the url (example: `Commands/spellbook_md` or `introduction`) and convert it into a valid Django URL.{% endverbatim %} 
{~~}

### Including the table of contents in your own views

If you want to include the navigation menu in one of your own views, you can simply import the `TOC` variable from `django_spellbook/views.py` and use it in your template.

```python
# my_app/views.py
from django.shortcuts import render
from django_spellbook.views import TOC

def my_view(request):
    context = { "toc": TOC }
    return render(
        request, "my_app/template.html", context
     )
```

### Sorting the Navigation Menu

By default, the navigation menu is sorted alphabetically by the 'title' of each item. To give an item priority in the sort order, simply add a number of '-' dashes to the beginning of the title. The TOC will automatically strip these dashes from the title, but they will still be sorted as if they were there.

{~ alert type="info" ~}
The 'title' property of each item will capitalize the first letter of each word longer than 3 characters, and strip any dashes from the beginning of the title. Dashes within the title will be replaced with spaces. Underscores will remain unchanged. `SPELLBOOK_MD_TITLEFY` is set to `True` by default, but you can set it to `False` to disable this behavior.
{~~}

{% a href="/docs/Markdown/base-template" .super-link %}
Read Next: Custom Base Template
{% enda %}