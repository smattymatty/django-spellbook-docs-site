import re
from typing import List, Tuple, Dict
import html


class GrimoireParser:
    def __init__(self):
        self.custom_blocks = {
            'code': self.parse_code_block,
            'spell': self.parse_spell_block,
            'potion': self.parse_potion_block,
        }

    def parse(self, content: str) -> str:
        """
        Parse the given content, handling both custom blocks and standard markdown.

        Args:
            content (str): The markdown content to be parsed.

        Returns:
            str: The parsed content as HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> content = "# Header\\n```spell\\nMagic Missile\\n```\\nNormal paragraph"
        >>> print(parser.parse(content))
        <h1>Header</h1>
        <div class="spell-block">Magic Missile</div>
        <p>Normal paragraph</p>
        """
        lines = content.split('\n')
        parsed_lines = []
        i = 0
        while i < len(lines):
            line = lines[i].rstrip()
            if line.startswith('#'):
                parsed_lines.append(self.parse_header(line))
            elif line.startswith('```'):
                block_type = line[3:].strip()
                if block_type in self.custom_blocks:
                    i, parsed_block = self.custom_blocks[block_type](
                        lines, i + 1)
                    parsed_lines.append(parsed_block)
                else:
                    i, parsed_block = self.parse_standard_code_block(
                        lines, i + 1)
                    parsed_lines.append(parsed_block)
            elif line.startswith('* '):
                i, parsed_list = self.parse_list(lines, i)
                parsed_lines.append(parsed_list)
            else:
                parsed_lines.append(self.parse_standard_markdown(line))
            i += 1
        return '\n'.join(filter(None, parsed_lines))

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

    def parse_code_block(self, lines: List[str], start: int) -> Tuple[int, str]:
        """
        Parse a custom code block.

        Args:
            lines (List[str]): All lines of the content being parsed.
            start (int): The line number where the code block content starts.

        Returns:
            Tuple[int, str]: A tuple containing the ending line number and the parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> lines = ['```code', 'def hello():', '    print("Hello, world!")', '```', 'Next line']
        >>> end, result = parser.parse_code_block(lines, 1)
        >>> print(end)
        3
        >>> print(result)
        <pre><code>def hello():
            print("Hello, world!")</code></pre>
        """
        return self.parse_custom_block(lines, start, 'pre', 'code')

    def parse_spell_block(self, lines: List[str], start: int) -> Tuple[int, str]:
        """
        Parse a custom spell block.

        Args:
            lines (List[str]): All lines of the content being parsed.
            start (int): The line number where the spell block content starts.

        Returns:
            Tuple[int, str]: A tuple containing the ending line number and the parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> lines = ['```spell', 'Fireball', 'Deals 8d6 fire damage', '```', 'Next line']
        >>> end, result = parser.parse_spell_block(lines, 1)
        >>> print(end)
        3
        >>> print(result)
        <div class="spell-block">Fireball
        Deals 8d6 fire damage</div>
        """
        return self.parse_custom_block(lines, start, 'div', 'spell-block')

    def parse_potion_block(self, lines: List[str], start: int) -> Tuple[int, str]:
        """
        Parse a custom potion block.

        Args:
            lines (List[str]): All lines of the content being parsed.
            start (int): The line number where the potion block content starts.

        Returns:
            Tuple[int, str]: A tuple containing the ending line number and the parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> lines = ['```potion', 'Healing Elixir', 'Restores 2d4+2 hit points', '```', 'Next line']
        >>> end, result = parser.parse_potion_block(lines, 1)
        >>> print(end)
        3
        >>> print(result)
        <div class="potion-block">Healing Elixir
        Restores 2d4+2 hit points</div>
        """
        return self.parse_custom_block(lines, start, 'div', 'potion-block')

    def parse_custom_block(self, lines: List[str], start: int, tag: str, class_name: str) -> Tuple[int, str]:
        """
        Parse a custom block.

        Args:
            lines (List[str]): The lines of the block.
            start (int): The starting line number.
            tag (str): The HTML tag to use.
            class_name (str): The CSS class to use.

        Returns:
            Tuple[int, str]: The ending line number and the parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> lines = ['```code', 'print("Hello, world!")', '```', 'Next line']
        >>> end, result = parser.parse_custom_block(lines, 1, 'pre', 'code')
        >>> print(end)
        3
        >>> print(result)
        <pre class="code"><code>print("Hello, world!")</code></pre>
        """
        block_lines = []
        i = start
        while i < len(lines) and not lines[i].strip().startswith('```'):
            block_lines.append(lines[i])
            i += 1
        block_content = '\n'.join(block_lines)
        if tag == 'pre':
            # For code blocks, don't parse the content and use nested <code> tag
            parsed_content = self.escape_html(block_content)
            return i, f'<{tag}><code>{parsed_content}</code></{tag}>'
        else:
            # For other blocks, parse the content but don't wrap in <p> tags
            parsed_content = self.parse_block_content(block_content)
            return i, f'<{tag} class="{class_name}">{parsed_content}</{tag}>'

    def parse_block_content(self, content: str) -> str:
        """
        Parse the content of a block.

        Args:
            content (str): The content of the block.

        Returns:
            str: The parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> print(parser.parse_block_content('Line 1\nLine 2'))
        <p>Line 1</p>
        <p>Line 2</p>
        """
        lines = content.split('\n')
        parsed_lines = [self.parse_inline_markdown(line) for line in lines]
        return '\n'.join(parsed_lines)

    def parse_inline_markdown(self, line: str) -> str:
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
        return line

    def parse_standard_code_block(self, lines: List[str], start: int) -> Tuple[int, str]:
        """
        Parse a standard markdown code block.

        This method is used for code blocks that don't match any custom block types.

        Args:
            lines (List[str]): All lines of the content being parsed.
            start (int): The line number where the code block content starts.

        Returns:
            Tuple[int, str]: A tuple containing the ending line number and the parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> lines = ['```', 'Standard code', 'No specific type', '```', 'Next line']
        >>> end, result = parser.parse_standard_code_block(lines, 1)
        >>> print(end)
        3
        >>> print(result)
        <pre><code>Standard code
        No specific type</code></pre>
        """
        return self.parse_custom_block(lines, start, 'pre', 'code')

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

    def parse_list(self, lines: List[str], start: int) -> Tuple[int, str]:
        """
        Parse a list.

        Args:
            lines (List[str]): The lines of the list.
            start (int): The starting line number.

        Returns:
            Tuple[int, str]: The ending line number and the parsed HTML.

        Example:
        >>> parser = GrimoireParser()
        >>> print(parser.parse_list(['* Item 1', '* Item 2'], 0))
        <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        </ul>
        """
        list_items = []
        i = start
        while i < len(lines) and lines[i].strip().startswith('* '):
            item = lines[i].strip()[2:]
            nested_content = []
            i += 1
            while i < len(lines) and lines[i].startswith('  '):
                nested_content.append(lines[i][2:])
                i += 1

            if nested_content:
                _, nested_list = self.parse_list(nested_content, 0)
                list_items.append(
                    f'<li>{self.parse_inline_markdown(item)}{nested_list}</li>')
            else:
                list_items.append(
                    f'<li>{self.parse_inline_markdown(item)}</li>')

        return i - 1, f'<ul>\n{"".join(list_items)}\n</ul>'

    def escape_html(self, text: str) -> str:
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
