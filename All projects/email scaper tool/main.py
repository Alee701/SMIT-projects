from email_scraper.scraper import scrape_emails
from email_scraper.utils import parse_arguments, setup_logging, load_blocked_domains
import logging

def main():
    setup_logging()
    args = parse_arguments()
    blocked_domains = load_blocked_domains()

    logging.info("Starting email scraping...")
    emails = scrape_emails(args.urls, blocked_domains)
    logging.info(f"Total unique emails found: {len(emails)}")
    
    args.output(emails)
    logging.info("Email scraping completed.")

if __name__ == "__main__":
    main()
