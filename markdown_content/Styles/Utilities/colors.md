---
title: Color Utilities
created: 2025-06-02
tags:
  - styles
  - utilities
  - colors
  - css
---

# Color Utilities

Django Spellbook provides a comprehensive set of utility classes to control text, background, and border colors. These utilities are designed to work with your defined theme colors and also offer direct color application, opacity variants, and hover state controls.

All color utilities rely on CSS custom properties (variables) defined in your `base/variables.css` for themeable colors (e.g., `var(--primary-color)`), with sensible fallbacks.

## Theme Colors

Apply core semantic colors from your application's theme to backgrounds, text, and borders.

### 1. Background Colors

Use `sb-bg-{theme_color}` to apply themed background colors.

* `sb-bg-primary`: Applies the primary theme background color.
* `sb-bg-secondary`: Applies the secondary theme background color.
* `sb-bg-accent`: Applies the accent theme background color.
* `sb-bg-neutral`: Applies the neutral theme background color.
* `sb-bg-success`: Used for success states.
* `sb-bg-warning`: Used for warning states.
* `sb-bg-error`: Used for error/danger states.
* `sb-bg-info`: Used for informational states.

**Example:**

```django
<div class="sb-p-3 sb-bg-primary sb-white">Primary Background</div>
<div class="sb-p-3 sb-bg-secondary sb-white sb-mt-2">Secondary Background</div>
<div class="sb-p-3 sb-bg-accent sb-black sb-mt-2">Accent Background</div>
<div class="sb-p-3 sb-bg-success sb-white sb-mt-2">Success Background</div>
```

{% div .sb-p-3 .sb-bg-primary .sb-white %}
Primary Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-secondary .sb-white .sb-mt-2 %}
Secondary Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-accent .sb-black .sb-mt-2 %}
Accent Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-success .sb-white .sb-mt-2 %}
Success Background
{% enddiv %}

### 2. Text Colors

Use `sb-{theme_color}` to apply themed text colors (e.g., `sb-primary` for primary text color).

* `sb-primary`: Applies the primary theme text color.
* `sb-secondary`: Applies the secondary theme text color.
* `sb-accent`: Applies the accent theme text color.
* `sb-neutral`: Applies the neutral theme text color.
* `sb-success`: Text color for success states.
* `sb-warning`: Text color for warning states.
* `sb-error`: Text color for error/danger states.
* `sb-info`: Text color for informational states.

**Example:**

```django
<p class="sb-primary">This text uses the primary color.</p>
<p class="sb-secondary sb-mt-1">This text uses the secondary color.</p>
<p class="sb-accent sb-mt-1">This text uses the accent color.</p>
<p class="sb-error sb-mt-1">This text uses the error color.</p>
```

{% div .sb-primary %}
This text uses the primary color.
{% enddiv %}

{% div .sb-secondary .sb-mt-1 %}
This text uses the secondary color.
{% enddiv %}

{% div .sb-accent .sb-mt-1 %}
This text uses the accent color.
{% enddiv %}

{% div .sb-error .sb-mt-1 %}
This text uses the error color.
{% enddiv %}

### 3. Border Colors

Use `sb-border-{theme_color}` to apply themed border colors. Remember to also apply a border width utility (e.g., `sb-border` or `sb-border-2`) and `sb-border-solid` (or another border style) for the border to be visible.

* `sb-border-primary`: Primary theme border color.
* `sb-border-secondary`: Secondary theme border color.
* `sb-border-accent`: Accent theme border color.
* `sb-border-neutral`: Neutral theme border color.
* `sb-border-success`: Border color for success states.
* `sb-border-warning`: Border color for warning states.
* `sb-border-error`: Border color for error/danger states.
* `sb-border-info`: Border color for informational states.

**Example:**

