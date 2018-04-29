distlib.search = (function() {
	'use strict';

	var title = "Book search";

	var page;

	var query;

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<input id="search-box" class="w3-input w3-margin-top" type="text">'
			+ '<div id="books-result"></div>'
			+ '<div class="w3-center" id="book-pad" style="height: 75px">'
		+ '</div>';

	var no_results_html = '<p id="empty-books-list" class="w3-disabled">No results</p>';

	var search_box;

	var books_result;

	var book_pad;

	var render = function(container, path_parameters, query_parameters) {
		container.innerHTML = main_html;
		query = query_parameters.q;
		page = query_parameters.page ? parseInt(query_parameters.page) : 1;
		search_box = document.getElementById("search-box");
		book_pad = document.getElementById("book-pad");
		books_result = document.getElementById("books-result");
		if (query || query == "") {
			search_box.value = query;
			search(query, page);
		}
		search_box.addEventListener("keyup", function (event) {
				if (event.keyCode != 13)
					return;
				history.pushState({}, null, window.location.hash + '?q=' + search_box.value);
				window.dispatchEvent(new HashChangeEvent("hashchange"));
			}
		);
	};

	var clear_result = function() {
		books_result.innerHTML = "";
		book_pad.innerHTML = "";
	};

	var add_books_to_view = function(container, books) {
		for (var i = 0; i < books.length; i = i + 1) {
			var element = document.createElement("li");
			element.innerHTML = String()
				+ '<p>'
					+ '<a href="/books/' + books[i].id + '">'
						+ books[i].title
						+ '<span class="w3-right">' + books[i].year + '</span>'
					+ '</a>'
				+ '</p>'
				+ '<p>'
					+ books[i].author
					+ '<span class="w3-tag w3-right">' + books[i].owner + '</span>'
				+ '</p>'
			container.append(element);
		}
	};

	var search = function(query, page) {
		clear_result();
		distlib.services.search(query, page - 1).then(function(data) {
			var books = data.books;
			var page_count = data.page_count;
			if (books.length == 0)
				books_result.innerHTML = no_results_html;
			else {
				books_result.innerHTML = '<ul class="w3-ul" id="books-list"></ul>';
				add_books_to_view(document.getElementById("books-list"), books);
				if (page_count > 0) {
					var pagination_buttons = document.createElement("div");
					pagination_buttons.classList.add("w3-center");
					pagination_buttons.innerHTML = String()
						+ '<div class="w3-bar">'
							+ ((page > 1) ? '<a href="?q=' + query + '&page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
							+ ((page <= page_count) ? '<a href="?q=' + query + '&page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
						+ '</div>';
					books_result.after(pagination_buttons);
					pagination_buttons.querySelectorAll("a").forEach(function(element){element.addEventListener("click", function(event){event.preventDefault(); console.log("asdfadsf")})});
				}
			}
			search_box.blur();
		});
	};

	return {
		render: render,
		title: title
	}
}());
