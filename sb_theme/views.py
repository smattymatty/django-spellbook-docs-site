from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django_spellbook.theme import THEMES_WITH_MODES, SpellbookTheme
from django.conf import settings


def theme_switcher(request):
    """Theme switcher view - allows users to switch between different themes."""
    # Get available themes and add 'magical' as the default option
    themes_list = ['magical'] + list(THEMES_WITH_MODES.keys())
    
    current_theme = request.session.get('theme', 'magical')
    current_mode = request.session.get('mode', 'light')
    
    # Get the actual theme config for display
    if current_theme == 'magical':
        # Use the magical theme from settings
        from core.settings import MAGICAL_THEME_CONFIG
        current_colors = MAGICAL_THEME_CONFIG['modes'][current_mode]['colors']
    else:
        # Get from presets
        theme_data = THEMES_WITH_MODES.get(current_theme, {})
        current_colors = theme_data.get('modes', {}).get(current_mode, {}).get('colors', {})
    
    return render(request, 'sb_theme/theme_switcher.html', {
        'themes': themes_list,
        'current_theme': current_theme,
        'current_mode': current_mode,
        'current_colors': current_colors,
        'hide_themes_button_from_banner': True,
    })


@csrf_exempt
@require_http_methods(["POST"])
def set_theme(request):
    """HTMX endpoint to set theme and return color preview."""
    theme = request.POST.get('theme', 'magical')
    mode = request.POST.get('mode', request.session.get('mode', 'light'))
    
    # Save to session
    request.session['theme'] = theme  # Always store the theme, including 'magical'
    
    request.session['mode'] = mode
    request.session.save()  # Explicitly save session
    
    # Get the theme colors for preview
    if theme == 'magical':
        from core.settings import MAGICAL_THEME_CONFIG
        colors = MAGICAL_THEME_CONFIG['modes'][mode]['colors']
    else:
        theme_data = THEMES_WITH_MODES.get(theme, {})
        colors = theme_data.get('modes', {}).get(mode, {}).get('colors', {})
    
    # Return partial template with color preview
    response = render(request, 'sb_theme/partials/color_preview.html', {
        'colors': colors,
        'current_theme': theme,
        'current_mode': mode,
    })
    # Add HX-Refresh header to reload the page after successful theme change
    response['HX-Refresh'] = 'true'
    return response


@csrf_exempt
@require_http_methods(["POST"])
def reset_theme(request):
    """Reset to default theme (magical)."""
    # Set theme to magical explicitly
    request.session['theme'] = 'magical'
    request.session['mode'] = 'light'
    request.session.save()  # Explicitly save session
    
    # Get default theme colors (magical light mode)
    from core.settings import MAGICAL_THEME_CONFIG
    colors = MAGICAL_THEME_CONFIG['modes']['light']['colors']
    
    response = render(request, 'sb_theme/partials/color_preview.html', {
        'colors': colors,
        'current_theme': 'magical',
        'current_mode': 'light',
    })
    # Add HX-Refresh header to reload the page after successful theme change
    response['HX-Refresh'] = 'true'
    return response


