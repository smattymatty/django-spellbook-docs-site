import os
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.template.loader import get_template
from django.template import TemplateDoesNotExist
from django.apps import apps
from django.utils.safestring import mark_safe

from grimoire_generator.generator import GrimoireGenerator
from grimoire_generator.registry import block_registry


class Command(BaseCommand):
    help = 'Generates HTML templates from Markdown files in the grimoire content directory'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force overwrite of existing template files',
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Print verbose output',
        )

    def handle(self, *args, **options):
        self.verbose = options['verbose']

        # Check for required settings
        required_settings = ['GRIMOIRE_CONTENT_APP', 'GRIMOIRE_CONTENT_DIR']
        for setting in required_settings:
            if not hasattr(settings, setting):
                raise CommandError(f"Missing required setting: {setting}")

        content_dir = settings.GRIMOIRE_CONTENT_DIR
        app_name = settings.GRIMOIRE_CONTENT_APP

        for app_config in apps.get_app_configs():
            try:
                __import__(f"{app_config.name}.grimoire_blocks.py")
            except ImportError:
                pass  # No custom_elements module in this app
        if block_registry.blocks:
            self.stdout.write(self.style.SUCCESS(
                f"Loaded {len(block_registry.blocks)} custom blocks from apps."))
        # Construct the path for the grimoire templates
        template_dir = os.path.join(
            settings.BASE_DIR, app_name, 'templates', app_name, 'grimoire')

        self.log(f"Content directory: {content_dir}")
        self.log(f"Template directory: {template_dir}")

        if not os.path.exists(content_dir):
            raise CommandError(
                f"Content directory does not exist: {content_dir}")

        try:
            self.generate_templates(
                content_dir, template_dir, options['force'])
            self.stdout.write(self.style.SUCCESS(
                "Grimoire templates generated successfully!"))
        except Exception as e:
            raise CommandError(f"An error occurred: {str(e)}")

    def generate_templates(self, content_dir, template_dir, force):
        try:
            # Try to get the grimoire_base.html template
            base_template = get_template(
                f'{settings.GRIMOIRE_CONTENT_APP}/grimoire_base.html')
            self.log("Base template loaded successfully")
        except TemplateDoesNotExist:
            raise CommandError(
                f"grimoire_base.html not found in {settings.GRIMOIRE_CONTENT_APP} templates.")

        # Ensure the template directory exists
        os.makedirs(template_dir, exist_ok=True)
        self.log(f"Ensured template directory exists: {template_dir}")

        # Initialize the GrimoireGenerator
        generator = GrimoireGenerator(content_dir)
        self.structure = generator.generate_structure()
        self.log("Structure generated:")
        self.log(str(self.structure))

        self._process_structure(
            self.structure, template_dir, base_template, force)

    def _process_structure(self, structure, template_dir, base_template, force, current_path=''):
        for key, value in structure.items():
            self.log(f"Processing item: {key}")
            self.log(f"Item type: {type(value)}")
            self.log(f"Item content: {value}")

            if isinstance(value, dict):
                if 'children' in value and value['children']:
                    # This is a directory with children, recurse into it
                    new_path = os.path.join(current_path, key)
                    self._process_structure(
                        value['children'], template_dir, base_template, force, new_path)
                elif 'content' in value:
                    # This is a file, generate the template
                    self._generate_template(
                        key, value, current_path, template_dir, base_template, force)
                else:
                    self.log(
                        f"Skipping item {key} as it doesn't have expected structure")
            else:
                self.log(f"Skipping item {key} as it's not a dictionary")

    def _generate_template(self, filename, file_info, current_path, template_dir, base_template, force):
        file_path = os.path.join(current_path, filename)
        template_path = os.path.join(template_dir, file_path[:-3] + '.html')

        self.log(f"Generating template for: {file_path}")
        self.log(f"Template path: {template_path}")

        if os.path.exists(template_path) and not force:
            self.log(f"Skipping existing template: {template_path}")
            return

        # Ensure the subdirectory for the template exists
        os.makedirs(os.path.dirname(template_path), exist_ok=True)

        # Use the base_template to render the content
        try:
            template_content = base_template.render({
                'grimoire_title': file_info.get('title', ''),
                # Mark as safe here
                'grimoire_content': mark_safe(file_info.get('content', '')),
                'grimoire_last_modified': file_info.get('last_modified', ''),
                'grimoire_url_path': file_info.get('url_path', ''),
                'grimoire_structure': self.structure
            })

            with open(template_path, 'w') as template_file:
                template_file.write(template_content)

            self.log(f"Generated template: {template_path}")
            self.log(f"File size: {os.path.getsize(template_path)} bytes")
        except Exception as e:
            self.log(f"Error generating template for {file_path}: {str(e)}")

    def log(self, message):
        if self.verbose:
            self.stdout.write(message)