```django
<div class="sb-p-3 sb-border sb-border-solid sb-border-primary">Primary Border</div>
<div class="sb-p-3 sb-border-2 sb-border-solid sb-border-secondary sb-mt-2">Secondary Border (2px)</div>
<div class="sb-p-3 sb-border sb-border-solid sb-border-accent sb-mt-2">Accent Border</div>
<div class="sb-p-3 sb-border-4 sb-border-solid sb-border-error sb-mt-2">Error Border (4px)</div>
```

{% div .sb-p-3 .sb-border .sb-border-solid .sb-border-primary %}
Primary Border
{% enddiv %}

{% div .sb-p-3 .sb-border-2 .sb-border-solid .sb-border-secondary .sb-mt-2 %}
Secondary Border (2px)
{% enddiv %}

{% div .sb-p-3 .sb-border .sb-border-solid .sb-border-accent .sb-mt-2 %}
Accent Border
{% enddiv %}

{% div .sb-p-3 .sb-border-4 .sb-border-solid .sb-border-error .sb-mt-2 %}
Error Border (4px)
{% enddiv %}

## Opacity Variants

Many theme colors for backgrounds, text, and borders have opacity variants. Append `-25`, `-50`, or `-75` to the color utility class for 25%, 50%, or 75% opacity, respectively. These are generated using `color-mix()`.

**Background Opacity Example:**

```django
<div class="sb-p-3 sb-bg-primary-50 sb-black">50% opacity primary background</div>
<div class="sb-p-3 sb-bg-success-25 sb-black sb-mt-2">25% opacity success background</div>
```

{% div .sb-p-3 .sb-bg-primary-50 .sb-black %}
50% opacity primary background
{% enddiv %}

{% div .sb-p-3 .sb-bg-success-25 .sb-black .sb-mt-2 %}
25% opacity success background
{% enddiv %}

**Text Opacity Example:**

```django
<p class="sb-primary-75">75% opacity primary text.</p>
<p class="sb-error-50 sb-mt-1">50% opacity error text.</p>
```

{% div .sb-primary-75 %}
75% opacity primary text.
{% enddiv %}

{% div .sb-error-50 .sb-mt-1 %}
50% opacity error text.
{% enddiv %}

**Border Opacity Example:**

```django
<div class="sb-p-3 sb-border-2 sb-border-solid sb-border-accent-50">50% opacity accent border (2px)</div>
```

{% div .sb-p-3 .sb-border-2 .sb-border-solid .sb-border-accent-50 %}
50% opacity accent border (2px)
{% enddiv %}

## Hover State Color Utilities

Apply colors specifically on hover using the `sb-hover:` prefix. Combine with transition utilities like `sb-transition-all` or `sb-transition-colors` for smooth effects.

### 1. Hover Background Colors

* `sb-hover:bg-{theme_color}` (e.g., `sb-hover:bg-primary`)
* `sb-hover:bg-{theme_color}-{opacity}` (e.g., `sb-hover:bg-primary-50`)
* `sb-hover:bg-black`, `sb-hover:bg-white`

**Example:**

```django
<div class="sb-p-3 sb-bg-neutral-25 
sb-hover:bg-primary sb-hover:white <!-- Colors are applied when hovered -->
sb-transition-all sb-duration-200 sb-cursor-pointer">
  Hover for Primary Background & White Text
</div>
```

{% div .sb-p-3 .sb-bg-neutral-25 .sb-hover:bg-primary .sb-hover:white .sb-transition-all .sb-duration-200 .sb-cursor-pointer %}
Hover for Primary Background & White Text
{% enddiv %}

### 2. Hover Text Colors

* `sb-hover:{theme_color}` (e.g., `sb-hover:secondary`)
* `sb-hover:{theme_color}-{opacity}` (e.g., `sb-hover:accent-75`)
* `sb-hover:black`, `sb-hover:white`

**Example:**

```django
<p class="sb-neutral 
sb-hover:success <!-- Colors are applied when hovered -->
sb-transition-color sb-duration-200 sb-cursor-pointer">
  Hover for Success Text
</p>
```

