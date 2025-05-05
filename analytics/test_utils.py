# analytics/tests/test_utils.py

from django.test import SimpleTestCase

from .utils import validate_url, FORBIDDEN_SUBSTRINGS, MAX_URL_LENGTH

class ValidateUrlTests(SimpleTestCase):
    """Tests for the analytics.utils.validate_url function."""

    def test_valid_urls(self):
        """Test URLs that should be considered valid for tracking."""
        valid_paths = [
            '/',
            '/a-simple-page/',
            '/articles/my-first-article/',
            '/products/12345/',
            '/search?q=testing',
            '/path/with/multiple/segments/',
            '/page.html', # Assuming .html isn't forbidden
            '/contact-us',
            '/about/',
            '/items/item-with-hyphens_and_underscores/',
            '/document.pdf', # Assuming .pdf isn't forbidden
        ]
        for url in valid_paths:
            with self.subTest(url=url): # SubTests show individual failures
                self.assertTrue(validate_url(url), f"URL '{url}' should be valid.")

    def test_invalid_input_types_and_empty(self):
        """Test invalid input types and empty values."""
        invalid_inputs = [
            None,
            '',
            123,
            ['/list/'],
            {'url': '/dict/'},
        ]
        for item in invalid_inputs:
             with self.subTest(item=item):
                self.assertFalse(validate_url(item), f"Input '{item}' should be invalid.")

    def test_forbidden_substrings(self):
        """Test URLs containing forbidden substrings."""
        # Sample a few forbidden substrings to create test URLs
        test_cases = [
            '/wp-admin/edit.php',
            '/path/to/wp-includes/js/script.js',
            '/xmlrpc.php',
            '/get/etc/passwd',
            '/some/path/with/.git/config',
            '/phpmyadmin/',
            '/api/../sensitive_data', # Path traversal attempt
            '/exploit?cmd=eval(base64_decode(...))',
            '/page-with-<script>-alert',
            '/%3cscript%3ealert(1)%3c/script%3e', # URL encoded script tag
            '/remote/fgt_lang?lang=/../../../..//////////dev/',
            '/autodiscover/autodiscover.xml',
            '/a//b/c', # Double slash
            '/test-joomla-component',
            '/check_drupal_version',
            '/magento_setup',
            '/path/.env',
            '/check/.ssh/id_rsa',
            '/adminer.php?db=test',
        ]
        for url in test_cases:
            with self.subTest(url=url):
                # Check if the logic correctly identifies a known forbidden substring
                # This also implicitly tests case-insensitivity due to normalization
                self.assertFalse(validate_url(url), f"URL '{url}' contains a forbidden substring.")

        # Explicitly test case insensitivity for substrings
        self.assertFalse(validate_url('/path/WP-ADMIN/'), "Uppercase substring WP-ADMIN failed.")
        self.assertFalse(validate_url('/path/with/PHPMyAdmin/'), "Mixed case substring PHPMyAdmin failed.")

    def test_forbidden_extensions(self):
        """Test URLs ending with forbidden extensions."""
        # Sample a few extensions
        test_cases = [
            '/config/database.php',
            '/backup/site_backup.sql',
            '/sensitive.key',
            '/archive.zip',
            '/old_config.yml',
            '/logs/app.log',
            '/uploads/image.jpg', # Common image should fail if listed
            '/static/style.css', # Common static should fail if listed
            '/api/users.json',
            '/admin/data.xml',
            '/hidden/.env',
            '/script.sh',
            '/private.pem',
        ]
        for url in test_cases:
             with self.subTest(url=url):
                self.assertFalse(validate_url(url), f"URL '{url}' has a forbidden extension.")

        # Test case insensitivity for extensions
        self.assertFalse(validate_url('/config.PHP'), "Uppercase extension PHP failed.")
        self.assertFalse(validate_url('/image.JPG'), "Uppercase extension JPG failed.")
        self.assertFalse(validate_url('/style.CSS'), "Uppercase extension CSS failed.")

        # Test URLs that contain but don't end with forbidden extensions
        self.assertTrue(validate_url('/path/info.php.page/'), "URL containing .php but not ending should be valid.")
        self.assertTrue(validate_url('/path/image.jpg.details/'), "URL containing .jpg but not ending should be valid.")
        # However, if '.php/' or similar is a forbidden *substring*, it would fail there.

    def test_url_length_limit(self):
        """Test URLs near and over the maximum length limit."""
        base = '/a'
        # Test just under the limit
        just_under = base * (MAX_URL_LENGTH // 3 - 1) + '/page'
        self.assertTrue(len(just_under) < MAX_URL_LENGTH)
        self.assertTrue(validate_url(just_under), "URL just under length limit should be valid.")

        # Test exactly at the limit
        # Note: Creating exact length can be tricky, adjust multiplier as needed
        multiplier = (MAX_URL_LENGTH - 1) // 2 # -1 for the starting '/'
        at_limit = '/' + 'a' * (MAX_URL_LENGTH - 1)
        # If MAX_URL_LENGTH is odd, need precise calculation
        at_limit_precise = '/a' * (MAX_URL_LENGTH // 2)
        at_limit_precise = at_limit_precise[:MAX_URL_LENGTH] # Ensure exact length

        # Let's create one guaranteed to be exactly MAX_URL_LENGTH
        url_at_limit = '/' + 'x' * (MAX_URL_LENGTH - 1)
        self.assertEqual(len(url_at_limit), MAX_URL_LENGTH)
        self.assertTrue(validate_url(url_at_limit), "URL exactly at length limit should be valid.")


        # Test just over the limit
        just_over = '/' + 'x' * MAX_URL_LENGTH # Length is MAX_URL_LENGTH + 1
        self.assertTrue(len(just_over) > MAX_URL_LENGTH)
        self.assertFalse(validate_url(just_over), "URL just over length limit should be invalid.")

    def test_urls_containing_substrings_but_allowed(self):
        """Test URLs that contain parts of forbidden words but are valid."""
        # Examples assume 'wp-admin' is forbidden but 'wordpress' is not,
        # and '.php' is forbidden but 'php' is not forbidden as a substring alone.
        allowed_urls = [
            '/about-wordpress-themes/', # Contains 'wordpress' but not 'wp-admin' etc.
            '/learn/php-basics/', # Contains 'php' but doesn't end with .php
            '/graphic-design/', # Contains 'php' if 'php' itself isn't forbidden substring
        ]
        for url in allowed_urls:
             with self.subTest(url=url):
                 # We need to be careful here. If 'php' IS a forbidden substring,
                 # '/learn/php-basics/' would fail. We assume it isn't for this test.
                 # This test depends heavily on the exact contents of FORBIDDEN_SUBSTRINGS.
                 if 'php' not in FORBIDDEN_SUBSTRINGS:
                    self.assertTrue(validate_url(url), f"URL '{url}' should be allowed.")
                 # Add similar checks for other potentially ambiguous cases based on your lists.