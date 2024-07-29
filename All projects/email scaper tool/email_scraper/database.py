import sqlite3

def setup_database():
    conn = sqlite3.connect('emails.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS emails
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                     email TEXT NOT NULL,
                     source_url TEXT NOT NULL)''')
    return conn

def save_email(conn, email, source_url):
    conn.execute('INSERT INTO emails (email, source_url) VALUES (?, ?)', (email, source_url))
    conn.commit()


def save_email(conn, email, source_url):
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO emails (email, source_url) VALUES (?, ?)", (email, source_url))
        conn.commit()
    except sqlite3.IntegrityError:
        pass  # Email already exists

