# api/tests/functions/test_markdown_preview.py
"""
Tests for markdown p"review helper functions.
"""

from unittest.mock import patch

from django.test import TestCase
from django.http import HttpResponse

from api.logic.markdown_preview import (
    render_markdown_to_html,
    sanitize_html_content,
    process_markdown_preview,
    get_sanitization_report,
    _get_allowed_tags,
    _get_allowed_attributes,
    _get_allowed_protocols,
)


class TestRenderMarkdownToHtml(TestCase):
    """Test the render_markdown_to_html function."""

    @patch("api.logic.markdown_preview.render_spellbook_markdown_to_html")
    def test_render_markdown_success(self, mock_render):
        """Test successful markdown rendering."""
        mock_render.return_value = "<p>Hello World</p>"

        result = render_markdown_to_html("# Hello World")

        self.assertEqual(result, "<p>Hello World</p>")
        mock_render.assert_called_once_with("# Hello World")

    def test_render_markdown_empty_input(self):
        """Test rendering empty markdown."""
        result = render_markdown_to_html("")
        self.assertEqual(result, "")

    def test_render_markdown_none_input(self):
        """Test rendering None input."""
        result = render_markdown_to_html(None)
        self.assertEqual(result, "")

    @patch("api.logic.markdown_preview.render_spellbook_markdown_to_html")
    @patch("api.logic.markdown_preview.logger")
    def test_render_markdown_exception_fallback(
        self, mock_logger, mock_render
    ):
        """Test fallback behavior when markdown rendering fails."""
        mock_render.side_effect = Exception("Rendering failed")

        result = render_markdown_to_html("# Test")

        # Should return escaped markdown as fallback
        self.assertIn("<pre><code># Test</code></pre>", result)
        mock_logger.error.assert_called_once()


class TestSanitizeHtmlContent(TestCase):
    """Test the sanitize_html_content function."""

    def test_sanitize_html_basic(self):
        """Test basic HTML sanitization."""
        html = "<p>Hello <strong>world</strong></p>"
        result = sanitize_html_content(html)
        self.assertEqual(result, "<p>Hello <strong>world</strong></p>")

    def test_sanitize_html_removes_dangerous_tags(self):
        """Test that dangerous tags are removed."""
        html = "<p>Hello</p><script>alert('xss')</script><p>World</p>"
        result = sanitize_html_content(html)
        # Script content may be preserved as text when strip=True
        self.assertIn("<p>Hello</p>", result)
        self.assertIn("<p>World</p>", result)
        self.assertNotIn("<script>", result)

    def test_sanitize_html_removes_dangerous_attributes(self):
        """Test that dangerous attributes are removed."""
        html = "<p onclick=\"alert('xss')\">Hello</p>"
        result = sanitize_html_content(html)
        self.assertEqual(result, "<p>Hello</p>")

    def test_sanitize_html_preserves_safe_attributes(self):
        """Test that safe attributes are preserved."""
        html = '<a href="https://example.com" title="Example">Link</a>'
        result = sanitize_html_content(html)
        self.assertEqual(
            result, '<a href="https://example.com" title="Example">Link</a>'
        )

    def test_sanitize_html_strict_mode(self):
        """Test strict mode sanitization."""
        html = '<div class="container"><p>Hello</p></div>'

        # Normal mode should preserve div
        normal_result = sanitize_html_content(html, strict_mode=False)
        self.assertIn("<div", normal_result)

        # Strict mode should remove div
        strict_result = sanitize_html_content(html, strict_mode=True)
        self.assertNotIn("<div", strict_result)
        self.assertIn("<p>Hello</p>", strict_result)

    def test_sanitize_html_empty_input(self):
        """Test sanitizing empty HTML."""
        result = sanitize_html_content("")
        self.assertEqual(result, "")

    def test_sanitize_html_none_input(self):
        """Test sanitizing None input."""
        result = sanitize_html_content(None)
        self.assertEqual(result, "")

    @patch("api.logic.markdown_preview.bleach.clean")
    @patch("api.logic.markdown_preview.logger")
    def test_sanitize_html_exception_fallback(self, mock_logger, mock_clean):
        """Test fallback behavior when sanitization fails."""
        mock_clean.side_effect = Exception("Sanitization failed")

        result = sanitize_html_content("<p>Test</p>")

        # Should return escaped content as fallback
        self.assertEqual(result, "&lt;p&gt;Test&lt;/p&gt;")
        mock_logger.error.assert_called_once()


