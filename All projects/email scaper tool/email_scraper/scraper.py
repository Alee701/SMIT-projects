import requests
from bs4 import BeautifulSoup
import re
import logging
import random
import time
from urllib.parse import urlparse
from email_scraper.config import USER_AGENTS
from email_scraper.email_validator import validate_email

def extract_emails_from_url(url, blocked_domains):
    headers = {'User-Agent': random.choice(USER_AGENTS)}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text()
        raw_emails = re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
        valid_emails = {email for email in raw_emails if validate_email(email, blocked_domains)}
        return valid_emails
    except requests.RequestException as e:
        logging.error(f"Error accessing {url}: {e}")
        return set()

def scrape_emails(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    emails = set()
    for a in soup.find_all('a', href=True):
        if re.match(r'^mailto:', a['href']):
            emails.add(a['href'].split(':')[1])
    return list(emails)
