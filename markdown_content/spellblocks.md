---
title: SpellBlocks Reference
published: 2025-12-12
modified: 2025-12-12
tags:
  - spellblocks
  - components
  - reference
---

SpellBlocks are reusable content components embedded directly in markdown. They render as styled HTML while you write in simple syntax.
```markdown
{~ blockname parameter="value" ~}
Content goes here
{~~}
```

---

## Component Blocks

Pre-styled, interactive components.

### alert

Highlight important information with colored callouts.
```markdown
{~ alert type="info" ~}
This is an informational message.
{~~}

{~ alert type="warning" ~}
Proceed with caution.
{~~}

{~ alert type="success" ~}
Operation completed successfully!
{~~}

{~ alert type="danger" ~}
This action cannot be undone.
{~~}
```

{~ alert type="info" ~}
This is an informational message.
{~~}

{~ alert type="warning" ~}
Proceed with caution.
{~~}

{~ alert type="success" ~}
Operation completed successfully!
{~~}

{~ alert type="danger" ~}
This action cannot be undone.
{~~}

| Parameter | Values | Default |
|-----------|--------|---------|
| `type` | `info`, `warning`, `success`, `danger`, `primary`, `secondary` | `info` |

---

### card

Container with optional header and footer.
```markdown
{~ card title="Getting Started" footer="Updated December 2025" ~}
Cards group related content with visual separation.

- Supports markdown inside
- Including **bold** and *italic*
- And lists
{~~}
```

{~ card title="Getting Started" footer="Updated December 2025" ~}
Cards group related content with visual separation.

- Supports markdown inside
- Including **bold** and *italic*
- And lists
{~~}

| Parameter | Description | Default |
|-----------|-------------|---------|
| `title` | Header text | None |
| `footer` | Footer text | None |
| `class` | Additional CSS classes | None |

---

### accordion

Collapsible content sections.
```markdown
{~ accordion title="Click to expand" ~}
This content is hidden until the user clicks.

Great for FAQs, optional details, or reducing page length.
{~~}

{~ accordion title="Start open" open="true" ~}
This accordion starts expanded.
{~~}
```

{~ accordion title="Click to expand" ~}
This content is hidden until the user clicks.

Great for FAQs, optional details, or reducing page length.
{~~}

{~ accordion title="Start open" open="true" ~}
This accordion starts expanded.
{~~}

| Parameter | Description | Default |
|-----------|-------------|---------|
| `title` | Clickable header text | Required |
| `open` | Start expanded | `false` |

---

### quote

Styled blockquotes with attribution.
```markdown
{~ quote author="Grace Hopper" source="Interview, 1986" ~}
The most dangerous phrase in the language is, "We've always done it this way."
{~~}
```

{~ quote author="Grace Hopper" source="Interview, 1986" ~}
The most dangerous phrase in the language is, "We've always done it this way."
{~~}

With author image:
```markdown
{~ quote author="Ada Lovelace" image="/static/images/ada.jpg" ~}
The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.
{~~}
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `author` | Attribution name | None |
| `source` | Source reference | None |
| `image` | Author image URL | None |
| `class` | Additional CSS classes | None |

---

### progress

Visual progress indicators.
```markdown
{~ progress value="75" label="{{percentage}}% Complete" ~}{~~}

{~ progress value="3" max_value="10" label="{{value}}/{{max_value}} tasks" color="success" ~}{~~}

{~ progress value="60" striped="true" animated="true" ~}{~~}
```

{~ progress value="75" label="{{percentage}}% Complete" ~}{~~}

{~ progress value="3" max_value="10" label="{{value}}/{{max_value}} tasks" color="success" ~}{~~}

{~ progress value="60" striped="true" animated="true" ~}{~~}

| Parameter | Description | Default |
|-----------|-------------|---------|
| `value` | Current progress value | `0` |
| `max_value` | Maximum value | `100` |
| `label` | Text label (supports `{{value}}`, `{{max_value}}`, `{{percentage}}`) | None |
| `color` | Bar color (theme colors) | `primary` |
| `bg_color` | Track background color | `white-50` |
| `height` | `sm`, `md`, `lg` | `md` |
| `striped` | Add stripe pattern | `false` |
| `animated` | Animate stripes | `false` |
| `rounded` | Round corners | `false` |
| `show_percentage` | Show percentage in bar | `false` |

---

### hero

Full-width hero sections for landing pages.
```markdown
{~ hero layout="text_left_image_right" image_src="/static/hero.jpg" image_alt="Hero image" ~}
# Welcome to Our Site

Start your journey here.
{~~}
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `layout` | Layout style (see below) | `text_left_image_right` |
| `image_src` | Image URL | None |
| `image_alt` | Image alt text | None |
| `bg_color` | Background color | None |
| `text_color` | Text color | `white` |
| `text_bg_color` | Text area background | `black-25` |
| `min_height` | Minimum height | `auto` |
| `id` | HTML id attribute | None |

**Layout options:**

