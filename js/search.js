distlib.search = (function() {
	'use strict';

	var title = "Buscar libros";

	var book_count = 0;

	var page_size = 10;

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<input id="search-box" class="w3-input w3-margin-top" type="text">'
			+ '<div class="w3-center" id="book-pad" style="height: 75px">'
		+ '</div>';

	var clear_books = function() {
		if ($("#books_list").length)
			$("#books-list").empty();
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
		$.when(distlib.services.search($("#search-box").val(), page_size, book_count)).then(function(books) {
			$(event.target).prop("disabled", false);
			if (books.length != 0)
				add_books_to_view($("#books-list"), books);
			if (books.length < page_size)
				$("#more-books").remove();
			}
		);
	}

	var render = function($container, path_parameters, query_parameters) {
		var query = query_parameters.q;
		$container.html(main_html);
		if (query || query == "") {
			$("#search-box").val(query);
			search(query);
		}
		$("#search-box").keyup(
			function (event) {
				if (event.keyCode != 13)
					return;
				search($("#search-box").val());
			}
		);
		$(document).on("click", 'a', function(event) {
			event.preventDefault();

			history.pushState({}, null, $(this).attr("href"));
			$(document).trigger("hashchange");
		});
	}

	var search = function(query) {
		history.pushState({}, null, window.location.hash + '?q=' + query);
		if ($("#books-list").length != 0)
			$("#books-list").remove();
		if ($("#more-books").length != 0)
			$("#more-books").remove();
		$.when(distlib.services.search(query)).then(function(books) {
			if (books.length == 0)
				$("#search-box").after('<p id="empty-books-list" class="w3-disabled">No hay libros</p>');
			else {
				if ($("#books-list").length == 0)
					$("#search-box").after('<ul class="w3-ul" id="books-list"></ul>');
				else
					$("#books-list").empty();
				add_books_to_view($("#books-list"), books);
				if (books.length >= page_size)
					$("#book-pad").append(more_books_button.click(on_more_books));
			}
			$("#search-box").blur();
		});
	};

	return {
		render: render,
		title: title
	}
}());