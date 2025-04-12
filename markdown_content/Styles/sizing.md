# Sizing Utilities

**Control the dimensions of elements.**

## Width

**Control element width.**

Fixed widths:

- `sb-w-0`: 0
- `sb-w-1`: 0.25rem
- `sb-w-2`: 0.5rem
- `sb-w-4`: 1rem
- `sb-w-8`: 2rem
- `sb-w-16`: 4rem
- `sb-w-32`: 8rem
- `sb-w-64`: 16rem

Percentage widths:

- `sb-w-1/2`: 50%
- `sb-w-1/3`: 33.333333%
- `sb-w-2/3`: 66.666667%
- `sb-w-1/4`: 25%
- `sb-w-3/4`: 75%
- `sb-w-full`: 100%

Viewport widths:

- `sb-w-screen`: 100vw
- `sb-w-50vw`: 50vw
- `sb-w-75vw`: 75vw

## Height

**Control element height.**

Fixed heights:

- `sb-h-0` through `sb-h-64`: Same as width scale
- `sb-h-auto`: Auto height

Percentage heights:

- `sb-h-1/2`: 50%
- `sb-h-1/3`: 33.333333%
- `sb-h-2/3`: 66.666667%
- `sb-h-full`: 100%

Viewport heights:

- `sb-h-screen`: 100vh
- `sb-h-50vh`: 50vh
- `sb-h-75vh`: 75vh

## Min/Max Dimensions

**Control minimum and maximum dimensions.**

Min-width:

- `sb-min-w-0`: 0
- `sb-min-w-full`: 100%
- `sb-min-w-screen`: 100vw

Max-width:

- `sb-max-w-xs`: 20rem
- `sb-max-w-sm`: 24rem
- `sb-max-w-md`: 28rem
- `sb-max-w-lg`: 32rem
- `sb-max-w-xl`: 36rem
- `sb-max-w-full`: 100%

Min/Max-height:

- `sb-min-h-0`: 0
- `sb-min-h-full`: 100%
- `sb-min-h-screen`: 100vh
- `sb-max-h-full`: 100%
- `sb-max-h-screen`: 100vh

## Aspect Ratio

**Control the aspect ratio of elements.**

Available classes:

- `sb-aspect-square`: 1/1
- `sb-aspect-video`: 16/9
- `sb-aspect-portrait`: 3/4
- `sb-aspect-wide`: 21/9

**Available object-fit classes:**

- `sb-object-contain`: Scale to fit
- `sb-object-cover`: Cover area
- `sb-object-fill`: Stretch to fill
- `sb-object-none`: Don't resize
- `sb-object-scale-down`: Scale down if needed

{~ alert type="tip" ~}
**Common Pattern: Responsive Image Container**
{~~}


```html
<div class="sb-w-full sb-max-w-lg sb-aspect-video">
    <img class="sb-w-full sb-h-full sb-object-cover" src="video-thumb.jpg">
</div>
```

{% a href="/docs/Styles/spacing" .super-link %}
Continue to Spacing Utilities
{% enda %}