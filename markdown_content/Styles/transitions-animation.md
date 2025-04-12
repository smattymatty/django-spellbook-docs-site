# Transition & Animation Utilities

**Control transitions, animations, and transforms.**

## Transition Duration

**Control how long transitions take.**

Available classes:

- `sb-duration-75`: 75ms
- `sb-duration-100`: 100ms
- `sb-duration-150`: 150ms
- `sb-duration-200`: 200ms
- `sb-duration-300`: 300ms
- `sb-duration-500`: 500ms

## Timing Functions

**Control the speed curve of transitions.**

Available classes:

- `sb-ease-linear`: Linear
- `sb-ease-in`: Ease in
- `sb-ease-out`: Ease out
- `sb-ease-in-out`: Ease in and out
- `sb-ease-bounce`: Bounce effect

## Transition Delay

**Add a delay before transitions start.**

Available classes:

- `sb-delay-75`: 75ms delay
- `sb-delay-100`: 100ms delay
- `sb-delay-150`: 150ms delay
- `sb-delay-300`: 300ms delay
- `sb-delay-500`: 500ms delay

## Basic Animations

**Pre-built animation patterns.**

Available classes:

- `sb-animate-fade`: Fade in/out
- `sb-animate-slide-up`: Slide up
- `sb-animate-slide-down`: Slide down
- `sb-animate-slide-left`: Slide left
- `sb-animate-slide-right`: Slide right
- `sb-animate-bounce`: Bounce
- `sb-animate-spin`: Spin
- `sb-animate-ping`: Ping effect
- `sb-animate-pulse`: Pulse effect

## Transform

**Apply transformations to elements.**

Available classes:

- `sb-scale-{amount}`: Scale
- `sb-rotate-{degrees}`: Rotate
- `sb-translate-x-{amount}`: Move horizontally
- `sb-translate-y-{amount}`: Move vertically
- `sb-skew-x-{amount}`: Skew horizontally
- `sb-skew-y-{amount}`: Skew vertically

{~ alert type="tip" ~}
**Common Pattern: Hover Animation**
{~~}

```django
<button class="sb-duration-300 sb-ease-out hover:sb-scale-105 hover:sb-translate-y-1 sb-animate-fade">
    Animated Button
</button>
```

{% a href="/docs/Styles/typography" .super-link %}
Continue to Typography Utilities
{% enda %}