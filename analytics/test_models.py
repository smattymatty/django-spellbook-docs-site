# analytics/tests.py

from django.test import TestCase, RequestFactory, override_settings
from django.utils import timezone
from django.db import IntegrityError # To test unique constraints
from django.core.cache import cache
from datetime import date, timedelta

import logging

# Import the models you want to test
from .models import PageView, DailyPageViewCount, UniqueVisitor
from .context_processors import analytics_context

logging.disable(logging.CRITICAL)

# This prevents cluttering test output
logging.disable(logging.CRITICAL)

class PageViewModelTests(TestCase):

    def test_pageview_creation_defaults(self):
        """
        Test creating a PageView instance and check default values.
        """
        url = "/test-page/"
        ip = "192.0.2.1"
        ua = "TestBrowser/1.0"

        pv = PageView.objects.create(
            url=url,
            ip_address=ip,
            user_agent=ua
        )

        # Basic checks
        self.assertEqual(pv.url, url)
        self.assertEqual(pv.ip_address, ip)
        self.assertEqual(pv.user_agent, ua)

        # Check timestamp is set automatically and is recent
        self.assertIsNotNone(pv.timestamp)
        # Ensure the timestamp is close to now (e.g., within the last 5 seconds)
        self.assertTrue(timezone.now() - pv.timestamp < timedelta(seconds=5))

    def test_pageview_str_representation(self):
        """
        Test the __str__ method of the PageView model.
        """
        url = "/another-page/"
        ip = "2001:db8::1" # IPv6 example
        timestamp_now = timezone.now()

        # Manually set timestamp for predictable __str__ output if needed,
        # but using the created one is fine for format check.
        pv = PageView.objects.create(
            url=url,
            ip_address=ip
            # timestamp will default to now
        )

        # Re-fetch timestamp from created object for comparison
        expected_str = f"{url} - {pv.timestamp}"
        self.assertEqual(str(pv), expected_str)

class DailyPageViewCountModelTests(TestCase):

    def test_daily_pageview_creation_defaults(self):
        """
        Test creating DailyPageViewCount and check default count.
        """
        url = "/home/"
        test_date = date(2025, 5, 5) # Use a specific date

        dpc = DailyPageViewCount.objects.create(
            url=url,
            date=test_date
            # count should default to 0
        )

        self.assertEqual(dpc.url, url)
        self.assertEqual(dpc.date, test_date)
        self.assertEqual(dpc.count, 0) # Verify default

    def test_daily_pageview_str_representation(self):
        """
        Test the __str__ method.
        """
        url = "/features/"
        test_date = date(2025, 5, 6)
        count = 15

        dpc = DailyPageViewCount.objects.create(
            url=url,
            date=test_date,
            count=count
        )

        expected_str = f"{url} - {test_date}: {count} views"
        self.assertEqual(str(dpc), expected_str)

    def test_daily_pageview_unique_together_constraint(self):
        """
        Test that url and date together must be unique.
        """
        url = "/pricing/"
        test_date = date(2025, 5, 7)

        # Create the first entry successfully
        DailyPageViewCount.objects.create(url=url, date=test_date, count=10)

        # Attempt to create a second entry with the same url and date
        # This block correctly expects and catches the IntegrityError
        with self.assertRaises(IntegrityError):
            DailyPageViewCount.objects.create(url=url, date=test_date, count=5)
        
# analytics/tests.py (continued)

