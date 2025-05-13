---
title: Progress Bar
created: 2025-05-13
tags:
  - component
  - progress-bar
  - ui
  - documentation
  - skills-visualization
  - course-progress
  - professional-development
---

# Progress Bar SpellBlock (`~ progress ~`)

The `~ progress ~` component offers a clear and adaptable method for visually representing various metrics such as project completion, skill proficiency, academic progress, or funding status against a defined maximum. It features an optional popover, triggered on hover, to display detailed contextual information, which can be styled for thematic consistency.

## Basic Usage

To implement a basic progress bar, specify a `value`. This value is assessed against a default `max_value` of 100 if not otherwise defined:

```django
{~ progress value="65" label="Profile Status" ~}
Profile is 65% complete. Ensure all sections are finalized for optimal visibility.
{~~}
```

This renders a progress bar indicating 65%:

{~ progress value="65" label="Profile Status" ~}
Profile is 65% complete. Ensure all sections are finalized for optimal visibility.
{~~}

## Parameters

The component's appearance and functionality are managed through the following parameters:

{~ card title="Full Parameter List" footer="The only required parameter is `value`." ~}

* **`value`** (Required, Float/Int): The current numerical value to be represented.
* **`max_value`** (Float/Int, Default: `100`): The endpoint value for the progress calculation. The bar's fill width is determined by the ratio `(value / max_value) * 100%`.
* **`label`** (String, Optional): Descriptive text for the progress bar, typically shown within or alongside it. Supports dynamic interpolation using `{value}`, `{max_value}`, and `{percentage}` placeholders.
* **`show_percentage`** (Boolean, Default: `true` if `label` is unset, `false` otherwise): Governs the display of the numerical percentage within the bar. This is superseded if `{percentage}` is used in the `label`.
* **`color`** (String, Default: `"primary"`): Specifies the fill color of the progress bar using predefined theme color identifiers (e.g., `primary`, `secondary`, `success`, `info`, `warning`, `danger`). Variants like `white-25` or `black-75` can achieve specific visual effects. These map to `sb-bg-*` CSS utility classes.
* **`bg_color`** (String, Default: `"white-50"`): Determines the background color of the progress bar's track. Uses theme color identifiers similar to `color`.
* **`height`** (String, Default: `"md"`): Modifies the bar's height. Accepted values: `"sm"` (small), `"md"` (medium), `"lg"` (large), corresponding to CSS classes like `sb-h-4`, `sb-h-8`, `sb-h-16`.
* **`striped`** (Boolean, Default: `false`): If true, a striped pattern is applied to the bar's fill.
* **`animated`** (Boolean, Default: `false`): If true (and `striped` is true), the stripes on the bar's fill are animated.
* **`rounded`** (Boolean, Default: `true`): If true, rounded corners are applied to the track and fill. Maps to CSS classes such as `sb-border-radius-md`.
* **`class`** (String, Optional): Appends custom CSS classes to the main container (`.sb-progress-container`) for additional styling.
* **`id`** (String, Optional): Assigns a custom HTML `id` to the main container, useful for CSS or JavaScript targeting.
* **`content_bg_color`** (String, Optional): Defines the background color of the popover. Accepts theme color names (e.g., `primary`, `neutral-90`). Defaults to a standard style if omitted.
* **`content_color`** (String, Optional): Sets the text color within the popover. Accepts theme color names or standard CSS color values. Defaults to a standard style if omitted.
* **`content_class`** (String, Optional): Appends custom CSS classes to the popover content `div` for specific styling.
* The content provided between `~ progress ... ~` and `~~` is rendered within the popover.
{~~}

## Application Examples: Professional Development & Skills

The `content_bg_color` and `content_color` parameters allow the popover to visually align with the progress bar's theme, enhancing contextual information.

### Academic & Course Progress

**Degree Program Advancement:**
Tracking progress towards a degree, with popover details for current academic standing.

