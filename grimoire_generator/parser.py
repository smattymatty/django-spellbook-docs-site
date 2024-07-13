import re
import os
from typing import List, Tuple, Dict

from django.conf import settings
from django.urls import reverse, NoReverseMatch
from django.utils.safestring import mark_safe

from grimoire_generator.utils import dict_to_attributes_str, parse_attributes
from grimoire_generator.registry import block_registry

# TODO: debug the double line paragraph issue
# if I do not do a double new line, the paragraph is not parsed correctly
# if I do a double new line, the paragraph is parsed correctly
# I need to figure out why this is happening
# I think it has something to do with the way the parser handles the newline character
# but I'm not sure, I need to investigate further.

if __name__ == '__main__':
    settings.configure()


GRIMOIRE_URL_NAMESPACE = getattr(settings, 'GRIMOIRE_URL_NAMESPACE', getattr(
    settings, 'GRIMOIRE_CONTENT_APP', 'grimoire'))


def parse_blockquote_element(content: str, **kwargs) -> str:
    """
    Parse a blockquote element.

    Args:
        content (str): The content of the element.
        element_type (str): The type of the element.
        attributes (str): The attributes of the element.

    Returns:
        str: The parsed HTML.

    Example:
    >>> result = parse_blockquote_element('This is a quote.')
    >>> print(result)
    <blockquote>This is a quote.</blockquote>
    """
    element_type = kwargs.pop('element_type', 'blockquote')
    attributes = dict_to_attributes_str(**kwargs)
    return f'<{element_type} {attributes}>{content}</{element_type}>'


additional_elements = {
    'blockquote': parse_blockquote_element,
}