{% div .sb-neutral .sb-hover:success .sb-transition-color .sb-duration-200 .sb-cursor-pointer %}
Hover for Success Text
{% enddiv %}

### 3. Hover Border Colors

* `sb-hover:border-{theme_color}` (e.g., `sb-hover:border-warning`)
* `sb-hover:border-{theme_color}-{opacity}` (e.g., `sb-hover:border-info-50`)

**Example:**

```django
<div class="sb-p-3 sb-border sb-border-solid sb-border-neutral-50 
sb-hover:border-error <!-- Colors are applied when hovered -->
sb-transition-all sb-duration-200 sb-cursor-pointer">
  Hover for Error Border
</div>
```

{% div .sb-p-3 .sb-border .sb-border-solid .sb-border-neutral-50 .sb-hover:border-error .sb-transition-all .sb-duration-200 .sb-cursor-pointer %}
Hover for Error Border
{% enddiv %}

## Special Color Values

Additional utility colors for common cases.

### Backgrounds
* `sb-bg-transparent`: Transparent background.
* `sb-bg-black`: Pure black background.
* `sb-bg-white`: Pure white background.
* Opacity variants like `sb-bg-black-25`, `sb-bg-white-75` are also available.

**Example:**

```django
<div class="sb-p-3 sb-bg-black sb-white">Black Background</div>
<div class="sb-p-3 sb-bg-white sb-black sb-border sb-border-solid sb-border-neutral-25 sb-mt-2">White Background</div>
<div class="sb-p-3 sb-bg-transparent sb-black sb-border sb-border-solid sb-border-neutral-50 sb-mt-2">Transparent Background</div>
```

{% div .sb-p-3 .sb-bg-black .sb-white %}
Black Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-white .sb-black .sb-border .sb-border-solid .sb-border-neutral-25 .sb-mt-2 %}
White Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-transparent .sb-black .sb-border .sb-border-solid .sb-border-neutral-50 .sb-mt-2 %}
Transparent Background
{% enddiv %}

### Text Colors
* `sb-black`: Pure black text.
* `sb-white`: Pure white text.
* Opacity variants like `sb-black-50`, `sb-white-75` are also available.

**Example:**

```django
<p class="sb-black">This is black text.</p>
<p class="sb-white sb-bg-neutral sb-p-1 sb-mt-1">This is white text (on a neutral background).</p>
```

{% div .sb-black %}
This is black text.
{% enddiv %}

{% div .sb-white .sb-bg-neutral .sb-p-1 .sb-mt-1 %}
This is white text (on a neutral background).
{% enddiv %}

### Border Colors

* `sb-border-black`: Pure black border.
* `sb-border-white`: Pure white border.
* `sb-border-transparent`: Transparent border.
* Opacity variants are also available.

**Example:**

```django
<div class="sb-p-3 sb-border-2 sb-border-solid sb-border-black">Black Border</div>
<div class="sb-p-3 sb-border-2 sb-border-solid sb-border-white sb-bg-neutral sb-mt-2">White Border (on neutral background)</div>
```

{% div .sb-p-3 .sb-border-2 .sb-border-solid .sb-border-black %}
Black Border
{% enddiv %}

{% div .sb-p-3 .sb-border-2 .sb-border-solid .sb-border-white .sb-bg-neutral .sb-mt-2 %}
White Border (on neutral background)
{% enddiv %}

---

{% a href="/docs/Styles/effects" .super-link %}
Continue to Effects Utilities
{% enda %}

---

## Bonus Colors

Beyond the primary theme and status colors, Django Spellbook offers several "bonus" abstract colors to provide additional design flexibility for specific highlights, subtle treatments, or distinct visual sections. Like other theme colors, these support background, text, border, opacity, and hover state utilities.

### 1. Emphasis Color

