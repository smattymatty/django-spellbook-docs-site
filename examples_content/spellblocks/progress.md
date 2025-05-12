---
title: Progress SpellBlock
created: 2025-05-12
tags:
  - spellblock
  - component
  - progress
  - ui
---

# Progress SpellBlock (`~ progress ~`)

The `~ progress ~` SpellBlock is a versatile tool for visualizing progress, completion percentage, skill level, funding status, or any value relative to a maximum. It provides a clear visual indicator that can be easily customized.

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

{~ accordion title="Available Parameters" open=true ~}

* **`value`** (Required, Float/Int): The current value to display.
* **`max_value`** (Float/Int, Default: `100`): The maximum possible value. The bar's width is calculated as `(value / max_value) * 100`.
* **`label`** (String, Optional): Text displayed with the progress bar. Supports variable interpolation (see below).
* **`show_percentage`** (Boolean, Default: `true` if `label` is not set, `false` otherwise): Determines if the percentage value is displayed inside the bar. This is overridden if `{{percentage}}` is used in the `label`.
* **`color`** (String, Default: `"primary"`): Sets the bar's background color using predefined theme colors (e.g., `primary`, `secondary`, `success`, `info`, `warning`, `danger`). Maps to `sb-bg-*` classes. Add suffix `-50`, `-25`, or `-75` to adjust the opacity of the color.
* **bg_color** (String, Default: `"white-50"`): Sets the bar's background color using predefined theme colors (e.g., `primary`, `secondary`, `success`, `info`, `warning`, `danger`). Maps to `sb-bg-*` classes. Add suffix `-50`, `-25`, or `-75` to adjust the opacity of the color.
* **`height`** (String, Default: `"md"`): Adjusts the bar's height. Common values: `"sm"`, `"md"`, `"lg"`. Maps to `sb-h-*` classes (or similar). Specific CSS units might also work if your CSS supports them.
* **`striped`** (Boolean, Default: `false`): Adds a striped pattern to the bar.
* **`animated`** (Boolean, Default: `false`): Animates the stripes (requires `striped="true"`).
* **`rounded`** (Boolean, Default: `true`): Applies rounded corners to the bar and track. Maps to `sb-border-radius-*` classes.
* **`class`** (String, Optional): Adds custom CSS classes to the main container element (`.sb-progress-container`).
* **`id`** (String, Optional): Adds a custom HTML `id` attribute to the main container.
{~~}

## Examples

### Using Labels & Colors

Provide context and visual cues with `label` and `color`.

**Skill Proficiency:**

```markdown
{% verbatim %}
{~ progress value="85" label="Python Proficiency: {{percentage}}" color="success" height="sm" ~}
{~~}
{% endverbatim %}
```

Renders as:
{~ progress value="85" label="Python Proficiency: {{percentage}}" color="success" height="sm" ~}
{~~}

**Changing Backround Color:**

```markdown
{% verbatim %}
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="white-25" bg_color="black-75" ~}
{~~}
{% endverbatim %}
```

Renders as:
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="white-25" bg_color="black-75" ~}
{~~}

**Course Progress:**

```markdown
{% verbatim %}
{~ progress value="3" max_value="5" label="Modules: {{value}} / {{max_value}}" color="info" ~}
{~~}
{% endverbatim %}
```

Renders as:
{~ progress value="3" max_value="5" label="Modules: {{value}} / {{max_value}}" color="info" ~}
{~~}

### Using `max_value`

Track progress towards a specific goal other than 100.

**Fundraising Goal:**
```markdown
{% verbatim %}
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}} ({{percentage}})" color="primary" rounded="false" height="lg" ~}
{~~}
{% endverbatim %}
```
Renders as:
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}} ({{percentage}})" color="primary" rounded="false" height="lg" ~}
{~~}

### Striped & Animated

Add visual flair for active processes or goals.

**Processing Data:**
```markdown
{% verbatim %}
{~ progress value="45" label="Processing... {{percentage}}" color="warning" striped="true" animated="true" ~}
{~~}
{% endverbatim %}
```
Renders as:
{~ progress value="45" label="Processing... {{percentage}}" color="warning" striped="true" animated="true" ~}
{~~}

### Completion State

Use `color="success"` for completed tasks.

**Task Complete:**
```markdown
{~ progress value="100" label="Deployment Successful!" color="success" ~}
{~~}
```
Renders as:
{~ progress value="100" label="Deployment Successful!" color="success" ~}
{~~}

## Label Interpolation

The `label` parameter allows dynamic text using these placeholders:

* **`{value}`**: Replaced with the raw `value` passed to the block.
* **`{max_value}`**: Replaced with the raw `max_value` passed to the block (or its default).
* **`{percentage}`**: Replaced with the calculated percentage (e.g., `75.0%`).

{~ alert type="info" ~}
Using `{percentage}` in the label will typically cause the percentage value to be displayed inside the bar, even if `show_percentage` would otherwise default to `false`. Literal curly braces in the label text are not supported if they mimic these placeholders.
{~~}

## Height Adjustments

```markdown
{% verbatim %}
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="info" striped="true" animated="true" height="lg" ~}
{~~}
{% endverbatim %}
```

{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="info" striped="true" animated="true" height="lg" ~}
{~~}

```markdown
{% verbatim %}
{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="info" striped="true" height="sm" ~}
{~~}
{% endverbatim %}
```

{~ progress value="7500" max_value="10000" label="Raised: ${{value}} / ${{max_value}}" color="info" striped="true" height="sm" color="error" ~}
{~~}

---