class GrimoireParser:
    def __init__(self):
        self.custom_elements: dict = {
            'p': self.parse_custom_element,
            'div': self.parse_custom_element,
            'span': self.parse_custom_element,
            'a': self.parse_custom_element,
        }
        self.custom_elements.update(additional_elements)
        self.custom_elements.update(block_registry.blocks)

    def parse(self, content: str) -> str:
        """
        Parse the given content, handling custom elements and standard markdown.
        Custom elements are defined using the `{% element_type attributes %}` syntax.

        Args:
            content (str): The markdown content to be parsed.

        Returns:
            str: The parsed content as HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> content = '''
        ... # Header
        ...
        ... {% p class='custom-class' %}
        ... This is a custom paragraph.
        ... {% endp %}
        ...
        ... Standard markdown **bold** and *italic*.
        ...
        ... ```python
        ... def hello():
        ...     print("Hello, World!")
        ... ```
        ... '''
        >>> print(parser.parse(content))
        {% verbatim %}<h1>Header</h1>
        <p class="custom-class">This is a custom paragraph.</p>
        <p>Standard markdown <strong>bold</strong> and <em>italic</em>.</p>
        <pre><code class="language-python">def hello():
            print("Hello, World!")</code></pre>{% endverbatim %}

        """
        lines = content.split('\n')
        parsed_lines = []
        current_paragraph = []
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            # Handle empty lines (paragraph breaks)
            if not line:
                if current_paragraph:
                    parsed_lines.append(
                        self.parse_paragraph(current_paragraph))
                    current_paragraph = []
                i += 1
                continue
            # Handle headers
            if line.startswith('#'):
                parsed_lines.append(self.parse_header(line))
            # Handle custom elements
            elif line.startswith('{%') and line.endswith('%}'):
                match = re.match(r'{%\s*(\w+)(.*?)%}', line)
                if match:
                    print(f"Found custom element: {match.groups()}")
                    element_type, attributes = match.groups()
                    if element_type in self.custom_elements:
                        i, parsed_block = self.parse_custom_block(
                            lines, i + 1, element_type, attributes)
                        parsed_lines.append(parsed_block)
                    else:
                        parsed_lines.append(self.parse_standard_markdown(line))
            # Handle code blocks
            elif line.startswith('```'):
                lang = line[3:].strip()
                i, parsed_block = self.parse_code_block(lines, i + 1, lang)
                parsed_lines.append(parsed_block)
            # Handle lists
            elif line.startswith(('* ', '- ')) or re.match(r'^\d+\.', line):
                i, parsed_list = self.parse_list(lines, i)
                parsed_lines.append(parsed_list)
            # Handle standard markdown (bold, italic, links)
            else:
                # Add line to current paragraph
                current_paragraph.append(line)
            i += 1

        # Handle any remaining paragraph content
        if current_paragraph:
            parsed_lines.append(self.parse_paragraph(current_paragraph))

        content_to_return = '\n'.join(filter(None, parsed_lines))
        return "{% verbatim %}" + content_to_return + "{% endverbatim %}"

    def parse_paragraph(self, lines: List[str]) -> str:
        content = ' '.join(lines)
        return f'<p>{self.parse_inline_markdown(content, surround=None)}</p>'

    def parse_custom_element(self, content: str, **kwargs) -> str:
        """
        Parse a custom element.

        Args:
            content (str): The content of the element.
            element_type (str): The type of the element.
            attributes (str): The attributes of the element.

        Returns:
            str: The parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> print(parser.parse_custom_element('Hello, world!', 'p', 'class="my-class"'))
        <p class="my-class">Hello, world!</p>
        >>> print(parser.parse_custom_element('Hello, world!', 'div', 'id="my-div"'))
        <div id="my-div">Hello, world!</div>
        """
        print(f"Parsing custom element: {content}, {kwargs}")

        # Default to 'div' if not specified
        element_type = kwargs.pop('element_type', 'div')

        # Convert remaining attributes to HTML string
        attr_str = dict_to_attributes_str(**kwargs)

        # Parse the content
        parsed_content = self.parse_block_content(content, surround=None)

        # Return the HTML
        return f'<{element_type} {attr_str}>{parsed_content}</{element_type}>'

    def parse_header(self, line: str) -> str:
        """
        Parse a header.

        Args:
            line (str): The line to parse.

        Returns:
            str: The parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> print(parser.parse_header('# Header'))
        <h1>Header</h1>
        >>> print(parser.parse_header('## Header'))
        <h2>Header</h2>
        >>> print(parser.parse_header('### Header'))
        <h3>Header</h3>
        >>> print(parser.parse_header('#### Header'))
        <h4>Header</h4>
        >>> print(parser.parse_header('##### Header'))
        <h5>Header</h5>
        >>> print(parser.parse_header('###### Header'))
        <h6>Header</h6>
        """
        match = re.match(r'^(#{1,6})\s*(.*)', line)
        if match:
            level = min(len(match.group(1)), 6)  # HTML supports h1 to h6
            content = match.group(2)
            if len(line) > 10000:  # Arbitrary threshold for "extremely long" lines
                return self.parse_standard_markdown(line)
            return f'<h{level}>{self.escape_html(content)}</h{level}>'
        return self.parse_standard_markdown(line)

    def parse_code_block(self, lines: List[str], start: int, lang: str) -> Tuple[int, str]:
        """
        Parse a code block, escaping Django template tags.

        Args:
            lines (List[str]): The lines of content.
            start (int): The starting line number.
            lang (str): The language of the code block.

        Returns:
            Tuple[int, str]: A tuple containing the ending line number and the parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> lines = ['```python', "print('Hello, {% element_type %}!')", '```']
        >>> end, result = parser.parse_code_block(lines, 1, 'python')
        >>> print(end)
        2
        >>> print(result)
        <pre><code class="language-python">print('Hello, {% element_type %}!')</code></pre>

        >>> lines = ['```django', '{% for item in items %}', '    <li>{{ item }}</li>', '{% endfor %}', '```']
        >>> end, result = parser.parse_code_block(lines, 1, 'django')
        >>> print(end)
        4
        >>> print(result)
        <code class="language-django">{% for item in items %}
            &lt;li&gt;{{ item }}&lt;/li&gt;
        {% endfor %}</code>
        """
        block_lines = []
        i = start
        while i < len(lines) and not lines[i].strip().startswith('```'):
            block_lines.append(lines[i])
            i += 1
        block_content = '\n'.join(block_lines)

        return i, f'<code class="language-{lang}">{self.escape_html(block_content)}</code>'

    def parse_custom_block(self, lines: List[str], start: int, element_type: str, attributes: str) -> Tuple[int, str]:
        """
        Parse a custom block element.

        Args:
            lines (List[str]): The lines of content.
            start (int): The starting line number.
            element_type (str): The type of the custom element.
            attributes (str): The attributes string for the element.

        Returns:
            Tuple[int, str]: A tuple containing the ending line number and the parsed HTML.

        Examples:
        >>> parser = GrimoireParser()
        >>> lines = [
        ...     '{% p class="test" %}',
        ...     'This is a test paragraph.',
        ...     'It has multiple lines.',
        ...     '{% endp %}'
        ... ]
        >>> end, result = parser.parse_custom_block(lines, 1, 'p', 'class="test"')
        >>> print(end)
        3
        >>> print(result)
        <p class="test">This is a test paragraph.
        It has multiple lines.</p>

        >>> lines = [
        ...     '{% div id="example" %}',
        ...     '<p>This is nested content.</p>',
        ...     '{% enddiv %}'
        ... ]
        >>> end, result = parser.parse_custom_block(lines, 1, 'div', 'id="example"')
        >>> print(end)
        2
        >>> print(result)
        <div id="example">&lt;p&gt;This is nested content.&lt;/p&gt;</div>

        >>> lines = [
        ...     '{% span data-test="true" %}',
        ...     'Inline content',
        ...     '{% endspan %}'
        ... ]
        >>> end, result = parser.parse_custom_block(lines, 1, 'span', 'data-test="true"')
        >>> print(end)
        2
        >>> print(result)
        <span data-test="true">Inline content</span>
        """
        # TODO: Add ability to extend custom elements with python functions that return
        # a rendered template
        block_lines = []
        i = start
        while i < len(lines) and not lines[i].strip().startswith('{% end' + element_type + ' %}'):
            block_lines.append(lines[i])
            i += 1
        block_content = '\n'.join(block_lines)
        attr_dict = parse_attributes(attributes)
        attr_dict['element_type'] = element_type
        print(attr_dict)
        return i, self.custom_elements[element_type](block_content, **attr_dict)

    def parse_block_content(self, content: str, surround: str = 'p') -> str:
        """
        Parse the content of a block.

        Args:
            content (str): The content of the block.

        Returns:
            str: The parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> print(parser.parse_block_content('Line 1\\nLine 2'))
        <p>Line 1</p>
        <p>Line 2</p>
        """
        lines = content.split('\n')
        parsed_lines = [self.parse_inline_markdown(
            line, surround) for line in lines]
        return '\n'.join(parsed_lines)

    def parse_inline_markdown(self, line: str, surround: str = 'p') -> str:
        """
        Parse inline markdown.

        Args:
            line (str): The line to parse.

        Returns:
            str: The parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> print(parser.parse_inline_markdown('**Bold** and *italic* and [link](https://example.com)'))
        <p><strong>Bold</strong> and <em>italic</em> and <a href="https://example.com">link</a></p>
        """
        line = self.escape_html(line)
        line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
        line = re.sub(r'\*(.*?)\*', r'<em>\1</em>', line)
        line = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', line)
        line = re.sub(r'`(.*?)`', r'<span class="inline-code">\1</span>', line)
        if surround:
            return f"<{surround}>{line}</{surround}>"
        else:
            return line

    def parse_standard_markdown(self, line: str) -> str:
        """
        Parse a line of standard markdown.

        This method handles basic markdown syntax like bold, italic, and links.
        For more complex markdown parsing, consider using a full-fledged markdown parser.

        Args:
            line (str): A single line of markdown text.

        Returns:
            str: The line parsed into HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> print(parser.parse_standard_markdown("[External link](https://example.com)"))
        <p><a href="https://example.com">External link</a></p>
        >>> print(parser.parse_standard_markdown(""))
        <BLANKLINE>
        """
        if not line.strip():
            return ''

        # Stack to keep track of open tags
        open_tags = []

        # Helper function to close all open tags
        def close_tags():
            closed = ''.join(f'</{tag}>' for tag in reversed(open_tags))
            open_tags.clear()
            return closed

        # Parse bold, italic, links, and inline code
        parts = re.split(r'(\*\*|\*|\[.*?\]\(.*?\)|`)', line)
        result = []
        in_code = False
        for part in parts:
            if part == '**':
                if 'strong' in open_tags:
                    result.append('</strong>')
                    open_tags.remove('strong')
                else:
                    result.append('<strong>')
                    open_tags.append('strong')
            elif part == '*':
                if 'em' in open_tags:
                    result.append('</em>')
                    open_tags.remove('em')
                else:
                    result.append('<em>')
                    open_tags.append('em')
            elif part == '`':
                if in_code:
                    result.append('</span>')
                    in_code = False
                else:
                    result.append('<span class="inline-code">')
                    in_code = True
            elif part.startswith('[') and '](' in part and part.endswith(')'):
                link_match = re.match(r'\[(.*?)\]\((.*?)\)', part)
                if link_match:
                    text, url = link_match.groups()
                    result.append(self.parse_link(text, url))
            else:
                # Escape HTML in regular text
                result.append(self.escape_html(part))

        # Close any remaining open tags
        result.append(close_tags())

        return f'<p>{"".join(result)}</p>'

    def parse_link(self, text: str, url: str) -> str:
        """
        Parse a markdown link into an HTML link.

        Args:
            text (str): The link text.
            url (str): The link URL.

        Returns:
            str: The parsed HTML link.

        Example:
        >>> parser = GrimoireParser()

        >>> print(parser.parse_link("External link", "https://example.com"))
        <a href="https://example.com">External link</a>
        >>> print(parser.parse_link("Relative link", "./relative/path"))
        <a href="./relative/path">Relative link</a>
        """
        text = self.escape_html(text)

        if url.startswith(('http://', 'https://', 'www.')):
            return f'<a href="{url}">{text}</a>'
        elif url.startswith(('./', '../')):
            # Handle relative paths
            return f'<a href="{url}">{text}</a>'

    def parse_list(self, lines: List[str], start: int) -> str:
        """
        Parse a list.

        Args:
            lines (List[str]): The lines of the list.
            start (int): The starting line number.

        Returns:
            str: The parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> print(parser.parse_list(['* Item 1', '* Item 2'], 0))
        (1, '<ul>\\n    <li>Item 1</li>\\n    <li>Item 2</li>\\n</ul>')
        >>> print(parser.parse_list(['1. Item 1', '2. Item 2'], 0))
        (1, '<ol>\\n    <li>Item 1</li>\\n    <li>Item 2</li>\\n</ol>')

        """
        list_items = []
        i = start
        # check if the list is ordered by checking the first item
        # if it starts with a number, it's ordered
        is_ordered = re.match(r'^\d+\.', lines[i].strip())
        list_type = 'ol' if is_ordered else 'ul'
        # while the next line starts with a bullet or number, add it to the list
        while i < len(lines) and (lines[i].strip().startswith(('* ', '- ')) or re.match(r'^\d+\.', lines[i].strip())):
            item = re.sub(r'^(\*|-|\d+\.)\s*', '', lines[i].strip())
            nested_content = []
            i += 1
            # while the next line is indented, add it to the nested content
            while i < len(lines) and lines[i].startswith('  '):
                nested_content.append(lines[i][2:])
                i += 1
            # if there is a nested content, parse it
            if nested_content:
                _, nested_list = self.parse_list(nested_content, 0)
                list_items.append(
                    f'    <li>{self.parse_inline_markdown(item, surround=None)}{nested_list}</li>')
            # otherwise, just add the item
            else:
                list_items.append(
                    f'    <li>{self.parse_inline_markdown(item, surround=None)}</li>')

        return i - 1, f'<{list_type}>\n' + '\n'.join(list_items) + f'\n</{list_type}>'

    def escape_html(self, text: str) -> str:
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


if __name__ == '__main__':
    import doctest
    doctest.testmod()
