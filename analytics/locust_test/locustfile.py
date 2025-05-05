import random
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