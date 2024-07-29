import re
from urllib.parse import urlparse

def validate_email(email, blocked_domains):
    if not is_valid_format(email):
        return False
    domain = get_domain_from_email(email)
    return domain not in blocked_domains

def is_valid_format(email):
    return re.match(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", email)

def get_domain_from_email(email):
    return email.split('@')[-1]
