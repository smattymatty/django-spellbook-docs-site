from django_spellbook.blocks import BasicSpellBlock, SpellBlockRegistry

import logging 
# Potentially add Decimal for currency, but float is likely fine for percentages
# from decimal import Decimal, InvalidOperation 

logger = logging.getLogger(__name__) # For logging errors/warnings

@SpellBlockRegistry.register()
class ProgressBarBlock(BasicSpellBlock):
    """
    SpellBlock for rendering a progress bar.
    """
    name = "progress"
    template = "base/blocks/progress_block.html"
    
    def _to_bool(self, value, default=False):
        """Helper to convert common string values to boolean."""
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.lower() in ['true', '1', 't', 'y', 'yes']
        return default

    def get_context(self):
        context = super().get_context()
        
        # --- 1. Validation & Type Conversion ---
        raw_value = 0.0
        raw_max_value = 100.0
        try:
            # Convert value upfront
            raw_value = float(self.kwargs.get("value", 0)) 
        except (ValueError, TypeError) as e:
            logger.warning(f"ProgressBarBlock: Invalid 'value' parameter: {self.kwargs.get('value')}. Defaulting to 0. Error: {e}")
            raw_value = 0.0 
        
        try:
             # Convert max_value upfront
            raw_max_value = float(self.kwargs.get("max_value", 100))
            if raw_max_value <= 0: # Max must be positive
               logger.warning(f"ProgressBarBlock: Invalid 'max_value' parameter: {raw_max_value}. Must be > 0. Defaulting to 100.")
               raw_max_value = 100.0
        except (ValueError, TypeError) as e:
            logger.warning(f"ProgressBarBlock: Invalid 'max_value' parameter: {self.kwargs.get('max_value')}. Defaulting to 100. Error: {e}")
            raw_max_value = 100.0

        context['raw_value'] = raw_value
        context['raw_max_value'] = raw_max_value

        # Convert boolean parameters
        context['striped'] = self._to_bool(self.kwargs.get('striped', False))
        context['animated'] = self._to_bool(self.kwargs.get('animated', False))
        context['rounded'] = self._to_bool(self.kwargs.get('rounded', True))

        # Original label and default show_percentage logic
        original_label = self.kwargs.get("label", None)
        default_show_percentage = original_label is None # Default to True only if no label is provided
        show_percentage = self._to_bool(self.kwargs.get("show_percentage", default_show_percentage))
        
        context['label'] = original_label # Store original for reference if needed
        context['show_percentage'] = show_percentage

        # Standard string/optional parameters
        context["color"] = self.kwargs.get("color", "primary")
        context["bg_color"] = self.kwargs.get("bg_color", "white-50")
        context["height"] = self.kwargs.get("height", "md")
        context["class"] = self.kwargs.get("class", None) 
        context["id"] = self.kwargs.get("id", None) 

        # --- 2. Percentage Calculation ---
        percentage = 0.0
        # Value clamping before calculation ensures percentage is 0-100
        clamped_value = max(0.0, min(raw_value, raw_max_value)) 
        percentage = round((clamped_value / raw_max_value) * 100, 2)
        
        context['calculated_percentage'] = percentage

        # --- 3. Label Interpolation ---
        processed_label = ""
        if original_label:
            processed_label = str(original_label) # Ensure it's a string
            processed_label = processed_label.replace("{{value}}", str(raw_value)) 
            processed_label = processed_label.replace("{{max_value}}", str(raw_max_value))
            processed_label = processed_label.replace("{{percentage}}", str(percentage)) # Use calculated percentage here
        context['processed_label'] = processed_label 

        return context