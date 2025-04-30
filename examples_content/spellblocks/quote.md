# Quote SpellBlock Showcase

The Quote SpellBlock provides an elegant way to highlight quotations, testimonials, and attributable statements in your documentation. This guide demonstrates all the capabilities and variations of the Quote block.

## Basic Quote Usage

At its simplest, a Quote block can be used without attribution:

```django
{~ quote ~}
The best way to predict the future is to invent it.
{~~}
```

{~ quote ~}
The best way to predict the future is to invent it.
{~~}

## Quotes with Attribution

Adding an author makes the quote more meaningful and credible.

### Quote with Author

```django
{~ quote author="Alan Kay" ~}
The best way to predict the future is to invent it.
{~~}
```

{~ quote author="Alan Kay" ~}
The best way to predict the future is to invent it.
{~~}

### Quote with Author and Source

For complete attribution, include both the author and the source:

```django
{~ quote author="Tim Berners-Lee" source="Weaving the Web, 1999" ~}
The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.
{~~}
```

{~ quote author="Tim Berners-Lee" source="Weaving the Web, 1999" ~}
The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.
{~~}

## Formatting Inside Quotes

Quotes support markdown formatting within their content for rich text presentation.

### Text Formatting

```django
{~ quote author="Donald Knuth" ~}
**Programming** is the art of telling another human what one wants the computer to do.
{~~}
```

{~ quote author="Donald Knuth" ~}
**Programming** is the art of telling another human what one wants the computer to do.
{~~}

```django
{~ quote author="Ada Lovelace" ~}
The *Analytical Engine* weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.
{~~}
```

{~ quote author="Ada Lovelace" ~}
The *Analytical Engine* weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.
{~~}

### Multi-line Quotes

Quotes can contain multiple paragraphs for longer passages:

```django
{~ quote author="Linus Torvalds" source="Email to linux-kernel mailing list, 2000" ~}
Talk is cheap. Show me the code.

Given enough eyeballs, all bugs are shallow.
{~~}
```

{~ quote author="Linus Torvalds" source="Email to linux-kernel mailing list, 2000" ~}
Talk is cheap. Show me the code.

Given enough eyeballs, all bugs are shallow.
{~~}

## Quotes with Images

Add a visual element to your quotes with the image parameter:

```django
{~ quote author="Grace Hopper" image="https://vcencyclopedia.vassar.edu/wp-content/uploads/2021/11/1583771839362.jpeg" ~}
The most dangerous phrase in the language is, "We've always done it this way."
{~~}
```

{~ quote author="Grace Hopper" image="https://vcencyclopedia.vassar.edu/wp-content/uploads/2021/11/1583771839362.jpeg" ~}
The most dangerous phrase in the language is, "We've always done it this way."
{~~}

## Customizing Quotes

### Custom CSS Classes

Add custom CSS classes to further style your quotes:

```django
{~ quote author="Steve Jobs" class="sb-bg-light sb-p-4 sb-border-radius" ~}
Design is not just what it looks like and feels like. Design is how it works.
{~~}
```

{~ quote author="Steve Jobs" class="sb-bg-light sb-p-4 sb-border-radius" ~}
Design is not just what it looks like and feels like. Design is how it works.
{~~}

## Best Practices

{~ alert type="info" ~}
### When to Use Quotes

Quotes are ideal for:

* Adding credibility with expert opinions
* Breaking up long sections of text
* Emphasizing key points or philosophies
* Providing historical context
* Including testimonials from users

Use quotes sparingly for maximum impact.
{~~}

### Quote Formatting Guidelines

{~ alert type="success" ~}
For the best appearance:

* Keep quotes relatively short and focused
* Ensure attribution is accurate
* Use markdown formatting sparingly within quotes
* Consider the visual hierarchy when including quotes
{~~}

---

{~ practice difficulty="Beginner" timeframe="5-10 minutes" impact="Medium" focus="Documentation" ~}
### Quote Practice Challenge

Try creating your own quote blocks:

1. Create a simple quote with just text
2. Create a quote with an author
3. Create a quote with both author and source
4. Create a quote with formatted text (bold, italic, etc.)
5. Try combining quotes with other SpellBlocks

Find inspiring quotes related to your project or field!
{~~}