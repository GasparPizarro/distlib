distlib.services = (function() {

	var api_host = "http://" + window.location.hostname + ":5000";

	var set_api_host = function(the_api_host) {
		api_host = the_api_host;
	};

	var get_api_host = function() {
		return api_host;
	}

	var search = function(query, page = 0, size = 10) {
		return $.ajax({
			url: api_host + "/books/search",
			type: "GET",
			data: {
				"q": query,
				"page": page,
				"size": size
			}
		});
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
		return $.ajax({
			url: api_host + "/books/" + book_id,
			type: "GET"
		});
	};

	var get_books = function(page = 0, size = 10) {
		return $.ajax({
			url: api_host + "/books",
			type: "GET",
			data: {
				"page": page,
				"size": size
			}
		});
	};

	var get_loans = function() {
		return $.ajax({
			url: api_host + "/loans",
			type: "GET"
		});
	};

	var get_debts = function() {
		return $.ajax({
			url: api_host + "/debts",
			type: "GET"
		});
	};


	var ask_for_book = function(book_id) {
		return $.ajax({
			url: api_host + "/loans",
			type: "POST",
			data: {
				"book_id": book_id,
				"recipient": distlib.user.get_username(),
				"time_range": 1
			}
		})
	};

	var add_book = function(book) {
		return $.ajax({
			url: api_host + "/books",
			type: "POST",
			data: book
		});
	};

	var delete_book = function(book_id) {
		return $.ajax({
			url: api_host + "/books/" + book_id,
			type: "DELETE"
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
		get_username: get_username
	}

}());
