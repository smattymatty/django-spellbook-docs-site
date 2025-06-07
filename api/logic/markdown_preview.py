"""
Logic functions for Markdown Preview API endpoint.
Provides clean, testable helper functions for rendering and sanitizing markdown content.
"""

import logging
from typing import Dict, List, Set, Optional
import bleach
from django.http import HttpResponse
from django.utils.html import escape
from rest_framework import status

from django_spellbook.parsers import render_spellbook_markdown_to_html

logger = logging.getLogger(__name__)


def render_markdown_to_html(raw_markdown: str) -> str:
    """
    Render raw markdown content to HTML using spellbook markdown processor.
    
    Args:
        raw_markdown: The raw markdown string to process
        
    Returns:
        Rendered HTML string
        
    Raises:
        Exception: If markdown rendering fails
    """
    if not raw_markdown:
        return ""
    
    try:
        html_output = render_spellbook_markdown_to_html(raw_markdown)
        logger.debug(f"Successfully rendered markdown ({len(raw_markdown)} chars -> {len(html_output)} chars)")
        return html_output
    except Exception as e:
        logger.error(f"Failed to render markdown: {type(e).__name__} - {e}")
        # Return escaped markdown as fallback
        return f"<pre><code>{escape(raw_markdown)}</code></pre>"


def sanitize_html_content(html_content: str, strict_mode: bool = False) -> str:
    """
    Sanitize HTML content to prevent XSS attacks while preserving formatting.
    
    Args:
        html_content: The HTML content to sanitize
        strict_mode: If True, uses more restrictive sanitization rules
        
    Returns:
        Sanitized HTML string
    """
    if not html_content:
        return ""
    
    try:
        # Define allowed HTML tags
        allowed_tags = _get_allowed_tags(strict_mode)
        
        # Define allowed attributes per tag
        allowed_attributes = _get_allowed_attributes(strict_mode)
        
        # Define allowed protocols for links
        allowed_protocols = _get_allowed_protocols()
        
        # Perform sanitization
        sanitized_html = bleach.clean(
            html_content,
            tags=frozenset(allowed_tags),
            attributes=allowed_attributes,
            protocols=frozenset(allowed_protocols),
            strip=True,
            strip_comments=True,
        )
        
        logger.debug(f"Successfully sanitized HTML ({len(html_content)} chars -> {len(sanitized_html)} chars)")
        return sanitized_html
        
    except Exception as e:
        logger.error(f"Failed to sanitize HTML: {type(e).__name__} - {e}")
        # Return escaped content as fallback
        return escape(html_content)


