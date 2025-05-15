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

        # --- Video (Deferred for MVP, but showing how params would be processed) ---
        # For MVP, these will likely be None or their defaults but not used in MVP templates
        context["video_src"] = self.kwargs.get("video_src")
        context["video_autoplay"] = self.kwargs.get("video_autoplay", self.DEFAULT_VIDEO_AUTOPLAY)
        context["video_loop"] = self.kwargs.get("video_loop", self.DEFAULT_VIDEO_LOOP)
        context["video_muted"] = self.kwargs.get("video_muted", self.DEFAULT_VIDEO_MUTED)
        context["video_controls"] = self.kwargs.get("video_controls", self.DEFAULT_VIDEO_CONTROLS)

        # Ensure autoplay implies muted if not explicitly set otherwise by user
        if context["video_autoplay"] and not self.kwargs.get("video_muted", False): # Check if user explicitly set muted to False
            context["video_muted"] = True
            
        video_src_raw = self.kwargs.get("video_src")
        context["video_src_raw"] = video_src_raw
        context["video_type"] = "direct" # Default

        if video_src_raw:
            if "youtube.com/watch?v=" in video_src_raw or "youtu.be/" in video_src_raw:
                context["video_type"] = "youtube"
                # Extract video ID
                video_id = None
                if "youtube.com/watch?v=" in video_src_raw:
                    video_id = video_src_raw.split("v=")[1].split('&')[0]
                elif "youtu.be/" in video_src_raw:
                    video_id = video_src_raw.split("/")[-1].split('?')[0]
                context["youtube_video_id"] = video_id
                # Build YouTube embed URL with parameters
                # Example: https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID&controls=0
                yt_params = []
                if self.kwargs.get("video_autoplay", self.DEFAULT_VIDEO_AUTOPLAY): yt_params.append("autoplay=1")
                if self.kwargs.get("video_muted", self.DEFAULT_VIDEO_MUTED): yt_params.append("mute=1") # Autoplay requires mute
                if self.kwargs.get("video_loop", self.DEFAULT_VIDEO_LOOP): yt_params.append(f"loop=1&playlist={video_id}") # Loop needs playlist=VIDEO_ID
                if not self.kwargs.get("video_controls", self.DEFAULT_VIDEO_CONTROLS): yt_params.append("controls=0")
                # Add other YT params like modestbranding=1, rel=0 etc. if desired
                context["youtube_embed_url"] = f"https://www.youtube.com/embed/{video_id}?{ '&'.join(yt_params) if yt_params else '' }"

            elif "vimeo.com/" in video_src_raw:
                context["video_type"] = "vimeo"
                # Similar logic to extract Vimeo ID and build embed URL
                # Vimeo embed URLs look like: https://player.vimeo.com/video/VIDEO_ID?autoplay=1&loop=1&muted=1
                try:
                    video_id = video_src_raw.split("/")[-1].split('?')[0]
                    context["vimeo_video_id"] = video_id
                    vm_params = []
                    if self.kwargs.get("video_autoplay", self.DEFAULT_VIDEO_AUTOPLAY): vm_params.append("autoplay=1")
                    if self.kwargs.get("video_loop", self.DEFAULT_VIDEO_LOOP): vm_params.append("loop=1")
                    if self.kwargs.get("video_muted", self.DEFAULT_VIDEO_MUTED): vm_params.append("muted=1")
                    if not self.kwargs.get("video_controls", self.DEFAULT_VIDEO_CONTROLS): vm_params.append("controls=0") # Vimeo might use 'background=1' for no controls + loop + autoplay
                    # For background-like behavior, Vimeo often suggests ?background=1 (implies autoplay, loop, muted, no controls)
                    # You might add a specific parameter like `video_mode="background"`
                    context["vimeo_embed_url"] = f"https://player.vimeo.com/video/{video_id}?{ '&'.join(vm_params) if vm_params else '' }"

                except IndexError:
                    logger.warning(f"Could not parse Vimeo video ID from: {video_src_raw}")
                    context["video_type"] = "direct" # Fallback if parsing fails


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