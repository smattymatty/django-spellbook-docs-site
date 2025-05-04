# Frequently Asked Questions

{~ accordion title="What is Django Spellbook?" open=true ~}
Django Spellbook is a powerful markdown processor that extends Django's templating capabilities.

It's designed to be simple, flexible, and easy to use, with a focus on maintainability and extensibility.

It leverages Django's template system to provide a seamless integration with your existing Django projects, making it a great choice for creating and managing markdown-based content.
{~~}

## Generation Process

{~ accordion title="Does this alter my database?" ~}
No, Django Spellbook does not alter your database. It processes your markdown files and generates templates that are then used by automatically generated views and URLs.

[Quickstart](/docs/Markdown/quick-start) to learn more.
{~~}

{~ accordion title="How do I access the generated URLS?" ~}
You can access your generated URLS by including `path('', include('django_spellbook.urls'))` in your main `urls.py` file.

[Navigation](/docs/Markdown/navigation) to learn more.
{~~}

{~ accordion title="Where are the templates stored?" ~}
The templates are stored in your app's `templates/spellbook_md/` directory. They can be utilized by your `SPELLBOOK_MD_BASE_TEMPLATE` setting to allow for flexible customization.

[Base Template](/docs/Markdown/base-template) to learn more.
{~~}

{~ accordion title="Does this change my app's codebase?" ~}
No, Django Spellbook does not modify your app's codebase. The only change of code is in the `templates/spellbook_md/` directory.

The `urls.py` and `views.py` files of your app are not modified. Instead, Django Spellbook generates these files automatically based on your configured settings, and stores them in it's own internal directory. `venv/lib/python3.10/site-packages/django_spellbook/views_app_name.py` and `venv/lib/python3.10/site-packages/django_spellbook/urls_app_name.py`

[python manage.py spellbook_md](/docs/Commands/spellbook_md) to learn more.
{~~}

## SpellBlocks

{~ accordion title="How do I create my own custom SpellBlocks?" ~}
You can create custom SpellBlocks by extending the `BasicSpellBlock` class and registering them using the `SpellBlockRegistry`. This allows you to define unique components tailored to your project's specific needs.

See the [documentation on Custom Spellblocks](/docs/Spellblocks/custom-spellblocks/) for a detailed guide.
{~~}

{~ accordion title="Can I change the appearance of the built-in SpellBlocks?" ~}
Yes, the built-in SpellBlocks use standard HTML and CSS. You can override the default styles provided by Django Spellbook by including your own CSS rules that target the specific classes used by the SpellBlocks (e.g., `.sb-card`, `.sb-alert`, `.sb-accordion`). Make sure your custom CSS is loaded after the `{% spellbook_styles %}` tag if you are using it.

Alternatively, you can avoid including `% spellbook_styles %` altogether and define all styles yourself.

[Styles Introduction](https://django-spellbook.org/docs/Styles/introduction/) to learn more.
{~~}

## Markdown Extensions & Django Tags

{~ accordion title="Can I use standard Django template tags/filters in my markdown?" ~}
Yes! Django Spellbook's `DjangoLikeTagProcessor` is designed to work alongside standard Django template logic. Tags like `% if %`, `% for %`, `% url %`, `{ variable }`, and filters are preserved during the markdown processing step. They will be correctly interpreted by Django when the final template is rendered.

Notice how I have to remove the { } characters from the `% if %` tag. This is because the Django template parser will interpret them as part of the tag syntax.

Custom tags like `% div .my-class %` are converted directly to HTML elements during processing, while standard Django tags are preserved for later rendering.
[Advanced Usage - DjangoLikeTagProcessor](/docs/Markdown/Advanced/djangoliketagprocessor) to learn more.
{~~}

{~ accordion title="How do I include static files like images in my markdown?" ~}
You can use the standard markdown syntax for images (`![alt text](/path/to/image.jpg)`). For Django's static file handling, use the `% static %` template tag within your markdown, just like you would in a regular Django template. Ensure `% load static %` is present in your base template (`SPELLBOOK_MD_BASE_TEMPLATE`) or included at the top of your markdown file if not using a base template.

Example:
`![My Image Alt](% static 'my_app/images/my_image.png' %)`
{~~}

## Configuration & Workflow

{~ accordion title="How often should I run `python manage.py spellbook_md`?" ~}
You should run the `spellbook_md` command whenever you add, modify, or delete markdown files in your source directory (`SPELLBOOK_MD_PATH`).

* **During Development:** Run it after making changes to see them reflected. You might integrate this into a file-watching workflow.
* **Before Deployment:** Run it as part of your deployment process to ensure the generated templates, views, and URLs are up-to-date in your production environment.
{~~}

{~ accordion title="Can I pass extra context to the generated pages?" ~}
Currently, the automatically generated views primarily pass metadata and Table of Contents information. For more complex context requirements, you might consider:

1.  Creating your own Django view that renders the Spellbook-generated template and adds your custom context.
2.  Using custom template tags within your markdown or base template to fetch and display dynamic data.
3.  Exploring middleware to inject context into requests (use with caution).

Direct context injection into the auto-generated views is not a built-in feature at this time.
{~~}

## Metadata

```yaml
---
title: Working with Spellbook Metadata
published: 2023-11-15
author: Django Spellbook Team
tags:
  - tutorial
  - metadata
  - configuration
difficulty: beginner
category: documentation
---
```

{~ accordion title="How do I access my metadata?" ~}
The `% show_metadata %` template tag renders a clean, user-friendly view of your content's metadata. 

[Template Tags](/docs/template-tags) to learn more.
{~~}

{~ accordion title="Can I use custom metadata?" ~}
Yes, you can include custom metadata in your markdown files. In the example above, the `difficulty` and `category` fields are custom metadata fields. They are automatically generated by Django Spellbook and can be accessed in your templates via `metatada.custom_meta.difficulty` and `metadata.custom_meta.category`.

[Metadata](/docs/markdown/metadata) to learn more.
{~~}

{~ accordion title="How can I change the default metadata template?" ~}
You can change the default metadata template by setting the `SPELLBOOK_MD_METADATA_BASE` setting in your `settings.py` file.

[Settings](/docs/settings) to learn more.
{~~}