class UniqueVisitorModelTests(TestCase):

    def test_unique_visitor_creation_defaults(self):
        """
        Test creating a UniqueVisitor and check default values.
        """
        ip = "192.0.2.100"
        ua = "AnotherTestBrowser/2.0"

        visitor = UniqueVisitor.objects.create(
            ip_address=ip,
            user_agent=ua
        )

        self.assertEqual(visitor.ip_address, ip)
        self.assertEqual(visitor.user_agent, ua)
        self.assertEqual(visitor.visit_count, 1) # Default
        self.assertFalse(visitor.is_bot)        # Default

        # Check timestamps are set and recent
        self.assertIsNotNone(visitor.first_visit)
        self.assertIsNotNone(visitor.last_visit)
        self.assertTrue(timezone.now() - visitor.first_visit < timedelta(seconds=5))
        self.assertTrue(timezone.now() - visitor.last_visit < timedelta(seconds=5))
        # Initially, first and last visit should be very close
        self.assertTrue(abs(visitor.last_visit - visitor.first_visit) < timedelta(seconds=1))


    def test_unique_visitor_str_representation(self):
        """
        Test the __str__ method.
        """
        ip = "192.0.2.101"
        ua = "YetAnotherBrowser/3.0"
        visitor = UniqueVisitor.objects.create(ip_address=ip, user_agent=ua, visit_count=5)

        expected_str = f"{ip} - Visits: 5"
        self.assertEqual(str(visitor), expected_str)

    def test_unique_visitor_unique_together_constraint(self):
        """
        Test that ip_address and user_agent together must be unique.
        """
        ip = "192.0.2.110"
        ua = "UniqueTestUA/1.0"

        # Create first entry
        UniqueVisitor.objects.create(ip_address=ip, user_agent=ua)

        # Attempt to create duplicate
        with self.assertRaises(IntegrityError):
            UniqueVisitor.objects.create(ip_address=ip, user_agent=ua)

    def test_unique_visitor_bot_detection_on_save(self):
        """
        Test the custom save method correctly identifies bots by user agent.
        """
        ip_bot = "192.0.2.200"
        ua_bot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

        ip_human = "192.0.2.201"
        ua_human = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

        # Test bot detection (case-insensitive)
        bot_visitor = UniqueVisitor(ip_address=ip_bot, user_agent=ua_bot)
        bot_visitor.save() # Trigger the custom save method
        # Fetch from DB to be sure
        bot_visitor_from_db = UniqueVisitor.objects.get(ip_address=ip_bot, user_agent=ua_bot)
        self.assertTrue(bot_visitor_from_db.is_bot)

        # Test non-bot
        human_visitor = UniqueVisitor(ip_address=ip_human, user_agent=ua_human)
        human_visitor.save()
        human_visitor_from_db = UniqueVisitor.objects.get(ip_address=ip_human, user_agent=ua_human)
        self.assertFalse(human_visitor_from_db.is_bot)

    def test_unique_visitor_most_common_url(self):
        """
        Test the most_common_url method.
        """
        ip = "192.0.2.210"
        ua = "URLTester/1.0"
        visitor = UniqueVisitor.objects.create(ip_address=ip, user_agent=ua)

        # 1. Test with no PageView entries
        self.assertIsNone(visitor.most_common_url())

        # 2. Test with one PageView entry
        url1 = "/page1/"
        pv1_time = timezone.now() - timedelta(minutes=10)
        PageView.objects.create(ip_address=ip, url=url1, timestamp=pv1_time, user_agent="AnyAgent") # User agent doesn't matter here
        self.assertEqual(visitor.most_common_url(), url1)

        # 3. Test with multiple PageView entries, should return latest
        url2 = "/page2/subpage/"
        pv2_time = timezone.now() - timedelta(minutes=5) # More recent than pv1
        PageView.objects.create(ip_address=ip, url=url2, timestamp=pv2_time, user_agent="AnyAgent")

        url3 = "/the-latest-page/"
        pv3_time = timezone.now() - timedelta(minutes=1) # Most recent
        PageView.objects.create(ip_address=ip, url=url3, timestamp=pv3_time, user_agent="AnyAgent")

        self.assertEqual(visitor.most_common_url(), url3)

        # 4. Test case where PageView exists but for different IP (should still be None for this visitor)
        other_ip = "192.0.2.211"
        PageView.objects.create(ip_address=other_ip, url="/other-visitor-page/", timestamp=timezone.now(), user_agent="AnyAgent")
        # Re-fetch visitor just in case, though not strictly necessary here
        visitor.refresh_from_db()
        # It should still return url3 based on the latest PageView *for this visitor's IP*
        self.assertEqual(visitor.most_common_url(), url3)
        



class AnalyticsContextProcessorTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        """
        Set up non-modified objects used by all test methods.
        Runs once per class.
        """
        # Create some reusable data
        cls.ip1 = "192.0.2.1"
        cls.ip2 = "192.0.2.2"
        cls.ip_bot = "192.0.2.250"
        cls.ua_human = "TestBrowser/1.0"
        cls.ua_bot = "TestBot/1.0 GoogleBot"

        cls.path_home = "/"
        cls.path_features = "/features/"
        cls.path_pricing = "/pricing/"
        cls.path_excluded_agg = "/excluded/aggregate/" # Will be excluded from totals
        cls.path_excluded_prefix = "/admin/analytics/" # Will be excluded entirely

        cls.today = date.today()
        cls.yesterday = cls.today - timedelta(days=1)
        cls.eight_days_ago = cls.today - timedelta(days=8)

        # --- Create DB data ---
        # Unique Visitors (bots vs humans)
        UniqueVisitor.objects.create(ip_address=cls.ip1, user_agent=cls.ua_human) # Human 1
        UniqueVisitor.objects.create(ip_address=cls.ip2, user_agent=cls.ua_human) # Human 2
        UniqueVisitor.objects.create(ip_address=cls.ip_bot, user_agent=cls.ua_bot) # Bot

        # Daily Page View Counts (for popular pages)
        # Day -8 (should be excluded from 7-day calculation)
        DailyPageViewCount.objects.create(url=cls.path_home, date=cls.eight_days_ago, count=5)
        # Yesterday
        DailyPageViewCount.objects.create(url=cls.path_home, date=cls.yesterday, count=10) # Total Home: 10+20=30
        DailyPageViewCount.objects.create(url=cls.path_features, date=cls.yesterday, count=15) # Total Features: 15+25=40
        DailyPageViewCount.objects.create(url=cls.path_pricing, date=cls.yesterday, count=5) # Total Pricing: 5+10=15
        DailyPageViewCount.objects.create(url=cls.path_excluded_agg, date=cls.yesterday, count=100) # Excluded from popular
        # Today
        DailyPageViewCount.objects.create(url=cls.path_home, date=cls.today, count=20)
        DailyPageViewCount.objects.create(url=cls.path_features, date=cls.today, count=25)
        DailyPageViewCount.objects.create(url=cls.path_pricing, date=cls.today, count=10)

        # Page Views (for total views and page-specific views)
        # Match Daily counts for consistency, add some older views and excluded views
        # Yesterday
        for _ in range(10): PageView.objects.create(url=cls.path_home, ip_address=cls.ip1, timestamp=timezone.now()-timedelta(hours=20))
        for _ in range(15): PageView.objects.create(url=cls.path_features, ip_address=cls.ip1, timestamp=timezone.now()-timedelta(hours=19))
        for _ in range(5): PageView.objects.create(url=cls.path_pricing, ip_address=cls.ip2, timestamp=timezone.now()-timedelta(hours=18))
        for _ in range(100): PageView.objects.create(url=cls.path_excluded_agg, ip_address=cls.ip2, timestamp=timezone.now()-timedelta(hours=17)) # Excluded from total
        # Today
        for _ in range(20): PageView.objects.create(url=cls.path_home, ip_address=cls.ip1, timestamp=timezone.now()-timedelta(hours=2))
        for _ in range(25): PageView.objects.create(url=cls.path_features, ip_address=cls.ip2, timestamp=timezone.now()-timedelta(hours=1))
        for _ in range(10): PageView.objects.create(url=cls.path_pricing, ip_address=cls.ip1, timestamp=timezone.now())
        # Older view
        PageView.objects.create(url=cls.path_home, ip_address=cls.ip1, timestamp=timezone.now()-timedelta(days=30))
        # Page view for the prefix-excluded path (shouldn't affect totals if logic is right)
        PageView.objects.create(url=cls.path_excluded_prefix, ip_address=cls.ip1, timestamp=timezone.now())

        # Total expected views EXCLUDING path_excluded_agg and path_excluded_prefix:
        # Home: 10+20+1 = 31
        # Features: 15+25 = 40
        # Pricing: 5+10 = 15
        # Total = 31 + 40 + 15 = 86

    def setUp(self):
        """
        Set up things that might change between tests (e.g., cache, request factory).
        Runs before every test method.
        """
        self.factory = RequestFactory()
        cache.clear() # Ensure a clean cache for each test

    # --- Tests for Path Exclusion ---

    @override_settings(ANALYTICS_EXCLUDED_PREFIXES=['/admin/', '/api/'])
    def test_context_excluded_by_prefix(self):
        """
        Test that context processor returns empty dict for excluded prefixes.
        """
        request_admin = self.factory.get('/admin/somepage/')
        request_api = self.factory.get('/api/v1/data/')
        context_admin = analytics_context(request_admin)
        context_api = analytics_context(request_api)
        self.assertEqual(context_admin, {})
        self.assertEqual(context_api, {})

    @override_settings(ANALYTICS_EXCLUDED_PREFIXES=['/admin/', '/api/'])
    def test_context_included_path(self):
        """
        Test that context processor returns data for non-excluded prefixes.
        """
        request = self.factory.get(self.path_home)
        context = analytics_context(request)
        # Just check it's not empty, detailed checks are below
        self.assertNotEqual(context, {})
        self.assertIn('total_views', context) # Check a key exists

    # --- Tests for Calculation and Caching ---

    @override_settings(
        ANALYTICS_AGGREGATE_EXCLUDED_PATHS=["/excluded/aggregate/"],
        ANALYTICS_CACHE_TIMEOUT=300
    )
    def test_context_calculation_cache_miss_and_hit(self):
        """
        Test data calculation on cache miss and retrieval on cache hit.
        """
        request = self.factory.get(self.path_features) # Request features page

        # 1. Cache Miss
        cache.clear() # Ensure miss
        context_miss = analytics_context(request)

        # Verify calculated values (based on setUpTestData)
        self.assertEqual(context_miss['page_views_count'], 40) # 15 yesterday + 25 today
        self.assertEqual(context_miss['today_page_views'], 25) # From DailyPageViewCount
        self.assertEqual(context_miss['total_views'], 87) # Excludes path_excluded_agg
        self.assertEqual(context_miss['unique_visitors'], 2) # Excludes bot
        self.assertEqual(len(context_miss['popular_pages']), 3) # Home, Features, Pricing
        # Check popular pages order and exclusion
        self.assertEqual(context_miss['popular_pages'][0]['url'], self.path_features)
        self.assertEqual(context_miss['popular_pages'][0]['total_views'], 40)
        self.assertEqual(context_miss['popular_pages'][1]['url'], self.path_home)
        self.assertEqual(context_miss['popular_pages'][1]['total_views'], 30)
        self.assertEqual(context_miss['popular_pages'][2]['url'], self.path_pricing)
        self.assertEqual(context_miss['popular_pages'][2]['total_views'], 15)

        # Check if the main context key is now in cache
        cache_key_context = f"analytics_context_data_{self.path_features}"
        self.assertIsNotNone(cache.get(cache_key_context))
        # Check if helper function keys are in cache
        self.assertIsNotNone(cache.get("analytics_total_site_views"))
        self.assertIsNotNone(cache.get("analytics_unique_visitors"))
        self.assertIsNotNone(cache.get("analytics_popular_pages"))

        # 2. Cache Hit
        # Ideally, check DB query count here if possible/needed using self.assertNumQueries
        # For simplicity, we'll just check the result is the same
        context_hit = analytics_context(request)
        self.assertEqual(context_miss, context_hit) # Entire context should match

    @override_settings(
        # Use the actual string values directly in the decorator
        ANALYTICS_AGGREGATE_EXCLUDED_PATHS=["/", "/excluded/aggregate/"], 

        ANALYTICS_CACHE_TIMEOUT=300
    )
    def test_context_aggregate_exclusions(self):
        """
        Test that AGGREGATE_EXCLUDED_PATHS correctly affects totals and popular pages.
        """
        request = self.factory.get(self.path_features) # Request features page
        context = analytics_context(request)

        # Total views should now exclude home page views (31)
        # Expected = 86 (original total) - 31 (home views) = 55
        self.assertEqual(context['total_views'], 56)

        # Popular pages should not include home page
        self.assertEqual(len(context['popular_pages']), 2) # Only Features, Pricing left
        self.assertEqual(context['popular_pages'][0]['url'], self.path_features)
        self.assertEqual(context['popular_pages'][0]['total_views'], 40)
        self.assertEqual(context['popular_pages'][1]['url'], self.path_pricing)
        self.assertEqual(context['popular_pages'][1]['total_views'], 15)

    def test_context_unique_visitors_excludes_bots(self):
        """
        Test that unique_visitors calculation correctly ignores bots.
        """
        # This is implicitly tested in test_context_calculation_cache_miss_and_hit
        # but we can add an explicit check if needed.
        request = self.factory.get(self.path_home)
        context = analytics_context(request)
        self.assertEqual(context['unique_visitors'], 2) # Should only be ip1 and ip2

    def test_context_page_specific_data(self):
        """
        Test page-specific view counts for different pages.
        """
        # Request home page
        request_home = self.factory.get(self.path_home)
        context_home = analytics_context(request_home)
        self.assertEqual(context_home['page_views_count'], 31) # 10 yes + 20 today + 1 older
        self.assertEqual(context_home['today_page_views'], 20) # From DailyPageViewCount

        # Request pricing page
        request_pricing = self.factory.get(self.path_pricing)
        context_pricing = analytics_context(request_pricing)
        self.assertEqual(context_pricing['page_views_count'], 15) # 5 yes + 10 today
        self.assertEqual(context_pricing['today_page_views'], 10) # From DailyPageViewCount

        # Request a page with no views tracked yet
        request_new = self.factory.get('/new/page/never/visited/')
        context_new = analytics_context(request_new)
        self.assertEqual(context_new['page_views_count'], 0)
        self.assertEqual(context_new['today_page_views'], 0)
        

# Remember to re-enable logging if you need it after tests run
logging.disable(logging.NOTSET)