---
title: spellbook_render
published: 2025-12-12
modified: 2025-12-12
tags:
  - functions
  - api
  - python
---

Convert markdown to HTML anywhere in your Django app. One function, full SpellBlock support.
```python
from django_spellbook.parsers import spellbook_render

html = spellbook_render(markdown_text)
```

---

## Basic Usage
```python
from django_spellbook.parsers import spellbook_render

markdown = """
# Welcome

This is **bold** and *italic*.

- Item one
- Item two
"""

html = spellbook_render(markdown)
```

Output:
```html
<h1>Welcome</h1>
<p>This is <strong>bold</strong> and <em>italic</em>.</p>
<ul>
<li>Item one</li>
<li>Item two</li>
</ul>
```

---

## SpellBlocks Just Work

Every SpellBlock available in markdown files works in `spellbook_render`:
```python
markdown = """
{~ alert type="warning" ~}
Check your settings before deploying.
{~~}

{~ card title="Quick Stats" ~}
- Users: 1,234
- Revenue: $56,789
{~~}

{~ accordion title="Click to expand" ~}
Hidden content revealed on click.
{~~}
"""

html = spellbook_render(markdown)
```

Full theme support. Full styling. No extra setup.

---

## In Views

### Template Context
```python
from django.shortcuts import render
from django_spellbook.parsers import spellbook_render

def article_view(request, slug):
    article = Article.objects.get(slug=slug)
    
    return render(request, 'article.html', {
        'title': article.title,
        'content': spellbook_render(article.markdown_content),
    })
```
```django
{% verbatim %}
<!-- article.html -->
{% load spellbook_tags %}

<!DOCTYPE html>
<html>
<head>
    {% spellbook_styles %}
</head>
<body>
    <h1>{{ title }}</h1>
    {{ content|safe }}
</body>
</html>
{% endverbatim %}
```

### Direct Response
```python
from django.http import HttpResponse
from django_spellbook.parsers import spellbook_render

def preview_markdown(request):
    markdown = request.POST.get('markdown', '')
    html = spellbook_render(markdown)
    return HttpResponse(html)
```

---

## In APIs

### Django REST Framework
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from django_spellbook.parsers import spellbook_render

class RenderMarkdownView(APIView):
    def post(self, request):
        markdown = request.data.get('markdown', '')
        return Response({
            'html': spellbook_render(markdown)
        })
```

### Simple JSON Endpoint
```python
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django_spellbook.parsers import spellbook_render

@csrf_exempt
def api_render(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        return JsonResponse({
            'html': spellbook_render(data.get('markdown', ''))
        })
```

---

## Dynamic Content

### User-Generated Content
```python
from django.shortcuts import render
from django_spellbook.parsers import spellbook_render

def user_profile(request, username):
    user = User.objects.get(username=username)
    
    # User's bio is stored as markdown
    bio_html = spellbook_render(user.profile.bio)
    
    return render(request, 'profile.html', {
        'user': user,
        'bio': bio_html,
    })
```

### Comments with Formatting
```python
def comment_list(request, post_id):
    comments = Comment.objects.filter(post_id=post_id)
    
    rendered_comments = [
        {
            'author': c.author,
            'content': spellbook_render(c.markdown_content),
            'created': c.created_at,
        }
        for c in comments
    ]
    
    return render(request, 'comments.html', {
        'comments': rendered_comments,
    })
```

---

## Email Templates

Generate rich HTML emails from markdown:
```python
from django.core.mail import send_mail
from django_spellbook.parsers import spellbook_render

def send_newsletter(subscriber, issue):
    html_content = spellbook_render(f"""
# {issue.title}

{issue.intro}

{~ card title="This Week's Highlight" ~}
{issue.highlight}
{~~}

---

{issue.body}

{~ alert type="info" ~}
You're receiving this because you subscribed at example.com
{~~}
""")
    
    send_mail(
        subject=issue.title,
        message=issue.plain_text,  # Fallback
        html_message=html_content,
        from_email='newsletter@example.com',
        recipient_list=[subscriber.email],
    )
```

---

## Admin Previews

Live preview in Django admin:
```python
# admin.py
from django.contrib import admin
from django.utils.html import format_html
from django_spellbook.parsers import spellbook_render
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'created']
    readonly_fields = ['content_preview']
    
    def content_preview(self, obj):
        if obj.markdown_content:
            html = spellbook_render(obj.markdown_content)
            return format_html(
                '<div style="max-width: 600px; padding: 1rem; '
                'border: 1px solid #ccc; border-radius: 4px;">'
                '{}</div>',
                html
            )
        return "No content"
    
    content_preview.short_description = "Preview"