Use the `emphasis` color utilities for elements that require strong visual prominence without necessarily indicating a status. Ideal for alternative calls-to-action or highlighting key features. (Defaults to a vibrant purple via `var(--emphasis-color)`).

**Background:**

```django
<div class="sb-p-3 sb-bg-emphasis sb-white">Emphasis Background</div>
<div class="sb-p-3 sb-bg-emphasis-50 sb-black sb-mt-2">50% Opacity Emphasis Background</div>
```

{% div .sb-p-3 .sb-bg-emphasis .sb-white %}
Emphasis Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-emphasis-50 .sb-black .sb-mt-2 %}
50% Opacity Emphasis Background
{% enddiv %}

**Text:**

```django
<p class="sb-emphasis">This text uses the emphasis color.</p>
<p class="sb-emphasis-75 sb-mt-1">75% opacity emphasis text.</p>
```

{% div .sb-emphasis %}
This text uses the emphasis color.
{% enddiv %}

{% div .sb-emphasis-75 .sb-mt-1 %}
75% opacity emphasis text.
{% enddiv %}

**Border:**

```django
<div class="sb-p-3 sb-border-2 sb-border-solid sb-border-emphasis">Emphasis Border</div>
```

{% div .sb-p-3 .sb-border-2 .sb-border-solid .sb-border-emphasis %}
Emphasis Border
{% enddiv %}

**Hover Example:**

```django
<div class="sb-p-3 sb-bg-neutral-25 sb-hover:bg-emphasis sb-hover:white sb-transition-all sb-cursor-pointer">
  Hover for Emphasis Background
</div>
```

{% div .sb-p-3 .sb-bg-neutral-25 .sb-hover:bg-emphasis .sb-hover:white .sb-transition-all .sb-cursor-pointer %}
Hover for Emphasis Background
{% enddiv %}

### 2. Subtle Color

Use the `subtle` color utilities for backgrounds of less critical sections, placeholder text, subtle borders, or UI elements that should recede visually. (Defaults to a very light gray via `var(--subtle-color)`).

**Background:**

```django
<div class="sb-p-3 sb-bg-subtle sb-black">Subtle Background (Very Light Gray)</div>
<div class="sb-p-3 sb-bg-subtle-50 sb-black sb-mt-2">50% Opacity Subtle Background</div>
```

{% div .sb-p-3 .sb-bg-subtle .sb-black %}
Subtle Background (Very Light Gray)
{% enddiv %}

{% div .sb-p-3 .sb-bg-subtle-50 .sb-black .sb-mt-2 %}
50% Opacity Subtle Background
{% enddiv %}

**Text:**

```django
<p class="sb-subtle sb-bg-black sb-p-1">This text uses the subtle color (on a dark background for visibility).</p>
<p class="sb-subtle-75 sb-bg-black sb-p-1 sb-mt-1">75% opacity subtle text (on a dark background for visibility).</p>
```

{% div .sb-subtle .sb-bg-black .sb-p-1 %}
This text uses the subtle color (on a dark background for visibility).
{% enddiv %}

{% div .sb-subtle-75 .sb-bg-black .sb-p-1 .sb-mt-1 %}
75% opacity subtle text (on a dark background for visibility).
{% enddiv %}

**Border:**

```django
<div class="sb-p-3 sb-border sb-border-solid sb-border-subtle">Subtle Border</div>
```

{% div .sb-p-3 .sb-border .sb-border-solid .sb-border-subtle %}
Subtle Border
{% enddiv %}

**Hover Example:**

```django
<p class="sb-neutral sb-hover:subtle-75 sb-bg-black sb-p-1 sb-transition-color sb-cursor-pointer">
  Hover for 75% Opacity Subtle Text (on dark bg)
</p>
```

{% div .sb-neutral .sb-hover:subtle-75 .sb-bg-black .sb-p-1 .sb-transition-color .sb-cursor-pointer %}
Hover for 75% Opacity Subtle Text (on dark bg)
{% enddiv %}

