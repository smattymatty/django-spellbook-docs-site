# Layout Utilities

Layout utilities help you control how elements are positioned and displayed on the page.

## Display

**Control how an element is displayed.**

Available classes:

- `sb-block`: Display as block
- `sb-inline`: Display as inline
- `sb-inline-block`: Display as inline-block
- `sb-flex`: Display as flex container
- `sb-grid`: Display as grid container
- `sb-hidden`: Hide element

## Position

**Control how an element is positioned.**

Available classes:

- `sb-static`: Default positioning
- `sb-relative`: Relative positioning
- `sb-absolute`: Absolute positioning
- `sb-fixed`: Fixed positioning
- `sb-sticky`: Sticky positioning

Position helpers:

- `sb-inset-0`: All sides set to 0
- `sb-top-0`: Top: 0
- `sb-right-0`: Right: 0
- `sb-bottom-0`: Bottom: 0
- `sb-left-0`: Left: 0

## Z-Index

**Control stacking order.**

Available classes:

- `sb-z-0` through `sb-z-50` (increments of 10)
- `sb-z-auto`: Auto z-index

## Overflow

**Control how content overflows.**

Available classes:

- `sb-overflow-auto`: Add scrollbars when needed
- `sb-overflow-hidden`: Hide overflow
- `sb-overflow-visible`: Show overflow
- `sb-overflow-scroll`: Always show scrollbars
- `sb-overflow-x-auto`: Auto overflow horizontally
- `sb-overflow-y-auto`: Auto overflow vertically

## Container

**The container class:**

- Centers content horizontally
- Adds responsive padding
- Sets max-width based on breakpoints:
    - **sm**: 640px
    - **md**: 768px
    - **lg**: 1024px
    - **xl**: 1280px

{~ alert type="info" ~}
**Combine position utilities with z-index for complex layouts.**
{~~}

```html
<div class="sb-relative">
    <div class="sb-absolute sb-top-0 sb-right-0 sb-z-10">
        Floating element
    </div>
</div>
```

{% a href="/docs/Styles/flexbox-grid" .super-link %}
Continue to Flexbox & Grid Utilities 
{% enda %}