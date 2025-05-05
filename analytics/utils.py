# analytics/utils.py
MAX_URL_LENGTH = 512
# Common file extensions often targeted by bots or not useful for tracking
# Include the leading dot.
FORBIDDEN_EXTENSIONS = {
    '.php', '.xml', '.json', '.env', '.sql', '.yml', '.yaml',
    '.gz', '.key', '.zip', '.crt', '.ico', '.alfa', '.bak',
    '.old', '.swp', '.tar.gz', '.tgz', '.log', '.txt', '.sh',
    '.config', '.conf', '.ini', '.htaccess', '.htpasswd', '.pem',
    '.dat', '.db', '.mdb', '.csv', '.xls', '.xlsx', '.doc', '.docx', # Less common web paths, but could be probed
    '.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.woff', '.woff2',
}

# Substrings often found in malicious requests or scanner probes.
# Use lowercase for case-insensitive matching.
FORBIDDEN_SUBSTRINGS = {
    # WordPress & common CMS probes
    'wp-admin', 'wp-content', 'wp-includes', 'xmlrpc.php', 'wp-login',
    'joomla', 'drupal', 'magento',

    # Config/System files/dirs (some might overlap with extensions)
    '.aws', '.ssh', '.git', 'etc/passwd', '.env', '.htaccess',

    # Common admin panels & tools
    'phpmyadmin', 'pma', 'sqladmin', 'adminer',
    'manager/html', # Tomcat
    'fileman/', 'fckeditor', 'ckeditor', # File managers / Editors
    '/remote/fgt_lang', # Fortinet probe
    '/solr/', '/cgi-bin/', '/scripts/',

    # Common vulnerability patterns (simple checks)
    '../', # Basic path traversal check
    'base64_decode', 'eval(', 'exec(', # Code execution attempts in path? Unlikely but possible
    '<script', '%3cscript', # Basic XSS probes (URL encoded)

    # Other common noise
    'apple-touch-icon',
    '.local', # mDNS probes
    '.well-known', # Often automated checks, can sometimes be excluded

    # Add any other patterns you observe frequently in logs
    'autodiscover/autodiscover.xml', # Exchange server probes
    '//', # Double slashes can indicate probing
}

def validate_url(url: str) -> bool:
    """
    Validates a URL path to filter out common bot probes, scanning tools,
    and requests for sensitive file types unlikely to be actual pages worth tracking.

    Args:
        url: The URL path string to validate.

    Returns:
        bool: True if the URL seems legitimate for tracking, False otherwise.
    """
    if not url or not isinstance(url, str): # Handle None, empty strings, or wrong types
        return False

    # --- Normalization ---
    # Work with lowercase for case-insensitive checks
    normalized_url = url.lower()
    # Optional: remove trailing slash if needed for consistent checks,
    # but be careful if '/some/path/' and '/some/path' are distinct URLs for you.
    # normalized_url = normalized_url.rstrip('/')

    # --- Checks ---

    # 1. Check for forbidden substrings (case-insensitive)
    # Using a generator expression within any() is efficient
    if any(sub in normalized_url for sub in FORBIDDEN_SUBSTRINGS):
        # print(f"DEBUG: URL '{url}' failed substring check.") # Debugging
        return False

    # 2. Check for forbidden extensions (case-insensitive)
    # Using endswith with a tuple is efficient
    # Create the tuple only once if this function is called very frequently,
    # otherwise creating it here is fine.
    if normalized_url.endswith(tuple(FORBIDDEN_EXTENSIONS)):
        # print(f"DEBUG: URL '{url}' failed extension check.") # Debugging
        return False

    # 3.  Very long URLs can be suspicious.
    if len(url) > MAX_URL_LENGTH:
        print(f"DEBUG: URL '{url}' failed length check.") # Debugging
        return False
    
    # 4. Double slashes can indicate probing
    if "//" in normalized_url:
        print(f"DEBUG: URL '{url}' failed double slash check.") # Debugging
        return False

    # If all checks pass, the URL is considered valid for tracking
    return True