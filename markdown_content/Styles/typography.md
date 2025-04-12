# Typography Utilities

**Control the appearance and formatting of text.**

## Font Family

**Set the font family of text.**

Available classes:

- `sb-font-sans`: System UI sans-serif
- `sb-font-serif`: Serif fonts
- `sb-font-mono`: Monospace fonts

## Font Size

**Control text size.**

Available classes:

- `sb-text-xs`: 0.75rem
- `sb-text-sm`: 0.875rem
- `sb-text-base`: 1rem
- `sb-text-lg`: 1.125rem
- `sb-text-xl`: 1.25rem
- `sb-text-2xl`: 1.5rem
- `sb-text-3xl`: 1.875rem
- `sb-text-4xl`: 2.25rem

## Font Style

**Control the style of text.**

Available classes:

- `sb-italic`: Italic text
- `sb-bold`: Bold text

## Line Height

**Control leading (line height).**

Available classes:

- `sb-leading-none`: 1
- `sb-leading-tight`: 1.25
- `sb-leading-snug`: 1.375
- `sb-leading-normal`: 1.5
- `sb-leading-relaxed`: 1.625
- `sb-leading-loose`: 2

## Letter Spacing

**Control tracking (letter spacing).**

Available classes:

- `sb-tracking-tighter`: -0.05em
- `sb-tracking-tight`: -0.025em
- `sb-tracking-normal`: 0
- `sb-tracking-wide`: 0.025em
- `sb-tracking-wider`: 0.05em
- `sb-tracking-widest`: 0.1em

## Text Alignment

**Control text alignment.**

Available classes:

- `sb-text-left`: Left align
- `sb-text-center`: Center align
- `sb-text-right`: Right align
- `sb-text-justify`: Justify text

## Text Decoration

**Control text decoration.**

Available classes:

- `sb-underline`: Underlined text
- `sb-line-through`: Strikethrough
- `sb-no-underline`: Remove decorations
- `sb-decoration-dotted`: Dotted underline
- `sb-decoration-dashed`: Dashed underline
- `sb-decoration-wavy`: Wavy underline

## Text Transform

**Control text casing and capitalization.**

Available classes:

- `sb-uppercase`: ALL CAPS
- `sb-lowercase`: all lowercase
- `sb-capitalize`: First Letter Cap
- `sb-normal-case`: Normal text

## Word Break

**Control word wrapping and breaks.**

Available classes:

- `sb-break-normal`: Break at normal points
- `sb-break-words`: Break within words
- `sb-break-all`: Break at any character
- `sb-whitespace-normal`: Normal whitespace
- `sb-whitespace-nowrap`: Prevent wrapping
- `sb-whitespace-pre`: Preserve whitespace

{~ alert type="tip" ~}
**Common Pattern: Article Heading**
{~~}

```django
<h1 class="sb-font-sans sb-text-3xl sb-tracking-tight sb-leading-tight sb-text-center sb-capitalize">
    Your Article Title Here
</h1>
```

{% div class="sb-font-sans sb-text-3xl sb-tracking-tight sb-leading-tight sb-text-center sb-capitalize" %}
Your Article Title Here
{% enddiv %}
