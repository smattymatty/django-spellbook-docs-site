import random
import json
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5) # Simulate user think time (1-5 seconds)

    # List of URLs users might visit
    trackable_urls = [
        '/',
        '/docs/Commands/spellbook_md/',
        '/docs/Markdown/quick-start/',
        '/examples/introduction/',
        '/docs/introduction/',
        '/changelog/introduction/'
        
        # Add more representative URLs
    ]

    # Maybe some URLs that trigger specific logic or exclusions
    # excluded_urls = ['/admin/', '/robots.txt']

    @task(10) # Higher weight = more frequent task
    def visit_trackable_page(self):
        """Simulate user visiting a page that should be tracked."""
        url = random.choice(self.trackable_urls)
        # Simulate different user agents
        user_agent = random.choice([
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', # Include bots?
        ])
        self.client.get(url, headers={'User-Agent': user_agent}, name=f"{url.split('?')[0]}_tracked") # Use name for grouping in Locust UI

    @task(5)
    def visit_home(self):
        """Specifically visit the home page."""
        self.client.get("", name="/_home")

    # Add tasks for other scenarios if needed (e.g., visiting excluded paths)
    # @task(1)
    # def visit_excluded(self):
    #     url = random.choice(self.excluded_urls)
    #     self.client.get(url, name="/_excluded")

    # Add tasks simulating POST requests or authenticated users if relevant
    # def on_start(self):
    #     # Code to run when a Locust user starts (e.g., login)
    #     pass
    
    
class HackerUser(HttpUser):
    wait_time = between(5, 25) # Simulate user think time (1-5 seconds)
    
    invalid_urls = [
            '/wp-admin/options-general.php',
            '/path/to/wp-includes/js/common.js',
            '/xmlrpc.php',
            '/etc/passwd',
            '/some/path/with/.git/config',
            '/phpmyadmin/',
            '/api/../sensitive_data',
            '/exploit?cmd=eval(base64_decode(...))',
            '/page-with-<script>-alert',
            '/%3cscript%3ealert(1)%3c/script%3e',
            '/remote/fgt_lang?lang=/etc/passwd',
            '/autodiscover/autodiscover.xml',
            '/a//b/c',
        ]
    
    @task(10)
    def visit_invalid_url(self):
        """Simulate user visiting an invalid URL."""
        url = random.choice(self.invalid_urls)
        self.client.get(url, name=f"{url.split('?')[0]}_invalid")
        
        
class APIUser(HttpUser):
    wait_time = between(1, 3) # API calls are often quicker

    # Store created IDs to test GET/PUT/DELETE on existing resources
    created_markdown_ids = []

    def on_start(self):
        """
        Optional: could be used for authentication if your API requires it.
        For now, assuming AllowAny or token is handled if needed.
        """
        pass

    @task(5) # Higher weight for creating content
    def create_markdown(self):
        title = f"API Test Title {random.randint(1, 10000)}"
        markdown_body = f"# {title}\n\nThis is **Markdown** content created by an APIUser.\n\n{random.randint(1, 10000)}"
        
        payload = {
            "title": title,
            "markdown_content": markdown_body
        }
        
        with self.client.post("/api/v1/stored-markdown/",
                               json=payload, # Locust's HttpUser client handles json parameter
                               name="/api/v1/stored-markdown/ (POST Create)",
                               catch_response=True) as response:
            if response.ok: # Checks for 2xx status codes
                try:
                    response_data = response.json()
                    if 'id' in response_data:
                        self.created_markdown_ids.append(response_data['id'])
                        response.success() # Mark as success
                    else:
                        response.failure(f"ID missing in successful POST response: {response.text}")
                except json.JSONDecodeError:
                    response.failure(f"Failed to decode JSON from successful POST: {response.text}")
            else:
                response.failure(f"Failed to create markdown: {response.status_code} - {response.text}")


    @task(10) # Higher weight for reading content
    def list_markdown(self):
        self.client.get("/api/v1/stored-markdown/", name="/api/v1/stored-markdown/ (GET List)")

    @task(3)
    def get_markdown_detail(self):
        if not self.created_markdown_ids:
            # If no IDs, perhaps fetch one from the list endpoint first or skip
            # For simplicity, we'll just list if no IDs created by this user yet
            self.list_markdown()
            return

        markdown_id = random.choice(self.created_markdown_ids)
        self.client.get(f"/api/v1/stored-markdown/{markdown_id}/", name="/api/v1/stored-markdown/{id} (GET Detail)")

    @task(1)
    def get_rendered_html_page(self):
        if not self.created_markdown_ids:
            self.list_markdown() # Fallback if no specific ID to test
            return

        markdown_id = random.choice(self.created_markdown_ids)
        # This endpoint serves an HTML page, not JSON by default, but Locust will still fetch it.
        self.client.get(f"/api/v1/rendered-markdown/{markdown_id}/", name="/api/v1/rendered-markdown/{id} (GET HTML Page)")


    @task(2)
    def update_markdown(self):
        if not self.created_markdown_ids:
            return # Cannot update if nothing created by this user

        markdown_id = random.choice(self.created_markdown_ids)
        updated_title = f"Updated Title {random.randint(10001, 20000)}"
        updated_markdown_body = f"# {updated_title}\n\nContent has been updated by APIUser at {random.random()}."
        
        payload = {
            "title": updated_title,
            "markdown_content": updated_markdown_body
        }
        self.client.put(f"/api/v1/stored-markdown/{markdown_id}/",
                        json=payload,
                        name="/api/v1/stored-markdown/{id} (PUT Update)")

    @task(1)
    def delete_markdown(self):
        if not self.created_markdown_ids:
            return # Cannot delete if nothing created

        markdown_id = self.created_markdown_ids.pop(random.randrange(len(self.created_markdown_ids)))
        self.client.delete(f"/api/v1/stored-markdown/{markdown_id}/",
                           name="/api/v1/stored-markdown/{id} (DELETE)")

    # You could also add a task for your original /api/v1/parse-markdown/ endpoint
    # if you decide to keep it for transient parsing.
    @task(2)
    def parse_transient_markdown(self):
        markdown_to_parse = "## Transient Test\n\n* Item 1\n* Item 2\n\n{~ alert type=\"info\" ~}This is a transient parse.{ ~~}"
        payload = {"markdown": markdown_to_parse}
        self.client.post("/api/v1/parse-markdown/", # Assuming this is the path for your original parser
                         json=payload,
                         name="/api/v1/parse-markdown/ (POST Transient)")
        
        
