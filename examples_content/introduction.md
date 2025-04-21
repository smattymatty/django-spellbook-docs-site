Welcome To the Examples of Django Spellbook!

Django Spellbook is a powerful toolkit for creating and managing markdown-based content in your Django projects. It's designed to be simple, flexible, and easy to use, with a focus on maintainability and extensibility.

This examples serves as a collection of real-world examples showcasing the capabilities of Django Spellbook. It's a great resource for learning how to use Django Spellbook and exploring its features.

{~ card title="Basic Markdown" footer="Updated: Today" ~}
1. Install the package
2. Add to `INSTALLED_APPS`
3. Start writing magical markdown!
{~~}

## What Are SpellBlocks?

SpellBlocks are reusable content components that you can embed directly in your markdown files. They work like Django template tags but are designed specifically for enhancing your documentation. With SpellBlocks, you can:

- Create visually distinct sections for different types of content
- Maintain consistent styling throughout your documentation
- Add interactive elements without writing HTML
- Organize complex information in a user-friendly way

## Basic SpellBlock Syntax

All SpellBlocks follow a consistent syntax:

```django
{~ block_name parameter="value" another_parameter="value" ~}
Your content goes here.
This content can include **markdown** formatting.
{~~}
```

## Available SpellBlocks

Django Spellbook comes with several built-in SpellBlocks to immediately enhance your documentation:

### Alert Block

Create attention-grabbing message boxes with different severity levels.

```django
{~ alert type="warning" ~}
Be careful with this setting in production!
{~~}
```

{~ alert type="warning" ~}
Be careful with this setting in production!
{~~}

[Explore the Alert Block →](/examples/spellblocks/alert)

### Card Block

Organize content in visexamples/introduction/ually distinct containers with optional headers and footers.

```django
{~ card title="Installation" footer="Updated June 2023" ~}
Install Django Spellbook using pip:

`pip install django-spellbook`
{~~}
```

{~ card title="Installation" footer="Updated June 2023" ~}
Install Django Spellbook using pip:

`pip install django-spellbook`
{~~}

[Explore the Card Block →](/examples/spellblocks/card)

### Quote Block

Add stylized quotations with attribution.

```django
{~ quote author="Django's Documentation" source="Design Philosophies" ~}
Explicit is better than implicit.
{~~}
```

{~ quote author="Django's Documentation" source="Design Philosophies" ~}
Explicit is better than implicit.
{~~}

[Explore the Quote Block →](/examples/spellblocks/quote)

### Practice Block

Create structured practice exercises with metadata.

```django
{~ practice difficulty="Beginner" timeframe="10 minutes" impact="Medium" focus="Django Templates" ~}
### Your First Template
Create a simple Django template that displays a greeting message.
{~~}
```

{~ practice difficulty="Beginner" timeframe="10 minutes" impact="Medium" focus="Django Templates" ~}
### Your First Template
Create a simple Django template that displays a greeting message.
{~~}

[Explore the Practice Block →](/docs/spellblocks/practice)

## Why Use SpellBlocks?

SpellBlocks offer several advantages over plain markdown:

{~ card title="Consistency" ~}
Ensure visual and structural consistency across your entire documentation.
{~~}

{~ card title="Readability" ~}
Improve the readability of both your source markdown and the rendered output.
{~~}

{~ card title="Maintainability" ~}
Update the appearance of all instances by changing the SpellBlock template.
{~~}

{~ card title="Extensibility" ~}
Create custom SpellBlocks for your project's specific documentation needs.
{~~}

