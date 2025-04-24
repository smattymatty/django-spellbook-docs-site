# Card SpellBlock Showcase

The Card SpellBlock provides a versatile container for organizing related content within a visually distinct box. This guide demonstrates all the capabilities and variations of the Card block.

## Basic Card Usage

At its simplest, a Card is a container for your content with some visual structure.

```django
{~ card ~}
This is a basic card with no title or footer.
{~~}
```

{~ card ~}
This is a basic card with no title or footer.
{~~}

## Cards with Headers and Footers

Cards become more useful when you add titles and footers to organize your content.

### Card with Title Only

```django
{~ card title="Important Information" ~}
This card has a title that helps users understand what's inside.
{~~}
```

{~ card title="Important Information" ~}
This card has a title that helps users understand what's inside.
{~~}

### Card with Footer Only

```django
{~ card footer="Last updated: April 2023" ~}
This card includes a footer that can contain metadata or additional context.
{~~}
```

{~ card footer="Last updated: April 2023" ~}
This card includes a footer that can contain metadata or additional context.
{~~}

### Card with Title and Footer

```django
{~ card title="Django Installation" footer="Compatible with Python 3.8+" ~}
To install Django, run:

`pip install django`

Then verify your installation with:

`python -m django --version`
{~~}
```

{~ card title="Django Installation" footer="Compatible with Python 3.8+" ~}
To install Django, run:

`pip install django`

Then verify your installation with:

`python -m django --version`
{~~}

## Formatting Inside Cards

Cards support full markdown formatting within their content, allowing rich text presentation.

### Text Formatting

```django
{~ card title="Formatting Examples" ~}
Cards support all markdown formatting:

**Bold text** for emphasis

*Italic text* for subtle emphasis

`Inline code` for technical terms

[Links](https://example.com) for references
{~~}
```

{~ card title="Formatting Examples" ~}
Cards support all markdown formatting:

**Bold text** for emphasis

*Italic text* for subtle emphasis

`Inline code` for technical terms

[Links](https://example.com) for references
{~~}

### Lists in Cards

```django
{~ card title="Project Setup Checklist" ~}
Before launching your Django project:

1. Set `DEBUG = False` in production
2. Configure proper database settings
3. Set up proper logging
4. Ensure all static files are collected
5. Set secure cookie settings

* Consider a CDN for static files
* Enable HTTPS for all traffic
* Use environment variables for secrets
{~~}
```

{~ card title="Project Setup Checklist" ~}
Before launching your Django project:

1. Set `DEBUG = False` in production
2. Configure proper database settings
3. Set up proper logging
4. Ensure all static files are collected
5. Set secure cookie settings

* Consider a CDN for static files
* Enable HTTPS for all traffic
* Use environment variables for secrets
{~~}

## Nested SpellBlocks

Cards can contain other SpellBlocks for complex content arrangements:

```django
{~ card title="Important Warnings" ~}
Please review these alerts before proceeding:

{~ alert type="warning" ~}
This operation cannot be undone!
{~~}

{~ alert type="danger" ~}
Make sure you have a backup before continuing.
{~~}
{~~}
```

{~ card title="Important Warnings" ~}
Please review these alerts before proceeding:

{~ alert type="warning" ~}
This operation cannot be undone!
{~~}

{~ alert type="danger" ~}
Make sure you have a backup before continuing.
{~~}
{~~}

## Common Card Use Cases

### Feature Highlights

```django
{~ card title="User Authentication" ~}
Django Spellbook includes:

* Secure user registration
* Password reset functionality 
* Social authentication options
* User profile management

All features follow Django security best practices.
{~~}
```

{~ card title="User Authentication" ~}
Django Spellbook includes:

* Secure user registration
* Password reset functionality 
* Social authentication options
* User profile management

All features follow Django security best practices.
{~~}

### Content Organization

```django
{~ card title="Documentation Sections" ~}
Our documentation is organized into these main sections:

{~ card title="Getting Started" class="sb-ml-4 sb-mr-4 sb-mb-2" ~}
Installation, basic concepts, and your first project.
{~~}

{~ card title="Core Features" class="sb-ml-4 sb-mr-4 sb-mb-2" ~}
Detailed explanations of all core functionality.
{~~}

{~ card title="Advanced Topics" class="sb-ml-4 sb-mr-4" ~}
Customization, optimization, and integration guides.
{~~}
{~~}
```

{~ card title="Documentation Sections" ~}
Our documentation is organized into these main sections:

{~ card title="Getting Started" class="sb-ml-4 sb-mr-4 sb-mb-2" ~}
Installation, basic concepts, and your first project.
{~~}

{~ card title="Core Features" class="sb-ml-4 sb-mr-4 sb-mb-2" ~}
Detailed explanations of all core functionality.
{~~}

{~ card title="Advanced Topics" class="sb-ml-4 sb-mr-4" ~}
Customization, optimization, and integration guides.
{~~}
{~~}

## Best Practices

{~ alert type="info" ~}
### When to Use Cards

Cards are ideal for:

* Organizing related content into discrete sections
* Highlighting important information
* Creating visual hierarchy on a page
* Presenting a collection of similar items

Use cards to break up long pages of content into more digestible chunks.
{~~}

---

{~ practice difficulty="Beginner" timeframe="10-15 minutes" impact="Medium" focus="Documentation" ~}
### Card Practice Challenge

Try creating your own card blocks:

1. Create a simple card with just content
2. Create a card with a title and some formatted content
3. Create a card with both title and footer
4. Create a nested card structure for organizing information
5. Try adding custom classes to style your cards differently

Experiment with combining cards with other SpellBlocks!
{~~}