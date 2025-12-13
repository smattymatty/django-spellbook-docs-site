---
title: Intro to Styles
published: 2025-12-12
modified: 2025-12-12
tags:
  - styles
  - css
  - utilities
---

Django Spellbook includes a utility-first CSS system. All classes use the `sb-` prefix to avoid conflicts with your existing styles.

## The sb- Prefix

Every Spellbook class starts with `sb-` so they never collide with Tailwind, Bootstrap, or your own CSS:
```html
<div class="sb-flex sb-justify-center sb-p-4 sb-bg-primary sb-rounded-lg">
    Your content
</div>
```

<div class="sb-flex sb-justify-center sb-p-4 sb-bg-primary sb-rounded-lg">
    Your content
</div>

## Including Styles

If you're using the default sidebar layout, styles are included automatically.

For custom templates:
```django
{% verbatim %}
{% load spellbook_tags %}

<head>
    {% spellbook_styles %}
</head>
{% endverbatim %}
```

This does two things:

1. Injects CSS variables from your `SPELLBOOK_THEME` setting
2. Links to the utility and component stylesheets

## Theme-Aware Colors

Colors aren't hardcoded. They reference CSS variables that change based on your theme:
```html
<!-- These adapt to whatever theme you're using -->
<div class="sb-bg-primary">Uses --primary-color</div>
<div class="sb-text-accent">Uses --accent-color</div>
<div class="sb-border-success">Uses --success-color</div>
```

Switch from `SPELLBOOK_THEME = 'default'` to `SPELLBOOK_THEME = 'arcane'` and every `sb-bg-primary` element changes from blue to purple. No CSS changes needed.

## Opacity Variants

Every color generates 25%, 50%, and 75% opacity variants automatically:
```html
<div class="sb-bg-primary">Full opacity</div>
<div class="sb-bg-primary-75">75% opacity</div>
<div class="sb-bg-primary-50">50% opacity</div>
<div class="sb-bg-primary-25">25% opacity</div>
```

## Hover States

Prefix with `sb-hover:` for hover effects:
```html
<button class="sb-bg-white sb-hover:bg-primary sb-hover:text-white">
    Hover me
</button>
```

## Using With SpellBlocks

The HTML element SpellBlocks (`div`, `span`, `section`, etc.) accept utility classes directly:
```markdown
{~ div class="sb-flex sb-gap-4 sb-p-6 sb-bg-surface sb-rounded-lg" ~}
Content with utility styling applied.
{~~}
```

---

## Reference

{~ accordion title="Colors" ~}
Background colors, text colors, border colors. All theme-aware with opacity variants and hover states.

[View Color Classes →](/docs/styles/colors/)
{~~}

{~ accordion title="Spacing" ~}
Padding, margin, and gap utilities. From `sb-p-0` to `sb-p-8` and everything in between.

[View Spacing Classes →](/docs/styles/spacing/)
{~~}

{~ accordion title="Layout" ~}
Flexbox, grid, width, height, display utilities. Building blocks for structure.

[View Layout Classes →](/docs/styles/layout/)
{~~}

{~ accordion title="Typography" ~}
Font sizes, weights, alignment, and text decoration.

[View Typography Classes →](/docs/styles/typography/)
{~~}

{~ accordion title="Components" ~}
Styles for SpellBlock components. Cards, alerts, accordions, progress bars, and more.

[View Component Classes →](/docs/styles/components/)
{~~}