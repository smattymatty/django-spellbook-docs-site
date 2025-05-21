# api/tests/test_views.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase # Good for testing DRF views
from django.conf import settings # To access MAX_API_REQUEST_SIZE
import json

from ..models import StoredMarkdown # Or from api.models import StoredMarkdown

# Make sure to create an __init__.py in your tests directory if it's a package:
# api/tests/__init__.py

class StoredMarkdownAPITests(APITestCase):
    def setUp(self):
        """
        Set up initial data for tests.
        """
        self.list_create_url = reverse('storedmarkdown-list-create') # From your api/urls.py name
        self.test_data_1 = {
            "title": "Test Markdown 1",
            "markdown_content": "# Title 1\n\nContent for item 1."
        }
        self.stored_item_1 = StoredMarkdown.objects.create(
            title="Existing Item 1",
            markdown_content="## Existing\n\nSome markdown here."
        )
        self.detail_url_1 = reverse('storedmarkdown-detail', kwargs={'pk': self.stored_item_1.pk})
        self.rendered_url_1 = reverse('renderedmarkdown-detail', kwargs={'pk': self.stored_item_1.pk})

    def test_create_stored_markdown_valid(self):
        """
        Ensure we can create a new StoredMarkdown object.
        """
        response = self.client.post(self.list_create_url, self.test_data_1, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(StoredMarkdown.objects.count(), 2) # One from setUp, one created
        created_item = StoredMarkdown.objects.get(title=self.test_data_1["title"])
        self.assertEqual(created_item.markdown_content, self.test_data_1["markdown_content"])
        self.assertIn("<h1", created_item.html_content) # Check if HTML was generated

    def test_create_stored_markdown_invalid_missing_content(self):
        """
        Ensure creating with missing required fields fails (if markdown_content is required).
        Note: Your model allows blank markdown_content, so this might pass validation
        unless your serializer makes it required.
        """
        invalid_data = {"title": "Only Title"}
        response = self.client.post(self.list_create_url, invalid_data, format='json')
        # If markdown_content is truly optional, this might be 201.
        # If serializer enforces it, it should be 400.
        # Let's assume serializer makes it effectively required for meaningful content:
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('markdown_content', response.data)


    def test_list_stored_markdown(self):
        """
        Ensure we can list StoredMarkdown objects.
        """
        # Create another item for the list
        StoredMarkdown.objects.create(title="Another Item", markdown_content="# Another")
        response = self.client.get(self.list_create_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) # Check based on items created
        self.assertEqual(response.data[0]['title'], "Another Item") # Assuming default ordering by -updated_at
        self.assertEqual(response.data[1]['title'], self.stored_item_1.title)


    def test_retrieve_stored_markdown_detail(self):
        """
        Ensure we can retrieve a specific StoredMarkdown object.
        """
        response = self.client.get(self.detail_url_1, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.stored_item_1.pk)
        self.assertEqual(response.data['title'], self.stored_item_1.title)
        self.assertIn('api_url', response.data) # If using HyperlinkedModelSerializer
        self.assertIn('rendered_html_page_url', response.data)

    def test_retrieve_stored_markdown_detail_not_found(self):
        """
        Ensure retrieving a non-existent object returns 404.
        """
        non_existent_pk = self.stored_item_1.pk + 100
        url = reverse('storedmarkdown-detail', kwargs={'pk': non_existent_pk})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_stored_markdown(self):
        """
        Ensure we can update an existing StoredMarkdown object.
        """
        updated_data = {
            "title": "Updated Title for Item 1",
            "markdown_content": "## Updated Content\n\nNow it's different!"
        }
        response = self.client.put(self.detail_url_1, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.stored_item_1.refresh_from_db()
        self.assertEqual(self.stored_item_1.title, updated_data["title"])
        self.assertEqual(self.stored_item_1.markdown_content, updated_data["markdown_content"])
        self.assertIn("<h2", self.stored_item_1.html_content) # Check if HTML was re-generated

    def test_delete_stored_markdown(self):
        """
        Ensure we can delete a StoredMarkdown object.
        """
        initial_count = StoredMarkdown.objects.count()
        response = self.client.delete(self.detail_url_1, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(StoredMarkdown.objects.count(), initial_count - 1)
        with self.assertRaises(StoredMarkdown.DoesNotExist):
            StoredMarkdown.objects.get(pk=self.stored_item_1.pk)

    def test_get_rendered_html_page(self):
        """
        Test the endpoint that serves the pre-rendered HTML within a base template.
        """
        response = self.client.get(self.rendered_url_1) # No format='json' as it returns HTML
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.get('Content-Type'), 'text/html; charset=utf-8')
        self.assertContains(response, self.stored_item_1.html_content, html=True)        # Or more specifically if html_content is just a fragment:
        # self.assertContains(response, "<h2 id=\"existing\">Existing</h2>")
        # Check for elements from your api/sb_base.html template
        self.assertContains(response, '<link rel="stylesheet" href="/static/django_spellbook/root.css">\n<link rel="stylesheet" href="/static/django_spellbook/utilities.css">\n<link rel="stylesheet" href="/static/django_spellbook/styles.css">') # Example from a base template

    def test_post_payload_too_large(self):
        """
        Test that posting a payload larger than the configured limit
        results in an appropriate error (400 or 413).
        """
        # This test relies on either your custom `check_request_size` method in the view
        # being triggered by Content-Length, or Django's `DATA_UPLOAD_MAX_MEMORY_SIZE`
        # causing an issue during parsing if Content-Length check is bypassed/different.

        # Define a small limit for MAX_API_REQUEST_SIZE specifically for this test via settings override
        # Also override DATA_UPLOAD_MAX_MEMORY_SIZE to be small for Django's internal check
        # Let's make MAX_API_REQUEST_SIZE the primary one our view will check against.
        test_max_api_size = 100  # bytes for our view's Content-Length check
        test_data_upload_max_memory_size = 100 # bytes for Django's internal check

        with self.settings(MAX_API_REQUEST_SIZE=test_max_api_size, 
                           DATA_UPLOAD_MAX_MEMORY_SIZE=test_data_upload_max_memory_size):
            
            payload_title = "Testing Small Limit"
            # Construct markdown content that, when part of JSON, will exceed test_max_api_size
            # JSON overhead: {"title":"","markdown_content":""} is ~40 chars.
            # If test_max_api_size = 100, then markdown_content can be around 100 - 40 - len(payload_title) chars.
            # Let's aim for markdown_content to be significantly larger than the remaining budget.
            markdown_chars_to_exceed_limit = test_max_api_size # Make it clearly exceed
            
            small_limit_payload = {
                "title": payload_title,
                "markdown_content": "A" * markdown_chars_to_exceed_limit 
            }

            # Calculate the expected size of the JSON payload
            # This is what the Content-Length header *should* be.
            serialized_payload = json.dumps(small_limit_payload)
            expected_payload_size_bytes = len(serialized_payload.encode('utf-8'))

            print(f"\n[TEST_INFO] Test: test_post_payload_too_large")
            print(f"[TEST_INFO] Overridden MAX_API_REQUEST_SIZE (for view check): {test_max_api_size} bytes")
            print(f"[TEST_INFO] Overridden DATA_UPLOAD_MAX_MEMORY_SIZE (for Django check): {test_data_upload_max_memory_size} bytes")
            print(f"[TEST_INFO] Expected serialized payload size: {expected_payload_size_bytes} bytes")
            print(f"[TEST_INFO] Payload being sent: {small_limit_payload}")

            # Make the POST request
            response = self.client.post(self.list_create_url, small_limit_payload, format='json')

            # The test client's response.request is a dictionary mirroring the WSGI environ
            # that was used to make the request to the WSGI handler.
            # It might not always perfectly reflect what a real HTTP client sends
            # or what a web server like Nginx passes on, but it's useful for DRF tests.
            # The test client usually sets CONTENT_LENGTH based on the data.
            request_environ = response.request if hasattr(response, 'request') else {}
            actual_content_length_header = request_environ.get('CONTENT_LENGTH', 'Not set by test client')
            
            print(f"[TEST_INFO] Response Status Code: {response.status_code}")
            print(f"[TEST_INFO] Actual CONTENT_LENGTH header received by WSGI app (from response.request): {actual_content_length_header}")
            if response.status_code >= 400:
                print(f"[TEST_INFO] Response Data (Error): {response.data}")


            # Assertions:
            # Your view's check_request_size should catch this based on Content-Length
            # and raise PayloadTooLarge, resulting in HTTP_413_REQUEST_ENTITY_TOO_LARGE.
            # If that check isn't hit or Content-Length isn't what we expect,
            # Django's DATA_UPLOAD_MAX_MEMORY_SIZE might trigger RequestDataTooBig,
            # which DRF often converts to a 400 (ParseError).
            self.assertIn(
                response.status_code,
                [status.HTTP_400_BAD_REQUEST, status.HTTP_413_REQUEST_ENTITY_TOO_LARGE],
                f"Expected 400 or 413, but got {response.status_code}. Response: {response.data if hasattr(response, 'data') else 'No data attribute'}"
            )
            
            # If you specifically expect 413 due to your check_request_size:
            if expected_payload_size_bytes > test_max_api_size:
                 self.assertEqual(response.status_code, status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, 
                                 f"Expected 413 due to Content-Length check. Got {response.status_code}. Details: {response.data if hasattr(response, 'data') else 'N/A'}")



    def test_markdown_content_sanitization_xss(self):
        """
        Test that potentially malicious markdown is sanitized.
        This relies on the model's save() method correctly using bleach.
        """
        xss_markdown = "# Test XSS\n\n<script>alert('XSS');</script>"
        payload = {
            "title": "XSS Attempt",
            "markdown_content": xss_markdown
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        created_item = StoredMarkdown.objects.get(pk=response.data['id'])
        self.assertNotIn("<script>", created_item.html_content.lower())
        self.assertNotIn("<p>alert('xss')</p>", created_item.html_content.lower()) # Check content also, just in case
        self.assertIn("<h1", created_item.html_content) # Ensure legitimate markdown is still processed