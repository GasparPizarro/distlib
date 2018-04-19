from functools import wraps
from flask import g, request, jsonify
import sqlite3
import time

DATABASE = './data.db'

def login_required(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		if g.user is None:
			return "No"
		return f(*args, **kwargs)
	return decorated_function

def get_db():
	db = getattr(g, '_database', None)
	if db is None:
		db = g._database = sqlite3.connect(DATABASE)
	return db


def close_connection(exception):
	db = getattr(g, '_database', None)
	if db is not None:
		db.close()

def query_db(query, args=(), one=False):
	cur = get_db().execute(query, args)
	rv = cur.fetchall()
	get_db().commit()
	cur.close()
	return (rv[0] if rv else None) if one else rv

def environment_user(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		if request.method == "OPTIONS":
			return ""
		auth_header = request.headers.get("Authorization")
		if auth_header is not None:
			token = auth_header[len("Token "):]
		else:
			return jsonify({"error": "Bad credentials"}), 400
		username = query_db("select username from user_token where token = ?", (token,), one=True)
		if username is not None:
			g.user = username[0]
		return f(*args, **kwargs)
	return decorated_function

def cors(response):
	response.headers["Access-Control-Expose-Headers"] = ", ".join([header for header in response.headers.keys()])
	response.headers["Access-Control-Allow-Origin"] = "*"
	response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, DELETE, PUT"
	response.headers["Access-Control-Allow-Headers"] = "origin, content-type, accept, authorization"
	response.headers["Access-Control-Allow-Credentials"] = True
	response.headers["Access-Control-Max-Age"] = "1209600"
	return response

def catch_all(path):
	return ''
