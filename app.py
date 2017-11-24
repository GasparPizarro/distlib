#!/usr/bin/env python3

from flask import Flask, jsonify, g, request
from functools import wraps
import sqlite3
import string
import datetime
import time
import random
import bcrypt
from utils import login_required, get_db, close_connection, query_db, environment_user, cors, catch_all

app = Flask(__name__)

@app.route("/books", methods=['GET'])
@environment_user
@login_required
def books():
	page = int(request.args.get("page", 0))
	size = int(request.args.get("size", 10))
	book_count = int(query_db("select count(*) from book where owner = ?", (g.user,), one=True)[0])
	books = query_db("select id, title, author, year from book where owner = ? order by title collate nocase limit ? offset ?", (g.user, size, page * size))
	response = jsonify([{
		"id": id,
		"title": title,
		"owner": g.user,
		"author": author,
		"year": year,
		"bearer": query_db("select recipient from loan where book = ? and status = 2", (id,), one=True)[0] if query_db("select recipient from loan where book = ? and status = 2", (id,), one=True) else None,
	} for (id, title, author, year) in books])
	response.headers["page-count"] = book_count // size
	return response

@app.route("/books", methods=['POST'])
@environment_user
@login_required
def add_book():
	title = request.form['title']
	author = request.form['author']
	year = request.form["year"]
	cursor = get_db().execute("insert into book (owner, title, author, year) values (?, ?, ?, ?)", (g.user, title, author, year))
	get_db().commit()
	cursor.close()
	return jsonify({
		"id": cursor.lastrowid,
		"title": title,
		"owner": g.user,
		"author": author,
		"year": year
	})

@app.route("/books/<int:book_id>", methods=['GET'])
@environment_user
@login_required
def book_detail(book_id):
	id_, owner, title, author, year = query_db("select id, owner, title, author, year from book where id = ?", (book_id,), one=True)
	return jsonify({
		"id": id_,
		"owner": owner,
		"title": title,
		"author": author,
		"year": year
	})

@app.route("/books/<int:book_id>", methods=['DELETE'])
@environment_user
@login_required
def delete_book(book_id):
	query_db("delete from book where id = ?", (book_id,))
	return  ('', 204)

@app.route("/books/search", methods=['GET'])
@environment_user
@login_required
def book_search():
	query = request.args["q"]
	page = int(request.args.get("page", 0))
	size = int(request.args.get("size", 10))
	book_count = int(query_db("select count(*) from book where title like ? or author like ?", ("%" + query + "%", "%" + query + "%"), one=True)[0])
	print(book_count)
	books = query_db("select id, owner, title, author, year from book where title like ? or author like ? group by title limit ? offset ?", ("%" + query + "%", "%" + query + "%", size, page * size))
	response = jsonify([{
		"id": id,
		"owner": owner,
		"title": title,
		"author": author,
		"year": year
	} 
	for (id, owner, title, author, year) in books])
	response.headers["page-count"] = book_count // size
	return response


@app.route("/debts", methods=['GET'])
@environment_user
@login_required
def debts():
	debts = query_db("select id, book, start, span, status from loan where recipient = ? and status = 2", (g.user,))
	return jsonify([{
		"id": debt[0],
		"book": {field: value for (field, value) in zip(["id", "owner", "title", "author", "year"], query_db("select * from book where id = ?", (debt[1],), one=True))},
		"lender": query_db("select owner from book where id = ?", (debt[1],), one=True)[0],
		"start": debt[2],
		"span": debt[3],
		"status": debt[4]
	}
	for debt in debts])

@app.route("/loans", methods=['GET'])
@environment_user
@login_required
def loans():
	loans = query_db("select id, book, recipient, start, span, status from loan where book in (select id from book where owner = ?) and status in (0, 2)", (g.user,))
	return jsonify([{
		"id": loan[0],
		"book": {field: value for (field, value) in zip(["id", "owner", "title", "author", "year"], query_db("select * from book where id = ?", (loan[1],), one=True))},
		"recipient": loan[2],
		"start": loan[3],
		"span": loan[4],
		"status": loan[5]
	}
	for loan in loans])

@app.route("/loans", methods=['POST'])
@environment_user
@login_required
def request_book():
	book_id = request.form['book_id']
	recipient = request.form['recipient']
	time_range = int(request.form['time_range'])
	start = datetime.datetime.now()
	end = start + datetime.timedelta(days=time_range)
	cursor = get_db().execute("insert into loan (book, recipient, start, span, status) values (?, ?, ?, ?, ?)", (book_id, recipient, str(start), time_range, 0))
	get_db().commit()
	cursor.close()
	return jsonify({
		"id": cursor.lastrowid,
		"book": book_id,
		"recipient": recipient,
		"start": None,
		"span": time_range,
		"status": 0
	})

