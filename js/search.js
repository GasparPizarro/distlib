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

	var search_box;

	var books_result;

	var book_pad;

	var render = function($container, path_parameters, query_parameters) {
		$container.html(main_html);
		query = query_parameters.q;
		page = query_parameters.page ? parseInt(query_parameters.page) : 1;
		search_box = $("#search-box");
		book_pad = $("#book-pad")
		books_result = $("#books-result");
		if (query || query == "") {
			search_box.val(query);
			search(query, page);
		}
		search_box.keyup(
			function (event) {
				if (event.keyCode != 13)
					return;
				history.pushState({}, null, window.location.hash + '?q=' + search_box.val());
				$(document).trigger("hashchange");
			}
		);
	};

	var clear_result = function() {
		books_result.empty();
		book_pad.empty();
	};

	var add_books_to_view = function($container, books) {
		for (var i = 0; i < books.length; i = i + 1) {
			var element = $('<li/>').append(
				$('<p/>').append(
					$('<a href="/books/' + books[i].id + '"/>').text(books[i].title)).append(
					$('<span class="w3-right"/>').text(books[i].year))
				).append(
					$('<p/>').text(books[i].author).append('<span class="w3-tag w3-right">' + books[i].owner + '</span>')
				);
			$container.append(element);
		}
	};

	var search = function(query, page) {
		clear_result();
		$.when(distlib.services.search(query, page - 1)).then(function(books, status, xhr) {
			var page_count = xhr.getResponseHeader("page-count");
			if (books.length == 0)
				books_result.html('<p id="empty-books-list" class="w3-disabled">No results</p>');
			else {
				books_result.html('<ul class="w3-ul" id="books-list"></ul>');
				add_books_to_view($("#books-list"), books);
				if (page_count > 0) {
					var pagination_buttons = String()
					+ '<div class="w3-center">'
						+ '<div class="w3-bar">'
					if (page > 1)
						pagination_buttons = pagination_buttons + '<a href="?q=' + query + '&page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>';
					if (page <= page_count)
						pagination_buttons = pagination_buttons + '<a href="?q=' + query + '&page=' + (page + 1) + '" class="w3-button">&raquo;</a></div>';
					pagination_buttons = pagination_buttons + '</div></div>';
					books_result.after(pagination_buttons);
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