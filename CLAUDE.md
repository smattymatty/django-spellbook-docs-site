# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Django-based documentation site for the django-spellbook package. It serves as both documentation and a live demo of the spellbook functionality, showcasing markdown rendering with custom "spellblocks" (reusable UI components).

## Architecture

### Core Django Apps

- **base**: Main site foundation and home page
- **docs**: Documentation pages rendered from markdown files in `markdown_content/`
- **changelog**: Version history rendered from `changelog_content/`
- **examples**: Live examples rendered from `examples_content/`
- **api**: REST API for markdown preview and spellblock registry
- **editor**: Interactive markdown editor with live preview
- **analytics**: Custom analytics middleware for tracking page views
- **sb_theme**: Theme builder and switcher functionality
- **RPG**: Special animated welcome screen feature

### Key Dependencies

- **django-spellbook**: Core package providing markdown parsing and spellblock functionality
- **django-htmx**: For dynamic interactions without full page reloads
- **djangorestframework**: Powers the API endpoints
- **whitenoise**: Static file serving in production

### Content Organization

The site uses django-spellbook's markdown processing system configured in `settings.py`:
- Documentation markdown: `markdown_content/`
- Changelog markdown: `changelog_content/`
- Examples markdown: `examples_content/`

Each markdown directory maps to a Django app that renders the content with custom templates.

## Development Commands

### Running the Development Server
```bash
# Standard development server with auto-reload
python manage.py runserver

# Full development flow (regenerates markdown + runs server)
./run.sh

# Production server with gunicorn
./run_real_server.sh
```

### Django Management Commands
```bash
# Apply database migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Collect static files for production
python manage.py collectstatic

# Regenerate markdown views from content
python manage.py spellbook_md --report-format=json --report-output=spellbook_md_report.json --report-level=detailed
```

### Testing
```bash
# Run Django tests
python manage.py test

# Run specific app tests
python manage.py test analytics
python manage.py test api

# JavaScript editor tests
# Open editor/static/editor/test_runner.html in browser
```

### Code Quality
```bash
# Format Python code with Black
black .

# Lint Python code
flake8
pylint */**.py

# Type checking
mypy .
```

## URL Structure

- `/` - Home page (base app)
- `/docs/` - Documentation pages
- `/changelog/` - Version history
- `/examples/` - Live spellblock examples
- `/editor/` - Interactive markdown editor
- `/api/v1/` - REST API endpoints
- `/rpg/` - RPG welcome animation
- `/a-panel/` - Django admin interface

## Working with Spellblocks

Spellblocks are custom markdown extensions that render as interactive components. They use the syntax:
```markdown
:::spellblock-name
parameter: value
---
Content here
:::
```

The spellblock registry and rendering logic is in `django_spellbook` and extended in the `api` app.

## Editor Module

The editor uses modern JavaScript modules located in `editor/static/editor/mjs/`:
- Provides syntax highlighting for markdown
- Real-time preview via API
- Spellblock insertion dropdown
- Keyboard shortcuts

## Database

Development uses SQLite (`db.sqlite3`). The main models are:
- `StoredMarkdown` (api app) - For saving/loading markdown content
- `UniqueVisitor` and `PageView` (analytics app) - Traffic tracking

## Environment Variables

Configure in `.env` file or environment:
- `SECRET_KEY` - Django secret key (required in production)
- `DEBUG` - Debug mode (default: True)

## Static Files

- Project static files: `base/static/`, `docs/static/`, etc.
- Collected static files: `staticfiles/` (after `collectstatic`)
- Served via WhiteNoise middleware in production