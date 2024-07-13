from django import template
from django.templatetags.static import static
from django.utils.safestring import mark_safe
from django_spellbook.exceptions import TemplateTagInitError


register = template.Library()

# Allowed values for event and action
ALLOWED_EVENTS = {'on-load'}
ALLOWED_ACTIONS = {
    'click', 'toggle', 'add-class', 'remove-class'
}
VALID_STRATEGIES = [
    'all', 'first', 'last', 'none', 'random', 'byText', 'this'
]


def validate_action_params(event, action, strategy, target_id):
    if not event or not action or not target_id:
        raise ValueError(
            "Missing required parameters: event, action, and target_id must be provided.")

    if event not in ALLOWED_EVENTS:
        raise ValueError(
            f"Invalid event: {event}. Allowed events are: {', '.join(ALLOWED_EVENTS)}.")

    if strategy not in VALID_STRATEGIES and not (strategy.isdigit() and 0 <= int(strategy) <= 100):
        raise ValueError(
            f"Invalid strategy: {strategy}. Allowed strategies are: {', '.join(VALID_STRATEGIES)} or an index between 0 and 100.")

    if action not in ALLOWED_ACTIONS:
        raise ValueError(
            f"Invalid action: {action}. Allowed actions are: {', '.join(ALLOWED_ACTIONS)}.")

    if not isinstance(target_id, str) or not target_id.strip():
        raise ValueError("Invalid target_id: It must be a non-empty string.")


@register.simple_tag
def invoke_action(event, action, strategy, target_id, config=''):
    """
    Generates the JavaScript code to initialize ActionInvoker instances.

    Args:
        event: The event to listen for (e.g., "on-load").
        action: The action to take (e.g., "click").
        strategy: The strategy to use for selecting buttons (e.g., "all").
        target_id: The ID of the element to attach the event listener to.

    Returns:
        Safe JavaScript code string.

    Raises:
        TemplateTagInitError: If validation fails.

    Example usage:
        {% load action_invoker_tags %}
        {% invoke_action "on-load" "click" "all" "my-button-group" %}
    """

    # Validate parameters
    try:
        config_dict = parse_config(config)
        validate_action_params(event, action, strategy, target_id)
        # Combine all parameters into a single dictionary
        full_config = {
            'event': event,
            'action': action,
            'strategy': strategy,
            'targetId': target_id,
            **config_dict
        }
    except ValueError as e:
        # Log and raise a TemplateTagInitError with a helpful message
        raise TemplateTagInitError(str(e))
    except Exception as e:
        raise Exception(str(e))

    module_path = static("django_spellbook/modules/ActionInvoker.mjs")

    # Generate the JavaScript code
    js_code = f"""
        <script type="module">
            import {{ ActionInvoker }} from "{module_path}";
            ActionInvoker.initAll([{ full_config }]);
        </script>
    """

    module_logger.debug(
        f"invoke_action tag generated JavaScript code: {js_code}")

    return mark_safe(js_code)