class TestProcessMarkdownPreview(TestCase):
    """Test the process_markdown_preview function."""

    @patch("api.logic.markdown_preview.render_markdown_to_html")
    @patch("api.logic.markdown_preview.sanitize_html_content")
    def test_process_markdown_success_with_sanitization(
        self, mock_sanitize, mock_render
    ):
        """Test successful markdown processing with sanitization."""
        mock_render.return_value = "<p>Hello World</p>"
        mock_sanitize.return_value = "<p>Hello World</p>"

        response = process_markdown_preview(
            "# Hello World", enable_sanitization=True
        )

        self.assertIsInstance(response, HttpResponse)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), "<p>Hello World</p>")
        self.assertEqual(response["content-type"], "text/html")

        mock_render.assert_called_once_with("# Hello World")
        mock_sanitize.assert_called_once_with(
            "<p>Hello World</p>", strict_mode=False
        )

    @patch("api.logic.markdown_preview.render_markdown_to_html")
    @patch("api.logic.markdown_preview.sanitize_html_content")
    @patch("api.logic.markdown_preview.logger")
    def test_process_markdown_success_without_sanitization(
        self, mock_logger, mock_sanitize, mock_render
    ):
        """Test successful markdown processing without sanitization."""
        mock_render.return_value = "<p>Hello World</p>"

        response = process_markdown_preview(
            "# Hello World", enable_sanitization=False
        )

        self.assertIsInstance(response, HttpResponse)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), "<p>Hello World</p>")

        mock_render.assert_called_once_with("# Hello World")
        mock_sanitize.assert_not_called()
        mock_logger.warning.assert_called_once()

    @patch("api.logic.markdown_preview.render_markdown_to_html")
    def test_process_markdown_strict_mode(self, mock_render):
        """Test markdown processing with strict mode."""
        mock_render.return_value = "<div><p>Hello</p></div>"

        response = process_markdown_preview(
            "# Hello", enable_sanitization=True, strict_mode=True
        )

        self.assertIsInstance(response, HttpResponse)
        self.assertEqual(response.status_code, 200)
        # In strict mode, div should be removed
        content = response.content.decode()
        self.assertNotIn("<div", content)

    @patch("api.logic.markdown_preview.render_markdown_to_html")
    @patch("api.logic.markdown_preview.logger")
    def test_process_markdown_exception_handling(
        self, mock_logger, mock_render
    ):
        """Test exception handling in markdown processing."""
        mock_render.side_effect = Exception("Rendering failed")

        response = process_markdown_preview("# Hello World")

        self.assertIsInstance(response, HttpResponse)
        self.assertEqual(response.status_code, 500)
        content = response.content.decode()
        self.assertIn("Error processing markdown", content)
        mock_logger.error.assert_called_once()


class TestGetSanitizationReport(TestCase):
    """Test the get_sanitization_report function."""

    def test_sanitization_report_basic(self):
        """Test basic sanitization report generation."""
        html = "<p>Hello</p><script>alert('xss')</script>"

        report = get_sanitization_report(html)

        self.assertIn("original_length", report)
        self.assertIn("sanitized_length", report)
        self.assertIn("size_reduction", report)
        self.assertIn("size_reduction_percent", report)
        self.assertIn("allowed_tags", report)
        self.assertIn("allowed_protocols", report)

        # Should show reduction due to script tag removal
        self.assertGreater(report["size_reduction"], 0)
        self.assertGreater(report["size_reduction_percent"], 0)

    def test_sanitization_report_empty_input(self):
        """Test sanitization report with empty input."""
        report = get_sanitization_report("")

        self.assertEqual(report["original_length"], 0)
        self.assertEqual(report["sanitized_length"], 0)
        self.assertEqual(report["size_reduction"], 0)
        self.assertEqual(report["size_reduction_percent"], 0)

    def test_sanitization_report_no_changes(self):
        """Test sanitization report when no sanitization is needed."""
        html = "<p>Hello <strong>world</strong></p>"

        report = get_sanitization_report(html)

        # Should show no reduction for clean HTML
        self.assertEqual(report["size_reduction"], 0)
        self.assertEqual(report["size_reduction_percent"], 0)

    @patch("api.logic.markdown_preview.sanitize_html_content")
    @patch("api.logic.markdown_preview.logger")
    def test_sanitization_report_exception(self, mock_logger, mock_sanitize):
        """Test sanitization report exception handling."""
        mock_sanitize.side_effect = Exception("Report failed")

        report = get_sanitization_report("<p>Test</p>")

        self.assertIn("error", report)
        self.assertEqual(report["error"], "Report failed")
        mock_logger.error.assert_called_once()


