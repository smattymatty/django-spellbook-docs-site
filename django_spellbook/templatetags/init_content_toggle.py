import re
from django import template
from django.templatetags.static import static
from django.utils.safestring import mark_safe
from django_spellbook.exceptions import TemplateTagInitError


register = template.Library()

VALID_TOGGLE_ID_PATTERN = re.compile(r'^[a-zA-Z0-9_\-]+$')


@register.simple_tag(takes_context=True)
def init_content_toggle(context, *toggle_ids):
    toggle_ids = [str(toggle_id).strip()
                  for toggle_id in toggle_ids if toggle_id]
    reserved_suffix = "-toggle-container"
    if not toggle_ids:
        raise TemplateTagInitError(
            "init_content_toggles tag requires at least one content toggle ID.", reserved_suffix
        )
    for toggle_id in toggle_ids:
        if reserved_suffix in toggle_id:
            raise TemplateTagInitError(
                f"Invalid toggle ID '{toggle_id}'.", reserved_suffix
            )
        if not VALID_TOGGLE_ID_PATTERN.match(toggle_id):
            raise TemplateTagInitError(
                f"Toggle ID '{toggle_id}' contains invalid characters. Only alphanumeric characters, hyphens, and underscores are allowed.", reserved_suffix
            )
    context['CONTENT_TOGGLES_INITIALIZED'] = True

    module_path = static("django_spellbook/modules/ContentToggleHandler.mjs")
    js_code = f"""
        <script type="module">
            import {{ ContentToggleHandler }} from "{module_path}";
            ContentToggleHandler.initAll('{ " ".join(toggle_ids) }');
        </script>
    """

    return mark_safe(js_code)
