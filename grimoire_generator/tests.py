from django.test import TestCase

# Create your tests here.
import threading
import os
import shutil
import tempfile
from django.test import TestCase
from django.conf import settings
from .generator import GrimoireGenerator
from .parser import GrimoireParser


class GrimoireGeneratorTests(TestCase):
    """
    Test suite for the GrimoireGenerator class.
    """

    def setUp(self):
        """
        Set up the test environment.
        1. Create a temporary directory for our test files.
        2. Create a sample directory structure with various test cases.
        """
        self.test_dir = tempfile.mkdtemp()

        # Create a sample directory structure with various test cases
        os.makedirs(os.path.join(self.test_dir, 'empty_dir'))
        os.makedirs(os.path.join(self.test_dir, 'nested', 'deeply', 'nested'))

        # Create some test markdown files
        with open(os.path.join(self.test_dir, 'test1.md'), 'w') as f:
            f.write("# Test File 1\nThis is a test file.")

        with open(os.path.join(self.test_dir, 'test2.md'), 'w') as f:
            f.write("No title in this one")

        with open(os.path.join(self.test_dir, 'nested', 'nested_file.md'), 'w') as f:
            f.write("# Nested File\nThis is a nested file.")

        # Create a file with a non-standard name
        with open(os.path.join(self.test_dir, 'file with spaces.md'), 'w') as f:
            f.write("# File with Spaces\nThis file has spaces in its name.")

        # Create a file with Unicode characters
        with open(os.path.join(self.test_dir, 'unicode_file_名前.md'), 'w', encoding='utf-8') as f:
            f.write("# Unicode File\nThis file has Unicode characters in its name.")

        # Create an empty file
        open(os.path.join(self.test_dir, 'empty_file.md'), 'w').close()

        # Create a file with no read permissions
        no_read_file = os.path.join(self.test_dir, 'no_read.md')
        with open(no_read_file, 'w') as f:
            f.write("# No Read File\nThis file has no read permissions.")
        os.chmod(no_read_file, 0o000)

        self.generator = GrimoireGenerator(self.test_dir)

    def tearDown(self):
        # Clean up the temporary directory
        shutil.rmtree(self.test_dir)

    def test_generate_structure(self):
        structure = self.generator.generate_structure()

        # Check if all non-empty directories and files are present
        self.assertIn('test1.md', structure)
        self.assertIn('test2.md', structure)
        self.assertIn('nested', structure)
        self.assertIn('file with spaces.md', structure)
        self.assertIn('unicode_file_名前.md', structure)
        self.assertIn('empty_file.md', structure)

        # Explicitly check that empty directories are not included
        self.assertNotIn('empty_dir', structure)

        # Check nested structure
        self.assertIn('nested_file.md', structure['nested']['children'])

        # Check file metadata
        self.assertEqual(structure['test1.md']['title'], 'Test File 1')
        # Should use filename as title
        self.assertEqual(structure['test2.md']['title'], 'test2')

        # Check URL paths
        self.assertEqual(structure['test1.md']['url_path'], '/test1')
        self.assertEqual(structure['nested']['children']
                         ['nested_file.md']['url_path'], '/nested/nested_file')

        # Additional checks for other files
        self.assertEqual(structure['file with spaces.md']
                         ['title'], 'File with Spaces')
        self.assertEqual(structure['unicode_file_名前.md']
                         ['title'], 'Unicode File')
        self.assertEqual(structure['empty_file.md']['title'], 'empty_file')

    def test_empty_directory(self):
        empty_dir_generator = GrimoireGenerator(
            os.path.join(self.test_dir, 'empty_dir'))
        structure = empty_dir_generator.generate_structure()
        self.assertEqual(structure, {})

    def test_file_with_spaces(self):
        structure = self.generator.generate_structure()
        self.assertIn('file with spaces.md', structure)
        self.assertEqual(structure['file with spaces.md']
                         ['title'], 'File with Spaces')
        self.assertEqual(structure['file with spaces.md']
                         ['url_path'], '/file with spaces')

    def test_unicode_filename(self):
        structure = self.generator.generate_structure()
        self.assertIn('unicode_file_名前.md', structure)
        self.assertEqual(structure['unicode_file_名前.md']
                         ['title'], 'Unicode File')
        self.assertEqual(structure['unicode_file_名前.md']
                         ['url_path'], '/unicode_file_名前')

    def test_empty_file(self):
        structure = self.generator.generate_structure()
        self.assertIn('empty_file.md', structure)
        self.assertEqual(structure['empty_file.md']['title'], 'empty_file')

    def test_no_read_permission(self):
        structure = self.generator.generate_structure()
        # File should be skipped due to lack of permissions
        self.assertNotIn('no_read.md', structure)

    def test_get_file_by_path(self):
        self.generator.generate_structure()

        # Test for existing file
        file_info = self.generator.get_file_by_path('/nested/nested_file')
        self.assertIsNotNone(file_info)
        self.assertEqual(file_info['title'], 'Nested File')

        # Test for non-existing file
        non_existent_file = self.generator.get_file_by_path(
            '/non/existent/file')
        self.assertIsNone(non_existent_file)

        # Test for file in root directory
        root_file = self.generator.get_file_by_path('/test1')
        self.assertIsNotNone(root_file)
        self.assertEqual(root_file['title'], 'Test File 1')

        # Test for file with spaces in name
        space_file = self.generator.get_file_by_path('/file with spaces')
        self.assertIsNotNone(space_file)
        self.assertEqual(space_file['title'], 'File with Spaces')

    def test_search_grimoire(self):
        self.generator.generate_structure()

        # Test basic search
        results = self.generator.search_grimoire('test')
        self.assertEqual(len(results), 2)  # Should find test1.md and test2.md
        self.assertIn(('Test File 1', '/test1'), results)
        self.assertIn(('test2', '/test2'), results)

        # Test case-insensitive search
        results = self.generator.search_grimoire('TEST')
        self.assertEqual(len(results), 2)

        # Test search in nested files
        results = self.generator.search_grimoire('nested')
        self.assertEqual(len(results), 1)
        self.assertIn(('Nested File', '/nested/nested_file'), results)

        # Test search with special characters
        results = self.generator.search_grimoire('名前')
        self.assertEqual(len(results), 1)
        self.assertIn(('Unicode File', '/unicode_file_名前'), results)

        # Test search with spaces
        results = self.generator.search_grimoire('file with')
        self.assertEqual(len(results), 1)
        self.assertIn(('File with Spaces', '/file with spaces'), results)

        # Test search with no results
        results = self.generator.search_grimoire('nonexistent')
        self.assertEqual(len(results), 0)

        # Test search with partial match
        results = self.generator.search_grimoire('file')
        # Should at least find 'Test File 1', 'Nested File', and 'File with Spaces'
        self.assertTrue(len(results) >= 3)

    def test_very_deep_nesting(self):
        # Create a deeply nested structure
        deep_path = os.path.join(
            self.test_dir, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
        os.makedirs(deep_path)

        # Create files at various levels of nesting
        with open(os.path.join(deep_path, 'deep_file.md'), 'w') as f:
            f.write("# Deep File\nThis is a deeply nested file.")

        with open(os.path.join(self.test_dir, 'a', 'b', 'mid_file.md'), 'w') as f:
            f.write("# Mid File\nThis is a file at medium depth.")

        with open(os.path.join(self.test_dir, 'a', 'shallow_file.md'), 'w') as f:
            f.write("# Shallow File\nThis is a file close to the root.")

        structure = self.generator.generate_structure()

        # Check the deepest file
        self.assertIn('deep_file.md', structure['a']['children']['b']['children']['c']
                      ['children']['d']['children']['e']['children']['f']['children']['g']['children'])

        # Check a file at medium depth
        self.assertIn(
            'mid_file.md', structure['a']['children']['b']['children'])

        # Check a shallow file
        self.assertIn('shallow_file.md', structure['a']['children'])

        # Test get_file_by_path for deeply nested file
        deep_file = self.generator.get_file_by_path('/a/b/c/d/e/f/g/deep_file')
        self.assertIsNotNone(deep_file)
        self.assertEqual(deep_file['title'], 'Deep File')

        # Test search for deeply nested file
        results = self.generator.search_grimoire('deep')
        self.assertIn(('Deep File', '/a/b/c/d/e/f/g/deep_file'), results)

        # Test that empty directories are not included
        self.assertNotIn('h', structure['a']['children']['b']['children']['c']
                         ['children']['d']['children']['e']['children']['f']['children']['g']['children'])

    def test_large_number_of_files(self):
        large_dir = os.path.join(self.test_dir, 'large')
        os.makedirs(large_dir)
        for i in range(1000):
            with open(os.path.join(large_dir, f'file_{i}.md'), 'w') as f:
                f.write(f"# File {i}\nThis is file number {i}.")

        structure = self.generator.generate_structure()
        self.assertEqual(len(structure['large']['children']), 1000)

    def test_non_markdown_files(self):
        with open(os.path.join(self.test_dir, 'not_markdown.txt'), 'w') as f:
            f.write("This is not a markdown file.")

        structure = self.generator.generate_structure()
        self.assertNotIn('not_markdown.txt', structure)

    def test_circular_reference(self):
        os.symlink(self.test_dir, os.path.join(self.test_dir, 'circular'))
        structure = self.generator.generate_structure()
        # Ensure it doesn't follow the symlink
        self.assertNotIn('circular', structure)

    def test_very_large_file(self):
        large_file_path = os.path.join(self.test_dir, 'large_file.md')
        with open(large_file_path, 'w') as f:
            f.write("# Large File\n" + "x" * (100 * 1024 * 1024))  # 100MB file
        structure = self.generator.generate_structure()
        self.assertIn('large_file.md', structure)
        self.assertEqual(structure['large_file.md']['title'], 'Large File')

    def test_concurrent_access(self):

        def generate():
            self.generator.generate_structure()

        threads = [threading.Thread(target=generate) for _ in range(10)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        # If this doesn't raise any exceptions, it's a good sign

    def test_incremental_update(self):
        self.generator.generate_structure()
        # Add a new file
        with open(os.path.join(self.test_dir, 'new_file.md'), 'w') as f:
            f.write("# New File\nThis is a new file.")
        updated_structure = self.generator.generate_structure()
        self.assertIn('new_file.md', updated_structure)

    def test_file_content_change(self):
        self.generator.generate_structure()
        file_path = os.path.join(self.test_dir, 'test1.md')
        with open(file_path, 'w') as f:
            f.write("# Updated Title\nUpdated content.")
        updated_structure = self.generator.generate_structure()
        self.assertEqual(
            updated_structure['test1.md']['title'], 'Updated Title')


class GrimoireParserTests(TestCase):
    def setUp(self):
        self.parser = GrimoireParser()

    def test_parse_complex_mixed_content(self):
        """
        Test parsing of complex content with mixed markdown elements and custom blocks.
        This test ensures that the parser can handle a variety of content types in a single document.
        """
        complex_content = """
# Main Title

This is a paragraph with **bold** and *italic* text.

```spell
Fireball
Level: 3
Casting Time: 1 action
Range: 150 feet
Components: V, S, M (a tiny ball of bat guano and sulfur)
Duration: Instantaneous
```

Here's a [link](https://example.com) in a paragraph.

```code
def hello_world():
    print("Hello, World!")
```

## Subtitle

Another paragraph with a `code snippet` inline.

```potion
Healing Potion
Rarity: Common
Type: Potion
Effect: Restores 2d4+2 hit points when consumed
```

* List item 1
* List item 2
  * Nested item
* List item 3

Final paragraph.
        """

        parsed_content = self.parser.parse(complex_content)

        # Check for presence of various elements
        self.assertIn("<h1>Main Title</h1>", parsed_content)
        self.assertIn(
            "<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>", parsed_content)
        self.assertIn('<div class="spell-block">Fireball', parsed_content)
        self.assertIn('<a href="https://example.com">link</a>', parsed_content)
        self.assertIn('<pre><code>def hello_world():', parsed_content)
        self.assertIn("<h2>Subtitle</h2>", parsed_content)
        self.assertIn('<code>code snippet</code>', parsed_content)
        self.assertIn('<div class="potion-block">Healing Potion',
                      parsed_content)
        self.assertIn("<ul>", parsed_content)
        self.assertIn("<li>List item 1</li>", parsed_content)
        self.assertIn("<li>List item 2<ul>", parsed_content)
        self.assertIn("<li>Nested item</li>", parsed_content)
        self.assertIn("</ul></li>", parsed_content)

        # Check order of elements (simplified)
        element_order = [
            "<h1>", "paragraph", "spell-block", "link", "code",
            "<h2>", "potion-block", "<ul>", "Final paragraph"
        ]
        last_index = -1
        for element in element_order:
            index = parsed_content.index(element)
            self.assertGreater(index, last_index)
            last_index = index

    def test_parse_edge_cases(self):
        """
        Test parsing of various edge cases and potential error scenarios.
        This ensures the parser is robust and handles unexpected input gracefully.
        """
        edge_cases = [
            ("Empty content", "", ""),
            ("Only whitespace", "   \n  \t  ", ""),
            ("Unclosed tags", "**Bold text", "<p><strong>Bold text</strong></p>"),
            ("Mismatched code block", "```code\nUnclosed block",
             "<pre><code>Unclosed block</code></pre>"),
            ("Empty code block", "```code\n```", "<pre><code></code></pre>"),
            ("Nested custom blocks", "```spell\n```potion\nNested\n```\n```",
             '<div class="spell-block"></div>\n<p>Nested</p>\n<pre><code></code></pre>'),
            ("HTML in markdown", "<div>Raw HTML</div>",
             "<p>&lt;div&gt;Raw HTML&lt;/div&gt;</p>"),
            ("Extremely long line", "#" * 10000 + " Long title",
             f"<p>{'#' * 10000} Long title</p>"),
        ]

        for case_name, input_content, expected_output in edge_cases:
            with self.subTest(case=case_name):
                parsed_content = self.parser.parse(input_content)
                self.assertEqual(parsed_content.strip(),
                                 expected_output.strip())

    def test_custom_block_parsing(self):
        """
        Test the parsing of custom blocks (spell, potion, code) in isolation and in combination.
        This ensures that each custom block type is parsed correctly and that they work together as expected.
        """
        custom_blocks = {
            "spell": (
                "```spell\nMagic Missile\nLevel: 1\nRange: 120 feet\n```",
                '<div class="spell-block">Magic Missile\nLevel: 1\nRange: 120 feet</div>'
            ),
            "potion": (
                "```potion\nInvisibility Potion\nDuration: 1 hour\nEffect: User becomes invisible\n```",
                '<div class="potion-block">Invisibility Potion\nDuration: 1 hour\nEffect: User becomes invisible</div>'
            ),
            "code": (
                "```code\ndef factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)\n```",
                '<pre><code>def factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)</code></pre>'
            )
        }

        # Test each block type individually
        for block_type, (input_content, expected_output) in custom_blocks.items():
            with self.subTest(block_type=block_type):
                parsed_content = self.parser.parse(input_content)
                self.assertIn(expected_output, parsed_content)

        # Test combination of all block types
        combined_input = "\n\n".join(block[0]
                                     for block in custom_blocks.values())
        combined_output = self.parser.parse(combined_input)
        for expected_output in (block[1] for block in custom_blocks.values()):
            self.assertIn(expected_output, combined_output)

        # Test nested standard markdown within custom blocks
        nested_markdown = """
```spell
Enchant Item
**Level:** 6
*Components:* V, S, M
Effect:
1. Imbue magic into an item
2. Lasts for **24 hours**
```
        """
        parsed_nested = self.parser.parse(nested_markdown)
        self.assertIn('<div class="spell-block">Enchant Item\n<strong>Level:</strong> 6\n<em>Components:</em> V, S, M\nEffect:\n1. Imbue magic into an item\n2. Lasts for <strong>24 hours</strong></div>', parsed_nested)
