# Creating Custom SpellBlocks

Let's create a custom SpellBlock that makes a collapsible section - perfect for FAQs or long documentation. We'll go through the whole process:

1. First, create your SpellBlock class:

```python
from django_spellbook.blocks import BasicSpellBlock
from django_spellbook.registry import SpellBlockRegistry

@SpellBlockRegistry.register()
class CollapsibleBlock(BasicSpellBlock):
    name = 'collapsible'
    template = 'my_app/blocks/collapsible.html'

    def get_context(self):
        context = super().get_context()
        context['summary'] = self.kwargs.get('summary', 'Click to expand')
        context['open'] = self.kwargs.get('open', False)
        return context
```

2. Create the template at `my_app/templates/my_app/blocks/collapsible.html`:

```django

<details class="spellbook-collapsible spellbook-border spellbook-border-radius-lg spellbook-p-3 spellbook-mb-3 spellbook-bg-light {% if kwargs.class %}{{ kwargs.class }}{% endif %}"
        {% if open %}open{% endif %}>
    <summary class="spellbook-cursor-pointer spellbook-font-bold">
        {{ summary }}
    </summary>
    <div class="spellbook-mt-3">
        {{ content|safe }}
    </div>
</details>
```

3. Now you can use it in your markdown:

```markdown

{~ collapsible summary="Why use SpellBlocks?" open="true" ~}
SpellBlocks make your markdown more powerful by adding:
- Custom components
- Consistent styling
- Reusable patterns
{~~}
```

## How It Works

1. The `@SpellBlockRegistry.register()` decorator adds your block to the available blocks
2. The `name` property sets what you'll type in markdown
3. `get_context()` processes any parameters you want to pass to your template
4. Your template uses Spellbook's built-in classes for consistent styling

## Best Practices

1. Include the `% spellbook_styles %` tag in your base template to use the built-in styles
2. Use the built-in utility classes:
   - `spellbook-border`
   - `spellbook-border-radius-lg`
   - `spellbook-p-3` (padding)
   - `spellbook-mb-3` (margin-bottom)
   - `spellbook-bg-light`
   - `spellbook-shadow-sm`
   - `spellbook-collapsible` is also included, just so this documentation can go smoothly, but feel free to make your own.

3. Allow for custom classes:
```django
{% verbatim %}
{% if kwargs.class %}{{ kwargs.class }}{% endif %}
{% endverbatim %}
```

4. Use `|safe` filter for markdown content:
```django
{% verbatim %}
{{ content|safe }}
{% endverbatim %}
```

{~ alert type="info" ~}
The `content` variable is already processed as markdown when it reaches your template!
{~~}

Want to see more examples? Check out the [built-in blocks source code](https://github.com/smattymatty/django_spellbook/tree/main/django_spellbook/blocks) for inspiration!