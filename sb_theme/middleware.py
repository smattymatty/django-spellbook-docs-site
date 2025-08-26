from django.conf import settings
from django_spellbook.theme import get_theme_with_mode, THEMES_WITH_MODES

class ThemeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get theme and mode from session
        theme_name = request.session.get('theme', None)
        mode = request.session.get('mode', 'light')
        
        # Check if user selected the magical theme from settings
        if theme_name == 'magical':
            # Load the magical theme with the correct mode
            from core.settings import MAGICAL_THEME_CONFIG
            if mode in MAGICAL_THEME_CONFIG.get('modes', {}):
                theme_config = MAGICAL_THEME_CONFIG['modes'][mode].copy()
                theme_config['name'] = f"magical-{mode}"
                settings.SPELLBOOK_THEME = theme_config
            else:
                # Fallback to light mode if mode not found
                settings.SPELLBOOK_THEME = MAGICAL_THEME_CONFIG['modes']['light']
            request.theme_name = 'magical'
            request.theme_mode = mode
        elif theme_name and theme_name in THEMES_WITH_MODES:
            # Apply preset theme from django_spellbook
            theme_config = get_theme_with_mode(theme_name, mode)
            if theme_config:
                settings.SPELLBOOK_THEME = theme_config
                # Store theme name and mode in request for templates
                request.theme_name = theme_name
                request.theme_mode = mode
        elif not theme_name:
            # No session theme, use magical theme as default
            from core.settings import MAGICAL_THEME_CONFIG
            # Default to light mode
            settings.SPELLBOOK_THEME = MAGICAL_THEME_CONFIG['modes']['light']
            request.theme_name = 'magical'
            request.theme_mode = 'light'
        
        response = self.get_response(request)
        return response