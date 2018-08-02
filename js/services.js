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
			type: "GET"
		}).then(response => response.json().then(json => ({books: json, pageCount: response.headers.get("page-count")})));
	},

	getBook: function(bookId) {
		return fetch(this.apiHost + "/books/" + bookId).then(function(response) {
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
			type: "GET"
		}).then(response => response.json().then(json => ({books: json, pageCount: response.headers.get("page-count")})));
	},

	getLoans: function() {
		return fetch(this.apiHost + "/loans", {
			method: "GET"
		}).then(response => response.json());
	},

	getDebts: function() {
		return fetch(this.apiHost + "/debts", {
			method: "GET"
		}).then(response => response.json());
	},

	askForBook: function(bookId) {
		form = new FormData();
		form.append("book_id", bookId);
		form.append("recipient", distlib.auth.getUsername());
		form.append("time_range", 1);
		return fetch(this.apiHost + "/loans", {
			method: "POST",
			body: form
		})
	},

	addBook: function(book) {
		form = new FormData();
		form.append("title", book.title);
		form.append("author", book.author);
		form.append("year", book.year);
		return fetch(this.apiHost + "/books", {
			method: "POST",
			body: form
		});
	},

	deleteBook: function(bookId) {
		return fetch(this.apiHost + "/books/" + bookId, {
			method: "DELETE"
		});
	},

	updateBook: function(bookId, data) {
		var form = new FormData();
		form.append("title", data.title);
		form.append("author", data.author);
		form.append("year", data.year);
		return fetch(this.apiHost + "/books/" + bookId, {
			method: "PUT",
			body: form
		});
	},

	getUsername: function() {
		return this.settings.username;
	},

	acceptLoan: function(loanId) {
		form = new FormData();
		form.append("status", "accepted");
		return fetch(this.apiHost + "/loans/" + loanId, {
			method: "PATCH",
			body: form
		}).then(response => response.json());
	},

	rejectLoan: function(loanId) {
		form = new FormData();
		form.append("status", "rejected");
		return fetch(this.apiHost + "/loans/" + loanId, {
			method: "PATCH",
			body: form
		});
	},

	finishLoan: function(loanId) {
		form = new FormData();
		form.append("status", "finished");
		return fetch(this.apiHost + "/loans/" + loanId, {
			method: "PATCH",
			body: form
		});
	},

	getProfile: function() {
		return fetch(this.apiHost + "/profile", {
			method: "GET"
		}).then(response => response.json());
	},

	updateProfile: function({firstName, lastName, oldPassword, newPassword} = {}) {
		form = new FormData();
		if (oldPassword)
			form.append("old_password", oldPassword);
		if (newPassword)
			form.append("new_password", newPassword);
		if (firstName)
			form.append("first_name", firstName);
		if (lastName)
			form.append("last_name", lastName);
		return fetch(this.apiHost + "/profile", {
			method: "POST",
			body: form
		})
	}
};
