---
title: Progress SpellBlock
created: 2025-05-13
tags:
  - spellblock
  - component
  - progress
  - ui
  - documentation
  - education
  - resume
  - skills
---

# Progress SpellBlock (`~ progress ~`): Level Up Your Content

The `~ progress ~` SpellBlock is a versatile tool for visualizing progress. Beyond simple percentages, it can be a powerful familiar in illustrating skill acquisition, academic achievements, career milestones, and personal development – a true "leveling up" visual. The integrated popover, customizable with `content_bg_color` and `content_color`, allows for rich contextual information.

## Basic Usage

A quick refresher:

```django
{~ progress value="65" label="Overall Profile Completion" ~}
Your profile is looking good! Just a few more sections to fill out.
{~~}
```

Renders as:
{~ progress value="65" label="Overall Profile Completion" ~}
Your profile is looking good! Just a few more sections to fill out.
{~~}

## Parameters for Popover Styling

In addition to the previously listed parameters, we now highlight those for theming the popover content:

* **`content_bg_color`** (String, Optional): Sets the background color of the popover. Accepts theme color names (e.g., `primary`, `success-25`, `neutral-90`). If not set, it defaults to a standard popover style (e.g., white).
* **`content_color`** (String, Optional): Sets the text color within the popover. Accepts theme color names or standard CSS color values. If not set, it defaults to a standard text color suitable for the default popover background.

{~ card title="Full Parameter List" footer="The only required parameter is `value`." ~}

* **`value`** (Required, Float/Int): The current value.
* **`max_value`** (Float/Int, Default: `100`): The maximum possible value.
* **`label`** (String, Optional): Text for the progress bar. Supports `{value}`, `{max_value}`, `{percentage}`.
* **`show_percentage`** (Boolean, Default: depends on `label`): Toggles percentage display in the bar.
* **`color`** (String, Default: `"primary"`): Bar's fill color.
* **`bg_color`** (String, Default: `"white-50"`): Bar's track color.
* **`height`** (String, Default: `"md"`): Bar height (`sm`, `md`, `lg`).
* **`striped`** (Boolean, Default: `false`): Striped fill.
* **`animated`** (Boolean, Default: `false`): Animates stripes.
* **`rounded`** (Boolean, Default: `true`): Rounded corners.
* **`class`** (String, Optional): Custom CSS classes for the container.
* **`id`** (String, Optional): Custom HTML `id` for the container.
* **`content_bg_color`** (String, Optional): Popover background color.
* **`content_color`** (String, Optional): Popover text color.
* **`content_class`** (String, Optional): Custom CSS classes for the popover content.
* Content between `~ progress ... ~` and `~~` is for the popover.
{~~}

## Themed Examples: Education, Resume & Leveling Up

Let's see how `content_bg_color` and `content_color` can make the popover an extension of the progress bar's theme.

### Academic Achievements

**Degree Completion:**
Illustrating progress towards a Bachelor of Magical Arts. The popover provides details about the current year and focus.

```django
{~ progress value="3" max_value="4" label="Year {{value}}/{{max_value}} Completed" color="info" bg_color="info-25" height="lg" content_bg_color="info-75" content_color="white" ~}
**Current Status: Year 3 of 4**
Focusing on Advanced Transfiguration and Ancient Runes. Thesis proposal on "Temporal Distortions in Ley Line Magic" submitted. Expected graduation: Spring 2026.
{~~}
```

Renders as:
{~ progress value="3" max_value="4" label="Year {{value}}/{{max_value}} Completed" color="info" bg_color="info-25" height="lg" content_bg_color="info-75" content_color="white" ~}
**Current Status: Year 3 of 4**
Focusing on Advanced Transfiguration and Ancient Runes. Thesis proposal on "Temporal Distortions in Ley Line Magic" submitted. Expected graduation: Spring 2026.
{~~}

**Mastering a Difficult Subject:**
Showing progress in "Advanced Potion Brewing," with popover details matching the "warning" theme of a challenging subject.

```django
{~ progress value="60" label="Potion Brewing Mastery: {{percentage}}" color="warning" bg_color="neutral-25" striped="true" content_bg_color="warning-75" content_color="black-75" ~}
**Potion Brewing - Current Standing:**
Successfully brewed Elixir of Vigilance (Grade: Exceeds Expectations). Struggling with Draught of Living Death complexity. Next practical: Polyjuice Potion.
{~~}
```

Renders as:
{~ progress value="60" label="Potion Brewing Mastery: {{percentage}}" color="warning" bg_color="neutral-25" striped="true" content_bg_color="warning-75" content_color="black-75" ~}
**Potion Brewing - Current Standing:**
Successfully brewed Elixir of Vigilance (Grade: Exceeds Expectations). Struggling with Draught of Living Death complexity. Next practical: Polyjuice Potion.
{~~}

