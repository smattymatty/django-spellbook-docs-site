---
title: Button
created: 2025-06-01
tags:
  - spellblock
  - button
  - ui
  - link
  - examples
---

# Button Block (`~ button ~`) Showcase

The `~ button ~` SpellBlock allows you to easily create styled HTML anchor (`<a>`) tags that look and behave like buttons. This is perfect for calls-to-action, navigation, and links that need to stand out. This guide demonstrates its parameters and common use cases for the link-focused button.

## Basic Usage

To create a basic button, you provide an `href` and the button's text content between the tags.

```
{~ button href="/getting-started" ~}
Get Started
{~~}
```

{~ button href="/getting-started" ~}
Get Started
{~~}

## Parameters Showcase

The `~ button ~` block offers several parameters for customization:

### `href` (Required)

This defines the URL the button links to. If omitted, it defaults to `"#"` but a warning will be logged.

```
{~ button href="/features" ~}
Learn About Features
{~~}
```
{~ button href="/features" ~}
Learn About Features
{~~}

```
{~ button ~}
Button with Default Href
{~~}
```
{~ button ~}
Button with Default Href
{~~}

### `type` (Visual Style)

Controls the button's appearance. Corresponds to predefined CSS classes (e.g., `sb-btn-primary`).
Default: `default`.
Supported types (based on your CSS): `default`, `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `accent`, `black`, `white`.

**Primary Button:**
```
{~ button href="/submit" type="primary" ~}
Submit Action
{~~}
```
{~ button href="/submit" type="primary" ~}
Submit Action
{~~}

**Secondary Button:**
```
{~ button href="/details" type="secondary" ~}
View Details
{~~}
```
{~ button href="/details" type="secondary" ~}
View Details
{~~}

**Success Button:**
```
{~ button href="/checkout" type="success" ~}
Confirm Purchase
{~~}
```
{~ button href="/checkout" type="success" ~}
Confirm Purchase
{~~}

*(You can add more examples for `danger`, `warning`, `info`, `accent`, etc. as needed)*

### `size`

Adjusts the button's size (padding, font-size). Corresponds to CSS classes (e.g., `sb-btn-sm`).
Default: `md`. Supported: `sm`, `md`, `lg`.

**Small Button:**
```
{~ button href="/small-action" type="primary" size="sm" ~}
Small Primary
{~~}
```
{~ button href="/small-action" type="primary" size="sm" ~}
Small Primary
{~~}

**Medium Button (Default Size):**
```
{~ button href="/medium-action" type="secondary" size="md" ~}
Medium Secondary
{~~}
```
{~ button href="/medium-action" type="secondary" size="md" ~}
Medium Secondary
{~~}

**Large Button:**
```
{~ button href="/large-action" type="success" size="lg" ~}
Large Success
{~~}
```
{~ button href="/large-action" type="success" size="lg" ~}
Large Success
{~~}

### `target`

Standard HTML `target` attribute for links (e.g., `_blank` to open in a new tab).

```
{~ button href="https://example.com" target="_blank" type="info" ~}
Open External Link
{~~}
```
{~ button href="https://example.com" target="_blank" type="info" ~}
Open External Link
{~~}

### `disabled`

Renders the button in a disabled state. The `href` will point to `"#"` and ARIA attributes for disabled state will be added.
Default: `false`. Set to `true` to disable.

```markdown
{~ button href="/secret-area" type="error" disabled="true" ~}
Access Restricted
{~~}
```

{~ button href="/secret-area" type="error" disabled="true" ~}
Access Restricted
{~~}

### `icon_left` and `icon_right`

Adds an icon to the left or right of the button text. You provide the CSS class for the icon.

**Icon Left:**

```markdown
{~ button href="/download" type="primary" icon_left="sb-icon-download" ~}
Download File
{~~}
```
{~ button href="/download" type="primary" icon_left="sb-icon-download" ~}
Download File
{~~}

**Icon Right:**

```markdown
{~ button href="/next" type="default" icon_right="sb-icon-arrow-right" ~}
Next Step
{~~}
```

{~ button href="/next" type="default" icon_right="sb-icon-arrow-right" ~}
Next Step
{~~}

**Both Icons:**
```markdown
{~ button href="/settings" type="secondary" icon_left="sb-icon-settings" icon_right="sb-icon-edit" ~}
Manage Settings
{~~}
```

{~ button href="/settings" type="secondary" icon_left="sb-icon-settings" icon_right="sb-icon-edit" ~}
Manage Settings
{~~}

**Plus Icon:**
This example shows how to use the `sb-icon-plus`.

```markdown
{~ button href="/add-item" type="success" icon_left="sb-icon-plus" ~}
Add Item
{~~}
```

{~ button href="/add-item" type="success" icon_left="sb-icon-plus" ~}
Add Item
{~~}

**Minus Icon:**
This example demonstrates the `sb-icon-minus`.

```markdown
{~ button href="/remove-item" type="error" icon_left="sb-icon-minus" ~}
Remove Item
{~~}
```

{~ button href="/remove-item" type="error" icon_left="sb-icon-minus" ~}
Remove Item
{~~}

### `class` and `id`

Apply custom CSS classes or an HTML `id` for additional styling or JavaScript targeting.

```markdown
{~ button href="/custom" class="my-special-button analytics-trigger" id="ctaButtonHomePage" type="accent" ~}
Special Offer
{~~}
```

{~ button href="/custom" class="my-special-button analytics-trigger" id="ctaButtonHomePage" type="accent" ~}
Special Offer
{~~}

## Content Formatting within Buttons

The text inside the button tags is processed as Markdown.

```markdown
{~ button href="/formatted-content" type="primary" size="lg" ~}
Click **Here** for *Amazing* `Offers`!
{~~}
```

{~ button href="/formatted-content" type="primary" size="lg" ~}
Click **Here** for *Amazing* `Offers`!
{~~}

## Combined Example

A button using multiple parameters:

```markdown
{~ button
    href="/user/profile"
    type="info"
    size="lg"
    target="_blank"
    icon_left="sb-icon-user"
    class="user-profile-button"
    id="userProfileBtn"
~}
View My Profile
{~~}
```

{~ button
    href="/user/profile"
    type="info"
    size="lg"
    target="_blank"
    icon_left="sb-icon-user"
    class="user-profile-button"
    id="userProfileBtn"
~}
View My Profile
{~~}

## Use Cases

* **Primary Calls to Action:** Guide users to the most important actions (e.g., "Sign Up", "Buy Now").
* **Secondary Actions:** Offer alternative, less critical actions (e.g., "Learn More", "View Details").
* **Navigation:** Use link-styled buttons for subtle navigation items that still need a button's click area.
* **Downloads & External Links:** Clearly indicate actions like downloading files or navigating to external sites, often with icons.

---

{~ practice difficulty="Beginner" timeframe="15-20 minutes" impact="Medium" focus="UI Elements" ~}
### Button Practice Challenge

Create the following buttons:

1. A large, `primary` button that says "Register Today" and links to `/register`.
2. A small, `secondary` button that says "Read Documentation", opens in a new tab, and has a book icon on the left (e.g., `icon_left="sb-icon-book"`).
3. A `danger` button with default size that says "Delete Account" and has a warning icon on the right (e.g., `icon_right="sb-icon-warning"`). Make this button appear `disabled`.
4. A default styled button with your name and a custom class `my-name-button`.
{~~}

---

{% a href="/docs/Styles/Utilties/colors" .super-link %}
Continue to Color Utilities
{% enda %}

---

## Bonus Color Variations

1. Emphasis

Emphasis is used for elements that require strong visual prominence without necessarily indicating a status.

```django
{~ button href="/spellblocks/button" type="emphasis" size="lg" icon_left="sb-icon-elven-city" ~}
Emphasis Button
{~~}
```

{~ button href="/spellblocks/button" type="emphasis" size="lg" icon_left="sb-icon-elven-city" ~}
Emphasis Button
{~~}

2. Subtle

Subtle is used for backgrounds of less critical sections, placeholder text, subtle borders, or UI elements that should recede visually.

```django
{~ button href="/spellblocks/button" type="subtle" size="lg" icon_left="sb-icon-ellipsis-horizontal" ~}
Subtle Button
{~~}
```

{~ button href="/spellblocks/button" type="subtle" size="lg" icon_left="sb-icon-ellipsis-horizontal" ~}
Subtle Button
{~~}

3. Distinct

Distinct is used for an alternative branding accent, categorizing content, or adding unique visual interest where other theme colors might not be the desired fit.

```django
{~ button href="/spellblocks/button" type="distinct" size="lg" icon_left="sb-icon-swirl-energy" ~}
Distinct Button
{~~}
```

{~ button href="/spellblocks/button" type="distinct" size="lg" icon_left="sb-icon-swirl-energy" ~}
Distinct Button
{~~}

## RPG Themed Buttons

These abstractly named colors are tailored for use in magical RPG settings, providing thematic options for representing arcane energies, ancient artifacts, and natural environments.

### 1. Aether

Represents raw magical energy, enchantments, psionics, or otherworldly phenomena.

```django
{~ button href="/spellblocks/button" type="aether" size="lg" icon_left="sb-icon-gemcut" ~}
Launch Arcanum
{~~}
```

{~ button href="/spellblocks/button" type="aether" size="lg" icon_left="sb-icon-gemcut" ~}
Launch Arcanum
{~~}

### 2. Artifact

Signifies ancient lore, powerful relics, hidden knowledge, or aged, valuable items.

```django
{~ button href="/spellblocks/button" type="artifact" size="lg" icon_left="sb-icon-ancient-tome" ~}
Learn More
{~~}
```

{~ button href="/spellblocks/button" type="artifact" size="lg" icon_left="sb-icon-ancient-tome" ~}
Learn More
{~~}

### 3. Sylvan

Represents deep forests, untamed wilds, nature-based magic, or earthy elements.

```django
{~ button href="/spellblocks/button" type="sylvan" size="lg" icon_left="sb-icon-sylvan-leaf" ~}
Explore the Forest
{~~}
```

{~ button href="/spellblocks/button" type="sylvan" size="lg" icon_left="sb-icon-sylvan-leaf" ~}
Explore the Forest
{~~}
