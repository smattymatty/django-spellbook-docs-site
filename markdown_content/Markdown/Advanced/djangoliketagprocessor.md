---
title: Advanced Usage - DjangoLikeTagProcessor (Markdown Extensions)
tags: 
  - advanced
  - markdown
  - extensions
  - DjangoLikeTagProcessor
  - django
  - template
  - tags
---
## DjangoLikeTagProcessor (Markdown Extensions)

Welcome to the advanced guide for the `DjangoLikeTagProcessor`. This processor is a core component of Django Spellbook's markdown rendering pipeline, enabling the powerful blend of markdown with Django template tag syntax. Understanding its inner workings can help you customize parsing behavior or debug complex rendering scenarios.

{~ card title="What is DjangoLikeTagProcessor?" ~}
The `DjangoLikeTagProcessor` is a `markdown.blockprocessors.BlockProcessor` subclass. Its primary role is to identify and process blocks of text starting with Django-like template tags. 

It intelligently distinguishes between: 

1.  **Custom HTML-like elements:** Tags like `% div .my-class %`...`% enddiv %` are converted into actual HTML elements (`<div class="my-class">...</div>`) with their content recursively parsed as markdown.
2.  **Built-in Django template tags:** Tags like `% if user.is_authenticated %`, `% for item in list %`, `% url 'my_view' %`, etc., are preserved within special `<django-tag>` elements, ensuring they are passed through to the final Django template rendering engine untouched.

{% a .super-link href="https://python-markdown.github.io/extensions/api/#blockprocessors" target="_blank" %}See the official python-markdown docs for more information.{% enda %}

{~~}

## How to use the DjangoLikeTagProcessor

To use the processor directly, you would typically initialize the `markdown.Markdown` class and include the processor in its extensions.

```python
{% verbatim %}
import markdown
from django_spellbook.markdown.extensions import DjangoLikeTagExtension

# Example Markdown Input (read below for full example)
with open('example.md', 'r') as f:
    markdown_input = f.read()

# Initialize Markdown with the extension
md = markdown.Markdown(extensions=[DjangoLikeTagExtension()])

# Convert Markdown to HTML
html_output = md.convert(markdown_input)

print(html_output)
```

### Example Input and Output

Given the `markdown_input` in the Python snippet above:

**Input Markdown:**
```markdown
{% verbatim %}
# Example Document

{% div .content-wrapper #main %}
This is the main content area.

{% if user.is_logged_in %}
    Welcome back, {{ user.name }}!
    Look at this {% strong %}important{% endstrong %} message.
{% else %}
    Please log in.
{% endif %}

Here is a list:
- Item 1
- Item 2
{% enddiv %}

Regular paragraph outside the custom tag.
{% endverbatim %}
```

**Expected HTML Output:**

The processor converts the custom `% div %` and `% strong %` tags into standard HTML elements with the specified attributes. Crucially, it preserves the Django `% if %`, `% else %`, and `% endif %` tags by wrapping them in `<django-tag>` elements. This ensures they are *not* processed as literal text by the markdown parser but are passed through to be interpreted by the Django template engine later.

```html
{% verbatim %}
<h1>Example Document</h1>
<div class="content-wrapper" id="main"><p>This is the main content area.</p>
<django-tag>{% if user.is_logged_in %}</django-tag>
<p>Welcome back, {{ user.name }}!
Look at this <strong>important</strong> message.</p>
<django-tag>{% else %}</django-tag>
<p>Please log in.</p>
<django-tag>{% endif %}</django-tag>
<p>Here is a list:</p>
<ul>
<li>Item 1</li>
<li>Item 2</li>
</ul></div>
<p>Regular paragraph outside the custom tag.</p>
{% endverbatim %}
```

This output HTML can then be included in a Django template. When Django renders that template, it will process the content within the `<django-tag>` elements as standard Django template logic, effectively merging markdown structure with dynamic Django rendering.


## Core Processing Logic

The processor uses regular expressions and distinct handling logic based on the tag identified.

{~ accordion title="1. Tag Identification (test and run methods)" ~}
The process starts in the `test` method, which uses regex to quickly check if a block begins with a potential opening tag (`% tag ... %`) that isn't an end tag.

