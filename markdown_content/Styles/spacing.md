# Spacing Utilities

**Control margins, padding, and space between elements.**

## Padding

**Control padding in all directions.**

Available classes:

- `sb-p-0` through `sb-p-8`: All sides
- `sb-px-0` through `sb-px-8`: Left and right
- `sb-py-0` through `sb-py-8`: Top and bottom
- `sb-pt-0` through `sb-pt-8`: Top only
- `sb-pr-0` through `sb-pr-8`: Right only
- `sb-pb-0` through `sb-pb-8`: Bottom only
- `sb-pl-0` through `sb-pl-8`: Left only

**Size Reference:**
0: 0
1: 0.25rem
2: 0.5rem
3: 1rem
4: 1.5rem
6: 2rem
8: 3rem

## Margin

**Control margin in all directions.**

Available classes:

- `sb-m-0` through `sb-m-8`: All sides
- `sb-mx-0` through `sb-mx-8`: Left and right
- `sb-my-0` through `sb-my-8`: Top and bottom
- `sb-mt-0` through `sb-mt-8`: Top only
- `sb-mr-0` through `sb-mr-8`: Right only
- `sb-mb-0` through `sb-mb-8`: Bottom only
- `sb-ml-0` through `sb-ml-8`: Left only

## Negative Margins

**Pull elements closer together.**

Available classes:

- `sb-m-n1` through `sb-m-n8`: All sides
- `sb-mt-n1` through `sb-mt-n8`: Top
- `sb-mr-n1` through `sb-mr-n8`: Right
- `sb-mb-n1` through `sb-mb-n8`: Bottom
- `sb-ml-n1` through `sb-ml-n8`: Left

## Space Between

**Control space between child elements.**

Available classes:

- `sb-space-x-0` through `sb-space-x-8`: Horizontal space
- `sb-space-y-0` through `sb-space-y-8`: Vertical space

{~ alert type="tip" ~}
**Common Pattern: Card Layout**
{~~}

```django
<div class="sb-p-4 sb-mb-4">
    <h2 class="sb-mb-2">Title</h2>
    <div class="sb-space-y-2">
        <p>First paragraph</p>
        <p>Second paragraph</p>
    </div>
</div>
```

{% div .sb-p-4 .sb-mb-4 %}
    {% h2 .sb-mb-2 %}Title{% endh2 %}
    {% div .sb-space-y-2 %}
        {% p %}First paragraph{% endp %}
        {% p %}Second paragraph{% endp %}
    {% enddiv %}
{% enddiv %}

{% a href="/docs/Styles/transitions-animations" .super-link %}
Continue to Transitions and Animations Utilities
{% enda %}