```

---

## Management Commands

Process markdown in scripts:
```python
# management/commands/export_docs.py
from django.core.management.base import BaseCommand
from django_spellbook.parsers import spellbook_render
from pathlib import Path

class Command(BaseCommand):
    help = 'Export markdown files as HTML'
    
    def handle(self, *args, **options):
        docs_dir = Path('docs')
        output_dir = Path('exported')
        output_dir.mkdir(exist_ok=True)
        
        for md_file in docs_dir.glob('**/*.md'):
            markdown = md_file.read_text()
            html = spellbook_render(markdown)
            
            output_path = output_dir / md_file.with_suffix('.html').name
            output_path.write_text(html)
            
            self.stdout.write(f'Exported: {output_path}')
```

---

## Markdown Features Included

Out of the box, `spellbook_render` supports:

| Feature | Syntax |
|---------|--------|
| Fenced code blocks | ` ``` ` |
| Tables | `\| col \| col \|` |
| Footnotes | `[^1]` |
| Attribute lists | `{: .class #id }` |
| Auto-generated TOC | `[TOC]` |
| All SpellBlocks | `{~ block ~}` |

Code blocks are protected—SpellBlocks inside ``` fences render as literal text, not components.

---

## Advanced: Custom Engine

For more control, use `SpellbookMarkdownEngine` directly:
```python
from django_spellbook.markdown.engine import SpellbookMarkdownEngine

# Custom markdown extensions
engine = SpellbookMarkdownEngine(
    markdown_extensions=[
        'markdown.extensions.fenced_code',
        'markdown.extensions.tables',
        # Add your own extensions
    ]
)

html = engine.parse_and_render(markdown_text)
```

### Engine Options
```python
SpellbookMarkdownEngine(
    reporter=None,           # Custom logging
    markdown_extensions=None, # Override extensions list
    fail_on_error=False,     # Raise exceptions on SpellBlock errors
)
```

When `fail_on_error=False` (default), broken SpellBlocks insert an HTML comment instead of crashing. Set to `True` for strict validation during development.

---

## Performance

`spellbook_render` is lightweight:

- No database queries
- No file I/O
- Pure string processing

For high-traffic views, cache the output:
```python
from django.core.cache import cache
from django_spellbook.parsers import spellbook_render

def get_rendered_content(article):
    cache_key = f'article_html_{article.id}_{article.updated_at.timestamp()}'
    
    html = cache.get(cache_key)
    if html is None:
        html = spellbook_render(article.markdown_content)
        cache.set(cache_key, html, timeout=3600)
    
    return html
```

---

## Next Steps

{~ accordion title="SpellBlocks Reference" ~}
All available SpellBlocks for use in your markdown.

[View SpellBlocks →](/docs/spellblocks/)
{~~}

{~ accordion title="Template Tags" ~}
Use SpellBlocks directly in Django templates with `{% verbatim %}{% spellblock %}{% endverbatim %}`.

[View Template Tags →](/docs/template-tags/)
{~~}

{~ accordion title="Themes" ~}
Style your rendered content with theme presets.

[View Themes →](/docs/themes/)
{~~}