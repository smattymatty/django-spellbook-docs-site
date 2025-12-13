from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from django_spellbook.sitemaps import SpellbookSitemap


class StaticViewSitemap(Sitemap):
    """Sitemap for static views like homepage, editor, etc."""
    priority = 0.8
    changefreq = 'weekly'

    def items(self):
        # Add your static view names here
        return [
            'base:home',
            'editor:home',
            'sb_theme:theme-switcher',
        ]

    def location(self, item):
        return reverse(item)


sitemaps = {
    'static': StaticViewSitemap,
    'spellbook': SpellbookSitemap,
}
