---
title: Progress
created: 2025-05-13
tags:
  - spellblock
  - component
  - progress
  - ui
  - documentation
---

# Progress SpellBlock (`~ progress ~`)

The `~ progress ~` SpellBlock is a versatile tool for visualizing progress, completion percentage, skill level, funding status, or any value relative to a maximum. It provides a clear visual indicator that can be easily customized with an optional popover for additional context.

## Basic Usage

At its simplest, provide a `value` (which defaults to being measured against a `max_value` of 100):

```markdown
{~ progress value="65" ~}
{~~}
```

This renders a progress bar showing 65%:

{~ progress value="65" ~}
{~~}

## Parameters

Customize the appearance and behavior using these parameters:

* **`value`** (Required, Float/Int): The current value to display.
* **`max_value`** (Float/Int, Default: `100`): The maximum possible value. The bar's width is calculated as `(value / max_value) * 100`.
* **`label`** (String, Optional): Text displayed with the progress bar, often inside it. Supports variable interpolation (see below).
* **`show_percentage`** (Boolean, Default: `true` if `label` is not set, `false` otherwise): Determines if the percentage value is displayed inside the bar. This is overridden if `{{percentage}}` is used in the `label`.
* **`color`** (String, Default: `"primary"`): Sets the progress bar's fill color using predefined theme colors (e.g., `primary`, `secondary`, `success`, `info`, `warning`, `danger`, or even `white-25`, `black-75` for specific effects). Maps to `sb-bg-*` utility classes.
* **`bg_color`** (String, Default: `"white-50"`): Sets the track (background) color of the progress bar itself using predefined theme colors. Maps to `sb-bg-*` utility classes.
* **`height`** (String, Default: `"md"`): Adjusts the bar's height. Common values: `"sm"` (small), `"md"` (medium), `"lg"` (large). These map to utility classes like `sb-h-4`, `sb-h-8`, `sb-h-16` respectively in the provided template.
* **`striped`** (Boolean, Default: `false`): Adds a striped pattern to the bar's fill.
* **`animated`** (Boolean, Default: `false`): Animates the stripes (requires `striped="true"`).
* **`rounded`** (Boolean, Default: `true`): Applies rounded corners to the bar and track. Maps to `sb-border-radius-md` or similar.
* **`class`** (String, Optional): Adds custom CSS classes to the main container element (`.sb-progress-container`).
* **`id`** (String, Optional): Adds a custom HTML `id` attribute to the main container. Useful for specific targeting with CSS or JavaScript.
* The content between `~ progress ... ~` and `~~` will be used for the popover when the progress bar is hovered.

## Examples

### Using Labels & Colors

Provide context and visual cues with `label` and `color`.

**Skill Proficiency:**
The content between the tags will appear in a popover on hover.

```markdown
{~ progress value="85" label="Python Proficiency: {{percentage}}" color="success" height="sm" ~}
Python is a powerful and versatile programming language. It is used in a wide range of applications, from web development to data analysis and machine learning.
{~~}
```

Renders as:
{~ progress value="85" label="Python Proficiency: {{percentage}}" color="success" height="sm" ~}
Python is a powerful and versatile programming language. It is used in a wide range of applications, from web development to data analysis and machine learning.
{~~}

**Changing Background Color:**
Note how `color` affects the fill and `bg_color` affects the track.

```markdown
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="white-25" bg_color="black-75" ~}
This project aims to raise $10,000 for new spellbook enchantments.
{~~}
```

Renders as:
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="white-25" bg_color="black-75" ~}
This project aims to raise $10,000 for new spellbook enchantments.
{~~}

**Course Progress:**

```markdown
{~ progress value="3" max_value="5" label="Modules: {{value}} / {{max_value}}" color="info" ~}
You've completed 3 out of 5 modules. Keep up the great work!
{~~}
```

Renders as:
{~ progress value="3" max_value="5" label="Modules: {{value}} / {{max_value}}" color="info" ~}
You've completed 3 out of 5 modules. Keep up the great work!
{~~}

### Using `max_value`

Track progress towards a specific goal other than 100.

**Fundraising Goal:**

```markdown
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}} ({{percentage}})" color="primary" rounded="false" height="lg" ~}
Current contributions for the new library wing.
{~~}
```

Renders as:
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}} ({{percentage}})" color="primary" rounded="false" height="lg" ~}
Current contributions for the new library wing.
{~~}

### Striped & Animated

Add visual flair for active processes or goals.

**Processing Data:**

```markdown
{~ progress value="45" label="Processing... {{percentage}}" color="warning" striped="true" animated="true" ~}
Currently analyzing ancient scrolls. This may take a moment.
{~~}
```

Renders as:
{~ progress value="45" label="Processing... {{percentage}}" color="warning" striped="true" animated="true" ~}
Currently analyzing ancient scrolls. This may take a moment.
{~~}

### Completion State

Use `color="success"` for completed tasks.

**Task Complete:**

```markdown
{~ progress value="100" label="Deployment Successful!" color="success" ~}
The new enchantments have been successfully deployed to the live grimoire!
{~~}
```

Renders as:
{~ progress value="100" label="Deployment Successful!" color="success" ~}
The new enchantments have been successfully deployed to the live grimoire!
{~~}

## Label Interpolation

The `label` parameter allows dynamic text using these placeholders:
*Remember to use double curly braces, I only use single curly braces in the examples outside of code blocks.*  

* **`{value}`**: Replaced with the raw `value` passed to the block.
* **`{max_value}`**: Replaced with the raw `max_value` passed to the block (or its default).
* **`{percentage}`**: Replaced with the calculated percentage (e.g., `75.0%`).

{~ alert type="info" ~}
Using `{{percentage}}` in the `label` will typically cause the percentage value to be displayed inside the bar, even if `show_percentage` would otherwise default to `false`. Literal curly braces in other contexts within the label text should render as typed.
{~~}

## Height Adjustments & Popover Content

The content between the `progress` tags becomes the popover detail.

**Large Progress Bar with Details:**

```markdown
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="info" striped="true" animated="true" height="lg" ~}
My content Here. It explains what this progress bar represents, providing more details on hover for the aspiring mage.
{~~}
```

Renders as:
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="info" striped="true" animated="true" height="lg" ~}
My content Here. It explains what this progress bar represents, providing more details on hover for the aspiring mage.
{~~}

**Small Progress Bar with Different Popover Style (Illustrative - popover style is global):**
*Note: The popover's visual style (like background/text color) is generally global from the CSS. Specific parameters `content_bg_color` or `content_color` for the popover are not standard for this block unless you've custom-built that functionality.*

```markdown
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="error" bg_color="neutral-25" striped="true" height="sm" ~}
This indicates a critical funding shortfall! The popover will explain the dire consequences.
{~~}
```

Renders as:
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="error" bg_color="neutral-25" striped="true" height="sm" ~}
This indicates a critical funding shortfall! The popover will explain the dire consequences.
{~~}

---