def process_markdown_preview(raw_markdown: str, enable_sanitization: bool = True, strict_mode: bool = False) -> HttpResponse:
    """
    Process markdown preview request with rendering and optional sanitization.
    
    Args:
        raw_markdown: The raw markdown content to process
        enable_sanitization: Whether to sanitize the HTML output
        strict_mode: Whether to use strict sanitization rules
        
    Returns:
        HttpResponse with the processed HTML content
    """
    try:
        # Step 1: Render markdown to HTML
        html_output = render_markdown_to_html(raw_markdown)
        
        # Step 2: Sanitize HTML if enabled
        if enable_sanitization:
            html_output = sanitize_html_content(html_output, strict_mode=strict_mode)
        else:
            logger.warning("HTML sanitization is DISABLED - this may be a security risk")
        
        # Step 3: Return response
        return HttpResponse(
            html_output,
            content_type="text/html",
            status=status.HTTP_200_OK,
        )
        
    except Exception as e:
        logger.error(f"Failed to process markdown preview: {type(e).__name__} - {e}")
        error_html = f"<div class='error'>Error processing markdown: {escape(str(e))}</div>"
        
        return HttpResponse(
            error_html,
            content_type="text/html",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def _get_allowed_tags(strict_mode: bool = False) -> List[str]:
    """
    Get the list of allowed HTML tags for sanitization.
    
    Args:
        strict_mode: If True, returns a more restrictive list
        
    Returns:
        List of allowed HTML tag names
    """
    if strict_mode:
        # Strict mode: only basic formatting tags
        return [
            "p", "br", "hr", "strong", "b", "em", "i", "u",
            "ul", "ol", "li", "blockquote", "pre", "code",
            "h1", "h2", "h3", "h4", "h5", "h6"
        ]
    
    # Standard mode: includes layout and semantic tags
    return [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr",
        "strong", "b", "em", "i", "u", "strike", "del",
        "ul", "ol", "li",
        "blockquote", "pre", "code",
        "a", "img",
        "table", "thead", "tbody", "tr", "th", "td",
        "div", "span",
        "section", "article", "aside", "header", "footer", "main",
        "details", "summary",
        "button", "form", "input", "label", "select", "option", "textarea",
    ]


def _get_allowed_attributes(strict_mode: bool = False) -> Dict[str, List[str]]:
    """
    Get the allowed HTML attributes per tag for sanitization.
    
    Args:
        strict_mode: If True, returns more restrictive attributes
        
    Returns:
        Dictionary mapping tag names to lists of allowed attributes
    """
    if strict_mode:
        # Strict mode: minimal attributes
        return {
            "a": ["href", "title"],
            "img": ["src", "alt", "title"],
            "code": ["class"],
            "pre": ["class"],
        }
    
    # Standard mode: comprehensive attributes for spellblocks
    return {
        "a": ["href", "title", "target", "rel"],
        "img": ["src", "alt", "title", "width", "height"],
        "div": ["class", "id", "data-*"],
        "span": ["class", "id", "data-*"],
        "section": ["class", "id", "data-*"],
        "article": ["class", "id", "data-*"],
        "aside": ["class", "id", "data-*"],
        "header": ["class", "id", "data-*"],
        "footer": ["class", "id", "data-*"],
        "main": ["class", "id", "data-*"],
        "table": ["class", "id"],
        "th": ["scope", "class"],
        "td": ["colspan", "rowspan", "class"],
        "tr": ["class"],
        "thead": ["class"],
        "tbody": ["class"],
        "code": ["class"],
        "pre": ["class"],
        "button": ["class", "id", "type", "onclick", "aria-*"],
        "form": ["class", "id", "action", "method"],
        "input": ["class", "id", "type", "name", "value", "placeholder"],
        "label": ["class", "id", "for"],
        "select": ["class", "id", "name"],
        "option": ["value", "selected"],
        "textarea": ["class", "id", "name", "placeholder", "rows", "cols"],
        "details": ["class", "id", "open"],
        "summary": ["class", "id"],
        "h1": ["class", "id"],
        "h2": ["class", "id"],
        "h3": ["class", "id"],
        "h4": ["class", "id"],
        "h5": ["class", "id"],
        "h6": ["class", "id"],
        "p": ["class", "id"],
        "ul": ["class", "id"],
        "ol": ["class", "id"],
        "li": ["class", "id"],
        "blockquote": ["class", "id"],
    }


def _get_allowed_protocols() -> List[str]:
    """
    Get the list of allowed URL protocols for sanitization.
    
    Returns:
        List of allowed URL protocols
    """
    return ["http", "https", "mailto", "tel", "ftp"]


def disable_html_sanitization_temporarily() -> None:
    """
    Utility function to help debug sanitization issues.
    This should only be used for debugging purposes.
    
    WARNING: This is a security risk and should never be used in production!
    """
    logger.critical(
        "HTML SANITIZATION HAS BEEN TEMPORARILY DISABLED! "
        "This is a SECURITY RISK and should only be used for debugging!"
    )


def get_sanitization_report(html_content: str) -> Dict[str, any]:
    """
    Generate a report showing what would be sanitized from HTML content.
    Useful for debugging sanitization issues.
    
    Args:
        html_content: The HTML content to analyze
        
    Returns:
        Dictionary with sanitization analysis
    """
    if not html_content:
        return {
            "original_length": 0, 
            "sanitized_length": 0, 
            "size_reduction": 0,
            "size_reduction_percent": 0,
            "allowed_tags": _get_allowed_tags(),
            "allowed_protocols": _get_allowed_protocols(),
        }
    
    try:
        # Get original length
        original_length = len(html_content)
        
        # Sanitize content
        sanitized = sanitize_html_content(html_content)
        sanitized_length = len(sanitized)
        
        # Basic analysis
        report = {
            "original_length": original_length,
            "sanitized_length": sanitized_length,
            "size_reduction": original_length - sanitized_length,
            "size_reduction_percent": (
                (original_length - sanitized_length) / original_length * 100
                if original_length > 0 else 0
            ),
            "allowed_tags": _get_allowed_tags(),
            "allowed_protocols": _get_allowed_protocols(),
        }
        
        return report
        
    except Exception as e:
        logger.error(f"Failed to generate sanitization report: {e}")
        return {"error": str(e)}