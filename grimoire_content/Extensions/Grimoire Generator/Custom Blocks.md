# Custom Blocks
Custom blocks are a powerful feature of the Grimoire Generator that allow users to define and use specialized content elements within their markdown files. These blocks can be used to create complex, reusable components with custom rendering logic.
## Parsing Custom Blocks

**The** `GrimoireParser` class handles the parsing of custom blocks:
1. Custom blocks are identified by the pattern `{% block_name attributes %}`.
2. The `parse_custom_block` method is called when a custom block is encountered.
3. It extracts the block content and attributes, then calls the appropriate registered function.
### Registering a Custom Block

To register a custom block, use the `@block_registry.register` decorator:

{% code_block language="app/grimoire_blocks.py" %}
```
from typing import Dict
from django.template.loader import render_to_string
from grimoire_generator.registry import block_registry

@block_registry.register('code_block')
def code_block(content: str, **kwargs: Dict[str, str]) -> str:
    # Implementation here
```
{% endcode_block %}

**Note** that this code must reside inside a `grimoire_blocks.py` in any of your apps.
## Custom Block Implementation

A custom block function should:

1. Accept a `content` parameter (the block's content) and `**kwargs`, a Dictionary of str:str pair values..
2. Return a string of rendered HTML.

{% code_block language="app/grimoire_blocks.py" %}
```
# ... previous imports
from django.utils.safestring import mark_safe

@block_registry.register('code_block')
def code_block(content: str, **kwargs: Dict[str, str]) -> str:
    """
    Render an enhanced code block with a copy button.

    Args:
        content (str): The content of the code block.
        **kwargs: Additional keyword arguments.
            - language (str): The programming language of the code.

    Returns:
        str: The rendered code block with copy functionality.
    """
    print(f"\nRendering code block:{kwargs}\n")
    context = {
        'content': content,
        'language': kwargs.get('language', ''),
        # has a copy button unless explicitly disabled
        'has_copy_button': kwargs.get('has_copy_button', 'True'),
        # notice how 'True' is a String.
    }

    template = 'docs/blocks/code_block.html'
    rendered_block = render_to_string(template, context)

    return mark_safe(rendered_block)
```
{% endcode_block %}

Now that you have the function created, you can create your HTML template. It doesn't matter what this HTML file named, or where it is located, but keeping it in a 'blocks' folder is good practice. 

{% code_block language="docs/templates/docs/blocks/code_block.html" %}
```
<div class="code-block-container">
    {% if has_copy_button %}
    <button class="copy-button">Copy</button>
    {% endif %}
    <pre class="code-block"{% if language %} data-language="{{ language }}"{% endif %}><div>{{ content|safe }}</div></pre>
</div>
```
{% endcode_block %}
## Usage in Markdown

Custom blocks can be used in markdown files like this:

{% code_block language="Markdown" %}

{% blockname arg_1="xyz" arg_2="can only be strings" %}
This is the content for the block!
{% endblockname %}

{% endcode_block %}

## Troubleshooting

1. **Block Not Recognized**: Ensure the block is properly registered inside the `grimoire_blocks.py` of any app's directory.
2. **Attribute Parsing Errors**: Check that all attributes are properly *quoted* in the markdown. `{% blockname arg_1="xyz" arg_2="can only be strings" %}`
3. **Rendering Errors**: Verify that the block function is returning valid **HTML**. Use browser developer tools to inspect. *e.g.,* `<div class="my-class" <p>Unclosed paragraph</div>`.

`hey` hi `howru` im fine `lol` wtf? `u think so` yeah bro `ok`

- lol! `gumby `gumby `gumby`