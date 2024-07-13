# Changelog
Django-Spellbook is a powerful library that allows you to add interactivity to your Django templates without writing JavaScript. This documentation will guide you through installation, basic usage, and advanced features.

## Quick Start
1. Install Django-Spellbook
2. Add it to your INSTALLED_APPS
3. Start using the template tags in your templates

## Key Features

- ActionInvoker: **Trigger** server-side actions *from* your templates
	1.  hey
	2.  yo
	3.  hi
		- even more?
		- wow!
		- this is cool
			1.  How about this
			2. no...
- ContentToggleHandler: **Show**/*hide* content dynamically
- InstantUpdater: **Update** parts of your page *without* full reloads
- ClassToggler: **Dynamically** add or remove CSS classes

```python
print('hello world')
```

hi `this` is a `token`

{% a style="color:red;" %}
yo yo yo
{% enda %}

{% blockquote style="color:red;" %}
yo yo yo
{% endblockquote %}

{% code_block language="python" %}
@block_registry.register('code_block')
def code_block(content: str, **kwargs) -> str:
    """
    Render an enhanced code block with a copy button.

    Args:
        content (str): The content of the code block.
        **kwargs: Additional keyword arguments.
            - language (str): The programming language of the code.

    Returns:
        str: The rendered code block with copy functionality.
    """
    context = {
        'content': content,
        'language': kwargs.get('language', ''),
        # has a copy button unless explicitly disabled
        'has_copy_button': kwargs.get('has_copy_button', True),
        'id': str(uuid.uuid4()),
    }

    rendered_block = render_to_string('docs/blocks/code_block.html', context)

    return mark_safe(rendered_block)

{% endcode_block %}