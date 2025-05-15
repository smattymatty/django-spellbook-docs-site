---
title: Advanced Hero Block Applications
created: 2025-05-14
tags:
  - spellblock
  - hero
  - component
  - ui
  - examples
  - professional
  - portfolio
  - services
  - case-study
---

# Hero Block (`~ hero ~`): Professional Use Cases

The `~ hero ~` SpellBlock provides a robust foundation for creating compelling leading sections. This document showcases advanced and varied examples tailored for professional contexts such as portfolios, service descriptions, and calls to action, leveraging parameters like `text_bg_color` for enhanced visual design.

## Example 1: Consultant Portfolio Introduction

A clean, impactful hero for a consultant's homepage, using the `text_left_image_right` layout.

```django
{~ hero layout="text_left_image_right" image_src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVzaW5lc3MlMjBtZWV0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" image_alt="Professional consultant presenting a strategy" min_height="70vh" content_align_vertical="center" text_bg_color="black-50" class="hero-consultant" ~}
## Strategic Business Solutions

Driving growth and efficiency for your organization. I offer expert consultancy in market analysis, operational improvement, and digital transformation. Let's build your success story together.

With over 15 years of experience across multiple industries, I provide actionable insights and measurable results.

{~~}
```

**Renders as:**
{~ hero layout="text_left_image_right" image_src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVzaW5lc3MlMjBtZWV0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" image_alt="Professional consultant presenting a strategy" min_height="70vh" content_align_vertical="center" text_bg_color="black-50" class="hero-consultant" ~}
## Strategic Business Solutions

Driving growth and efficiency for your organization. I offer expert consultancy in market analysis, operational improvement, and digital transformation. Let's build your success story together.

With over 15 years of experience across multiple industries, I provide actionable insights and measurable results.

{~~}

---

## Example 2: Software Product Showcase with Background Image

Utilizing the `text_center_image_background` layout to highlight a software product. The `text_bg_color` with slight transparency ensures the text is legible over the image.

```django
{~ hero layout="text_center_image_background" image_src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c29mdHdhcmUlMjBkZXZlbG9wbWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" image_alt="Abstract software interface" text_color="white" text_bg_color="black-50" min_height="screen" content_align_vertical="center" ~}
# Innovate. Automate. Elevate.

Discover **SynergyFlow Pro** – the ultimate platform for streamlining your team's workflow and boosting productivity. Intuitive design, powerful features.

{~~}
```

**Renders as:**
{~ hero layout="text_center_image_background" image_src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c29mdHdhcmUlMjBkZXZlbG9wbWVudHxlbnwwfHwwfHx8MA%3D%3D&auto.format&fit=crop&w=800&q=60" image_alt="Abstract software interface" text_color="white" min_height="screen" content_align_vertical="center" ~}

# Innovate. Automate. Elevate.

Discover **SynergyFlow Pro** – the ultimate platform for streamlining your team's workflow and boosting productivity. Intuitive design, powerful features.

{~~}

---

## Example 3: Minimalist Text-Only Hero for a Service Page

The `text_only_centered` layout is perfect for a direct, message-focused introduction, such as for a specialized service.

```django
{~ hero layout="text_only_centered" bg_color="neutral-50" text_color="black" min_height="400px" content_align_vertical="center" text_bg_color="white-75" class="hero-service-intro" ~}
### Expert Financial Advisory

Navigating complex financial landscapes with clarity and precision. We provide personalized strategies for wealth management, investment planning, and retirement security.

Your financial future, secured.

{~~}
```

**Renders as:**
{~ hero layout="text_only_centered" bg_color="neutral-50" text_color="black" min_height="400px" content_align_vertical="center" text_bg_color="white-75" class="hero-service-intro" ~}
### Expert Financial Advisory

Navigating complex financial landscapes with clarity and precision. We provide personalized strategies for wealth management, investment planning, and retirement security.

Your financial future, secured.

{~~}

---

## Example 4: Workshop or Event Announcement

Using `text_center_image_background` with a vibrant image and clear call to action. `content_align_vertical="bottom"` pushes content down.

```django
{~ hero layout="text_center_image_background" image_src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGV2ZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" image_alt="Dynamic workshop event" text_color="white" text_bg_color="primary-75" min_height="60vh" content_align_vertical="bottom" ~}
## Upcoming Workshop: Mastering Digital Marketing

**Date:** October 26th, 2025 | **Location:** Online
Join industry experts to learn the latest trends and techniques in digital marketing. Limited seats available!

{~~}
```

**Renders as:**
{~ hero layout="text_center_image_background" image_src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGV2ZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" image_alt="Dynamic workshop event" text_color="white" text_bg_color="primary-75" min_height="60vh" content_align_vertical="bottom" ~}
## Upcoming Workshop: Mastering Digital Marketing

**Date:** October 26th, 2025 | **Location:** Online
Join industry experts to learn the latest trends and techniques in digital marketing. Limited seats available!

{~~}

---

## Example 5: Developer Skill Highlight on a Resume/Portfolio

A `text_left_image_right` layout focusing on a specific skill, with text background for clarity if image has varied colors.

```django
{~ hero layout="text_left_image_right" image_src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGV2ZWxvcGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" image_alt="Code on a screen" min_height="auto" content_align_vertical="center" bg_color="black-25" text_bg_color="black-25" class="skill-highlight-hero" ~}
### Core Competency: API Development

Designing and implementing robust, scalable, and secure RESTful APIs using Python (Django REST Framework, FastAPI) and Node.js. Proficient in API documentation (Swagger/OpenAPI), versioning, and integration.

* Developed a microservice architecture processing 1M+ requests/day.
* Integrated third-party APIs for payment gateways and data services.
{~~}
```

**Renders as:**
{~ hero layout="text_left_image_right" image_src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGV2ZWxvcGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" image_alt="Code on a screen" min_height="auto" content_align_vertical="center" bg_color="black-25" text_bg_color="black-25" class="skill-highlight-hero" ~}
### Core Competency: API Development

Designing and implementing robust, scalable, and secure RESTful APIs using Python (Django REST Framework, FastAPI) and Node.js. Proficient in API documentation (Swagger/OpenAPI), versioning, and integration.

* Developed a microservice architecture processing 1M+ requests/day.
* Integrated third-party APIs for payment gateways and data services.

{~~}

The `~ hero ~` SpellBlock can be used to create stunning, movie-themed hero sections, perfect for film reviews, fan pages, or promotional content. These examples demonstrate the new layouts: `text_right_image_left`, `image_top_text_bottom`, and `image_only_full`.

## Example 1: Sci-Fi Epic - `text_right_image_left`

Showcasing a movie poster on the left and review/details on the right.

```django
{~ hero layout="text_right_image_left" image_src="https://image.tmdb.org/t/p/w780/gKkl37BQuKTanygYQG1pyYgKzgL.jpg" image_alt="Movie poster for 'Dune: Part Two'" min_height="80vh" content_align_vertical="center" bg_color="black-90" text_color="neutral-100" text_bg_color="black-50" class="movie-hero-dune" ~}
## Dune: Part Two (2024)

A breathtaking cinematic achievement, Denis Villeneuve's sequel expands on the rich lore of Arrakis with stunning visuals and a compelling narrative. Follow Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.

* **Director:** Denis Villeneuve
* **Stars:** Timothée Chalamet, Zendaya, Rebecca Ferguson
* **Rating:** spice_melange: spice_melange: spice_melange: spice_melange: spice_melange: (5/5 Spice Melanges)

{~~}
```

**Renders as:**
{~ hero layout="text_right_image_left" image_src="https://m.media-amazon.com/images/I/51ZM+aTI7rL.jpg" image_alt="Movie poster for 'Dune: Part Two'" min_height="80vh" content_align_vertical="center" bg_color="black-75" text_color="white" text_bg_color="black-50" class="movie-hero-dune" ~}
## Dune: Part Two (2024)

A breathtaking cinematic achievement, Denis Villeneuve's sequel expands on the rich lore of Arrakis with stunning visuals and a compelling narrative. Follow Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.

* **Director:** Denis Villeneuve
* **Stars:** Timothée Chalamet, Zendaya, Rebecca Ferguson
* **Rating:** spice_melange: spice_melange: spice_melange: spice_melange: spice_melange: (5/5 Spice Melanges)

{~~}

---

## Example 2: Animated Feature - `image_top_text_bottom`

Perfect for a family-friendly movie, with a vibrant wide image at the top and details below.

```django
{~ hero layout="image_top_text_bottom" image_src="https://image.tmdb.org/t/p/original/kDp1vUBnMfTfS2h6R5mDcO0yD0W.jpg" image_alt="Promotional image for 'Spider-Man: Across the Spider-Verse'" min_height="auto" bg_color="black-25" content_align_vertical="top" text_bg_color="white-50" text_color="black" class="movie-hero-spiderman" ~}
### Spider-Man: Across the Spider-Verse (2023)

Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must redefine what it means to be a hero.

**Voice Cast Includes:** Shameik Moore, Hailee Steinfeld, Oscar Isaac

{~~}
```

**Renders as:**
{~ hero layout="image_top_text_bottom" image_src="https://m.media-amazon.com/images/I/71XcorWZeML._AC_UF894,1000_QL80_.jpg" image_alt="Promotional image for 'Spider-Man: Across the Spider-Verse'" min_height="auto" bg_color="black-25" content_align_vertical="top" text_bg_color="white-50" text_color="black" class="movie-hero-spiderman" ~}
### Spider-Man: Across the Spider-Verse (2023)

Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must redefine what it means to be a hero.

**Voice Cast Includes:** Shameik Moore, Hailee Steinfeld, Oscar Isaac

{~~}

---

## Example 3: Indie Film Festival - `image_only_full`

A full-bleed image to set the mood for a film festival, with overlaid text announcing the event. `text_bg_color` is crucial for readability.

```django
{~ hero layout="image_only_full" image_src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmlsbSUyMGZlc3RpdmFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80" image_alt="Audience at an independent film festival" min_height="90vh" text_color="white" text_bg_color="black-75" content_align_vertical="center" class="filmfest-hero" ~}
# Sundown Independent Film Festival

**Celebrating Visionary Filmmakers**

Join us: June 10-15, 2026

Discover the future of cinema. Submissions now open!

{~~}
```

**Renders as:**
{~ hero layout="image_only_full" image_src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmlsbSUyMGZlc3RpdmFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80" image_alt="Audience at an independent film festival" min_height="90vh" text_color="white" text_bg_color="black-75" class="filmfest-hero" ~}
# Sundown Independent Film Festival

**Celebrating Visionary Filmmakers**

Join us: June 10-15, 2026

Discover the future of cinema. Submissions now open!

{~~}

---
