distlib.books = (function() {
	'use strict';

	var title = "My books";

	var page;

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<ul class="w3-ul" id="books-list">'
			+ '</ul>'
			+ '<button id="show-book-modal" class="w3-button w3-black w3-circle" style="padding: 20px; position: fixed; z-index: 1; right: 1em; bottom: 1em;"><i class="fa fa-plus fa-fw"></i></button>'
		+ '</div>'
		+ '<div id="book-modal" class="w3-modal w3-animate-opacity">'
			+ '<div class="w3-modal-content" style="max-width:300px">'
				+ '<div class="w3-container">'
					+ '<span id="close-book-modal" class="w3-button w3-display-topright">&times;</span>'
					+ '<h3 class="w3-center">New book</h3>'
					+ '<form id="add-book-form"class="w3-container">'
						+ '<div class="w3-section">'
							+ '<label>Title</label>'
							+ '<input class="w3-input w3-margin-bottom" type="text" name="title" required>'
							+ '<label>Author</label>'
							+ '<input class="w3-input w3-margin-bottom" name="author" required>'
							+ '<label>Year</label>'
							+ '<input class="w3-input w3-margin-bottom" type="number" name="year" required>'
							+ '<button class="w3-button w3-block w3-green" type="submit" id="add-book">Add book</button>'
						+ '</div>'
					+ '</form>'
				+ '</div>'
			+ '</div>'
		+ '</div>';

	var books_list;

	var render = function($container, _, query_parameters) {
		$container.html(main_html);
		page = query_parameters.page ? parseInt(query_parameters.page) : 1;
		var backend_page = page - 1;
		books_list = $("#books-list");
		$.when(distlib.services.get_books(backend_page)).then(function(books, _, xhr) {
			var page_count = parseInt(xhr.getResponseHeader("page-count"));
			clear_books();
			load_books(books);
			if (page_count > 0) {
				var pagination_buttons = String()
				+ '<div class="w3-center">'
					+ '<div class="w3-bar">'
				if (page > 1)
					pagination_buttons = pagination_buttons + '<a href="?page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>';
				if (page <= page_count)
					pagination_buttons = pagination_buttons + '<a href="?page=' + (page + 1) + '" class="w3-button">&raquo;</a></div>';
				pagination_buttons = pagination_buttons + '</div></div>';
				books_list.after(pagination_buttons);
			}
		});
	};

	var on_add_book = function(event) {
		event.preventDefault();
		$.when(distlib.services.add_book($("#add-book-form").serialize())).then(function(result) {
			$(document).trigger("hashchange");
			distlib.shell.toast("The book has been added");
		})
	};

	var set_display_book_modal = function(status) {
		$("#book-modal").css("display", status ? "block" : "none");
	};

	var load_books = function(books) {
		if (books.length == 0)
			books_list.replaceWith('<p id="empty-books-list" class="w3-disabled">There are no books</p>');
		else
			add_books_to_view(books_list, books);
		$("#show-book-modal").click(function(event) {set_display_book_modal(true)});
		$("#close-book-modal").click(function(event) {set_display_book_modal(false)});
		$("#add-book").click(on_add_book);
	}
	
	var clear_books = function() {
		books_list.empty();
		$("#more-books").remove();
	}

	var add_books_to_view = function($container, books) {
		for (var i = 0; i < books.length; i = i + 1) {
			var element = $('<li/>').append(
				$('<p/>').append(
					$('<a href="/books/' + books[i].id + '"/>').text(books[i].title)).append(
					$('<span class="w3-right"/>').text(books[i].year))
				).append(
				$('<p/>').text(books[i].author).append(
					books[i].bearer ? $('<span class="w3-tag w3-right"/>').text('Lent to ' + books[i].bearer) : null
				)
			);
			$container.append(element);
		}
	}

	return {
		render: render,
		title: title
	}
}());