# Flexbox & Grid Utilities

**Control layout with powerful flexbox and grid utilities.**

## Flex Direction

**Control the direction of flex items.**

Available classes:

- `sb-flex`: Enable flexbox
- `sb-flex-row`: Items in a row
- `sb-flex-col`: Items in a column
- `sb-flex-row-reverse`: Reversed row
- `sb-flex-col-reverse`: Reversed column

**Responsive variants:**

- `sb-sm:flex-row`: Row on small screens and up
- `sb-md:flex-row`: Row on medium screens and up
- `sb-lg:flex-row`: Row on large screens and up
- (Same pattern for `-col` variants)

## Justify Content

**Control how items are positioned along the main axis.**

Available classes:

- `sb-justify-start`: Items at start
- `sb-justify-end`: Items at end
- `sb-justify-center`: Items at center
- `sb-justify-between`: Space between items
- `sb-justify-around`: Space around items
- `sb-justify-evenly`: Space evenly distributed

## Align Items

**Control how items are positioned along the cross axis.**

Available classes:

- `sb-items-start`: Items at start
- `sb-items-end`: Items at end
- `sb-items-center`: Items at center
- `sb-items-baseline`: Items along baseline
- `sb-items-stretch`: Items stretch to fill

## Gap

**Control space between items.**

Available classes:

- `sb-gap-1`: 0.25rem gap
- `sb-gap-2`: 0.5rem gap
- `sb-gap-3`: 1rem gap
- `sb-gap-4`: 1.5rem gap
- `sb-gap-6`: 2rem gap

## Flex Grow/Shrink

**Control how items grow and shrink.**

Available classes:

- `sb-grow`: Allow item to grow
- `sb-grow-0`: Prevent growing
- `sb-shrink`: Allow item to shrink
- `sb-shrink-0`: Prevent shrinking

## Grid

**Create grid layouts.**

Available classes:

- `sb-grid`: Enable grid
- `sb-grid-cols-1`: One column
- `sb-grid-cols-2`: Two columns
- `sb-grid-cols-3`: Three columns
- `sb-grid-cols-4`: Four columns

**Responsive grid:**

- `sb-md:grid-cols-2`: Two columns on medium screens
- `sb-md:grid-cols-3`: Three columns on medium screens
- `sb-md:grid-cols-4`: Four columns on medium screens

{~ alert type="info" ~}
**Common Pattern:** Making a responsive layout with a row on large screens and a column on small screens.
{~~}

```django
<div class="sb-flex sb-flex-col sb-md:flex-row sb-items-center sb-justify-between sb-gap-4">
    <div>Stacks on mobile, side by side on desktop</div>
    <div>With equal spacing between</div>
</div>
```

{% a href="/docs/Styles/interactivity" .super-link %}
Continue to Interactivity Utilities
{% enda %}