from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry
import logging # For potential warnings/errors

logger = logging.getLogger(__name__) # Or a more specific logger

@SpellBlockRegistry.register()
class HeroSpellBlock(BasicSpellBlock):
    name = "hero"
    template = "base/blocks/hero_block.html" # Main template for the hero block

    # Define MVP parameters with their defaults
    # (These would also be documented in your markdown)
    LAYOUT_CHOICES = [
        "text_left_image_right",
        "text_center_image_background",
        "text_only_centered",
        "text_right_image_left",
        "image_top_text_bottom",
        "image_only_full",
    ]
    DEFAULT_LAYOUT = "text_left_image_right"
    DEFAULT_IMAGE_ALT = "" # Should ideally be required if image_src is present
    DEFAULT_BG_COLOR = None # Or a specific default like "transparent" or "white"
    DEFAULT_TEXT_COLOR = "white" # Or a specific default
    DEFAULT_TEXT_BG_COLOR = "black-25"
    DEFAULT_MIN_HEIGHT = "auto"
    DEFAULT_CONTENT_ALIGN_VERTICAL = "center"

    # Video defaults (even if deferred for MVP, good to have placeholders)
    # TODO: Add video support
    DEFAULT_VIDEO_AUTOPLAY = False # Changed from true as per our discussion
    DEFAULT_VIDEO_LOOP = True
    DEFAULT_VIDEO_MUTED = True # Essential if autoplay is true
    DEFAULT_VIDEO_CONTROLS = False


    def get_context(self):
        context = super().get_context() # Gets basic context like 'content', 'kwargs'

        # --- Layout ---
        layout = self.kwargs.get("layout", self.DEFAULT_LAYOUT).lower()
        if layout not in self.LAYOUT_CHOICES:
            logger.warning(
                f"HeroBlock: Invalid 'layout' parameter: '{layout}'. "
                f"Defaulting to '{self.DEFAULT_LAYOUT}'."
            )
            layout = self.DEFAULT_LAYOUT
        context["layout"] = layout

        # --- Image ---
        context["image_src"] = self.kwargs.get("image_src")
        image_alt = self.kwargs.get("image_alt", self.DEFAULT_IMAGE_ALT)
        if context["image_src"] and not image_alt:
            logger.warning(
                "HeroBlock: 'image_src' is present but 'image_alt' is missing or empty. "
                "Alt text is important for accessibility."
            )
            # You might choose to provide a generic alt or leave it as is, but log it.
        context["image_alt"] = image_alt

        # --- Styling & Dimensions (MVP) ---
        context["bg_color"] = self.kwargs.get("bg_color", self.DEFAULT_BG_COLOR)
        context["text_color"] = self.kwargs.get("text_color", self.DEFAULT_TEXT_COLOR)
        context["text_bg_color"] = self.kwargs.get("text_bg_color", self.DEFAULT_TEXT_BG_COLOR)
        context["min_height"] = self.kwargs.get("min_height", self.DEFAULT_MIN_HEIGHT)
        context["content_align_vertical"] = self.kwargs.get(
            "content_align_vertical", self.DEFAULT_CONTENT_ALIGN_VERTICAL
        ).lower()
        context["custom_class"] = self.kwargs.get("class", "") # User-provided custom classes

        # The 'content' variable (inner markdown processed to HTML) is already in context
        # from BasicSpellBlock's get_context.

        # Determine a CSS class for the layout for easier styling
        context["layout_class"] = f"sb-hero-layout--{layout.replace('_', '-')}"

        # Determine CSS class for vertical alignment
        align_map = {
            "top": "sb-items-start", # Assuming Flexbox/Grid alignment utilities
            "center": "sb-items-center",
            "bottom": "sb-items-end",
        }
        context["vertical_align_class"] = align_map.get(context["content_align_vertical"], "sb-items-center")

        return context