### 3. Distinct Color

Use the `distinct` color utilities for an alternative branding accent, categorizing content, or adding unique visual interest where other theme colors might not be the desired fit. (Defaults to a vibrant cyan/teal via `var(--distinct-color)`).

**Background:**

```django
<div class="sb-p-3 sb-bg-distinct sb-white">Distinct Background</div>
<div class="sb-p-3 sb-bg-distinct-25 sb-black sb-mt-2">25% Opacity Distinct Background</div>
```

{% div .sb-p-3 .sb-bg-distinct .sb-white %}
Distinct Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-distinct-25 .sb-black .sb-mt-2 %}
25% Opacity Distinct Background
{% enddiv %}

**Text:**

```django
<p class="sb-distinct">This text uses the distinct color.</p>
<p class="sb-distinct-50 sb-mt-1">50% opacity distinct text.</p>
```

{% div .sb-distinct %}
This text uses the distinct color.
{% enddiv %}

{% div .sb-distinct-50 .sb-mt-1 %}
50% opacity distinct text.
{% enddiv %}

**Border:**

```django
<div class="sb-p-3 sb-border-3 sb-border-solid sb-border-distinct">Distinct Border (3px)</div>
```

{% div .sb-p-3 .sb-border-3 .sb-border-solid .sb-border-distinct %}
Distinct Border (3px)
{% enddiv %}

**Hover Example:**

```django
<div class="sb-p-3 sb-border sb-border-solid sb-border-neutral-50 sb-hover:border-distinct sb-transition-all sb-cursor-pointer">
  Hover for Distinct Border
</div>
```

{% div .sb-p-3 .sb-border .sb-border-solid .sb-border-neutral-50 .sb-hover:border-distinct .sb-transition-all .sb-cursor-pointer %}
Hover for Distinct Border
{% enddiv %}

---

## RPG Themed Bonus Colors

These abstractly named colors are tailored for use in magical RPG settings, providing thematic options for representing arcane energies, ancient artifacts, and natural environments. Ensure you have defined `--aether-color`, `--artifact-color`, and `--sylvan-color` in your `base/variables.css` and created corresponding utility classes (e.g., `sb-bg-aether`, `sb-aether`, `sb-border-aether`, plus opacity and hover variants if desired).

### 1. Aether Color

Represents raw magical energy, enchantments, psionics, or otherworldly phenomena. (Example default: vibrant fuchsia/magenta `var(--aether-color)`).

**Background:**

```django
<div class="sb-p-3 sb-bg-aether sb-white">Aetheric Glow Background</div>
<div class="sb-p-3 sb-bg-aether-50 sb-black sb-mt-2">50% Opacity Aether Background</div>
```

{% div .sb-p-3 .sb-bg-aether .sb-white %}
Aetheric Glow Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-aether-50 .sb-black .sb-mt-2 %}
50% Opacity Aether Background
{% enddiv %}

**Text:**

```django
<p class="sb-aether">This text shimmers with aetheric power.</p>
<p class="sb-aether-75 sb-mt-1">75% opacity aether text.</p>
```

{% div .sb-aether %}
This text shimmers with aetheric power.
{% enddiv %}

{% div .sb-aether-75 .sb-mt-1 %}
75% opacity aether text.
{% enddiv %}

**Border:**

```django
<div class="sb-p-3 sb-border-2 sb-border-solid sb-border-aether">Aether-Bound Border</div>
```

{% div .sb-p-3 .sb-border-2 .sb-border-solid .sb-border-aether %}
Aether-Bound Border
{% enddiv %}

**Hover Example:**

```django
<div class="sb-p-3 sb-bg-neutral-25 sb-hover:bg-aether sb-hover:white sb-transition-all sb-cursor-pointer">
  Hover for Aether Background
</div>
```

