import uuid
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe

from typing import Dict
from django.template.loader import render_to_string
from grimoire_generator.registry import block_registry


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
        'id': str(uuid.uuid4()),
    }

    template = 'docs/blocks/code_block.html'
    rendered_block = render_to_string(template, context)

    return mark_safe(rendered_block)
