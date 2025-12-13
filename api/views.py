# api/views.py
import logging
from pathlib import (
    Path,
)
import random
import bleach

from django.conf import (
    settings,
)
from django.http import (
    HttpResponse,
)
from rest_framework.exceptions import (
    APIException,
)
from rest_framework.views import (
    APIView,
)
from rest_framework.response import (
    Response,
)
from rest_framework import (
    status,
    permissions,
)
from django.shortcuts import (
    get_object_or_404,
)  # For detail view
from django.shortcuts import (
    render,
)  # Used in RenderedMarkdownDetailAPIView
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from .models import (
    StoredMarkdown,
)
from .serializers import (
    StoredMarkdownSerializer,
)

from django_spellbook.parsers import (
    render_spellbook_markdown_to_html,
)
from django_spellbook.blocks import (
    SpellBlockRegistry,
)

logger = logging.getLogger(__name__)


class PayloadTooLarge(APIException):
    status_code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
    default_detail = "Payload Too Large"
    default_code = "payload_too_large"


class BaseCustomAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Default permissions

    def get_serializer_context(
        self,
    ):
        return {"request": self.request}

    def check_request_size(
        self,
        request,
        max_size_setting_name="MAX_API_REQUEST_SIZE",
        default_max_size=settings.DATA_UPLOAD_MAX_MEMORY_SIZE,
    ):  # Using DATA_UPLOAD_MAX_MEMORY_SIZE as default
        try:
            content_length = int(
                request.META.get(
                    "CONTENT_LENGTH",
                    0,
                )
            )
        except (
            ValueError,
            TypeError,
        ):
            return
        max_size = getattr(
            settings,
            max_size_setting_name,
            default_max_size,
        )
        if content_length > max_size:
            raise PayloadTooLarge(
                f"Payload size ({content_length} bytes) exceeds configured limit ({max_size} bytes)."
            )


# --- Views that handle Markdown content ---


