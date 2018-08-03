import sys
import sqlite3
from getpass import getpass
from utils import query_db
import bcrypt

DATABASE = './data.db'

connection = sqlite3.connect(DATABASE)
cursor = connection.cursor()


username = input("Username: ")
if cursor.execute("select username from user where username = ?", (username,)).fetchone():
	print("Username already exists")
	sys.exit()
password1 = getpass("Password: ")
password2 = getpass("Password confirmation:")
if password1 != password2:
	print("Passwords do not match")
	sys.exit()
email = input("Email: ")
first_name = getpass("First name: ")
last_name = getpass("Last name: ")

cursor.execute("insert into user (username, first_name, last_name, password, email) values (?, ?, ?, ?, ?)", (username, first_name, last_name, bcrypt.hashpw(password1.encode("utf-8"), bcrypt.gensalt()), email))
connection.commit()
