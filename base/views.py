from django.shortcuts import render
from pathlib import Path
from django_spellbook.parsers import render_spellbook_markdown_to_html

# Create your views here.


def home(request):
    # Load the get started content from markdown
    markdown_path = Path(__file__).resolve().parent.parent / 'markdown_content' / 'home_get_started.md'
    
    try:
        with open(markdown_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
        
        # Strip frontmatter if present
        if markdown_content.startswith('---'):
            # Find the closing --- and skip everything before it
            parts = markdown_content.split('---', 2)
            if len(parts) >= 3:
                markdown_content = parts[2].strip()
        
        # Render markdown to HTML using django-spellbook
        get_started_html = render_spellbook_markdown_to_html(markdown_content)
    except FileNotFoundError:
        # Fallback if file doesn't exist
        get_started_html = "<p>Content loading...</p>"
    
    context = {
        'get_started_content': get_started_html,
    }
    
    return render(
        request,
        "base/home.html",
        context,
    )