@app.route("/loans/<int:loan_id>/accept", methods=['POST'])
@environment_user
@login_required
def accept_loan(loan_id):
	owner, = query_db("select owner from book where id = (select book from loan where id = ?)", (loan_id, ), one=True)
	print(owner)
	print(g.user)
	if owner != g.user:
		return jsonify({"error": "user does not own book"}), 400
	query = query_db("update loan set status = ?, start = ? where id = ?", (2, datetime.datetime.today(), loan_id))
	id, book, recipient, start, span, status = query_db("select id, book, recipient, start, span, status from loan where id = ?", (loan_id,), one=True)
	return jsonify({
		"id": id,
		"book": {field: value for (field, value) in zip(["id", "owner", "title", "author", "year"], query_db("select * from book where id = ?", (book,), one=True))},
		"recipient": recipient,
		"start": start,
		"span": span,
		"status": status
	})

@app.route("/loans/<int:loan_id>/reject", methods=['POST'])
@environment_user
@login_required
def reject_loan(loan_id):
	query = query_db("update loan set status = ?, start = ? where id = ?", (1, datetime.datetime.today(), loan_id))
	id, book, recipient, start, span, status = query_db("select id, book, recipient, start, span, status from loan where id = ?", (loan_id,), one=True)
	return jsonify({
		"id": id,
		"book": book,
		"recipient": recipient,
		"start": start,
		"span": span,
		"status": status
	})


@app.route("/loans/<int:loan_id>/finish", methods=['POST'])
@environment_user
@login_required
def finish_loan(loan_id):
	query = query_db("update loan set status = ?, start = ? where id = ?", (3, datetime.datetime.today(), loan_id))
	id, book, recipient, start, span, status = query_db("select id, book, recipient, start, span, status from loan where id = ?", (loan_id,), one=True)
	return jsonify({
		"id": id,
		"book": book,
		"recipient": recipient,
		"start": start,
		"span": span,
		"status": status
	})

@app.route("/loans/<int:loan_id>", methods=['GET'])
@environment_user
@login_required
def loan(loan_id):
	loans = query_db("select id, book, recipient, start, span, status from loan where id = ?", (g.user,))
	return jsonify({
		"id": loan[0],
		"book": loan[1],
		"recipient": loan[2],
		"start": loan[3],
		"span": loan[4],
		"status": loan[5]
	})

@app.route("/profile", methods=['GET'])
@environment_user
@login_required
def get_profile():
	profile = query_db("select username, first_name, last_name from user where username = ?", (g.user,), one=True)
	if profile is not None:
		username, first_name, last_name = profile
	return jsonify({
		"username": username,
		"first_name": first_name,
		"last_name": last_name
	})

@app.route("/profile", methods=['POST'])
@environment_user
@login_required
def update_profile():
	old_password = request.form.get("old-password", None)
	new_password1 = request.form.get("new-password1", None)
	new_password2 = request.form.get("new-password2", None)
	if request.form.get("first-name", None):
		query_db("update user set first_name = ? where username = ?", (request.form["first-name"], g.user))
	if request.form.get("last-name", None):
		query_db("update user set last_name = ? where username = ?", (request.form["last-name"], g.user))
	hashed_password = query_db("select password from user where username = ?", (g.user,), one=True)
	if old_password is not None and bcrypt.checkpw(old_password.encode("utf-8"), hashed_password[0].encode("utf-8")) and new_password1 == new_password1:
		query_db("update user set password = ? where username = ?", (bcrypt.hashpw(new_password2.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"), g.user))
	profile = query_db("select username, first_name, last_name from user where username = ?", (g.user,), one=True)
	if profile is not None:
		username, first_name, last_name = profile
	return jsonify({
		"username": username,
		"first_name": first_name,
		"last_name": last_name
	})


@app.route("/token", methods=['POST'])
def get_token():
	username = request.form['username']
	password = request.form['password']
	hashed_password = query_db("select password from user where username = ?", (username,), one=True)
	if hashed_password is not None and bcrypt.checkpw(password.encode("utf-8"), hashed_password[0].encode("utf-8")):
		token = query_db("select token from user_token where username = ?", (username,), one=True)
		if token is None:
			token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(40))
			query_db("insert into user_token (username, token) values (?, ?)", (username, token))
		return jsonify({"token": token})
	else:
		return jsonify({"error": "Bad credentials"}), 400

@app.route("/logout", methods=['GET'])
@environment_user
@login_required
def logout():
	query_db("delete from user_token where user_username = ?", (g.user,))
	return jsonify({"status": "logged_out"})

app.after_request(cors)
app.route('/<path:path>', endpoint=catch_all, methods=['OPTIONS'])
app.teardown_appcontext(close_connection)

if __name__ == "__main__":
	app.run(debug=True, host="0.0.0.0")