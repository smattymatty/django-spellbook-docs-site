---
title: Align
created: 2025-06-01
tags:
  - spellblock
  - align
  - layout
  - utility
  - examples
---

# Align Block (`~ align ~`) Showcase

The `~ align ~` SpellBlock is a versatile utility for controlling the horizontal alignment of the block container itself, the dimensions of the block, and the text alignment of the content within it. This guide demonstrates its various parameters and use cases.

## Basic Usage (Default Alignment)

By default, an `~ align ~` block will center itself (if its width is less than 100%) and center its internal content. The default width is 100% and height is `auto`.

```
{~ align ~}
This is a basic align block.
By default, the block itself takes full available width,
and the text content within it is centered.
If we give it a width less than 100%, the block itself will also be centered.
{~~}
```

{~ align ~}
This is a basic align block.
By default, the block itself takes full available width,
and the text content within it is centered.
If we give it a width less than 100%, the block itself will also be centered.
{~~}

Let's see the default centering of the block when width is constrained:
```
{~ align width="70%" ~}
This block has `width="70%"`. Notice how the block itself is centered on the page.
The text inside is also centered by default.
{~~}
```

{~ align width="70%" ~}
This block has `width="70%"`. Notice how the block itself is centered on the page.
The text inside is also centered by default.
{~~}

## Parameters Showcase

### `pos` (Block Positioning)

The `pos` parameter controls the horizontal alignment of the `AlignBlock` container itself within its parent. It corresponds to flexbox justification values like `flex-start`, `center`, or `flex-end`. To observe its effect, the block's `width` should typically be less than 100%.

**`pos="start"`**
```
{~ align pos="start" width="60%" class="sb-border sb-p-2" ~}
This block has `pos="start"` and `width="60%"`.
It will align to the **start** (left) of the available space.
Content inside is still centered by default.
*(Added a border and padding for visibility)*
{~~}
```
{~ align pos="start" width="60%" class="sb-border sb-p-2" ~}
This block has `pos="start"` and `width="60%"`.
It will align to the **start** (left) of the available space.
Content inside is still centered by default.
*(Added a border and padding for visibility)*
{~~}

**`pos="center"`** (Default behavior if width < 100%)
```
{~ align pos="center" width="60%" class="sb-border sb-p-2" ~}
This block has `pos="center"` and `width="60%"`.
It will align to the **center** of the available space.
Content inside is still centered by default.
{~~}
```
{~ align pos="center" width="60%" class="sb-border sb-p-2" ~}
This block has `pos="center"` and `width="60%"`.
It will align to the **center** of the available space.
Content inside is still centered by default.
{~~}

**`pos="end"`**
```
{~ align pos="end" width="60%" class="sb-border sb-p-2" ~}
This block has `pos="end"` and `width="60%"`.
It will align to the **end** (right) of the available space.
Content inside is still centered by default.
{~~}
```
{~ align pos="end" width="60%" class="sb-border sb-p-2" ~}
This block has `pos="end"` and `width="60%"`.
It will align to the **end** (right) of the available space.
Content inside is still centered by default.
{~~}

### `content_align` (Internal Content Text Alignment)

The `content_align` parameter controls the text alignment of the content *inside* the block. It accepts `start`, `center`, or `end`.

**`content_align="start"`**
```
{~ align content_align="start" class="sb-border sb-p-2" ~}
Content inside this block is aligned to the **start** (left).
The block itself defaults to `pos="center"` and `width="100%"`.
Line 1 of text.
Another line for demonstration.
{~~}
```
{~ align content_align="start" class="sb-border sb-p-2" ~}
Content inside this block is aligned to the **start** (left).
The block itself defaults to `pos="center"` and `width="100%"`.
Line 1 of text.
Another line for demonstration.
{~~}

**`content_align="center"`** (Default behavior)
```
{~ align content_align="center" class="sb-border sb-p-2" ~}
Content inside this block is aligned to the **center**.
This is the default internal text alignment.
Line 1 of text.
Another line for demonstration.
{~~}
```
{~ align content_align="center" class="sb-border sb-p-2" ~}
Content inside this block is aligned to the **center**.
This is the default internal text alignment.
Line 1 of text.
Another line for demonstration.
{~~}

**`content_align="end"`**
```
{~ align content_align="end" class="sb-border sb-p-2" ~}
Content inside this block is aligned to the **end** (right).
The block itself defaults to `pos="center"` and `width="100%"`.
Line 1 of text.
Another line for demonstration.
{~~}
```
{~ align content_align="end" class="sb-border sb-p-2" ~}
Content inside this block is aligned to the **end** (right).
The block itself defaults to `pos="center"` and `width="100%"`.
Line 1 of text.
Another line for demonstration.
{~~}