| Layout | Description |
|--------|-------------|
| `text_left_image_right` | Two columns, text on left |
| `text_right_image_left` | Two columns, text on right |
| `text_center_image_background` | Centered text over background image |
| `text_only_centered` | Centered text, no image |
| `image_top_text_bottom` | Stacked, image above text |
| `image_only_full` | Full-bleed image |

---

### practice

Exercise or activity blocks with metadata.
```markdown
{~ practice difficulty="Beginner" timeframe="15 minutes" impact="High" focus="Python" ~}
## String Manipulation

Write a function that reverses a string without using built-in reverse methods.

1. Accept a string parameter
2. Return the reversed string
3. Handle edge cases (empty string, single character)
{~~}
```

{~ practice difficulty="Beginner" timeframe="15 minutes" impact="High" focus="Python" ~}
## String Manipulation

Write a function that reverses a string without using built-in reverse methods.

1. Accept a string parameter
2. Return the reversed string
3. Handle edge cases (empty string, single character)
{~~}

| Parameter | Description | Default |
|-----------|-------------|---------|
| `difficulty` | Difficulty level | `Moderate` |
| `timeframe` | Estimated time | `Varies` |
| `impact` | Learning impact | `Medium` |
| `focus` | Topic/skill focus | `General` |
| `class` | Additional CSS classes | None |

---

## HTML Elements

Semantic HTML with shorthand syntax. Use these for structure and styling without leaving markdown.

### Syntax
```markdown
{~ element .class-name #element-id attribute="value" ~}
Content
{~~}
```

- `.classname` — adds a CSS class (multiple allowed: `.class1 .class2`)
- `#id-name` — sets the element ID
- `attribute="value"` — any HTML attribute

### Available Elements

**Block elements:** `div`, `section`, `article`, `aside`, `header`, `footer`, `nav`, `main`

**Void elements:** `hr`, `br` (self-closing, no content)

### Examples

Basic structure:
```markdown
{~ section .features #main-features ~}
## Our Features

Feature content here.
{~~}
```
```html
<section class="features" id="main-features">
  <h2>Our Features</h2>
  <p>Feature content here.</p>
</section>
```

Multiple classes:
```markdown
{~ div .card .shadow .p-4 ~}
Styled container
{~~}
```

Horizontal rule:
```markdown
{~ hr .my-8 .border-accent ~}{~~}
```

---

## Framework Integration

HTML element blocks accept any attribute, making them perfect for frontend frameworks.

### HTMX
```markdown
{~ button hx-get="/api/load-more" hx-target="#results" hx-swap="beforeend" .btn .btn-primary ~}
Load More
{~~}

{~ div #results .mt-4 ~}
Results appear here...
{~~}
```

### Alpine.js
```markdown
{~ div x-data="{ open: false }" ~}

{~ button @click="open = !open" .btn ~}
Toggle Panel
{~~}

{~ div x-show="open" x-transition .panel ~}
Panel content revealed!
{~~}

{~~}
```

### Data Attributes
```markdown
{~ div data-controller="chart" data-chart-type="line" data-chart-animate="true" ~}
Chart container
{~~}
```

### ARIA Attributes
```markdown
{~ nav aria-label="Main navigation" role="navigation" ~}
- [Home](/)
- [About](/about/)
- [Contact](/contact/)
{~~}
```

---

## Nesting Blocks

SpellBlocks can be nested for complex layouts:
```markdown
{~ section .feature-grid ~}

{~ card title="Feature One" ~}
First feature description.
{~~}

{~ card title="Feature Two" ~}
Second feature description.
{~~}

{~ card title="Feature Three" ~}
Third feature description.
{~~}

{~~}
```

{~ section .feature-grid ~}

{~ card title="Feature One" ~}
First feature description.
{~~}

{~ card title="Feature Two" ~}
Second feature description.
{~~}

{~ card title="Feature Three" ~}
Third feature description.
{~~}

{~~}

---

## In Django Templates

Use SpellBlocks directly in templates with the `{% verbatim %}{% spellblock %}{% endverbatim %}` tag:
```django
{% verbatim %}
{% load spellbook_tags %}

{% spellblock 'alert' type='success' %}
    Welcome back, {{ user.username }}!
{% endspellblock %}

{% spellblock 'card' title=article.title %}
    {{ article.excerpt }}
{% endspellblock %}
{% endverbatim %}
```

Full Django template variable support. See [Template Tags](/docs/template-tags/) for details.

---

## Next Steps

{~ accordion title="Create Custom SpellBlocks" ~}
Build your own SpellBlocks with custom templates and logic.

[View Custom SpellBlocks →](/docs/customization/custom-spellblocks/)
{~~}

{~ accordion title="Style Classes" ~}
Utility classes for styling SpellBlocks and content.

[View Style Classes →](/docs/styles/introduction/)
{~~}

{~ accordion title="spellbook_render" ~}
Use SpellBlocks in Python code via the render function.

[View spellbook_render →](/docs/functions/spellbook-render/)
{~~}