# SpellBlocks

SpellBlocks are reusable content components that you can embed directly in your markdown. Think of them as Django template tags, but for markdown. They're perfect for creating rich, interactive content while keeping your markdown clean and readable.

## Built-in SpellBlocks

### Alert Block

Creates attention-grabbing message boxes with different styles.

```django
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

```django
{~ card title="Optional Title" footer="Optional Footer" class="any-extra-classes" ~}
Your card content here.
Supports **markdown** too!
{~~}
```

{~ card title="This is my Card" footer="This is my Footer" ~}
All parameters are optional. The card will still look good without them.
{~~}

## Quote Block

The Quote Block creates stylized quotations with optional attribution information. This block is perfect for highlighting important quotes, testimonials, or key takeaways from other sources.

### Parameters

- `author` - (Optional) The person who said or wrote the quote
- `source` - (Optional) The source of the quote (book, article, etc.)
- `class` - (Optional) Additional CSS classes to apply to the quote block

### Example Usage

```markdown
{~ quote author="Albert Einstein" source="Address to the Students' Disarmament Meeting" ~}
Peace cannot be kept by force; it can only be achieved by understanding.
{~~}
```

### Rendered Result

{~ quote author="Albert Einstein" source="Address to the Students' Disarmament Meeting" ~}
Peace cannot be kept by force; it can only be achieved by understanding.
{~~}

You can also use markdown *within* your quotes:

```markdown
{~ quote author="Ada Lovelace" ~}
The **Analytical Engine** weaves algebraic patterns, just as the *Jacquard loom* weaves flowers and leaves.
{~~}
```

## Practice Block

The Practice Block provides a structured format for exercises, challenges, or practice activities. It's ideal for tutorials, educational content, or articles that include actionable tasks.

### Parameters

- `difficulty` - (Optional) How challenging the practice is (default: "Moderate")
- `timeframe` - (Optional) Estimated time to complete (default: "Varies")
- `impact` - (Optional) The benefit level from completing the practice (default: "Medium")
- `focus` - (Optional) The skill area this practice targets (default: "General")
- `class` - (Optional) Additional CSS classes to apply to the practice block

### Example Usage

```markdown
{~ practice difficulty="Beginner" timeframe="15-30 minutes" impact="High" focus="Django Templates" ~}
### Template Inheritance Challenge

Create a Django project with:
1. A base template with blocks for `title`, `content`, and `footer`
2. Two child templates that extend this base template
3. A view that renders each child template

**Bonus**: Add a navigation block that changes based on the current page.
{~~}
```

### Rendered Result

{~ practice difficulty="Beginner" timeframe="15-30 minutes" impact="High" focus="Django Templates" ~}
### Template Inheritance Challenge

Create a Django project with:
1. A base template with blocks for `title`, `content`, and `footer`
2. Two child templates that extend this base template
3. A view that renders each child template

**Bonus**: Add a navigation block that changes based on the current page.
{~~}

For more advanced examples:

```markdown
{~ practice difficulty="Advanced" timeframe="1-2 hours" impact="Very High" focus="Performance Optimization" ~}
### Database Query Optimization

Take an existing Django view that's performing slowly and:
1. Use Django Debug Toolbar to identify slow queries
2. Implement `select_related()` and `prefetch_related()` where appropriate
3. Add proper indexing to your models
4. Measure and document the performance improvement

**Deliverable**: Before and after performance metrics, and a brief explanation of your changes.
{~~}

{% a href="/docs/Markdown/custom-spellblocks" .super-link %}
Read Next: Creating Custom SpellBlocks
{% enda %}