# api/tests/test_models.py

from django.test import TestCase
from ..models import StoredMarkdown # Adjust import if your tests.py is elsewhere

# For more complex spell testing, you might need to ensure spells are loaded,
# or mock the render_spellbook_markdown_to_html function.
# For now, we'll test the pre-bleaching and assume basic markdown conversion.

class StoredMarkdownModelSaveTests(TestCase):

    def test_markdown_to_html_conversion_on_save(self):
        """Test that basic Markdown is converted to HTML and stored."""
        md_content = "# Title\n\nThis is **bold** and *italic*."
        expected_html_partial = "<h1 id=\"title\">Title</h1>\n<p>This is <strong>bold</strong> and <em>italic</em>.</p>"
        # Note: Actual HTML can vary slightly based on the Markdown parser (e.g., id in h1)

        stored_item = StoredMarkdown.objects.create(
            title="Test Basic Markdown",
            markdown_content=md_content
        )
        self.assertIn("<h1", stored_item.html_content) # Check for h1
        self.assertIn("Title</h1>", stored_item.html_content)
        self.assertIn("<p>This is <strong>bold</strong> and <em>italic</em>.</p>", stored_item.html_content)

    def test_script_tag_in_markdown_is_stripped_before_render(self):
        """Test that <script> tags in markdown_content are stripped by bleach before rendering."""
        md_content = "# Hello\n\n<script>alert('PWNED');</script>\n\nMore text."
        # bleach.clean with strip=True should remove the script tag and its content.
        # So, render_spellbook_markdown_to_html should receive:
        # "# Hello\n\n\n\nMore text." (script and content gone)

        stored_item = StoredMarkdown.objects.create(
            title="Test Script Stripping",
            markdown_content=md_content
        )
        
        # Assert that the <script> tag is NOT in the final html_content
        self.assertNotIn("<script>", stored_item.html_content)
        self.assertIn("<p>alert('PWNED');</p>", stored_item.html_content)
        
        # Assert that the legitimate markdown parts are still there
        self.assertIn("<h1", stored_item.html_content)
        self.assertIn("Hello</h1>", stored_item.html_content)
        self.assertIn("<p>More text.</p>", stored_item.html_content)

    def test_allowed_html_in_markdown_is_preserved_before_render(self):
        """Test that HTML tags allowed by the pre-bleach pass are kept and rendered."""
        # 'strong' and 'p' are in your model's markdown_allowed_tags
        md_content = "This is <p><strong>allowed raw HTML</strong></p> in Markdown."
        # bleach.clean should keep this as is.
        # render_spellbook_markdown_to_html will then process it.
        # A typical markdown parser might wrap the whole thing in <p> or process the inner <p>
        # depending on its configuration for raw HTML pass-through.
        
        stored_item = StoredMarkdown.objects.create(
            title="Test Allowed HTML",
            markdown_content=md_content
        )
        
        # Check that the allowed HTML is present.
        # The exact output depends on how the Markdown renderer handles pre-existing HTML.
        # Often, it might pass it through or wrap it.
        self.assertIn("<p><strong>allowed raw HTML</strong></p>", stored_item.html_content)
        # It might also be wrapped in an outer <p> tag:
        # e.g. <p>This is <p><strong>allowed raw HTML</strong></p> in Markdown.</p>
        # For a more robust check, focus on the presence of the core allowed structure.

    def test_disallowed_html_in_markdown_is_stripped_before_render(self):
        """Test that HTML tags NOT allowed by the pre-bleach pass are stripped."""
        # 'div' and 'span' are NOT in your model's markdown_allowed_tags by default
        md_content = "# Title\n\n<div>A div that should not be stripped.</div><span>A span.</span>"
        # bleach.clean should remove the <div> and <span> tags and their content.
        # render_spellbook_markdown_to_html should receive: "# Title\n\n"

        stored_item = StoredMarkdown.objects.create(
            title="Test Disallowed HTML Stripping",
            markdown_content=md_content
        )

        self.assertIn("<h1", stored_item.html_content)
        self.assertIn("Title</h1>", stored_item.html_content)
        self.assertIn("<div>", stored_item.html_content)
        self.assertIn("<span>", stored_item.html_content)
        self.assertIn("A div that should not be stripped.", stored_item.html_content) # Content of stripped tags
        self.assertIn("A span.", stored_item.html_content) # Content of stripped tags


    def test_spellbook_tag_processed_after_markdown_bleach(self):
        """
        Test that spellbook tags are preserved by the pre-bleach step
        and then processed by render_spellbook_markdown_to_html.
        This test assumes render_spellbook_markdown_to_html correctly processes
        a known, simple spell or passes through unrecognized spell-like syntax.
        """
        # Spellbook tags {~ ... ~} are not HTML, so bleach *should* ignore them.
        # Let's assume a spell like {~ bold ~}text{~~} becomes <strong>text</strong>
        # or that render_spellbook_markdown_to_html simply renders the text if the spell is unknown.
        # This part is highly dependent on your django-spellbook setup and registered spells.

        # Scenario 1: Spell content does not contain HTML that bleach would strip
        md_content_spell_safe = "Content with {~ some_spell parameter=\"value\" ~}spell text{~~}."
        # bleached_markdown should be the same as md_content_spell_safe
        # html_content will depend on how 'some_spell' is rendered.
        # If 'some_spell' is not registered/simple, it might render as:
        # <p>Content with {~ some_spell parameter="value" ~}spell text{~~}.</p>
        # OR if some_spell renders its content as bold:
        # <p>Content with <strong>spell text</strong>.</p>

        # For this test, let's assume render_spellbook_markdown_to_html at least
        # converts markdown around the spell.
        # And let's assume {~ my_simple_spell ~}content{~~} is rendered as <div class="my-simple-spell">content</div>
        # AND 'div' IS NOT in markdown_allowed_tags for the pre-bleach. This is where it gets tricky.

        # Let's simplify: Test that a spell tag itself isn't mangled by pre-bleach,
        # and that markdown around it is processed.
        # We will *mock* render_spellbook_markdown_to_html to verify what it receives.
        
        from unittest.mock import patch

        # Mock the actual renderer to check the input it receives after bleaching
        with patch('api.models.render_spellbook_markdown_to_html') as mock_render:
            # Set a return value for the mock so save() completes
            mock_render.return_value = "<p>Mocked HTML Output</p>"
            
            md_with_spell_and_script = "A spell {~ myspell ~}inner content{~~} and <script>bad</script> afterwards."
            # Expected bleached_markdown: "A spell {~ myspell ~}inner content{~~} and  afterwards."
            # (script tag and its content 'bad' are removed by bleach.clean)
            
            StoredMarkdown.objects.create(
                title="Test Spell and Bleach",
                markdown_content=md_with_spell_and_script
            )

            # Check that render_spellbook_markdown_to_html was called once
            mock_render.assert_called_once()
            
            # Get the arguments it was called with
            args, kwargs = mock_render.call_args
            received_markdown = kwargs.get('markdown_string')

            expected_bleached_markdown = "A spell {~ myspell ~}inner content{~~} and bad afterwards."
            self.assertEqual(received_markdown, expected_bleached_markdown)

    def test_update_markdown_content_rerenders_html(self):
        """Test that updating markdown_content triggers a re-render of html_content."""
        stored_item = StoredMarkdown.objects.create(
            title="Initial Content",
            markdown_content="# Initial"
        )
        self.assertIn("<h1", stored_item.html_content)
        self.assertIn("Initial</h1>", stored_item.html_content)

        stored_item.markdown_content = "## Updated"
        stored_item.save() # Trigger the save method again

        # Refresh from DB to ensure we have the updated instance
        stored_item.refresh_from_db()

        self.assertIn("<h2", stored_item.html_content) # Should now be h2
        self.assertIn("Updated</h2>", stored_item.html_content)
        self.assertNotIn("<h1", stored_item.html_content) # Initial h1 should be gone
        self.assertNotIn("Initial", stored_item.html_content)