class StoredMarkdownListCreateAPIView(BaseCustomAPIView):
    """
    List and create StoredMarkdown objects.
    Inherits from BaseCustomAPIView to provide permission_classes and get_serializer_context.
    """

    def get(
        self,
        request,
        *args,
        **kwargs,
    ):
        queryset = StoredMarkdown.objects.all().order_by("-updated_at")
        serializer = StoredMarkdownSerializer(
            queryset,
            many=True,
            context=self.get_serializer_context(),
        )
        return Response(serializer.data)

    def post(
        self,
        request,
        *args,
        **kwargs,
    ):
        try:
            self.check_request_size(
                request,
                max_size_setting_name="MAX_API_REQUEST_SIZE",
            )
        except PayloadTooLarge as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            )

        serializer = StoredMarkdownSerializer(
            data=request.data,
            context=self.get_serializer_context(),
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class StoredMarkdownDetailAPIView(BaseCustomAPIView):
    # get_serializer_context is inherited
    # permission_classes is inherited

    #  define get_object here as it's specific to this detail view
    def get_object(
        self,
        pk,
    ):
        """
        Helper method to get the object with the given pk or raise a 404.
        """
        return get_object_or_404(
            StoredMarkdown,
            pk=pk,
        )

    def get(
        self,
        request,
        pk,
        *args,
        **kwargs,
    ):
        instance = self.get_object(pk)  # Now self.get_object exists
        serializer = StoredMarkdownSerializer(
            instance,
            context=self.get_serializer_context(),
        )
        return Response(serializer.data)

    def put(
        self,
        request,
        pk,
        *args,
        **kwargs,
    ):
        try:
            self.check_request_size(
                request,
                max_size_setting_name="MAX_API_REQUEST_SIZE",
            )
        except PayloadTooLarge as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            )

        instance = self.get_object(pk)  # Now self.get_object exists
        serializer = StoredMarkdownSerializer(
            instance,
            data=request.data,
            context=self.get_serializer_context(),
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(
        self,
        request,
        pk,
        *args,
        **kwargs,
    ):
        instance = self.get_object(pk)  # Now self.get_object exists
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RenderedMarkdownDetailAPIView(
    APIView
):  # This one doesn't need BaseCustomAPIView features
    permission_classes = [permissions.IsAuthenticated]

    # No get_serializer_context needed as it doesn't use a DRF serializer for output
    # No check_request_size needed as it's a GET request with no body to check

    # Must define get_object here as it's specific to this detail view
    def get_object(
        self,
        pk,
    ):
        return get_object_or_404(
            StoredMarkdown,
            pk=pk,
        )

    def get(
        self,
        request,
        pk,
        *args,
        **kwargs,
    ):
        instance = self.get_object(pk)
        rendered_html = instance.html_content
        # Pass the instance to the template context so you can use instance.title etc.
        return render(
            request,
            "api/sb_base.html",
            {
                "markdown_content": rendered_html,
                "instance": instance,
            },
        )


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def markdown_preview_api(request):
    """
    API endpoint to render markdown content to HTML with sanitization.
    Returns HTML content for live preview functionality.
    """
    logger.info("[Markdown Preview API] --- Starting request ---")
    
    try:
        from .logic.markdown_preview import process_markdown_preview
        
        raw_markdown = request.data.get("markdown", "")
        
        # Process markdown with sanitization enabled
        # Set enable_sanitization=False to debug sanitization issues
        response = process_markdown_preview(
            raw_markdown=raw_markdown,
            enable_sanitization=True,
            strict_mode=False
        )
        
        logger.info(f"[Markdown Preview API] Successfully processed {len(raw_markdown)} chars of markdown")
        return response
        
    except Exception as e:
        logger.error(f"[Markdown Preview API] Error: {type(e).__name__} - {e}")
        return HttpResponse(
            f"<div class='error'>Error processing markdown: {str(e)}</div>",
            content_type="text/html",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def spellblock_registry_api(request):
    """
    API endpoint to fetch all available SpellBlocks and their schemas.
    Returns JSON with block definitions including parameter information.
    """
    logger.info("[SpellBlock Registry API] --- Starting request ---")

    try:
        from .logic.spellblock_registry import build_spellblock_registry
        
        registry_data = build_spellblock_registry()

        response_data = {
            "blocks": registry_data,
            "count": len(registry_data),
        }

        return Response(
            response_data,
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        logger.error(
            f"[SpellBlock Registry API] Error: {type(e).__name__} - {e}"
        )
        return Response(
            {
                "error": "Failed to retrieve SpellBlock registry",
                "detail": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([permissions.AllowAny])  # Or your preferred permissions
def random_markdown_api(
    request,
):
    logger.info("\n[Random Markdown API] --- Starting request ---")

    spellbook_paths_setting = getattr(
        settings,
        "SPELLBOOK_MD_PATH",
        [],
    )
    # The original logging for SPELLBOOK_MD_PATH was good, let's keep it clear
    logger.info(
        f"[Random Markdown API] ---\n\tRaw SPELLBOOK_MD_PATH from settings: {spellbook_paths_setting}\n\t---"
    )

    if not isinstance(
        spellbook_paths_setting,
        list,
    ):
        spellbook_paths = [spellbook_paths_setting]
        logger.info(
            f"[Random Markdown API] ---\n\tSPELLBOOK_MD_PATH was not a list, converted to: {spellbook_paths}\n\t---"
        )
    else:
        spellbook_paths = spellbook_paths_setting

    all_markdown_files = []
    logger.info(
        "[Random Markdown API] --- Iterating through configured paths to find markdown files ---"
    )
    if not spellbook_paths:
        logger.warning(
            "[Random Markdown API] ---\n\tSPELLBOOK_MD_PATH is empty or not configured.\n\t---"
        )

    for (
        i,
        p_str,
    ) in enumerate(spellbook_paths):
        logger.info(
            f"[Random Markdown API] ---\n\tProcessing Path Entry #{i + 1}: '{p_str}' (type: {type(p_str)})"
        )
        try:
            # Per your note: "SPELLBOOK_MD_PATH contains strings"
            path_obj = Path(p_str)
            logger.info(
                f"[Random Markdown API] \t\tSuccessfully converted to Path object: '{path_obj}'"
            )

            if not path_obj.exists():
                logger.warning(
                    f"[Random Markdown API] \t\tPath does not exist: '{path_obj}'. Skipping."
                )
                continue

            if path_obj.is_dir():
                logger.info(
                    f"[Random Markdown API] \t\t'{path_obj}' is a directory. Searching for '*.md' files recursively..."
                )
                found_in_dir = list(path_obj.rglob("*.md"))
                if found_in_dir:
                    all_markdown_files.extend(found_in_dir)
                    logger.info(
                        f"[Random Markdown API] \t\tFound {len(found_in_dir)} markdown file(s) in this directory:"
                    )
                    for (
                        md_file_idx,
                        md_file,
                    ) in enumerate(found_in_dir):
                        logger.info(
                            f"[Random Markdown API] \t\t\t- [{md_file_idx + 1}] {md_file}"
                        )
                else:
                    logger.info(
                        f"[Random Markdown API] \t\tNo markdown files found in directory '{path_obj}'."
                    )
            elif (
                path_obj.is_file() and path_obj.suffix.lower() == ".md"
            ):  # Use .lower() for case-insensitivity
                logger.info(
                    f"[Random Markdown API] \t\t'{path_obj}' is a single markdown file. Adding it."
                )
                all_markdown_files.append(path_obj)
            else:
                logger.warning(
                    f"[Random Markdown API] \t\t'{path_obj}' is not a directory or a .md file. Skipping."
                )
        except Exception as e:
            logger.error(
                f"[Random Markdown API] \t\tError processing path entry '{p_str}': {type(e).__name__} - {e}\n\t---"
            )

    logger.info("[Random Markdown API] --- File collection complete ---")
    logger.info(
        f"[Random Markdown API] ---\n\tTotal unique markdown files collected: {len(all_markdown_files)}"
    )
    if all_markdown_files:
        logger.info(
            "[Random Markdown API] \tList of all collected markdown files:"
        )
        for (
            f_idx,
            f_path,
        ) in enumerate(all_markdown_files):
            logger.info(f"[Random Markdown API] \t\t- [{f_idx + 1}] {f_path}")
    logger.info("\t---")

    if not all_markdown_files:
        logger.warning(
            "[Random Markdown API] --- No markdown files were found in any configured SPELLBOOK_MD_PATH. Returning 404. ---"
        )
        return HttpResponse(
            "No markdown files found in SPELLBOOK_MD_PATH.",
            status=status.HTTP_404_NOT_FOUND,
            content_type="text/plain",
        )

    try:
        random_file_path = random.choice(all_markdown_files)
        logger.info(
            f"[Random Markdown API] ---\n\tRandomly selected file for response: '{random_file_path}'\n\t---"
        )
    except IndexError:
        logger.error(
            "[Random Markdown API] --- CRITICAL ERROR: 'random.choice' was called on an empty list of files. This should have been caught earlier. Returning 500. ---"
        )
        return HttpResponse(
            "Error selecting random file: No files available after processing paths.",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type="text/plain",
        )

    try:
        logger.info(
            f"[Random Markdown API] --- Attempting to read content from file: '{random_file_path}' ---"
        )
        with open(
            random_file_path,
            "r",
            encoding="utf-8",
        ) as f:
            raw_markdown_content = f.read()
        logger.info(
            f"[Random Markdown API] ---\n\tSuccessfully read file. Content length: {len(raw_markdown_content)} bytes.\n\t---"
        )
        logger.info(
            "[Random Markdown API] --- Request successful. Returning raw markdown content. ---"
        )
        return HttpResponse(
            raw_markdown_content,
            content_type="text/markdown; charset=utf-8",
        )
    except FileNotFoundError:
        logger.error(
            f"[Random Markdown API] ---\n\tError: File not found during read attempt: '{random_file_path}'. This could happen if the file was moved/deleted after listing or if the path was incorrect.\n\t---"
        )
        return HttpResponse(
            f"Error reading markdown file: File not found '{random_file_path}'.",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type="text/plain",
        )
    except Exception as e:
        logger.error(
            f"[Random Markdown API] ---\n\tUnhandled error reading markdown file '{random_file_path}': {type(e).__name__} - {e}\n\t---"
        )
        return HttpResponse(
            f"Error reading markdown file: {str(e)}",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type="text/plain",
        )


# Style Preview API Views for HTMX color examples


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_bg_core(request):
    """Preview for core background colors."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">Primary</div>
        <div class="sb-bg-secondary sb-text-text sb-p-3 sb-rounded">Secondary</div>
        <div class="sb-bg-accent sb-text-text sb-p-3 sb-rounded">Accent</div>
        <div class="sb-bg-neutral sb-text-text sb-p-3 sb-rounded">Neutral</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_bg_status(request):
    """Preview for status background colors."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-bg-success sb-text-text sb-p-3 sb-rounded">Success</div>
        <div class="sb-bg-warning sb-text-text sb-p-3 sb-rounded">Warning</div>
        <div class="sb-bg-error sb-text-text sb-p-3 sb-rounded">Error</div>
        <div class="sb-bg-info sb-text-text sb-p-3 sb-rounded">Info</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_bg_specialty(request):
    """Preview for specialty background colors."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-bg-emphasis sb-text-text sb-p-3 sb-rounded">Emphasis</div>
        <div class="sb-bg-subtle sb-text-text sb-p-3 sb-rounded sb-border sb-border-neutral-25">Subtle</div>
        <div class="sb-bg-distinct sb-text-text sb-p-3 sb-rounded">Distinct</div>
        <div class="sb-bg-aether sb-text-text sb-p-3 sb-rounded">Aether</div>
        <div class="sb-bg-artifact sb-text-text sb-p-3 sb-rounded">Artifact</div>
        <div class="sb-bg-sylvan sb-text-text sb-p-3 sb-rounded">Sylvan</div>
        <div class="sb-bg-danger sb-text-text sb-p-3 sb-rounded">Danger</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_bg_system(request):
    """Preview for system background colors."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-bg-background sb-text-text sb-p-3 sb-rounded sb-border sb-border-neutral-25">Background</div>
        <div class="sb-bg-surface sb-text-text sb-p-3 sb-rounded sb-border sb-border-neutral-25">Surface</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_bg_base(request):
    """Preview for base background colors."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-bg-black sb-text-white sb-p-3 sb-rounded">Black</div>
        <div class="sb-bg-white sb-text-text sb-p-3 sb-rounded sb-border sb-border-neutral-25">White</div>
        <div class="sb-bg-transparent sb-text-text sb-p-3 sb-rounded sb-border sb-border-neutral-25">Transparent</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_text_colors(request):
    """Preview for text colors."""
    html = '''
    <div class="sb-flex sb-gap-4 sb-flex-wrap">
        <span class="sb-text-primary sb-font-bold">Primary</span>
        <span class="sb-text-secondary sb-font-bold">Secondary</span>
        <span class="sb-text-accent sb-font-bold">Accent</span>
        <span class="sb-text-neutral sb-font-bold">Neutral</span>
        <span class="sb-text-success sb-font-bold">Success</span>
        <span class="sb-text-warning sb-font-bold">Warning</span>
        <span class="sb-text-error sb-font-bold">Error</span>
        <span class="sb-text-info sb-font-bold">Info</span>
        <span class="sb-text-text sb-font-bold">Text (default)</span>
        <span class="sb-text-text-secondary sb-font-bold">Text Secondary (muted)</span>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_border_colors(request):
    """Preview for border colors."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-border-2 sb-border-primary sb-p-3 sb-rounded sb-text-text">Primary</div>
        <div class="sb-border-2 sb-border-secondary sb-p-3 sb-rounded sb-text-text">Secondary</div>
        <div class="sb-border-2 sb-border-accent sb-p-3 sb-rounded sb-text-text">Accent</div>
        <div class="sb-border-2 sb-border-success sb-p-3 sb-rounded sb-text-text">Success</div>
        <div class="sb-border-2 sb-border-warning sb-p-3 sb-rounded sb-text-text">Warning</div>
        <div class="sb-border-2 sb-border-error sb-p-3 sb-rounded sb-text-text">Error</div>
        <div class="sb-border-2 sb-border-info sb-p-3 sb-rounded sb-text-text">Info</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_opacity_bg(request):
    """Preview for background opacity variants."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-bg-primary sb-text-text sb-p-3 sb-rounded">100%</div>
        <div class="sb-bg-primary-90 sb-text-text sb-p-3 sb-rounded">90%</div>
        <div class="sb-bg-primary-75 sb-text-text sb-p-3 sb-rounded">75%</div>
        <div class="sb-bg-primary-50 sb-text-text sb-p-3 sb-rounded">50%</div>
        <div class="sb-bg-primary-25 sb-text-text sb-p-3 sb-rounded">25%</div>
        <div class="sb-bg-primary-10 sb-text-text sb-p-3 sb-rounded sb-border sb-border-neutral-25">10%</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_opacity_text(request):
    """Preview for text opacity variants."""
    html = '''
    <div class="sb-flex sb-gap-4 sb-flex-wrap">
        <span class="sb-text-primary sb-font-bold">100%</span>
        <span class="sb-text-primary-75 sb-font-bold">75%</span>
        <span class="sb-text-primary-50 sb-font-bold">50%</span>
        <span class="sb-text-primary-25 sb-font-bold">25%</span>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_opacity_border(request):
    """Preview for border opacity variants."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-border-2 sb-border-primary sb-p-3 sb-rounded sb-text-text">100%</div>
        <div class="sb-border-2 sb-border-primary-75 sb-p-3 sb-rounded sb-text-text">75%</div>
        <div class="sb-border-2 sb-border-primary-50 sb-p-3 sb-rounded sb-text-text">50%</div>
        <div class="sb-border-2 sb-border-primary-25 sb-p-3 sb-rounded sb-text-text">25%</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_hover_bg(request):
    """Preview for background hover states."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-bg-white sb-hover:bg-primary sb-hover:text-white sb-p-3 sb-rounded sb-border sb-border-neutral-25 sb-transition sb-cursor-pointer">
            White → Primary
        </div>
        <div class="sb-bg-surface sb-hover:bg-accent sb-hover:text-white sb-p-3 sb-rounded sb-border sb-border-neutral-25 sb-transition sb-cursor-pointer">
            Surface → Accent
        </div>
        <div class="sb-bg-transparent sb-hover:bg-primary-25 sb-p-3 sb-rounded sb-border sb-border-neutral-25 sb-transition sb-cursor-pointer">
            Transparent → 25%
        </div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_hover_text(request):
    """Preview for text hover states."""
    html = '''
    <div class="sb-flex sb-gap-4 sb-flex-wrap">
        <span class="sb-text-secondary sb-hover:text-primary sb-font-bold sb-transition sb-cursor-pointer">
            Secondary → Primary
        </span>
        <span class="sb-text-primary sb-hover:text-accent sb-font-bold sb-transition sb-cursor-pointer">
            Primary → Accent
        </span>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_hover_border(request):
    """Preview for border hover states."""
    html = '''
    <div class="sb-flex sb-gap-2 sb-flex-wrap">
        <div class="sb-border-2 sb-border-secondary sb-hover:border-primary sb-p-3 sb-rounded sb-text-text sb-transition sb-cursor-pointer">
            Secondary → Primary
        </div>
        <div class="sb-border-2 sb-border-neutral sb-hover:border-accent sb-p-3 sb-rounded sb-text-text sb-transition sb-cursor-pointer">
            Neutral → Accent
        </div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')

# Spacing Preview API Views for HTMX spacing examples


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_spacing_p(request):
    """Preview for padding (all sides)."""
    html = '''
    <div class="sb-flex sb-flex-column sb-gap-2">
        <div class="sb-p-0 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-0: No padding</div>
        <div class="sb-p-1 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-1: 0.25rem</div>
        <div class="sb-p-2 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-2: 0.5rem</div>
        <div class="sb-p-3 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-3: 1rem</div>
        <div class="sb-p-4 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-4: 1.5rem</div>
        <div class="sb-p-6 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">p-6: 2rem</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_spacing_pxy(request):
    """Preview for px/py padding."""
    html = '''
    <div class="sb-flex sb-flex-column sb-gap-2">
        <div class="sb-px-6 sb-py-1 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">px-6 py-1: Wide horizontal</div>
        <div class="sb-px-1 sb-py-4 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">px-1 py-4: Tall vertical</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_spacing_psides(request):
    """Preview for padding individual sides."""
    html = '''
    <div class="sb-flex sb-flex-column sb-gap-2">
        <div class="sb-pt-4 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">pt-4: Padding top</div>
        <div class="sb-pr-6 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">pr-6: Padding right</div>
        <div class="sb-pb-4 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">pb-4: Padding bottom</div>
        <div class="sb-pl-6 sb-bg-surface sb-text-text sb-border-2 sb-border-neutral">pl-6: Padding left</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_spacing_m(request):
    """Preview for margin (all sides)."""
    html = '''
    <div class="sb-flex sb-flex-column sb-gap-2">
        <div class="sb-bg-neutral-5 sb-p-1">
            <div class="sb-m-0 sb-bg-surface sb-text-text sb-p-2">m-0 inside container</div>
        </div>
        <div class="sb-bg-neutral-5 sb-p-1">
            <div class="sb-m-2 sb-bg-surface sb-text-text sb-p-2">m-2 inside container</div>
        </div>
        <div class="sb-bg-neutral-5 sb-p-1">
            <div class="sb-m-4 sb-bg-surface sb-text-text sb-p-2">m-4 inside container</div>
        </div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_spacing_mb(request):
    """Preview for margin-bottom."""
    html = '''
    <div>
        <div class="sb-bg-surface sb-text-text sb-p-3 sb-mb-2 sb-border-2 sb-border-neutral">mb-2: Small gap below</div>
        <div class="sb-bg-surface sb-text-text sb-p-3 sb-mb-4 sb-border-2 sb-border-neutral">mb-4: Medium gap below</div>
        <div class="sb-bg-surface sb-text-text sb-p-3 sb-mb-8 sb-border-2 sb-border-neutral">mb-8: Large gap below</div>
        <div class="sb-bg-surface sb-text-text sb-p-3 sb-border-2 sb-border-neutral">Next element after gaps</div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def style_preview_spacing_gap(request):
    """Preview for gap utilities."""
    html = '''
    <div class="sb-flex sb-flex-column sb-gap-4">
        <div>
            <div class="sb-text-text-secondary sb-mb-1">gap-2:</div>
            <div class="sb-flex sb-gap-2">
                <div class="sb-bg-primary sb-text-text sb-p-3">A</div>
                <div class="sb-bg-primary sb-text-text sb-p-3">B</div>
                <div class="sb-bg-primary sb-text-text sb-p-3">C</div>
            </div>
        </div>
        <div>
            <div class="sb-text-text-secondary sb-mb-1">gap-4:</div>
            <div class="sb-flex sb-gap-4">
                <div class="sb-bg-primary sb-text-text sb-p-3">A</div>
                <div class="sb-bg-primary sb-text-text sb-p-3">B</div>
                <div class="sb-bg-primary sb-text-text sb-p-3">C</div>
            </div>
        </div>
        <div>
            <div class="sb-text-text-secondary sb-mb-1">gap-8:</div>
            <div class="sb-flex sb-gap-8">
                <div class="sb-bg-primary sb-text-text sb-p-3">A</div>
                <div class="sb-bg-primary sb-text-text sb-p-3">B</div>
                <div class="sb-bg-primary sb-text-text sb-p-3">C</div>
            </div>
        </div>
    </div>
    '''
    return HttpResponse(html, content_type='text/html')