def theme_builder(request):
    """Theme Builder Wizard - Visual theme creation tool."""
    
    # Get current theme to use as starting point
    current_theme_name = request.session.get('theme', 'arcane')
    current_mode = request.session.get('mode', 'light')
    
    # Load the current theme configuration with modes
    from django_spellbook.theme import THEMES_WITH_MODES, get_theme_with_mode
    
    # Get the theme with both modes
    if current_theme_name in THEMES_WITH_MODES:
        theme_data = THEMES_WITH_MODES[current_theme_name]
        light_colors = theme_data['modes']['light']['colors']
        dark_colors = theme_data['modes']['dark']['colors']
    else:
        # Fallback to default theme
        current_theme = SpellbookTheme()
        base_colors = current_theme.to_dict()['colors']
        light_colors = base_colors
        dark_colors = base_colors  # Will be adjusted in JS
    
    # Define all available color properties for the builder
    color_properties = {
        'primary': {
            'label': 'Primary',
            'description': 'Main brand color for buttons, links, and accents',
            'category': 'Brand Colors'
        },
        'secondary': {
            'label': 'Secondary', 
            'description': 'Supporting color for secondary elements',
            'category': 'Brand Colors'
        },
        'accent': {
            'label': 'Accent',
            'description': 'Highlight color for special elements and CTAs',
            'category': 'Brand Colors'
        },
        'neutral': {
            'label': 'Neutral',
            'description': 'Neutral color for borders and subtle elements',
            'category': 'Brand Colors'
        },
        'success': {
            'label': 'Success',
            'description': 'Color for success states and positive feedback',
            'category': 'Status Colors'
        },
        'warning': {
            'label': 'Warning',
            'description': 'Color for warning states and caution messages',
            'category': 'Status Colors'
        },
        'error': {
            'label': 'Error',
            'description': 'Color for error states and negative feedback',
            'category': 'Status Colors'
        },
        'info': {
            'label': 'Info',
            'description': 'Color for informational messages and help text',
            'category': 'Status Colors'
        },
        'emphasis': {
            'label': 'Emphasis',
            'description': 'Color for emphasized content and highlights',
            'category': 'Extended Colors'
        },
        'subtle': {
            'label': 'Subtle',
            'description': 'Subtle background color for quiet elements',
            'category': 'Extended Colors'
        },
        'distinct': {
            'label': 'Distinct',
            'description': 'Distinctive color for unique elements',
            'category': 'Extended Colors'
        },
        'aether': {
            'label': 'Aether',
            'description': 'Mystical purple for magical elements',
            'category': 'Extended Colors'
        },
        'artifact': {
            'label': 'Artifact',
            'description': 'Ancient gold for treasure and artifacts',
            'category': 'Extended Colors'
        },
        'sylvan': {
            'label': 'Sylvan',
            'description': 'Forest green for nature elements',
            'category': 'Extended Colors'
        },
        'danger': {
            'label': 'Danger',
            'description': 'High-contrast color for dangerous actions',
            'category': 'Extended Colors'
        },
        'background': {
            'label': 'Background',
            'description': 'Main page background color',
            'category': 'System Colors'
        },
        'surface': {
            'label': 'Surface',
            'description': 'Background color for cards and elevated elements',
            'category': 'System Colors'
        },
        'text': {
            'label': 'Text',
            'description': 'Primary text color',
            'category': 'System Colors'
        },
        'text-secondary': {
            'label': 'Text Secondary',
            'description': 'Secondary text color for less important content',
            'category': 'System Colors'
        },
    }
    
    # Layout options for preview
    preview_layouts = [
        {
            'id': 'home',
            'name': 'Home Page',
            'description': 'Homepage with hero section and color palette',
            'url': '/'
        },
        {
            'id': 'blog-list',
            'name': 'Blog List',
            'description': 'Blog listing page with post cards',
            'url': '/blog/'
        },
        {
            'id': 'theme-switcher',
            'name': 'Theme Switcher',
            'description': 'Theme switcher with components showcase',
            'url': '/themes/'
        },
        {
            'id': 'blog-post',
            'name': 'Blog Post',
            'description': 'Individual blog post with content',
            'url': '/blog/introducing-themes/'
        },
    ]
    
    return render(request, 'sb_theme/theme_builder.html', {
        'color_properties': color_properties,
        'light_colors': light_colors,
        'dark_colors': dark_colors,
        'preview_layouts': preview_layouts,
        'current_theme': current_theme_name,
        'current_mode': current_mode,
        'light_colors_json': json.dumps(light_colors),
        'dark_colors_json': json.dumps(dark_colors),
        'color_properties_json': json.dumps(color_properties),
        'preview_layouts_json': json.dumps(preview_layouts),
        'hide_themes_button_from_banner': True,
    })


@csrf_exempt
def toggle_mode(request):
    """Toggle between light and dark modes."""
    if request.method == 'POST':
        current_mode = request.session.get('mode', 'light')
        new_mode = 'dark' if current_mode == 'light' else 'light'
        request.session['mode'] = new_mode
        
        return JsonResponse({
            'status': 'success',
            'mode': new_mode,
            'icon': '☀️' if new_mode == 'light' else '🌙'
        })
    
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)