distlib.search = (function() {
	'use strict';

	var title = "Book search";

	var book_count = 0;

	var page_size = 10;

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
		var query = query_parameters.q;
		search_box = $("#search-box");
		book_pad = $("#book-pad")
		books_result = $("#books-result");
		if (query || query == "") {
			search_box.val(query);
			search(query);
		}
		search_box.keyup(
			function (event) {
				if (event.keyCode != 13)
					return;
				search(search_box.val());
			}
		);
	};

	var clear_result = function() {
		books_result.empty();
		book_pad.empty();
	};

	var add_books_to_view = function($container, books) {
		book_count = book_count + books.length;
		for (var i = 0; i < books.length; i = i + 1) {
			var element = $('<li/>').append(
				$('<p/>').append(
					$('<a href="/libros/' + books[i].id + '"/>').text(books[i].title)).append(
					$('<span class="w3-right"/>').text(books[i].year))
				).append(
				$('<p/>').text(books[i].author).append('<span class="w3-tag w3-right">' + books[i].owner + '</span>')
			);
			$container.append(element);
		}
	};

	var more_books_button = $('<button id="more-books" type="button" class="w3-button w3-blue">Más</button>');

	var on_more_books = function(event) {
		event.preventDefault();
		$(event.target).prop("disabled", true);
		$.when(distlib.services.search(search_box.val(), page_size, book_count)).then(function(books) {
			$(event.target).prop("disabled", false);
			if (books.length != 0)
				add_books_to_view($("#books-list"), books);
			if (books.length < page_size)
				$("#more-books").remove();
			}
		);
	}

	var search = function(query) {
		history.pushState({}, null, window.location.hash + '?q=' + query);
		clear_result();
		$.when(distlib.services.search(query)).then(function(books) {
			if (books.length == 0)
				books_result.html('<p id="empty-books-list" class="w3-disabled">No results</p>');
			else {
				books_result.html('<ul class="w3-ul" id="books-list"></ul>');
				add_books_to_view($("#books-list"), books);
				if (books.length >= page_size)
					$("#book-pad").append(more_books_button.click(on_more_books));
			}
			search_box.blur();
		});
	};

	return {
		render: render,
		title: title
	}
}());