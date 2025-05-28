from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry
import logging # For potential warnings/errors

logger = logging.getLogger(__name__) # Or a more specific logger


    
@SpellBlockRegistry.register()
class LabelSeperatorSpellBlock(BasicSpellBlock):
    name = "label_seperator"
    template = "base/blocks/label_seperator.html" # Main template for the label_seperator block

    DEFAULT_ALIGN = "center"
    DEFAULT_TEXT_COLOR = "info-75"
    DEFAULT_BG_COLOR = "white-75"

    def get_context(self):
        context = super().get_context() # Gets basic context like 'content', 'kwargs'
        
        context["align"] = self.kwargs.get("align", self.DEFAULT_ALIGN).lower()
        context["text_color"] = self.kwargs.get("text_color", self.DEFAULT_TEXT_COLOR)
        context["bg_color"] = self.kwargs.get("bg_color", self.DEFAULT_BG_COLOR)
        
        return context