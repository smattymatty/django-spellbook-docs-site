# analytics/middleware.py
from django.utils import timezone
from datetime import date
from .models import PageView, DailyPageViewCount, UniqueVisitor

class PageViewMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Skip admin, static files, and analytics requests
        if (not request.path.startswith('/admin/') and 
            not request.path.startswith('/static/') and
            not request.path.startswith('/analytics/')):
            
            # Get visitor info
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Record the page view
            PageView.objects.create(
                url=request.path,
                ip_address=ip_address,
                user_agent=user_agent
            )
            
            # Update daily count
            today = date.today()
            daily_count, created = DailyPageViewCount.objects.get_or_create(
                url=request.path,
                date=today,
                defaults={'count': 1}
            )
            
            if not created:
                daily_count.count += 1
                daily_count.save()
            
            # Track unique visitors
            visitor, created = UniqueVisitor.objects.get_or_create(
                ip_address=ip_address,
                user_agent=user_agent,
                defaults={
                    'first_visit': timezone.now(),
                    'last_visit': timezone.now()
                }
            )
            
            if not created:
                visitor.last_visit = timezone.now()
                visitor.visit_count += 1
                visitor.save()
        
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip