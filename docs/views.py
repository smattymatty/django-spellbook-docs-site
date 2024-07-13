from django.shortcuts import render
from django.http import Http404
from django.conf import settings
from grimoire_generator.generator import GrimoireGenerator
from grimoire_generator.utils import sort_structure


def home(request):
    content_dir = settings.GRIMOIRE_CONTENT_DIR
    generator = GrimoireGenerator(content_dir)

    structure = generator.generate_structure()

    context = {
        'grimoire_structure': structure
    }
    print(f"structure: {structure}")

    return render(request, 'docs/home.html', context)


def grimoire_page(request, path=''):
    content_dir = settings.GRIMOIRE_CONTENT_DIR
    generator = GrimoireGenerator(content_dir)

    structure = generator.generate_structure()

    file_info = generator.get_file_by_path(path)

    if file_info:
        template_path = f"{settings.GRIMOIRE_CONTENT_APP}/grimoire/{path}.html"
        context = {
            'grimoire_title': file_info.get('title', ''),
            'grimoire_content': file_info.get('content', ''),
            'grimoire_last_modified': file_info.get('last_modified', ''),
            'grimoire_url_path': file_info.get('url_path', ''),
            'grimoire_structure': structure
        }
        print(f"structure: {structure}")
        response = render(request, template_path, context)
        return response
    else:
        raise Http404("Grimoire page not found")


def grimoire_index(request):
    # Initialize the GrimoireGenerator
    content_dir = settings.GRIMOIRE_CONTENT_DIR
    generator = GrimoireGenerator(content_dir)

    # Generate the structure
    structure = generator.generate_structure()

    # Render the index template
    return render(request, f"{settings.GRIMOIRE_CONTENT_APP}/sections/grimoire_index.html", {
        'grimoire_structure': structure
    })


def grimoire_search(request):
    query = request.GET.get('q', '')

    if query:
        # Initialize the GrimoireGenerator
        content_dir = settings.GRIMOIRE_CONTENT_DIR
        generator = GrimoireGenerator(content_dir)

        # Perform the search
        results = generator.search_grimoire(query)
    else:
        results = []

    return render(request, f"{settings.GRIMOIRE_CONTENT_APP}/sections/grimoire_search.html", {
        'query': query,
        'results': results
    })
