distlib.services = (function() {

	var api_host = "http://" + window.location.hostname + ":5000";

	var set_api_host = function(the_api_host) {
		api_host = the_api_host;
	};

	var get_api_host = function() {
		return api_host;
	}

	var search = function(query, page = 0, size = 10) {
		var url = new URL(api_host + "/books/search");
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
	};

	var settings = {
		username: "The_user",
		opt_1: true
	};

	var get_settings =  function() {
		return settings;
	};

	var set_settings = function(the_settings) {
		settings = the_settings;

	};

	var get_book = function(book_id) {
		return fetch(api_host + "/books/" + book_id, {headers: {"Authorization": "Token " + distlib.user.get_token()}}).then(response => response.json());
	};

	var get_books = function(page = 0, size = 10) {
		return fetch(api_host + "/books", {
			method: "GET",
			data: {
				"page": page,
				"size": size
			},
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		}).then(response => response.json().then(json => ({books: json, page_count: response.headers.get("page-count")})));
	};

	var get_loans = function() {
		return fetch(api_host + "/loans", {
			method: "GET",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		}).then(response => response.json());
	};

	var get_debts = function() {
		return fetch(api_host + "/debts", {
			method: "GET",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		}).then(response => response.json());
	};


	var ask_for_book = function(book_id) {
		form = new FormData();
		form.append("book_id", book_id);
		form.append("recipient", distlib.user.get_username());
		form.append("time_range", 1);
		return fetch(api_host + "/loans", {
			method: "POST",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		})
	};

	var add_book = function(book) {
		form = new FormData();
		form.append("title", book.title);
		form.append("author", book.author);
		form.append("year", book.year);
		return fetch(api_host + "/books", {
			method: "POST",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		});
	};

	var delete_book = function(book_id) {
		return fetch(api_host + "/books/" + book_id, {
			method: "DELETE",
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		});
	};

	var update_book = function(book_id, data) {
		var form = new FormData();
		form.append("title", data.title);
		form.append("author", data.author);
		form.append("year", data.year);
		return fetch(api_host + "/books/" + book_id, {
			method: "PUT",
			body: form,
			headers: {
				"Authorization": "Token " + distlib.user.get_token()
			}
		});
	};


	var get_username = function() {
		return settings.username;
	};

	return {
		set_api_host: set_api_host,
		get_api_host: get_api_host,
		get_settings: get_settings,
		set_settings: set_settings,
		search: search,
		get_books: get_books,
		get_debts: get_debts,
		get_book: get_book,
		ask_for_book: ask_for_book,
		add_book: add_book,
		get_loans: get_loans,
		delete_book: delete_book,
		update_book: update_book,
		get_username: get_username
	}

}());