If `test` returns `True`, the `run` method takes over:

1.  It re-matches the `RE_START` pattern to capture the `tag` name and the `attrs_string`.
2.  **Crucially, it checks if the `tag` is in `DJANGO_INLINE_TAGS` (`{'static', 'url', 'include', 'load', 'csrf_token'}`).** If it is, `run` immediately returns `False`. This signals to the markdown parser that this *block* processor should *not* handle this tag, allowing the `DjangoLikeTagInlineProcessor` to handle it later within the standard markdown paragraph processing.
3.  If it's *not* an inline tag, the block is popped from the list, and processing continues.
4.  It determines if the tag is a known Django built-in (`DJANGO_BUILT_INS`) or a custom element tag.
5.  It dispatches to either `_handle_django_tag` or `_handle_custom_element`.

{~ alert type="danger" ~}
The `run` method is the most important part of the processor. It's responsible for handling the tag and extracting the content within it. If you're not familiar with the inner workings of the `markdown` library, you might want to read the {% a .super-link href="https://python-markdown.github.io/extensions/api/#blockprocessors" target="_blank" %}official python-markdown docs{% enda %}
{~~}
{~~}

{~ accordion title="2. Handling Custom Elements (_handle_custom_element)" ~}
This method is responsible for converting tags like `% mytag .class #id attr="val" %` into HTML `<mytag class="class" id="id" attr="val">`.

1.  **Element Creation:** An `ElementTree.Element` is created using the `tag` name (`mytag` in the example).
2.  **Attribute Parsing:** The `attrs_string` (`.class #id attr="val"`) is passed to the `_parse_attributes` helper.
    This helper uses the dedicated `parse_attributes` function (from `django_spellbook.markdown.attribute_parser`) which handles standard attributes, class shortcuts (`.class`), and ID shortcuts (`#id`).
3.  **Nested Content Processing:** The core logic for finding the matching `% endtag %` and extracting the content in between happens in `process_nested_content` (from `django_spellbook.markdown.extensions.custom_tag_parser`). This function handles nested tags and spans across multiple markdown blocks. It returns a `NestedContentResult` containing the `inner_content` and any `remaining_blocks` after the end tag.
4.  **Recursive Markdown Parsing:** This is done by splitting the `inner_content` by blank lines (creating new blocks) and feeding them back into `self.parser.parseBlocks(temp_parent, split_blocks)`. The resulting HTML children are then appended to the custom element created in step 1.

{~ alert type="info" title="Recursive Parsing" ~}
The extracted `inner_content` is *not* treated as plain text. Instead, it's processed recursively by the main markdown parser to handle any standard markdown syntax (like lists, bold, italics, code spans) *inside* the custom element block.
{~~}
{~~}

{~ accordion title="3. Handling Django Tags (_handle_django_tag)" ~}
This method deals with tags listed in `DJANGO_BUILT_INS`. It further differentiates between block tags and other built-ins.

1.  **Django Block Tags:** If the `tag` is a key in `DJANGO_BLOCK_TAGS` (e.g., `if`, `for`, `block`, `with`), handling is delegated to `handle_django_block_tag` (from `django_spellbook.markdown.extensions.django_builtin_tag_helpers`). This helper function manages the preservation of the opening tag (wrapped in `<django-tag>`) and recursively processes the content until it finds the corresponding closing tag (e.g., `endif`, `endfor`), which is also preserved in a `<django-tag>`. It correctly handles nested Django block tags.
2.  **Other Built-in Tags:** Tags like `else`, `elif`, `extends`, `load`, which don't have enclosed content in the same way as block tags or are handled inline, are simply preserved literally by wrapping the entire tag text within a `<django-tag>` element.

{~ alert type="warning" title="Inline Tags" ~}
Remember that tags defined in `DJANGO_INLINE_TAGS` (`static`, `url`, `include`, `load`, `csrf_token`) are explicitly *ignored* by this block processor's `run` method. They are handled later by the `DjangoLikeTagInlineProcessor`, which also wraps them in `<django-tag>` but operates within paragraphs.
{~~}
{~~}