class SecurityTestAPIUser(HttpUser):
    wait_time = between(2, 10)

    @task(10)
    def post_malformed_json(self):
        # Sending data that is not valid JSON to an endpoint expecting JSON
        malformed_payloads = [
            "{'title': 'Bad Quotes', 'markdown_content': 'Test'}", # Single quotes instead of double
            '{"title": "Missing Comma" "markdown_content": "Test"}',
            '{"title": "Trailing Comma", "markdown_content": "Test",}',
            'This is not JSON at all',
        ]
        payload = random.choice(malformed_payloads)
        self.client.post("/api/v1/stored-markdown/",
                         data=payload, # Send as raw data
                         headers={'Content-Type': 'application/json'}, # Still claim it's JSON
                         name="/api/v1/stored-markdown/ (POST Malformed JSON)",
                         catch_response=True) # Important to check response status

    @task(10)
    def post_unexpected_fields(self):
        payload = {
            "title": "Unexpected Fields Test",
            "markdown_content": "Valid markdown.",
            "unexpected_field": "some_value",
            "is_admin": True # Trying to inject a field that shouldn't be settable
        }
        self.client.post("/api/v1/stored-markdown/",
                         json=payload,
                         name="/api/v1/stored-markdown/ (POST Unexpected Fields)")

    @task(10)
    def post_missing_required_fields(self):
        # Your serializer currently doesn't strictly require 'markdown_content' if blank is allowed
        # But if 'markdown_content' was required (null=False, blank=False in model & not read_only in serializer for create)
        payload = {
            "title": "Missing Markdown Content"
            # "markdown_content": "" is omitted
        }
        # This test depends on your model/serializer validation rules.
        # If markdown_content can be blank/null, this might be a valid request.
        # If it's required, this should fail validation.
        self.client.post("/api/v1/stored-markdown/",
                         json=payload,
                         name="/api/v1/stored-markdown/ (POST Missing Required Fields)")


    @task(15)
    def post_markdown_with_potential_xss(self):
        # Test how the server-side sanitization (bleach) handles these.
        # The goal is that the *stored* html_content should be safe.
        xss_payloads = [
            "# XSS Test\n\n<script>alert('XSS Attempt 1');</script>",
            "## Another XSS\n\n<img src=x onerror=alert('XSS Attempt 2')>",
            "[Click Me](javascript:alert('XSS Attempt 3'))", # Markdown link XSS
            "{~ hero layout=\"text_only_centered\" text_color=\"<script>alert(\'XSS in spell param\')</script>\" ~}Content{~~}"
        ]
        payload = {
            "title": f"XSS Test Payload {random.randint(1,100)}",
            "markdown_content": random.choice(xss_payloads)
        }
        self.client.post("/api/v1/stored-markdown/",
                         json=payload,
                         name="/api/v1/stored-markdown/ (POST XSS Payloads)")

    @task(5)
    def attempt_path_traversal_or_sqli_like_in_pk(self):
        # These should result in 404s or validation errors, not 500s or unexpected behavior.
        # Your URL patterns use <int:pk>, so non-integers will cause a 404 before view.
        # But good to have a task that hits these patterns.
        potentially_bad_pks = [
            "1/../../etc/passwd",
            "1%20OR%201=1",
            "' OR '1'='1",
            "SELECT_column_FROM_users" # this won't match <int:pk>
        ]
        pk_attempt = random.choice(potentially_bad_pks)
        # This will likely 404 due to Django's URL routing for <int:pk> if pk_attempt is not an int.
        # If it somehow bypassed, it's a deeper issue.
        self.client.get(f"/api/v1/stored-markdown/{pk_attempt}/",
                        name="/api/v1/stored-markdown/{bad_pk} (GET)")


    @task(5)
    def oversized_payload(self):
        # Test how your server handles very large inputs if you have limits.
        # Django/webserver might have default limits.
        large_markdown = "# Large Content\n" + ("This is a very long line of text. " * 10000) # ~2MB
        payload = {
            "title": "Oversized Payload Test",
            "markdown_content": large_markdown
        }
        self.client.post("/api/v1/stored-markdown/",
                         json=payload,
                         name="/api/v1/stored-markdown/ (POST Oversized Payload)",
                         catch_response=True) # Catch to see if it's a 413 Payload Too Large or similar


    # Add other tasks:
    # - Sending incorrect data types for fields (e.g., number for title)
    # - Testing other HTTP methods on endpoints that don't support them (e.g., PUT on list view if not supported)