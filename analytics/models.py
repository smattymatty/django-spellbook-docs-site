from django.db import models
from django.utils import timezone

class PageView(models.Model):
    url = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.url} - {self.timestamp}"
    
    def save(self, *args, **kwargs):
        if not validate_url(self.url):
            self.delete()
        else:
            super().save(*args, **kwargs)

class DailyPageViewCount(models.Model):
    url = models.CharField(max_length=255)
    date = models.DateField()
    count = models.PositiveIntegerField(default=0)
    
    class Meta:
        unique_together = ('url', 'date')
    
    def __str__(self):
        return f"{self.url} - {self.date}: {self.count} views"
    
    def save(self, *args, **kwargs):
        if not validate_url(self.url):
            self.delete()
        else:
            super().save(*args, **kwargs)

class UniqueVisitor(models.Model):
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True, null=True)
    first_visit = models.DateTimeField(default=timezone.now)
    last_visit = models.DateTimeField(default=timezone.now)
    visit_count = models.PositiveIntegerField(default=1)
    
    class Meta:
        unique_together = ('ip_address', 'user_agent')
        
    def most_common_url(self):
        try:
            return PageView.objects.filter(ip_address=self.ip_address).order_by('-timestamp').first().url
        except:
            return None
    
    def __str__(self):
        return f"{self.ip_address} - Visits: {self.visit_count}"
    
    def save(self, *args, **kwargs):
        if not validate_url(self.most_common_url()):
            self.delete()
        else:
            super().save(*args, **kwargs)
    
    
def validate_url(url: str):
    '''
    Hacker bots attempt to get .php links and wp-admin links ! 
    We need to delete anything that has this as a url,
    '''
    if url.endswith('.php') or "wp-admin" in url:
        return False
    if url.endswith('.xml') or url.endswith('.json'):
        return False
    if url.endswith('.env') or url.endswith('.sql'):
        return False
    if url.endswith('.yml') or url.endswith('.yaml'):
        return False
    if url.endswith('.gz') or url.endswith('.key'):
        return False
    if url.endswith('.zip') or url.endswith('.crt'):
        return False
    if url.endswith('.production') or ".aws" in url:
        return False
    if "apple-touch-icon" in url or ".ssh" in url:
        return False
    if url.endswith(".ico") or url.endswith(".alfa"):
        return False
    if "wp-content" in url or url.endswith(".phP"):
        return False
    if "fileman/" in url:
        return False
    return True

