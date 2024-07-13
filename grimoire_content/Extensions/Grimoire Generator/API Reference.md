# API Reference
## generate_grimoire Command

The `generate_grimoire` command is the main component of Grimoire_Generator, designed to automate the process of converting Markdown files into HTML templates. This command is particularly useful for maintaining and updating documentation or content that is written in Markdown but needs to be served as HTML in your Django application.
### Usage

The `generate_grimoire` command is typically run from the command line in your Django project directory:

{% code_block language="bash" %}
python manage.py generate_grimoire [options]
{% endcode_block %}
### Options

- `--force`: Forces overwrite of existing template files.
- `--verbose`: Prints verbose output during the generation process.
### Configuration

Before using the command, ensure you have the following settings in your Django `settings.py`:

{% code_block language="settings.py" %}
```
GRIMOIRE_CONTENT_APP = 'your_app_name'
GRIMOIRE_CONTENT_DIR = '/path/to/your/markdown/files'
```
{% endcode_block %}

Also, within your CONTENT_APP's templates folder, include a grimoire_base.html to render all of your content to.

{% code_block language="app/templates/app/grimoire_base.html" %}
```
{% extends 'docs/base.html' %}
{% block docs_content %}
    <div>
    <!-- Just put in grimoire_content --> and whatever else!
        {{ grimoire_content }}
        <span style="text-align: right; text-size: small; opacity: 0.5">{{ grimoire_last_modified }}</span>
    </div>
{% endblock %}

```
{% endcode_block %}

There are some pre-defined context variables to be used in your grimoire_base.html:
- `grimoire_title`
- `grimoire_content`
- `grimoire_last_modified`
- `grimoire_url_path`
- `grimoire_structure`

These context variables are given to the templates on command run, and then the templates are each fully rendered. If you one of these context variables changes, you will have to run the command again to fully update. 
### Process

1. **Initialization**: The command checks for required settings and loads any custom blocks from your Django apps.
2. **Directory Setup**: It constructs the paths for the source Markdown files and the destination HTML templates.
3. **Template Generation**: For each Markdown file, it:
   - Parses the content
   - Applies the base template (`grimoire_base.html`)
   - Generates an HTML file in the corresponding location in the templates directory
### Example
Assuming you have the following structure:
{% code_block language="folders" %}
your_project/
    your_app/
        content/
            intro.md
            advanced/
                topic1.md
{% endcode_block %}
Running the command:
{% code_block language="bash" %}
```
python manage.py generate_grimoire --verbose
```
{% endcode_block %}
Will generate:
{% code_block language="folders" %}
your_project/
    your_app/
        templates/
            your_app/
                grimoire/
                    intro.html
                    advanced/
                        topic1.html
{% endcode_block %}
### Best Practices
1. **Version Control**: Keep your Markdown files under version control.
2. **Regular Updates**: Run this command as part of your deployment process to ensure your HTML templates are always up-to-date.
3. **Custom Base Template**: Create a custom `grimoire_base.html` in your app's templates directory for consistent styling and layout.
### Troubleshooting
- If templates are not generating, check your `GRIMOIRE_CONTENT_DIR` setting.
- For issues with custom blocks, ensure they are properly registered in your app's `grimoire_blocks.py` file.
- Use the `--verbose` option for detailed logs to identify any issues in the generation process.
## Grimoire_Parser
The Grimoire_Parser is a crucial component of Django-Spellbook, designed to parse and transform custom markdown-like syntax into HTML. It serves as the backbone for creating dynamic, interactive web applications with minimal custom JavaScript in Django projects.
### Key Features
- **Custom** element parsing
- **Markdown**-to-HTML conversion
- **Support** for code blocks, lists, and inline styles
- **Integration** with Django template system
- **Extensible** architecture for custom blocks
### Usage
The Grimoire_Parser is typically used internally by the Django-Spellbook system. However, you can also use it directly in your Django views or templates if needed.
{% code_block language="Python" %}
from django_spellbook.grimoire_generator.parser import GrimoireParser

parser = GrimoireParser()
html_content = parser.parse(markdown_content)
{% endcode_block %}
Initializes a new instance of the `GrimoireParser`. The constructor sets up the custom elements dictionary, which includes default HTML elements and any additional elements registered in the `block_registry`.

### Extending GrimoireParser

To add custom parsing behavior, you can subclass `GrimoireParser` and override or add methods as needed. You can also extend the `custom_elements` dictionary in the constructor to add support for new custom elements.

## GrimoireGenerator

The GrimoireGenerator is a powerful tool within Django-Spellbook that creates a structured representation of documentation files. It's designed to walk through a specified directory, identify markdown files, and generate a hierarchical structure of your documentation.

### Key Features

- **Directory Traversal**: Recursively walks through documentation directories.
- **Markdown Parsing**: Extracts metadata and content from markdown files.
- **Structure Generation**: Creates a nested dictionary representing the documentation structure.
- **File Metadata Extraction**: Retrieves title, URL path, and last modified date for each file.
- **Search Functionality**: Allows searching through the generated documentation structure.
- **Sorting Options**: Provides customizable sorting of the generated structure.

### Usage

The GrimoireGenerator is typically used to create a structured representation of your documentation, which can then be used to generate navigation menus, search indices, or other documentation-related features.

{% code_block language="Python" %}
```
from django_spellbook.grimoire_generator.generator import GrimoireGenerator

# Initialize the generator
generator = GrimoireGenerator('/path/to/docs', sort_key='name', reverse=False)

# Generate the structure
structure = generator.generate_structure()

# Retrieve a specific file
file_info = generator.get_file_by_path('/introduction')

# Search the documentation
results = generator.search_grimoire('django')
```
{% endcode_block %}

The structure is an important part of the generator, and is often passed into view's context to help create navigation menu!

{% code_block language="structure example" %}
{
	'introduction.md': {
		'title': 'Introduction to Documentation',
		'url_path': '/introduction',
		'last_modified': datetime.datetime(2023, 5, 10, 15, 30),
		'children': {}
	},
	'topics': {
		'children': {
			'advanced.md': {
				'title': 'Advanced Topics',
				'url_path': '/topics/advanced',
				'last_modified': datetime.datetime(2023, 5, 11, 9, 45),
				'children': {}
			}
		}
	}
}
{% endcode_block %}