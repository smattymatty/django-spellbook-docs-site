from django.apps import AppConfig


class BaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'

    def ready(self):
        """Import spellblocks when Django app is ready."""
        try:
            import base.spellblocks  # This will register the SpellBlocks
        except ImportError:
            pass