{% div .sb-p-3 .sb-bg-neutral-25 .sb-hover:bg-aether .sb-hover:white .sb-transition-all .sb-cursor-pointer %}
Hover for Aether Background
{% enddiv %}

### 2. Artifact Color

Signifies ancient lore, powerful relics, hidden knowledge, or aged, valuable items. (Example default: antique gold `var(--artifact-color)`).

**Background:**
```django

<div class="sb-p-3 sb-bg-artifact sb-black">Ancient Artifact Background</div>
<div class="sb-p-3 sb-bg-artifact-50 sb-black sb-mt-2">50% Opacity Artifact Background</div>
```

{% div .sb-p-3 .sb-bg-artifact .sb-black %}
Ancient Artifact Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-artifact-50 .sb-black .sb-mt-2 %}
50% Opacity Artifact Background
{% enddiv %}

**Text:**

```django
<p class="sb-artifact">Text of ancient power.</p>
<p class="sb-artifact-75 sb-bg-black sb-p-1 sb-mt-1">75% opacity artifact text (on dark bg).</p>
```

{% div .sb-artifact %}
Text of ancient power.
{% enddiv %}

{% div .sb-artifact-75 .sb-bg-black .sb-p-1 .sb-mt-1 %}
75% opacity artifact text (on dark bg).
{% enddiv %}

**Border:**

```django
<div class="sb-p-3 sb-border sb-border-solid sb-border-artifact">Relic Border</div>
```

{% div .sb-p-3 .sb-border .sb-border-solid .sb-border-artifact %}
Relic Border
{% enddiv %}

**Hover Example:**

```django
<p class="sb-neutral sb-hover:artifact-75 sb-bg-black sb-p-1 sb-transition-color sb-cursor-pointer">
  Hover for 75% Opacity Artifact Text (on dark bg)
</p>
```

{% div .sb-neutral .sb-hover:artifact-75 .sb-bg-black .sb-p-1 .sb-transition-color .sb-cursor-pointer %}
Hover for 75% Opacity Artifact Text (on dark bg)
{% enddiv %}

### 3. Sylvan Color

Represents deep forests, untamed wilds, nature-based magic, or earthy elements. (Example default: deep mossy green `var(--sylvan-color)`).

**Background:**

```django
<div class="sb-p-3 sb-bg-sylvan sb-white">Deep Forest Background</div>
<div class="sb-p-3 sb-bg-sylvan-25 sb-black sb-mt-2">25% Opacity Sylvan Background</div>
```

{% div .sb-p-3 .sb-bg-sylvan .sb-white %}
Deep Forest Background
{% enddiv %}

{% div .sb-p-3 .sb-bg-sylvan-25 .sb-black .sb-mt-2 %}
25% Opacity Sylvan Background
{% enddiv %}

**Text:**

```django
<p class="sb-sylvan">Whispers of the sylvan woods.</p>
<p class="sb-sylvan-50 sb-mt-1">50% opacity sylvan text.</p>
```

{% div .sb-sylvan %}
Whispers of the sylvan woods.
{% enddiv %}

{% div .sb-sylvan-50 .sb-mt-1 %}
50% opacity sylvan text.
{% enddiv %}

**Border:**

```django
<div class="sb-p-3 sb-border-3 sb-border-solid sb-border-sylvan">Sylvan Grove Border (3px)</div>
```

{% div .sb-p-3 .sb-border-3 .sb-border-solid .sb-border-sylvan %}
Sylvan Grove Border (3px)
{% enddiv %}

**Hover Example:**

```django
<div class="sb-p-3 sb-border sb-border-solid sb-border-neutral-50 sb-hover:border-sylvan sb-transition-all sb-cursor-pointer">
  Hover for Sylvan Border
</div>
```

{% div .sb-p-3 .sb-border .sb-border-solid .sb-border-neutral-50 .sb-hover:border-sylvan .sb-transition-all .sb-cursor-pointer %}
Hover for Sylvan Border
{% enddiv %}