import os
import re
from datetime import datetime
from typing import Dict, List, Tuple

from grimoire_generator.parser import GrimoireParser
from grimoire_generator.utils import sort_structure

# TODO: Debug the new paragraph parsing


class GrimoireGenerator:
    """
    A generator that creates a structured representation of documentation files.

    This class walks through a specified directory, identifying markdown files
    and creating a structured representation of your documentation. It handles
    various edge cases and provides detailed information about each file.

    """

    def __init__(self, root_dir: str, sort_key: str = 'name', reverse: bool = False):
        """
        Initialize the GrimoireGenerator.

        Args:
            root_dir (str): The root directory of the documentation files.

        Raises:
            ValueError: If the root directory doesn't exist or isn't readable.
        """
        if not os.path.isdir(root_dir) or not os.access(root_dir, os.R_OK):
            raise ValueError(
                f"The directory ({root_dir}) is inaccessible or doesn't exist.")
        self.root_dir = root_dir
        self.file_structure = {}
        self.parser = GrimoireParser()
        self.sort_key = sort_key
        self.reverse = reverse

    def generate_structure(self) -> Dict[str, Dict]:
        """
        Generate the structure of the documentation.

        Returns:
            Dict[str, Dict]: A nested dictionary representing the structure of the documentation.

        Example:
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
        """
        self.file_structure = self._walk_directory(self.root_dir)
        return sort_structure(self.file_structure, self.sort_key, self.reverse)

    def _walk_directory(self, current_dir: str, relative_path: str = '') -> Dict[str, Dict]:
        """
        Recursively walk through the documentation directory.

        Args:
            current_dir (str): The current directory being processed.
            relative_path (str): The path relative to the root directory.

        Returns:
            Dict[str, Dict]: A dictionary representing the structure of the current directory.
        """
        structure = {}
        try:
            for item in os.listdir(current_dir):
                full_path = os.path.join(current_dir, item)
                rel_path = os.path.join(relative_path, item)

                # Add this check for symlinks
                if os.path.islink(full_path):
                    continue  # Skip symlinks entirely

                if os.path.isdir(full_path):
                    children = self._walk_directory(full_path, rel_path)
                    if children:  # Only include non-empty directories
                        structure[item] = {'children': children}
                elif item.endswith('.md'):
                    file_info = self._extract_file_metadata(
                        full_path, rel_path)
                    if file_info and 'error' not in file_info:  # Only include files without errors
                        structure[item] = file_info

            return structure
        except PermissionError:
            print(
                f"Warning: Unable to access {current_dir}. Check your permissions.")
            return {}

    def _extract_file_metadata(self, file_path: str, relative_path: str) -> Dict[str, any]:
        """
        Extract the metadata of a markdown file.

        Args:
            file_path (str): The full path to the markdown file.
            relative_path (str): The path relative to the root directory.

        Returns:
            Dict[str, any]: A dictionary containing the file's metadata.
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()

            title = self._extract_title(content) or os.path.splitext(
                os.path.basename(file_path))[0]
            url_path = '/' + os.path.splitext(relative_path)[0]
            parsed_content = self.parser.parse(content)
            return {
                'title': title,
                'url_path': url_path,
                'last_modified': datetime.fromtimestamp(os.path.getmtime(file_path)),
                'content': parsed_content,
                'children': {}
            }
        except (IOError, UnicodeDecodeError) as e:
            print(f"Warning: Unable to read {file_path}. Error: {str(e)}")
            return None  # Return None instead of a dict with an error

    def _extract_title(self, content: str) -> str:
        """
        Extract the title from the content of a markdown file.

        Args:
            content (str): The content of the markdown file.

        Returns:
            str: The title of the document, or None if no title is found.
        """
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        return title_match.group(1) if title_match else None

    def get_file_by_path(self, path: str) -> Dict[str, any]:
        """
        Retrieve a specific markdown file by its path.
        Args:
            path (str): The URL path of the file.
        Returns:
            Dict[str, any]: The metadata of the requested file, or None if not found.
        """
        try:
            components = path.strip('/').split('/')
            current = self.file_structure
            for i, component in enumerate(components):
                if i == len(components) - 1:  # If it's the last component
                    # Try to get the .md file
                    return current.get(f"{component}.md")
                elif component in current:
                    if isinstance(current[component], dict) and 'children' in current[component]:
                        current = current[component]['children']
                    else:
                        current = current[component]
                else:
                    return None
            return None
        except Exception as e:
            print(f"Error: {e}")
            raise ValueError(f"Invalid path: {path}")

    def search_grimoire(self, query: str) -> List[Tuple[str, str]]:
        """
        Search the documentation for files matching the given query.

        Args:
            query (str): The search query.

        Returns:
            List[Tuple[str, str]]: A list of tuples containing the title and URL path of matching files.
        """
        results = []
        query = query.lower()  # Convert query to lowercase once
        self._search_recursive(self.file_structure, query, results)
        return results

    def _search_recursive(self, structure: Dict[str, Dict], query: str, results: List[Tuple[str, str]]):
        """
        Recursively search the file structure for matching files.

        Args:
            structure (Dict[str, Dict]): The current structure being searched.
            query (str): The search query.
            results (List[Tuple[str, str]]): The list to store search results.
        """
        for key, value in structure.items():
            if 'title' in value:
                title = value['title'].lower()
                url_path = value['url_path'].lower()
                if query in title or query in url_path:
                    results.append((value['title'], value['url_path']))
            if 'children' in value:
                self._search_recursive(value['children'], query, results)


if __name__ == '__main__':
    import doctest
    doctest.testmod()
