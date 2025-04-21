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
{~ quote author="Grace Hopper" image="/static/images/grace-hopper.jpg" ~}
The most dangerous phrase in the language is, "We've always done it this way."
{~~}
```

{~ quote author="Grace Hopper" image="/static/images/grace-hopper.jpg" ~}
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

## Quotes in Different Contexts

### Motivational Quotes

```django
{~ quote author="Martin Fowler" ~}
Any fool can write code that a computer can understand. Good programmers write code that humans can understand.
{~~}
```

{~ quote author="Martin Fowler" ~}
Any fool can write code that a computer can understand. Good programmers write code that humans can understand.
{~~}

### Historical Context

```django
{~ quote author="Dennis Ritchie" source="Creator of C and co-creator of Unix" ~}
UNIX is basically a simple operating system, but you have to be a genius to understand the simplicity.
{~~}
```

{~ quote author="Dennis Ritchie" source="Creator of C and co-creator of Unix" ~}
UNIX is basically a simple operating system, but you have to be a genius to understand the simplicity.
{~~}

### Expert Testimonials

```django
{~ quote author="Dr. Jane Smith" source="Lead Developer at TechCorp" ~}
Django Spellbook revolutionized how we build and maintain our documentation. The markdown integration makes it incredibly easy for our entire team to contribute.
{~~}
```

{~ quote author="Dr. Jane Smith" source="Lead Developer at TechCorp" ~}
Django Spellbook revolutionized how we build and maintain our documentation. The markdown integration makes it incredibly easy for our entire team to contribute.
{~~}

## Nested in Other SpellBlocks

Quotes work well inside other blocks for complex content arrangements:

```django
{~ card title="Words of Wisdom" ~}
Some thoughts on software development:

{~ quote author="Kent Beck" ~}
Make it work, make it right, make it fast.
{~~}

{~ quote author="John Woods" ~}
Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.
{~~}
{~~}
```

{~ card title="Words of Wisdom" ~}
Some thoughts on software development:

{~ quote author="Kent Beck" ~}
Make it work, make it right, make it fast.
{~~}

{~ quote author="John Woods" ~}
Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.
{~~}
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