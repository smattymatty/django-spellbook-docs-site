# Creating Custom SpellBlocks

This guide will walk you through creating custom SpellBlocks for your Django Spellbook application.

## Setting Up Custom SpellBlocks

### Step 1: Create spellblocks.py file

**Important:** Your custom SpellBlocks must be defined in a file named `spellblocks.py` in your Django app.

```python
from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry

@SpellBlockRegistry.register()
class MyCustomBlock(BasicSpellBlock):
    name = 'my_custom_block'
    template = 'your_app/blocks/my_custom_block.html'

    def get_context(self):
        context = super().get_context()
        # Add your custom context here via self.kwargs.get('name', '')
        return context
```

### Step 2: Create the template

Create your HTML template in your app's templates directory. The path should match what you specified in your SpellBlock class.

For example, if your app is named `blog` and you specified `template = 'blog/blocks/my_block.html'`, create your template at:
```
blog/
  templates/
    blog/
      blocks/
        my_block.html
```

## Example: Creating a Quote Block

Let's create a SpellBlock for displaying formatted quotes with attribution:

### Step 1: In your `spellblocks.py` file:

```python
from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry

@SpellBlockRegistry.register()
class QuoteBlock(BasicSpellBlock):
    name = 'quote'
    template = 'blog/blocks/quote.html'

    def get_context(self):
        context = super().get_context()
        context['author'] = self.kwargs.get('author', '')
        context['source'] = self.kwargs.get('source', '')
        return context
```

### Step 2: Create the template at `blog/templates/blog/blocks/quote.html`:

```django
{% verbatim %}
<blockquote class="sb-blockquote sb-pl-4 sb-border-accent sb-border-0 sb-border-solid sb-border-l sb-mb-4 {% if kwargs.class %}{{ kwargs.class }}{% endif %}">
    <p class="sb-italic">{{ content|safe }}</p>
    {% if author or source %}
    <footer class="sb-text-sm sb-mt-2">
        {% if author %}<cite class="sb-font-bold">{{ author }}</cite>{% endif %}
        {% if source %}<span class="sb-text-neutral-600">, {{ source }}</span>{% endif %}
    </footer>
    {% endif %}
</blockquote>
{% endverbatim %}
```

### Step 3: Use in your markdown:

```python
{~ quote author="Albert Einstein" source="Letter to Max Born, 1926" ~}
God does not play dice with the universe.
{~~}
```

## Important Notes

1. The file **must** be named `spellblocks.py` for Django Spellbook to automatically discover your custom blocks.

2. Make sure your templates are stored in the correct location matching your specified template path.

3. Remember to include Spellbook's styles in your base template:
```django
{% verbatim %}
{% load spellbook_tags %}
<!DOCTYPE html>
<html>
<head>
    {% spellbook_styles %}
    <!-- Other head elements -->
</head>
<body>
    <!-- Your content -->
</body>
</html>
{% endverbatim %}
```

4. All parameters from your markdown are available in the template via `kwargs.parameter_name`.

5. The content between your SpellBlock tags is already processed as markdown and available as `content` in your template.