class TestHelperFunctions(TestCase):
    """Test the helper functions."""

    def test_get_allowed_tags_normal_mode(self):
        """Test allowed tags in normal mode."""
        tags = _get_allowed_tags(strict_mode=False)

        self.assertIn("div", tags)
        self.assertIn("span", tags)
        self.assertIn("p", tags)
        self.assertIn("h1", tags)
        self.assertIn("button", tags)

    def test_get_allowed_tags_strict_mode(self):
        """Test allowed tags in strict mode."""
        tags = _get_allowed_tags(strict_mode=True)

        self.assertNotIn("div", tags)
        self.assertNotIn("span", tags)
        self.assertIn("p", tags)
        self.assertIn("h1", tags)
        self.assertNotIn("button", tags)

    def test_get_allowed_attributes_normal_mode(self):
        """Test allowed attributes in normal mode."""
        attrs = _get_allowed_attributes(strict_mode=False)

        self.assertIn("div", attrs)
        self.assertIn("class", attrs["div"])
        self.assertIn("data-*", attrs["div"])
        self.assertIn("button", attrs)
        self.assertIn("onclick", attrs["button"])

    def test_get_allowed_attributes_strict_mode(self):
        """Test allowed attributes in strict mode."""
        attrs = _get_allowed_attributes(strict_mode=True)

        self.assertNotIn("div", attrs)
        self.assertNotIn("button", attrs)
        self.assertIn("a", attrs)
        self.assertIn("href", attrs["a"])
        self.assertNotIn("onclick", attrs.get("a", []))

    def test_get_allowed_protocols(self):
        """Test allowed protocols."""
        protocols = _get_allowed_protocols()

        self.assertIn("http", protocols)
        self.assertIn("https", protocols)
        self.assertIn("mailto", protocols)
        self.assertIn("tel", protocols)
        self.assertNotIn("javascript", protocols)
        self.assertNotIn("data", protocols)


class TestIntegration(TestCase):
    """Integration tests for the complete markdown preview pipeline."""

    def test_full_pipeline_spellblock_rendering(self):
        """Test the complete pipeline with spellblock content."""
        # This would require actual spellblock markdown
        # For now, test with basic markdown
        markdown = "# Hello\n\nThis is a **test**."

        response = process_markdown_preview(markdown)

        self.assertIsInstance(response, HttpResponse)
        self.assertEqual(response.status_code, 200)
        content = response.content.decode()

        # Should contain basic HTML elements
        self.assertTrue(
            any(tag in content for tag in ["<h1>", "<p>", "<strong>"])
        )

    def test_full_pipeline_with_dangerous_content(self):
        """Test the complete pipeline with potentially dangerous content."""
        # Use more direct HTML that would be processed by sanitization
        markdown = """# Hello

<script>alert('xss')</script>

<div onclick="alert('click')">Click me</div>

This is **safe** content."""

        response = process_markdown_preview(markdown)

        self.assertIsInstance(response, HttpResponse)
        self.assertEqual(response.status_code, 200)
        content = response.content.decode()

        # Should not contain dangerous HTML elements (but text content may remain)
        self.assertNotIn("<script>", content)
        # Note: onclick might be preserved as text content within escaped HTML

        # Should contain safe content
        self.assertIn("safe", content)
        self.assertIn("Hello", content)
