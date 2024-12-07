# SpellBlocks

SpellBlocks are reusable content components that you can embed directly in your markdown. Think of them as Django template tags, but for markdown. They're perfect for creating rich, interactive content while keeping your markdown clean and readable.

## Creating SpellBlocks

Every SpellBlock inherits from `BasicSpellBlock`. Here's how to create one:

```python
from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry

@SpellBlockRegistry.register()
class MyBlock(BasicSpellBlock):
    name = 'my_block'  # This is what you'll use in markdown
    template = 'my_app/blocks/my_block.html'  # Your template path

    def get_context(self):
        context = super().get_context()
        # Add your custom context here
        return context
```

## Built-in SpellBlocks

### Alert Block

Creates attention-grabbing message boxes with different styles.

```markdown
{~ alert type="warning" ~}
Hey! This is important stuff!
{~~}
```

Available Types:

- info (default)
- warning
- success
- danger

{~ alert type="info" ~}
If you use an invalid type, it'll default to 'info' and print a warning message telling you what went wrong.
{~~}

### Card Block

Creates a card-style container for your content. Perfect for organizing related information.

```markdown
{~ card title="Optional Title" footer="Optional Footer" class="any-extra-classes" ~}
Your card content here.
Supports **markdown** too!
{~~}
```

{~ card title="This is my Card" footer="This is my Footer" ~}
All parameters are optional. The card will still look good without them.
{~~}

## How SpellBlocks Work

1. They process your markdown content first
2. Apply any custom logic you define
3. Render through a template
4. Return the final HTML

The base `BasicSpellBlock` handles:

- Markdown processing with common extensions
- Context management
- Template rendering
- Parameter validation

{% a href="/docs/Markdown/custom-spellblocks" .super-link %}
Read Next: Creating Custom SpellBlocks
{% enda %}