distlib.services = {

	apiHost: "http://" + window.location.hostname + ":5000",

	search: function(query, page = 0, size = 10) {
		var url = new URL(this.apiHost + "/books/search");
		url.search = new URLSearchParams({
			"q": query,
			"page": page,
			"size": size
		});
		return fetch(url, {
			type: "GET",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		}).then(response => response.json().then(json => ({books: json, pageCount: response.headers.get("page-count")})));
	},

	getBook: function(bookId) {
		return fetch(this.apiHost + "/books/" + bookId, {headers: {"Authorization": "Token " + distlib.auth.getToken()}}).then(function(response) {
			if (response.ok)
				return response.json();
			else
				return null;
		});
	},

	getBooks: function(page = 0, size = 10) {
		var url = new URL(this.apiHost + "/books");
		url.search = new URLSearchParams({
			"page": page,
			"size": size
		})
		return fetch(url, {
			type: "GET",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		}).then(response => response.json().then(json => ({books: json, pageCount: response.headers.get("page-count")})));
	},

	getLoans: function() {
		return fetch(this.apiHost + "/loans", {
			method: "GET",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		}).then(response => response.json());
	},

	getDebts: function() {
		return fetch(this.apiHost + "/debts", {
			method: "GET",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		}).then(response => response.json());
	},

	askForBook: function(bookId) {
		form = new FormData();
		form.append("book_id", bookId);
		form.append("recipient", distlib.auth.getUsername());
		form.append("time_range", 1);
		return fetch(this.apiHost + "/loans", {
			method: "POST",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		})
	},

	addBook: function(book) {
		form = new FormData();
		form.append("title", book.title);
		form.append("author", book.author);
		form.append("year", book.year);
		return fetch(this.apiHost + "/books", {
			method: "POST",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		});
	},

	deleteBook: function(bookId) {
		return fetch(this.apiHost + "/books/" + bookId, {
			method: "DELETE",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		});
	},

	updateBook: function(bookId, data) {
		var form = new FormData();
		form.append("title", data.title);
		form.append("author", data.author);
		form.append("year", data.year);
		return fetch(this.apiHost + "/books/" + bookId, {
			method: "PUT",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		});
	},

	getUsername: function() {
		return this.settings.username;
	},

	rejectLoan: function(loanId) {
		return fetch(this.apiHost + "/loans/" + loanId + "/reject", {
			method: "POST",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		});
	},

	finishLoan: function(loanId) {
		return fetch(this.apiHost + "/loans/" + loanId + "/finish", {
			method: "POST",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		});
	},

	acceptLoan: function(loanId) {
		return fetch(this.apiHost + "/loans/" + loanId + "/accept", {
			method: "POST",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		}).then(response => response.json());
	},

	getProfile: function() {
		return fetch(this.apiHost + "/profile", {
			method: "GET",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			}
		}).then(response => response.json());
	},

	updateProfile: function() {
		return fetch(this.apiHost + "/profile", {
			method: "POST",
			headers: {
				"Authorization": "Token " + distlib.auth.getToken()
			},
			body: new FormData(document.getElementById("profile-form"))
		})
	}
};
