"""
Logic functions for SpellBlock Registry API endpoint.
Provides clean, testable helper functions for extracting and processing spellblock information.
"""

import inspect
import re
import logging
from typing import Dict, List, Tuple, Any, Optional

from django_spellbook.blocks import SpellBlockRegistry

logger = logging.getLogger(__name__)


def extract_default_parameters(block_class) -> Dict[str, Dict[str, Any]]:
    """
    Extract parameters from DEFAULT_ attributes of a SpellBlock class.
    
    Args:
        block_class: The SpellBlock class to analyze
        
    Returns:
        Dict mapping parameter names to their metadata (default, type, required)
    """
    parameters = {}
    
    for attr_name in dir(block_class):
        if attr_name.startswith("DEFAULT_"):
            param_name = attr_name[8:].lower()  # Remove 'DEFAULT_' prefix
            default_value = getattr(block_class, attr_name)
            
            parameters[param_name] = {
                "default": default_value,
                "type": type(default_value).__name__,
                "required": False,
            }
    
    return parameters


def extract_kwargs_parameters(block_class) -> Dict[str, Dict[str, Any]]:
    """
    Extract parameters from self.kwargs.get() patterns in the get_context method.
    Excludes commented lines to avoid false positives.
    
    Args:
        block_class: The SpellBlock class to analyze
        
    Returns:
        Dict mapping parameter names to their metadata (default, type, required)
    """
    parameters = {}
    
    if not hasattr(block_class, "get_context"):
        return parameters
    
    try:
        source = inspect.getsource(block_class.get_context)
        
        # Filter out commented lines to avoid false positives
        lines = source.split('\n')
        active_lines = [
            line for line in lines 
            if not line.strip().startswith('#')
        ]
        filtered_source = '\n'.join(active_lines)
        
        # Pattern to match self.kwargs.get('param', 'default') calls
        kwargs_pattern = r"self\.kwargs\.get\(['\"]([^'\"]+)['\"](?:,\s*([^)]*))?\)"
        matches = re.findall(kwargs_pattern, filtered_source)
        
        for param_name, raw_default in matches:
            if param_name in parameters:
                continue  # Skip if already found
                
            # Clean up the default value
            default_value = raw_default.strip().strip('\'"') if raw_default else ""
            
            # Infer parameter type from default value
            param_type, processed_default = _infer_parameter_type(default_value)
            
            parameters[param_name] = {
                "default": processed_default,
                "type": param_type,
                "required": False,
            }
            
    except Exception as e:
        logger.warning(
            f"Could not parse get_context for {block_class.__name__}: {e}"
        )
    
    return parameters


def build_spellblock_registry() -> List[Dict[str, Any]]:
    """
    Build the complete spellblock registry with all block information and parameters.
    
    Returns:
        List of dictionaries containing spellblock metadata
    """
    registry_data = []
    
    # Skip test/internal blocks
    skip_blocks = {"argstest", "selfclosing", "simple"}
    
    for block_name, block_class in SpellBlockRegistry._registry.items():
        if block_name.lower() in skip_blocks:
            continue
            
        # Build basic block information
        block_info = {
            "name": block_name,
            "class_name": block_class.__name__,
            "description": _get_block_description(block_class, block_name),
            "parameters": {},
        }
        
        # Extract parameters from DEFAULT_ attributes
        default_params = extract_default_parameters(block_class)
        block_info["parameters"].update(default_params)
        
        # Extract parameters from kwargs.get() patterns
        kwargs_params = extract_kwargs_parameters(block_class)
        block_info["parameters"].update(kwargs_params)
        
        registry_data.append(block_info)
    
    logger.info(f"Successfully collected {len(registry_data)} SpellBlocks")
    return registry_data


def _get_block_description(block_class, block_name: str) -> str:
    """
    Get the description for a spellblock from its docstring or generate a default.
    
    Args:
        block_class: The SpellBlock class
        block_name: The name of the block
        
    Returns:
        Description string for the block
    """
    return (
        getattr(block_class, "__doc__", None) 
        or f"SpellBlock: {block_name}"
    )


def _infer_parameter_type(value: str) -> Tuple[str, Any]:
    """
    Infer the parameter type and convert the value accordingly.
    
    Args:
        value: String representation of the default value
        
    Returns:
        Tuple of (type_name, converted_value)
    """
    if not value:
        return "str", ""
    
    # Check for boolean values
    if value.lower() in ["true", "false"]:
        return "bool", value.lower() == "true"
    
    # Check for integer values
    if value.isdigit() or (value.startswith('-') and value[1:].isdigit()):
        return "int", int(value)
    
    # Check for float values
    try:
        if '.' in value:
            float_val = float(value)
            return "float", float_val
    except ValueError:
        pass
    
    # Default to string
    return "str", value