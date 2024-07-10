import re
from typing import List, Tuple, Dict
import html


class GrimoireParser:
    def __init__(self):
        self.custom_elements = {
            'p': self.parse_custom_element,
            'div': self.parse_custom_element,
            'span': self.parse_custom_element,
        }

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
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if line.startswith('#'):
                parsed_lines.append(self.parse_header(line))
            elif line.startswith('{%') and line.endswith('%}'):
                match = re.match(r'{%\s*(\w+)(.*?)%}', line)
                if match:
                    element_type, attributes = match.groups()
                    if element_type in self.custom_elements:
                        i, parsed_block = self.parse_custom_block(
                            lines, i + 1, element_type, attributes)
                        parsed_lines.append(parsed_block)
                    else:
                        parsed_lines.append(self.parse_standard_markdown(line))
            elif line.startswith('```'):
                lang = line[3:].strip()
                i, parsed_block = self.parse_code_block(lines, i + 1, lang)
                parsed_lines.append(parsed_block)
            else:
                parsed_lines.append(self.parse_standard_markdown(line))
            i += 1
        content_to_return = '\n'.join(filter(None, parsed_lines))
        return "{% verbatim %}" + content_to_return + "{% endverbatim %}"

    def parse_custom_element(self, content: str, element_type: str, attributes: str) -> str:
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
        # Parse attributes
        attr_dict = self.parse_attributes(attributes)

        # Convert attributes to HTML string
        attr_str = ' '.join([f'{k}="{v}"' for k, v in attr_dict.items()])

        # Parse the content
        parsed_content = self.parse_block_content(content, surround=None)

        # Return the HTML
        return f'<{element_type} {attr_str}>{parsed_content}</{element_type}>'

    def parse_attributes(self, attributes: str) -> dict:
        """
        Parse attributes from a string.

        Args:
            attributes (str): The attributes string.

        Returns:
            dict: A dictionary of attribute names and values.

        Example:
        >>> parser = GrimoireParser()
        >>> attr_dict = parser.parse_attributes('class="my-class" id="my-id"')
        >>> print(attr_dict)
        {'class': 'my-class', 'id': 'my-id'}
        >>> attr_dict = parser.parse_attributes('data-test="true"')
        >>> print(attr_dict)
        {'data-test': 'true'}
        >>> attr_dict = parser.parse_attributes('data-custom-attr="value" another-attr="test"')
        >>> print(attr_dict)
        {'data-custom-attr': 'value', 'another-attr': 'test'}
        """
        attr_dict = {}
        for attr in re.findall(r'([\w-]+)=[\'"]([^\'"]*)[\'"]', attributes):
            attr_dict[attr[0]] = attr[1]
        return attr_dict

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
        <pre><code class="language-django">{% for item in items %}
            &lt;li&gt;{{ item }}&lt;/li&gt;
        {% endfor %}</code></pre>
        """
        block_lines = []
        i = start
        while i < len(lines) and not lines[i].strip().startswith('```'):
            block_lines.append(lines[i])
            i += 1
        block_content = '\n'.join(block_lines)

        return i, f'<pre><code class="language-{lang}">{self.escape_html(block_content)}</code></pre>'

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
        block_lines = []
        i = start
        while i < len(lines) and not lines[i].strip().startswith('{% end' + element_type + ' %}'):
            block_lines.append(lines[i])
            i += 1
        block_content = '\n'.join(block_lines)
        return i, self.custom_elements[element_type](block_content, element_type, attributes)

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
        line = re.sub(r'`(.*?)`', r'<code>\1</code>', line)
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
        >>> print(parser.parse_standard_markdown("**Bold** and *italic* and [link](https://example.com)"))
        <p><strong>Bold</strong> and <em>italic</em> and <a href="https://example.com">link</a></p>
        >>> print(parser.parse_standard_markdown(""))
        <BLANKLINE>

        """
        if not line.strip():
            return ''

        line = self.escape_html(line)

        # Stack to keep track of open tags
        open_tags = []

        # Helper function to close all open tags
        def close_tags():
            closed = ''.join(f'</{tag}>' for tag in reversed(open_tags))
            open_tags.clear()
            return closed

        # Parse bold and italic
        parts = re.split(r'(\*\*|\*)', line)
        result = []
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
            else:
                # Parse links
                link_parts = re.split(r'(\[.*?\]\(.*?\))', part)
                for link_part in link_parts:
                    link_match = re.match(r'\[(.*?)\]\((.*?)\)', link_part)
                    if link_match:
                        text, url = link_match.groups()
                        result.append(f'<a href="{url}">{text}</a>')
                    else:
                        # Parse inline code
                        code_parts = re.split(r'(`)', link_part)
                        for code_part in code_parts:
                            if code_part == '`':
                                if 'code' in open_tags:
                                    result.append('</code>')
                                    open_tags.remove('code')
                                else:
                                    result.append('<code>')
                                    open_tags.append('code')
                            else:
                                result.append(code_part)

        # Close any remaining open tags
        result.append(close_tags())

        return f'<p>{"".join(result)}</p>'

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
        <ul>
            <li><p>Item 1</p></li>
            <li><p>Item 2</p></li>
        </ul>
        >>> print(parser.parse_list(['- Item 1', '- Item 2'], 0))
        <ul>
            <li><p>Item 1</p></li>
            <li><p>Item 2</p></li>
        </ul>
        """
        list_items = []
        i = start
        while i < len(lines) and (lines[i].strip().startswith('* ') or lines[i].strip().startswith('- ')):
            item = lines[i].strip()[2:]
            nested_content = []
            i += 1
            while i < len(lines) and lines[i].startswith('  '):
                nested_content.append(lines[i][2:])
                i += 1

            if nested_content:
                nested_list = self.parse_list(nested_content, 0)
                list_items.append(
                    f'    <li>{self.parse_inline_markdown(item)}{nested_list}</li>')
            else:
                list_items.append(
                    f'    <li>{self.parse_inline_markdown(item)}</li>')

        return '<ul>\n' + '\n'.join(list_items) + '\n</ul>'

    def escape_html(self, text: str) -> str:
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


if __name__ == '__main__':
    import doctest
    doctest.testmod()
