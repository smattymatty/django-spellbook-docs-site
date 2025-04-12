# What is Django Spellbook?

A magical toolkit that enhances Django projects with powerful markdown processing, styling utilities, and more.

It's a collection of tools that I've found useful in my projects, and I hope that you will too.

# Installation

Install the package with pip:
`pip install django-spellbook`

Then, add `django_spellbook` to your Django app's `INSTALLED_APPS` in `settings.py`:

```python
# settings.py
INSTALLED_APPS = [
    ...,
    'django_spellbook',
    'my_app', # another app is required to use as the SPELLBOOK_MD_APP
]
```

For more settings, check out the [settings documentation](/docs/settings).

# Features of Django Spellbook

Django Spellbook includes a number of features, within different modules that can be used in your Django projects.

## Markdown

Spellbook's custom Markdown Renderer will automatically build the templates, views, urls, and much more with just one terminal command. It offers extended syntax for creating interactive elements with much more control over the HTML output, including custom elements, blocks, and more. 

All you need to get started is a folder of markdown files, a Django app, and a few settings. Spellbook now supports multiple source directories and destination apps, allowing you to organize different types of content (like documentation, blog posts, or help articles) into separate apps with their own URL namespaces.

{~ alert type="info" ~}
Spellbook's markdown module aims to be as simple as possible, while still providing a lot of flexibility and control. It's designed to be used alongside other Django features and third-party libraries like HTMX and Tailwind CSS.
{~~}

{% a href="/docs/Markdown/introduction" .super-link %}
Learn More about Spellbook's Markdown Module
{% enda %}

## Styles

Spellbook's built-in styles can be loaded with the template tag `% spellbook_styles %`. This includes several utility classes for common styling needs, such as '.sb-p-1' or '.sb-flex-col' and '.sb-justify-center'. There are also several built-in component classes such as '.sb-card', 'sb-card-body', 'sb-alert', and '.sb-alert-info'.

These styles were originally made just for the Markdown module's built-in blocks. I'm including them in this documentation for reference, so users don't have to redefine basic utility classes.

{~ alert type="info" ~}
The styles take a similar approach to Tailwind CSS, but much more lightweight. The 'utility' classes are meant to be used alongside more semantic & verbose 'component' classes.
{~~}

{% a href="/docs/Styles/introduction" .super-link %}
Learn More about Spellbook's Styles Module
{% enda %}