from flask import Flask, request, render_template, send_file
from email_scraper.scraper import scrape_emails
from email_scraper.database import setup_database, save_email
import json
import csv
import io

app = Flask(__name__)
db_conn = setup_database()

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    url = request.form['url']
    emails = scrape_emails(url)
    for email in emails:
        save_email(db_conn, email, url)
    return render_template('index.html', emails=emails, emails_json=json.dumps([{'email': e, 'source_url': url} for e in emails]))

@app.route('/export', methods=['POST'])
def export():
    emails_json = request.form['emails']
    emails = json.loads(emails_json)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Email', 'Source URL'])
    for email in emails:
        writer.writerow([email['email'], email['source_url']])
    output.seek(0)
    return send_file(output, mimetype='text/csv', as_attachment=True, download_name='emails.csv')

if __name__ == '__main__':
    app.run(debug=True)