### `width` and `height`

These parameters control the dimensions of the block.

- If a unitless number `<= 100` is given (e.g., `width="50"`), it's treated as `%`.
- If a unitless number `> 100` is given (e.g., `width="250"`), it's treated as `px`.
- Explicit units like `50%`, `120px`, or `auto` (e.g., `width="auto"`) are respected.

**`width` examples:**
```
{~ align width="50%" class="sb-border sb-p-2" ~}
This block has `width="50%"`.
{~~}
```
{~ align width="50%" class="sb-border sb-p-2" ~}
This block has `width="50%"`.
{~~}

```
{~ align width="250" class="sb-border sb-p-2" ~}
This block has `width="250"`, which becomes `250px`.
{~~}
```
{~ align width="250" class="sb-border sb-p-2" ~}
This block has `width="250"`, which becomes `250px`.
{~~}

**`height` examples (add a border to see the height):**
```
{~ align height="100px" class="sb-border sb-p-2" ~}
This block has `height="100px"`. Content may overflow if too much.
{~~}
```
{~ align height="100px" class="sb-border sb-p-2" ~}
This block has `height="100px"`. Content may overflow if too much.
{~~}

```
{~ align height="70" class="sb-border sb-p-2" ~}
This block has `height="70"`, which becomes `70%` of its parent's height.
(Note: Percentage heights can be tricky and depend on the parent container having a defined height.)
This content is inside.
{~~}
```
{~ align height="70" class="sb-border sb-p-2" ~}
This block has `height="70"`, which becomes `70%` of its parent's height.
(Note: Percentage heights can be tricky and depend on the parent container having a defined height.)
This content is inside.
{~~}

**`width="auto"` and `height="auto"` (Default height behavior):**
```
{~ align width="auto" class="sb-border sb-p-2 sb-inline-block" ~}
This block has `width="auto"`. It will only be as wide as its content.
To make `width="auto"` apparent, we've added a hypothetical utility class like `sb-inline-block` or you might use it within a flex parent where its auto width can be observed.
{~~}
```
{~ align width="auto" class="sb-border sb-p-2 sb-inline-block" ~}
This block has `width="auto"`. It will only be as wide as its content.
To make `width="auto"` apparent, we've added a hypothetical utility class like `sb-inline-block` or you might use it within a flex parent where its auto width can be observed.
{~~}


### `class`, `id`, and `content_class`

These parameters allow for custom styling and identification.

```
{~ align id="my-unique-aligner" class="custom-outer-styles sb-border-primary sb-p-3" content_class="custom-inner-styles" width="80%" ~}
This block has:

- `id="my-unique-aligner"` for the outer wrapper.
- `class="custom-outer-styles sb-border-primary sb-p-3"` added to the outer wrapper.
- `content_class="custom-inner-styles"` for the inner `div` that directly wraps this text.
You would define these custom classes in your own CSS.
The text is centered by default internally. The block is centered due to default `pos` and `width="80%"`.
{~~}
```
{~ align id="my-unique-aligner" class="custom-outer-styles sb-border-primary sb-p-3" content_class="custom-inner-styles" width="80%" ~}
This block has:

- `id="my-unique-aligner"` for the outer wrapper.
- `class="custom-outer-styles sb-border-primary sb-p-3"` added to the outer wrapper.
- `content_class="custom-inner-styles"` for the inner `div` that directly wraps this text.
You would define these custom classes in your own CSS.
The text is centered by default internally. The block is centered due to default `pos` and `width="80%"`.
{~~}

## Combined Example

Let's combine several parameters:

```
{~ align pos="end" width="70%" height="150px" content_align="start" class="sb-bg-neutral-50 sb-p-3" ~}
### Styled & Aligned Section

This block is aligned to the **end** (right), has a `width` of **70%**, and a fixed `height` of **150px**.
The internal text content is aligned to the **start** (left).
It also has custom background, padding, and shadow utility classes.

- Point 1
- Point 2
{~~}
```

{~ align pos="end" width="70%" height="150px" content_align="start" class="sb-bg-neutral-50 sb-p-3" ~}
### Styled & Aligned Section

This block is aligned to the **end** (right), has a `width` of **70%**, and a fixed `height` of **150px**.
The internal text content is aligned to the **start** (left).
It also has custom background, padding, and shadow utility classes.

- Point 1
- Point 2
{~~}


