---
title: Educators Guide
created: 2025-05-07
updated: 2025-05-07
tags: 
  - education
  - teaching
  - learning
  - spellbook
  - django
---
# Educators Guide

{~ alert type="info" title="The Future is Intelligent" ~}
This document outlines the enhanced "Question Spell," a pivotal component for Django Spellbook. It empowers educational content creators to magically store, manage, and reuse questions and answers within their database. This allows for dynamic generation of tests, quizzes, and interactive learning elements across their entire digital academy or within specific modules.
{~~}


## The educational Content Creator's Guide

### 1. Create a New Question

To create a new question, simply utilize the spell after any level of header (h1, h2, h3, etc.):

```markdown
## The Unlikely Journey of the Unladen Swallow {? title="What is the airspeed velocity of an unladen swallow?" ans="unladen-swallow-velocity" topic="aviary_physics" difficulty="intermediate" ?}
```

### 2. Create a New Answer

To create a new answer, simply surround your content with the question spell, using the `ans` attribute:

```markdown
{? ans="unladen-swallow-velocity" ?}
The airspeed velocity of an unladen swallow is approximately 15 miles per hour.
{??}
```

Full Example: 

```markdown
# The Unlikely Journey of the Unladen Swallow {? title="What is the airspeed velocity of an unladen swallow?" ans="unladen-swallow-velocity" ?}

This story is about a swallow who is not able to fly.

## The African Swallow {? title="What is the airspeed velocity of an African swallow?" ans="african-swallow-velocity" ?}

The African Swallow's velocity is 
{? ans="african-swallow-velocity" ?}
about 10 miles per hour.
{??}

# Another Header

Even if the spell is not utilized, the new `#` level 1 header has started a new scope, and the ans attribute will not be recognized. 

It will actually result in an MarkdownProcessingError, because the `question`s answer  
```

### 3.Define your tags in settings.py

In your django settings, you will define a list of tags that will be used to generate the `tags` attribute for each question.

```python
# settings.py

SPELLBOOK_MD_QUESTION_TAGS = [
    'aviary_physics',
    'biology',
    'chemistry',
    'physics',
    'mathematics',
    'science',
]
```

### 4. Utilize these stored questions in future markdown content using the various spellblocks available to you.

#### 4.1 The Quiz Block

The `Quiz Block` allows you to dynamically assemble quizzes from your repository of questions.

```markdown
{~ quiz title="Chapter 1 Review" count="10" tags=["chapter1", "beginner"] show_feedback="immediate" ~}
```

#### 4.2 The Flashcard Block

The `Flashcard Block` turns Q&A pairs into a digital deck for study.

```markdown
{~ flashcards tags=["key_terms", "chapter2"] shuffle="true" ~}
```

#### 4.3 The Matching Game Block

The `Matching Game Block` provides a fun, interactive way to test connections between concepts.

```markdown
{~ matching_game title="Arcane Symbol Match" left_tags=["symbols"] right_tags=["symbol_meanings"] count="8" ~}
```

#### 4.4 The Test Page

A "Test Page" is a dedicated, automatically generated document for comprehensive assessments. This introduces "Spellbook Pages"—dynamically created pages based on `spellbook_md` settings and data from spells like the "Question Spell."

The idea is not too fleshed out yet, but I imageine it could be defined in your django settings like this:

```python
# settings.py

SPELLBOOK_MD_TEST_PAGE = {
    'title': 'Test Page',
    'description': 'A comprehensive assessment of your knowledge.',
    'tags': ['test', 'assessment'],
    'difficulty': 'beginner',
    'time_limit': '30 minutes',
    'questions' : 20,
}
```

That is a simple example dictionary, but we could probably make a new python class SpellbookTest or something that people could import from django_spellbook.edu.tests

## Other plans

Right now the only two parameters for the question spell are `title` and `ans`. In the future, we can include