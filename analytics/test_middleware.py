# analytics/tests/test_middleware.py

from datetime import date
from unittest.mock import patch

from django.test import TestCase, RequestFactory, override_settings
from django.test import Client # Use the test client for full request simulation
from django.contrib.auth import get_user_model
from django.utils import timezone

from datetime import date, timedelta

# Import the models to check DB state
from .models import PageView, DailyPageViewCount, UniqueVisitor


User = get_user_model()

# Define some common paths/data used in tests
TRACKABLE_PATH = '/a-trackable-page/'
EXCLUDED_PATH = '/robots.txt'
EXCLUDED_PREFIX_PATH = '/admin/some-model/'
AJAX_PATH = '/ajax/update/'


class PageViewMiddlewareTests(TestCase):

    def setUp(self):
        """Runs before each test method."""
        self.client = Client() # Client simulates full requests through middleware stack
        # You might need RequestFactory if testing helper methods directly
        self.factory = RequestFactory()
        # Create a user for authentication tests
        self.user = User.objects.create_user(username='testuser', password='password')
        # Clear models just in case (though TestCase should handle transactions)
        PageView.objects.all().delete()
        DailyPageViewCount.objects.all().delete()
        UniqueVisitor.objects.all().delete()

    # --- Test Exclusion Logic ---

    def test_middleware_excluded_exact_path(self):
        """Middleware should not track explicitly excluded paths."""
        response = self.client.get(EXCLUDED_PATH)
        self.assertEqual(response.status_code, 404) # Assuming no view exists
        self.assertEqual(PageView.objects.count(), 0)
        self.assertEqual(DailyPageViewCount.objects.count(), 0)
        self.assertEqual(UniqueVisitor.objects.count(), 0)

    @override_settings(ANALYTICS_EXCLUDED_PATHS=['/custom/exclude/'])
    def test_middleware_excluded_exact_path_from_settings(self):
        """Middleware should not track paths excluded via settings."""
        response = self.client.get('/custom/exclude/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(PageView.objects.count(), 0)

    def test_middleware_excluded_prefix_path(self):
        """Middleware should not track paths matching default excluded prefixes."""
        response = self.client.get(EXCLUDED_PREFIX_PATH)
        self.assertEqual(response.status_code, 404) # Assuming no admin view is set up
        self.assertEqual(PageView.objects.count(), 0)

    @override_settings(ANALYTICS_EXCLUDED_PREFIXES=['/api/v1/'])
    def test_middleware_excluded_prefix_path_from_settings(self):
        """Middleware should not track paths matching prefixes excluded via settings."""
        response = self.client.get('/api/v1/users/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(PageView.objects.count(), 0)

    @override_settings(ANALYTICS_TRACK_AUTHENTICATED_USERS=False)
    def test_middleware_excluded_authenticated_user(self):
        """Middleware should not track logged-in users if setting is False."""
        self.client.login(username='testuser', password='password')
        response = self.client.get(TRACKABLE_PATH)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(PageView.objects.count(), 0)
        self.assertEqual(UniqueVisitor.objects.count(), 0)

    @override_settings(ANALYTICS_IGNORE_AJAX=True)
    def test_middleware_excluded_ajax_request(self):
        """Middleware should ignore AJAX requests if setting is True."""
        response = self.client.get(AJAX_PATH, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(PageView.objects.count(), 0)

    # Mock the utility function directly using patch
    @override_settings(ANALYTICS_VALIDATE_URL=True)
    @patch('analytics.utils.validate_url', return_value=False)
    def test_middleware_excluded_invalid_url(self, mock_validate_url):
        """Middleware should not track if URL validation fails."""
        response = self.client.get('/invalid/../path/?q=!') # Example invalid-like path
        self.assertEqual(response.status_code, 404)
        self.assertEqual(PageView.objects.count(), 0)
        mock_validate_url.assert_called_once_with('/invalid/../path/?q=!') # Check mock was called

    # --- Test Tracking Logic ---

    def test_middleware_tracks_normal_request(self):
        """Middleware should create all relevant records for a standard request."""
        response = self.client.get(TRACKABLE_PATH, HTTP_USER_AGENT='TestAgent/1.0')
        self.assertEqual(response.status_code, 404) # No view needed for middleware test

        # Check PageView
        self.assertEqual(PageView.objects.count(), 1)
        pv = PageView.objects.first()
        self.assertEqual(pv.url, TRACKABLE_PATH)
        self.assertEqual(pv.ip_address, '127.0.0.1') # Default test client IP
        self.assertEqual(pv.user_agent, 'TestAgent/1.0')

        # Check DailyPageViewCount
        self.assertEqual(DailyPageViewCount.objects.count(), 1)
        dpc = DailyPageViewCount.objects.first()
        self.assertEqual(dpc.url, TRACKABLE_PATH)
        self.assertEqual(dpc.date, date.today())
        self.assertEqual(dpc.count, 1)

        # Check UniqueVisitor
        self.assertEqual(UniqueVisitor.objects.count(), 1)
        uv = UniqueVisitor.objects.first()
        self.assertEqual(uv.ip_address, '127.0.0.1')
        self.assertEqual(uv.user_agent, 'TestAgent/1.0')
        self.assertEqual(uv.visit_count, 1)
        self.assertFalse(uv.is_bot) # Check bot detection default

    def test_middleware_updates_counts_on_repeat_visit(self):
        """Middleware should increment counts for repeat visits on the same day."""
        # First visit
        self.client.get(TRACKABLE_PATH, HTTP_USER_AGENT='TestAgent/1.0', REMOTE_ADDR='198.51.100.1')
        # Second visit (same user/day/path)
        response = self.client.get(TRACKABLE_PATH, HTTP_USER_AGENT='TestAgent/1.0', REMOTE_ADDR='198.51.100.1')
        self.assertEqual(response.status_code, 404)

        # Check PageView (creates a new one each time)
        self.assertEqual(PageView.objects.count(), 2)

        # Check DailyPageViewCount (should update existing)
        self.assertEqual(DailyPageViewCount.objects.count(), 1)
        dpc = DailyPageViewCount.objects.get(url=TRACKABLE_PATH, date=date.today())
        self.assertEqual(dpc.count, 2)

        # Check UniqueVisitor (should update existing)
        self.assertEqual(UniqueVisitor.objects.count(), 1)
        uv = UniqueVisitor.objects.get(ip_address='198.51.100.1', user_agent='TestAgent/1.0')
        self.assertEqual(uv.visit_count, 2)
        self.assertTrue(timezone.now() - uv.last_visit < timedelta(seconds=5)) # last_visit updated

    @override_settings(ANALYTICS_TRACK_AUTHENTICATED_USERS=True)
    def test_middleware_tracks_authenticated_user_if_enabled(self):
        """Middleware should track logged-in users if setting is True."""
        self.client.login(username='testuser', password='password')
        response = self.client.get(TRACKABLE_PATH)
        self.assertEqual(response.status_code, 404)
        # Assert records ARE created
        self.assertEqual(PageView.objects.count(), 1)
        self.assertEqual(DailyPageViewCount.objects.count(), 1)
        self.assertEqual(UniqueVisitor.objects.count(), 1)

    @override_settings(ANALYTICS_IGNORE_AJAX=False)
    def test_middleware_tracks_ajax_if_enabled(self):
        """Middleware should track AJAX requests if setting is False."""
        response = self.client.get(AJAX_PATH, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 404)
        # Assert records ARE created
        self.assertEqual(PageView.objects.count(), 1)

    # --- Test IP Handling ---

    def test_ip_extraction_x_forwarded_for(self):
        """Middleware should prioritize X-Forwarded-For header."""
        ip = '10.0.0.1'
        response = self.client.get(TRACKABLE_PATH, HTTP_X_FORWARDED_FOR=f'{ip}, 192.168.1.1')
        self.assertEqual(PageView.objects.count(), 1)
        pv = PageView.objects.first()
        self.assertEqual(pv.ip_address, ip) # Should get the first IP
        uv = UniqueVisitor.objects.first()
        self.assertEqual(uv.ip_address, ip)

    def test_ip_extraction_remote_addr(self):
        """Middleware should use REMOTE_ADDR if X-Forwarded-For is absent."""
        ip = '198.51.100.5'
        response = self.client.get(TRACKABLE_PATH, REMOTE_ADDR=ip)
        self.assertEqual(PageView.objects.count(), 1)
        pv = PageView.objects.first()
        self.assertEqual(pv.ip_address, ip)
        uv = UniqueVisitor.objects.first()
        self.assertEqual(uv.ip_address, ip)

    @override_settings(ANALYTICS_ANONYMIZE_IP=True)
    def test_ip_anonymization_ipv4(self):
        """Test IPv4 anonymization."""
        ip = '198.51.100.50'
        expected_ip = '198.51.100.0'
        response = self.client.get(TRACKABLE_PATH, REMOTE_ADDR=ip)
        self.assertEqual(PageView.objects.count(), 1)
        pv = PageView.objects.first()
        self.assertEqual(pv.ip_address, expected_ip)
        uv = UniqueVisitor.objects.first()
        self.assertEqual(uv.ip_address, expected_ip)

    @override_settings(ANALYTICS_ANONYMIZE_IP=True)
    def test_ip_anonymization_ipv6(self):
        """Test IPv6 anonymization."""
        ip = '2001:db8:abcd:0012:ffff:ffff:ffff:ffff'
        expected_ip = '2001:db8:abcd:12::' # Simplified anonymization keeps first 4 segments
        response = self.client.get(TRACKABLE_PATH, REMOTE_ADDR=ip)
        self.assertEqual(PageView.objects.count(), 1)
        pv = PageView.objects.first()
        self.assertEqual(pv.ip_address, expected_ip)
        uv = UniqueVisitor.objects.first()
        self.assertEqual(uv.ip_address, expected_ip)

    @override_settings(ANALYTICS_ANONYMIZE_IP=False)
    def test_ip_no_anonymization(self):
        """Test IP is stored as is when anonymization is off."""
        ip = '198.51.100.75'
        response = self.client.get(TRACKABLE_PATH, REMOTE_ADDR=ip)
        self.assertEqual(PageView.objects.count(), 1)
        pv = PageView.objects.first()
        self.assertEqual(pv.ip_address, ip) # Original IP
        uv = UniqueVisitor.objects.first()
        self.assertEqual(uv.ip_address, ip)

    def test_ip_invalid_ip_stored_as_default(self):
        """Test that invalid IPs are stored as 0.0.0.0"""
        response = self.client.get(TRACKABLE_PATH, REMOTE_ADDR='INVALID_IP_STRING')
        self.assertEqual(PageView.objects.count(), 1)
        pv = PageView.objects.first()
        self.assertEqual(pv.ip_address, '0.0.0.0')
        uv = UniqueVisitor.objects.first()
        self.assertEqual(uv.ip_address, '0.0.0.0')

    # --- Test Bot Detection Integration ---
    def test_middleware_bot_detection(self):
        """Check if bot detection in UniqueVisitor works via middleware"""
        response = self.client.get(TRACKABLE_PATH, HTTP_USER_AGENT='Googlebot/2.1 Test')
        self.assertEqual(UniqueVisitor.objects.count(), 1)
        uv = UniqueVisitor.objects.first()
        self.assertTrue(uv.is_bot)
        
@override_settings(ANALYTICS_VALIDATE_URL=True) # Ensure validation is active for this class
class PageViewMiddlewareValidateUrlIntegrationTests(TestCase):
    """
    Integration tests for PageViewMiddleware ensuring it uses validate_url
    to block tracking of unwanted URLs (based on substrings/extensions).
    Does NOT mock validate_url.
    """

    def setUp(self):
        """Runs before each test method."""
        self.client = Client()
        # Clear models before each test
        PageView.objects.all().delete()
        DailyPageViewCount.objects.all().delete()
        UniqueVisitor.objects.all().delete()

    def test_integration_skips_forbidden_substrings(self):
        """
        Middleware should skip tracking URLs caught by validate_url's substring check.
        """
        # Use URLs based on FORBIDDEN_SUBSTRINGS in utils.py
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

        for url in invalid_urls:
            with self.subTest(url=url):
                response = self.client.get(url)
                # Check status code (likely 404), but main goal is DB check
                # self.assertEqual(response.status_code, 404)
                # Assert NO records were created
                self.assertEqual(PageView.objects.count(), 0, f"PageView created for substring URL: {url}")
                self.assertEqual(DailyPageViewCount.objects.count(), 0, f"DailyCount created for substring URL: {url}")
                self.assertEqual(UniqueVisitor.objects.count(), 0, f"UniqueVisitor created for substring URL: {url}")

    def test_integration_skips_forbidden_extensions(self):
        """
        Middleware should skip tracking URLs caught by validate_url's extension check.
        """
        # Use URLs based on FORBIDDEN_EXTENSIONS in utils.py
        invalid_urls = [
            '/config/database.php',
            '/backup/site_backup.sql',
            '/sensitive.key',
            '/archive.zip',
            '/old_config.yml',
            '/logs/app.log',
            '/uploads/image.jpg',
            '/static/style.css',
            '/api/users.json',
            '/admin/data.xml',
            '/hidden/.env',
            '/script.sh',
            '/private.pem',
            '/somefile.htpasswd',
            '/favicon.ico', # Also often explicitly excluded, but test extension rule
        ]

        for url in invalid_urls:
            with self.subTest(url=url):
                response = self.client.get(url)
                # Assert NO records were created
                self.assertEqual(PageView.objects.count(), 0, f"PageView created for extension URL: {url}")
                self.assertEqual(DailyPageViewCount.objects.count(), 0, f"DailyCount created for extension URL: {url}")
                self.assertEqual(UniqueVisitor.objects.count(), 0, f"UniqueVisitor created for extension URL: {url}")

    def test_integration_skips_long_urls(self):
        """
        Middleware should skip tracking URLs caught by validate_url's length check.
        """
        # Assumes MAX_URL_LENGTH is defined in utils and accessible (might need import)
        # Or just hardcode a length known to be > MAX_URL_LENGTH
        try:
            # Try importing MAX_URL_LENGTH for precision
            from .utils import MAX_URL_LENGTH
        except ImportError:
            # Fallback if MAX_URL_LENGTH isn't easily importable or defined
            MAX_URL_LENGTH = 512 # Use the value defined in utils.py

        long_url = '/' + 'a' * MAX_URL_LENGTH # This URL has length MAX_URL_LENGTH + 1

        response = self.client.get(long_url)
        # Assert NO records were created
        self.assertEqual(PageView.objects.count(), 0, f"PageView created for long URL")
        self.assertEqual(DailyPageViewCount.objects.count(), 0, f"DailyCount created for long URL")
        self.assertEqual(UniqueVisitor.objects.count(), 0, f"UniqueVisitor created for long URL")

    def test_integration_tracks_valid_urls_when_validation_active(self):
        """
        Ensure middleware STILL tracks normal URLs when validation setting is True.
        """
        valid_url = '/this/is/a/perfectly/valid/page/'
        response = self.client.get(valid_url)
        # Assert records WERE created
        self.assertEqual(PageView.objects.count(), 1, f"PageView not created for valid URL")
        self.assertEqual(DailyPageViewCount.objects.count(), 1, f"DailyCount not created for valid URL")
        self.assertEqual(UniqueVisitor.objects.count(), 1, f"UniqueVisitor not created for valid URL")
        # Check values if needed
        pv = PageView.objects.first()
        self.assertEqual(pv.url, valid_url)