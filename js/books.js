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

	var no_books_html = '<p id="empty-books-list" class="w3-disabled">There are no books</p>';

	var books_list;

	var render = function($container, _, query_parameters) {
		$container.html(main_html);
		page = query_parameters.page ? parseInt(query_parameters.page) : 1;
		var backend_page = page - 1;
		books_list = $("#books-list");
		var page_count = 0;
		distlib.services.get_books(backend_page)
		.then(function(response) {
			page_count = response.headers.get("page-count");
			return response.json()
		})
		.then(function(books) {
			clear_books();
			load_books(books);
			if (page_count > 0) {
				var pagination_buttons = String()
					+ '<div id="pagination-buttons" class="w3-center">'
						+ '<div class="w3-bar">'
							+ (page > 1 ? '<a href="?page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
							+ (page <= page_count ? '<a href="?page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
						+ '</div>'
					+ '</div>';
				books_list.after(pagination_buttons);
				$("#pagination-buttons a").click(onClickLink);
			}
		});
	};

	var onClickLink = function() {
		history.pushState({}, null, $(this).attr("href"));
		$(document).trigger("hashchange");
		return false;
	};

	var on_add_book = function(event) {
		event.preventDefault();
		$.when(distlib.services.add_book($("#add-book-form").serialize())).then(function(result) {
			$(document).trigger("hashchange");
			distlib.shell.toast("The book has been added");
		})
	};

	var show_modal = function() {
		var modal = document.getElementById('book-modal');
		$("#close-book-modal").click(hide_modal);
		modal.style.display = "block";
		$(document).click(hide_modal);
		return false;
	};

	var hide_modal = function() {
		var modal = document.getElementById('book-modal');
		modal.style.display = "none";
		$(document).unbind("click", hide_modal);
		return false;
	}

	var load_books = function(books) {
		if (books.length == 0)
			books_list.replaceWith(no_books_html);
		else
			add_books_to_view(books_list, books);
		$("#show-book-modal").click(show_modal);
		$("#add-book").click(on_add_book);
		$("#books-list a").click(onClickLink);
	}

	var clear_books = function() {
		books_list.empty();
		$("#more-books").remove();
	}

	var onClickLink = function() {
		history.pushState({}, null, $(this).attr("href"));
		$(document).trigger("hashchange");
		return false;
	}

	var add_books_to_view = function($container, books) {
		for (var i = 0; i < books.length; i = i + 1) {
			var element = String()
				+ '<li>'
					+ '<p>'
						+ '<a href="/books/36">' + books[i].title + '</a>'
						+ '<span class="w3-right">' + books[i].year + '</span>'
					+ '</p>'
					+ '<p>'
						+ books[i].author
						+ (books[i].bearer != null ? '<span class="w3-tag w3-right">' + 'Lent to ' + books[i].bearer + '</span>' : '')
					+ '</p>'
				+ '</li>'
			$container.append(element);
		}
	}

	return {
		render: render,
		title: title
	}
}());