### Resume & Work Experience

**Skill Level (from a Resume):**
Visualizing proficiency in "Django Web Weaving," with popover details that match the primary skill color.

```django
{~ progress value="90" label="Django Web Weaving: Expert ({{percentage}})" color="primary" height="sm" content_bg_color="primary-75" content_color="white" ~}
**Expert Level:** Proficient in Django ORM, REST framework, Channels, and deploying scalable applications on enchanted servers. Developed the award-winning "QuickQuill" familiar messaging platform.
{~~}
```

Renders as:
{~ progress value="90" label="Django Web Weaving: Expert ({{percentage}})" color="primary" height="sm" content_bg_color="primary-75" content_color="white" ~}
**Expert Level:** Proficient in Django ORM, REST framework, Channels, and deploying scalable applications on enchanted servers. Developed the award-winning "QuickQuill" familiar messaging platform.
{~~}

**Project Completion at a Previous Role:**
A progress bar indicating a successfully completed major project, "Phoenix Feather Archival System."

```django
{~ progress value="100" label="Project Phoenix: Complete!" color="success" bg_color="success-25" animated="false" content_bg_color="success-75" content_color="white" ~}
**Project Lead: Phoenix Feather Archival System**
Successfully led a team of 5 junior mages to digitize and secure 10,000 ancient scrolls. Project completed on time and 15% under budget. Received a commendation from the Grand Council.
{~~}
```

Renders as:
{~ progress value="100" label="Project Phoenix: Complete!" color="success" bg_color="success-25" animated="false" content_bg_color="success-75" content_color="white" ~}
**Project Lead: Phoenix Feather Archival System**
Successfully led a team of 5 junior mages to digitize and secure 10,000 ancient scrolls. Project completed on time and 15% under budget. Received a commendation from the Grand Council.
{~~}

### Personal Development & "Leveling Up"

**Learning a New Incantation (Language):**
Tracking progress learning "Infernal (Advanced Dialect)". The popover uses a fiery theme.

```django
{~ progress value="25" max_value="100" label="Infernal Study: {{percentage}}" color="error" bg_color="black-75" striped="true" animated="true" height="sm" content_bg_color="error-75" content_color="white" ~}
**Current Progress: Novice Summoner**
Mastered basic greetings and 3 minor binding spells. Still confusing "Kazath" (ally) with "Kazaath" (eternal doom). Weekly lessons with Archdemon Belphazor.
{~~}
```

Renders as:
{~ progress value="25" max_value="100" label="Infernal Study: {{percentage}}" color="error" bg_color="black-75" striped="true" animated="true" height="sm" content_bg_color="error-75" content_color="white" ~}
**Current Progress: Novice Summoner**
Mastered basic greetings and 3 minor binding spells. Still confusing "Kazath" (ally) with "Kazaath" (eternal doom). Weekly lessons with Archdemon Belphazor.
{~~}

**Apprentice to Journeyman:**
Visualizing the overall journey from an apprentice to a journeyman mage.

```django
{~ progress value="650" max_value="1000" label="Journeyman Rank Progress: {{percentage}}" color="secondary" bg_color="white-75" height="lg" content_bg_color="secondary-75" content_color="white" ~}
**Path to Journeyman (650/1000 XP):**

* Completed Herbology I & II (+200 XP)
* Assisted Master Elara in the Crystal Caves (+150 XP)
* Successfully defended the village from GrumbleSnouts (+300 XP)
Next Quest: Retrieve the Orb of Whispering Winds.
{~~}
```

Renders as:
{~ progress value="650" max_value="1000" label="Journeyman Rank Progress: {{percentage}}" color="secondary" bg_color="white-75" height="lg" content_bg_color="secondary-75" content_color="white" ~}
**Path to Journeyman (650/1000 XP):**

* Completed Herbology I & II (+200 XP)
* Assisted Master Elara in the Crystal Caves (+150 XP)
* Successfully defended the village from GrumbleSnouts (+300 XP)
Next Quest: Retrieve the Orb of Whispering Winds.
{~~}

{~ alert type="info" title="A Note on Colors" ~}
The `color`, `bg_color`, `content_bg_color`, and `content_color` parameters typically expect theme color names (like `primary`, `info-50`, `black-75`). The actual color values are defined in your site's CSS (e.g., using CSS variables like `--primary-color`). Ensure your chosen color names have corresponding styles for both backgrounds (`sb-bg-*`) and text (`sb-text-*` or direct color application) for optimal results.
The popover's default styling will apply if `content_bg_color` and `content_color` are not specified.
{~~}

---
