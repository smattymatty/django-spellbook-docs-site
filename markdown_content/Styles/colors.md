# Color Utilities

**Control text and background colors with our semantic color system.**

## Theme Colors

**Core semantic colors for your application.**

Background colors:

- `sb-bg-primary`: Primary brand color
- `sb-bg-secondary`: Secondary brand color
- `sb-bg-accent`: Accent highlights
- `sb-bg-neutral`: Neutral/base color
- `sb-bg-error`: Error states
- `sb-bg-warning`: Warning states
- `sb-bg-success`: Success states
- `sb-bg-info`: Information states

Text colors:

- `sb-primary`: Primary text
- `sb-secondary`: Secondary text
- `sb-accent`: Accent text
- `sb-neutral`: Neutral text
- `sb-error`: Error text
- `sb-warning`: Warning text
- `sb-success`: Success text
- `sb-info`: Info text

Border colors:

- `sb-border-primary`: Primary border color
- `sb-border-secondary`: Secondary border color
- `sb-border-accent`: Accent border color
- `sb-border-neutral`: Neutral border color
- `sb-border-error`: Error border color
- `sb-border-warning`: Warning border color
- `sb-border-success`: Success border color
- `sb-border-info`: Info border color

## Opacity Variants

**Semi-transparent versions of colors.**

Theme color opacities:

- `-25`: 25% opacity
- `-50`: 50% opacity
- `-75`: 75% opacity

Example:
```django
<div class="sb-bg-primary-50">
    50% opacity primary background
</div>
<p class="sb-primary-75">
    75% opacity primary text
</p>
```


## Special Values

**Additional utility colors.**

- `sb-bg-transparent`: Transparent background
- `sb-bg-black`: Pure black
- `sb-bg-white`: Pure white

{% a href="/docs/Styles/effects" .super-link %}
Continue to Effects Utilities
{% enda %}