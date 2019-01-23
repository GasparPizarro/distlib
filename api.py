#!/usr/bin/env python3

from flask import Flask, jsonify, g, request
from flask.views import MethodView
from functools import wraps
import sqlite3
import string
import datetime
import time
import math
import random
import bcrypt
from utils import login_required, get_db, close_connection, query_db, environment_user, cors, catch_all

app = Flask(__name__)

class Books(MethodView):

	decorators = [login_required, environment_user]

	def get(self, book_id=None):
		if not book_id:
			page = int(request.args.get("page", 1)) - 1
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
			response.headers["page-count"] = math.ceil(book_count / size)
			return response
		else :
			try:
				id_, owner, title, author, year = query_db("select id, owner, title, author, year from book where id = ?", (book_id,), one=True)
			except TypeError:
				return ('', 404)
			return jsonify({
				"id": id_,
				"owner": owner,
				"title": title,
				"author": author,
				"year": year
			})

	def post(self):
		title = request.form['title']
		author = request.form['author']
		year = int(request.form["year"])
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

	def put(self, book_id):
		updatable_fields = ["title", "author", "year"]
		title = request.form.get("title", None)
		author = request.form.get("author", None)
		try:
			if request.form.get("year", None):
				year = int(request.form["year"])
		except ValueError:
			return ('', 400)
		query = "update book set " + (", ".join(["%s = ?" % (field,) for (field, value) in request.form.items() if field in updatable_fields and value])) + " where id = ?"
		data = query_db(query, [value for (field, value) in request.form.items() if field in updatable_fields and value] + [book_id])
		return self.get(book_id)

	def delete(self, book_id):
		is_lent = query_db("select recipient from loan where book = ? and status = 2", (book_id,), one=True)
		if is_lent:
			return ('Cannot delete lent book', 403)
		else:
			query_db("delete from book where id = ?", (book_id,))
			return ('', 204)




@app.route("/books/search", methods=['GET'])
@environment_user
@login_required
def book_search():
	query = request.args["q"]
	page = int(request.args.get("page", 1))
	size = int(request.args.get("size", 10))
	book_count = int(query_db("select count(*) from book where title like ? or author like ?", ("%" + query + "%", "%" + query + "%"), one=True)[0])
	books = query_db("select id, owner, title, author, year from book where title like ? or author like ? limit ? offset ?", ("%" + query + "%", "%" + query + "%", size, (page - 1) * size))
	response = jsonify([{
		"id": id,
		"owner": owner,
		"title": title,
		"author": author,
		"year": year,
		"bearer": query_db("select recipient from loan where book = ? and status = 2", (id,), one=True)[0] if query_db("select recipient from loan where book = ? and status = 2", (id,), one=True) else None,
	} for (id, owner, title, author, year) in books])
	response.headers["page-count"] = math.ceil(book_count / size)
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

class Loans(MethodView):

	decorators = [login_required, environment_user]

	def get(self, loan_id=None):
		if loan_id:
			loan = query_db("select id, book, recipient, start, span, status from loan where id = ?", (loan_id,), one=True)
			if loan:
				return jsonify({
					"id": loan[0],
					"book": loan[1],
					"recipient": loan[2],
					"start": loan[3],
					"span": loan[4],
					"status": loan[5]
				})
			else:
				return ('', 404)
		else:
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

	def post(self):
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

	def patch(self, loan_id):
		status = request.form.get("status")
		if status == "accepted":
			owner, = query_db("select owner from book where id = (select book from loan where id = ?)", (loan_id, ), one=True)
			if owner != g.user:
				return jsonify({"error": "user does not own book"}), 400
			query = query_db("update loan set status = ?, start = ? where id = ?", (2, datetime.datetime.today(), loan_id))
			id, book, recipient, start, span, status = query_db("select id, book, recipient, start, span, status from loan where id = ?", (loan_id,), one=True)
		elif status == "rejected":
			query = query_db("update loan set status = ?, start = ? where id = ?", (1, datetime.datetime.today(), loan_id))
			id, book, recipient, start, span, status = query_db("select id, book, recipient, start, span, status from loan where id = ?", (loan_id,), one=True)
		elif status == "finished":
			query = query_db("update loan set status = ?, start = ? where id = ?", (3, datetime.datetime.today(), loan_id))
			id, book, recipient, start, span, status = query_db("select id, book, recipient, start, span, status from loan where id = ?", (loan_id,), one=True)
		else:
			return ('', 400)
		return jsonify({
			"id": id,
			"book": {field: value for (field, value) in zip(["id", "owner", "title", "author", "year"], query_db("select * from book where id = ?", (book,), one=True))},
			"recipient": recipient,
			"start": start,
			"span": span,
			"status": status
		})

class Profile(MethodView):

	decorators = [login_required, environment_user]

	def get(self):
		profile = query_db("select username, first_name, last_name from user where username = ?", (g.user,), one=True)
		if profile is not None:
			username, first_name, last_name = profile
		return jsonify({
			"username": username,
			"first_name": first_name,
			"last_name": last_name
		})

	def post(self):
		first_name = request.form.get("first_name", None)
		last_name = request.form.get("last_name", None)
		old_password = request.form.get("old_password", None)
		new_password = request.form.get("new_password", None)
		if new_password:
			hashed_password = query_db("select password from user where username = ?", (g.user,), one=True)
			if not (old_password and bcrypt.checkpw(old_password.encode("utf-8"), hashed_password[0].encode("utf-8"))):
				return jsonify({"error": "Wrong password"}), 400
			query_db("update user set password = ? where username = ?", (bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"), g.user))
			query_db("delete from user_token where username = ?", (g.user, ))
		if first_name:
			query_db("update user set first_name = ? where username = ?", (first_name, g.user))
		if last_name:
			query_db("update user set last_name = ? where username = ?", (last_name, g.user))
		profile = query_db("select username, first_name, last_name from user where username = ?", (g.user,), one=True)
		if profile is not None:
			username, first_name, last_name = profile
		if new_password:
			query_db("delete from user_token where username = ?", (g.user,))
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
		return jsonify({"error": "Bad credentials"}), 401

@app.route("/logout", methods=['GET'])
@environment_user
@login_required
def logout():
	query_db("delete from user_token where username = ?", (g.user,))
	return jsonify({"status": "logged_out"})

app.after_request(cors)
app.route('/<path:path>', endpoint=catch_all, methods=['OPTIONS'])

app.add_url_rule('/profile', view_func=Profile.as_view('profile'))

books_view = Books.as_view('books')
app.add_url_rule('/books', view_func=books_view, methods=['GET', 'POST'])
app.add_url_rule('/books/<int:book_id>', view_func=books_view, methods=['GET', 'PUT', 'DELETE'])

loans_view = Loans.as_view('loans')
app.add_url_rule('/loans', view_func=loans_view, methods=['GET', 'POST'])
app.add_url_rule('/loans/<int:loan_id>', view_func=loans_view, methods=['GET', 'PATCH'])

app.teardown_appcontext(close_connection)

if __name__ == "__main__":
	app.config["ENV"] = "development"
	app.run(debug=True, host="0.0.0.0")
