distlib.services = {

	api_host: "http://" + window.location.hostname + ":5000",

	search: function(query, page = 0, size = 10) {
		var url = new URL(this.api_host + "/books/search");
		url.search = new URLSearchParams({
			"q": query,
			"page": page,
			"size": size
		});
		return fetch(url, {
			type: "GET",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		}).then(response => response.json().then(json => ({books: json, page_count: response.headers.get("page-count")})));
	},

	get_book: function(book_id) {
		return fetch(this.api_host + "/books/" + book_id, {headers: {"Authorization": "Token " + distlib.user.get_token()}}).then(response => response.json());
	},

	get_books: function(page = 0, size = 10) {
		return fetch(this.api_host + "/books", {
			method: "GET",
			data: {
				"page": page,
				"size": size
			},
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		}).then(response => response.json().then(json => ({books: json, page_count: response.headers.get("page-count")})));
	},

	get_loans: function() {
		return fetch(this.api_host + "/loans", {
			method: "GET",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		}).then(response => response.json());
	},

	get_debts: function() {
		return fetch(this.api_host + "/debts", {
			method: "GET",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		}).then(response => response.json());
	},

	ask_for_book: function(book_id) {
		form = new FormData();
		form.append("book_id", book_id);
		form.append("recipient", distlib.user.get_username());
		form.append("time_range", 1);
		return fetch(this.api_host + "/loans", {
			method: "POST",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		})
	},

	add_book: function(book) {
		form = new FormData();
		form.append("title", book.title);
		form.append("author", book.author);
		form.append("year", book.year);
		return fetch(this.api_host + "/books", {
			method: "POST",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		});
	},

	delete_book: function(book_id) {
		return fetch(this.api_host + "/books/" + book_id, {
			method: "DELETE",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		});
	},

	update_book: function(book_id, data) {
		var form = new FormData();
		form.append("title", data.title);
		form.append("author", data.author);
		form.append("year", data.year);
		return fetch(this.api_host + "/books/" + book_id, {
			method: "PUT",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		});
	},

	get_username: function() {
		return this.settings.username;
	},

	reject_loan: function(loan_id) {
		return fetch(this.api_host + "/loans/" + loan_id + "/reject", {
			method: "POST",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		});
	},

	finish_loan: function(loan_id) {
		return fetch(this.api_host + "/loans/" + loan_id + "/finish", {
			method: "POST",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		});
	},

	accept_loan: function(loan_id) {
		return fetch(this.api_host + "/loans/" + loan_id + "/accept", {
			method: "POST",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		}).then(response => response.json());
	}
};