```django
{% verbatim %}
{~ progress value="75" max_value="120" label="Credits Earned: {{value}}/{{max_value}}" color="info" bg_color="info-25" height="lg" content_bg_color="info-75" content_color="white" ~}
**Program: B.S. Computer Science**
Currently in Junior year, maintaining a 3.8 GPA. Core coursework in Data Structures and Algorithms completed. Capstone project selection underway.
{~~}
{% endverbatim %}
```

Renders as:
{~ progress value="75" max_value="120" label="Credits Earned: {{value}}/{{max_value}}" color="info" bg_color="info-25" height="lg" content_bg_color="info-75" content_color="white" ~}
**Program: B.S. Computer Science**
Currently in Junior year, maintaining a 3.8 GPA. Core coursework in Data Structures and Algorithms completed. Capstone project selection underway.
{~~}

**Online Course Module Completion:**
Visualizing completion of an online certification course.

```django
{% verbatim %}
{~ progress value="4" max_value="6" label="Module {{value}} of {{max_value}}" color="primary" striped="true" content_bg_color="primary-75" content_color="white" ~}
**Course: Advanced Project Management**
Completed modules on Risk Assessment and Stakeholder Communication. Next up: Agile Methodologies.
Estimated completion: 2 weeks.
{~~}
{% endverbatim %}
```

Renders as:
{~ progress value="4" max_value="6" label="Module {{value}} of {{max_value}}" color="primary" striped="true" content_bg_color="primary-75" content_color="white" ~}
**Course: Advanced Project Management**
Completed modules on Risk Assessment and Stakeholder Communication. Next up: Agile Methodologies.
Estimated completion: 2 weeks.
{~~}

### Resume & Skill Representation

**Technical Skill Proficiency (Resume):**
Displaying expertise level in a specific technology, with popover for project examples.

```django
{% verbatim %}
{~ progress value="90" label="Python Development: {{percentage}}" color="success" height="sm" content_bg_color="success-75" content_color="white" ~}
**Python Expertise: Advanced**
Extensive experience with Django, Flask, data analysis libraries (Pandas, NumPy), and machine learning frameworks (Scikit-learn). Contributed to several open-source projects.
{~~}
{% endverbatim %}
```

Renders as:
{~ progress value="90" label="Python Development: {{percentage}}" color="success" height="sm" content_bg_color="success-75" content_color="white" ~}
**Python Expertise: Advanced**
Extensive experience with Django, Flask, data analysis libraries (Pandas, NumPy), and machine learning frameworks (Scikit-learn). Contributed to several open-source projects.
{~~}

**Language Fluency:**
Indicating level of fluency in a foreign language for a resume or profile.

```django
{% verbatim %}
{~ progress value="70" label="Spanish Fluency: Professional Working Proficiency" color="secondary" content_bg_color="secondary-75" content_color="white" ~}
**Details:** Can conduct business meetings, deliver presentations, and draft complex documents in Spanish. Certified DELE C1.
{~~}
{% endverbatim %}
```

Renders as:
{~ progress value="70" label="Spanish Fluency: Professional Working Proficiency" color="secondary" content_bg_color="secondary-75" content_color="white" ~}
**Details:** Can conduct business meetings, deliver presentations, and draft complex documents in Spanish. Certified DELE C1.
{~~}

### Career Progression & Goal Tracking

**Professional Certification Training:**
Tracking hours logged towards a professional certification.

```django
{% verbatim %}
{~ progress value="85" max_value="120" label="PMP Certification Prep: {{value}}/{{max_value}} Hours" color="warning" bg_color="neutral-25" striped="true" animated="true" height="sm" content_bg_color="warning-75" content_color="black-75" ~}
**PMP Exam Preparation:**
85 contact hours completed. Focus areas: Risk Management and Cost Control. Exam scheduled for next quarter.
{~~}
{% endverbatim %}
```

Renders as:
{~ progress value="85" max_value="120" label="PMP Certification Prep: {{value}}/{{max_value}} Hours" color="warning" bg_color="neutral-25" striped="true" animated="true" height="sm" content_bg_color="warning-75" content_color="black-75" ~}
**PMP Exam Preparation:**
85 contact hours completed. Focus areas: Risk Management and Cost Control. Exam scheduled for next quarter.
{~~}