## Accordion SpellBlock Showcase

The Accordion SpellBlock enables creating collapsible content sections, perfect for FAQs, step-by-step guides, and organizing complex information. This guide demonstrates all Accordion capabilities.
Basic Accordion Usage

**Create a simple collapsible section:**

```django
{~ accordion title="What is Django Spellbook?" ~}
A powerful markdown processor that extends Django's templating capabilities.
{~~}
```

{~ accordion title="What is Django Spellbook?" ~}
A powerful markdown processor that extends Django's templating capabilities.
{~~}

**Expanded on page load:**

```django
{~ accordion title="Installation Guide" open=true ~}
1. `pip install django-spellbook`  
2. Add to `INSTALLED_APPS`  
3. Run `migrate`
{~~}
```

{~ accordion title="Installation Guide" open=true ~}
1. `pip install django-spellbook`  
2. Add to `INSTALLED_APPS`  
3. Run `migrate`
{~~}

## Rich Content Support
Accoridons can contain any valid markdown and SpellBlocks:

```django
{~ accordion title="Troubleshooting Guide" ~}

Common issues:

1. Missing migrations
2. Template path errors
3. Markdown syntax issues

{~ practice difficulty="Intermediate" ~}
Create a test case for migration conflicts
{~~}
{~~}
```

{~ accordion title="Troubleshooting Guide" ~}

Common issues:
1. Missing migrations
2. Template path errors
3. Markdown syntax issues

{~ practice difficulty="Intermediate" ~}
Create a test case for migration conflicts
{~~}
{~~}
