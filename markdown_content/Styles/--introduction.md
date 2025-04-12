# Introduction to Spellbook Styles

Django Spellbook includes a comprehensive set of utility and component classes that make it easy to style your content consistently. These styles were originally created for the built-in blocks, but they're available for you to use in your own templates and custom blocks.

## Including the Styles

Add the styles to your template with the `spellbook_styles` template tag:

```django
{% verbatim %}
{% load spellbook_tags %}
<head>
...
{% spellbook_styles %}
...
</head>
{% endverbatim %}
```

{~ alert type="warning" ~}
Be sure that they are included in the head of your HTML, preferrably in your base template or a `% block extra_css %', to make sure all extended templates will benefit.
{~~}

## Style Categories

Spellbook's styles are divided into two main categories:

### 1. Utility Classes

Small, single-purpose classes that handle common styling needs:

- Spacing (padding, margins)
- Borders and shadows
- Typography
- Colors
- Flexbox layouts
- Transitions

These are prefixed with `spellbook-` to avoid conflicts with your existing styles:

{% div class="spellbook-p-3 spellbook-mb-3 spellbook-border" %}
```html
<div class="spellbook-p-3 spellbook-mb-3 spellbook-border">
    Padded, with margin and border
</div>
```
{% enddiv %}

### 2. Component Classes
Pre-styled components used by the built-in blocks:

- Alert components
- Card layouts
- Navigation elements

These create consistent, polished UI elements:
```html
<div class="sb-card">
    <div class="sb-card-body">
        A nice card layout
    </div>
</div>
```

{% div .sb-card %}
{% div .sb-card-body %}
A nice card layout
{% enddiv %}
{% enddiv %}

{~ alert type="info" ~}
All Spellbook styles use the `sb-` prefix to prevent conflicts with your project's existing CSS. This means you can safely use them alongside other CSS frameworks.
{~~}

Want to see the specific classes available? Check out:

- [Border Utilities](/docs/Styles/borders)
- [Color Utilities](/docs/Styles/colors)
- [Effects Utilities](/docs/Styles/effects)
- [Flexbox & Grid Utilities](/docs/Styles/flexbox-grid)
- [Interactivity Utilities](/docs/Styles/interactivity)
- [Layout Utilities](/docs/Styles/layout)
- [Sizing Utilities](/docs/Styles/sizing)
- [Spacing Utilities](/docs/Styles/spacing)
- [Transition/Animation Utilities](/docs/Styles/transition-animation)
- [Typography Utilities](/docs/Styles/typography)

{~ card title="Style Philosophy" ~}
Spellbook's styles are designed to be:

- **Predictable**: consistent naming patterns
- **Non-invasive**: won't affect your existing styles
- **Composable**: mix and match as needed
- **Responsive**: work well on all devices
{~~}