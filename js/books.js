distlib.books = (function() {
	'use strict';

	var title = "Mis libros";

	var book_count = 0;

	var page_size = 10;

	var main_html = String()
		+ '<div id="module" class="w3-container">'
			+ '<ul class="w3-ul" id="books-list">'
			+ '</ul>'
			+ '<button id="show-book-modal" class="w3-button w3-black w3-circle" style="padding: 20px; position: fixed; z-index: 1; right: 1em; bottom: 1em;"><i class="fa fa-plus fa-fw"></i></button>'
		+ '</div>'
		+ '<div id="book-modal" class="w3-modal w3-animate-opacity">'
			+ '<div class="w3-modal-content" style="max-width:300px">'
				+ '<div class="w3-container">'
					+ '<span id="close-book-modal" class="w3-button w3-display-topright">&times;</span>'
					+ '<form id="add-book-form"class="w3-container">'
						+ '<div class="w3-section">'
							+ '<label>Título</label>'
							+ '<input class="w3-input w3-margin-bottom" type="text" name="title" required>'
							+ '<label>Autor</label>'
							+ '<input class="w3-input w3-margin-bottom" name="author" required>'
							+ '<label>Año</label>'
							+ '<input class="w3-input w3-margin-bottom" type="number" name="year" required>'
							+ '<button class="w3-button w3-block w3-green" type="submit" id="add-book">Agregar libro</button>'
						+ '</div>'
					+ '</form>'
				+ '</div>'
			+ '</div>'
		+ '</div>';

	var more_books_button = $('<div class="w3-center" id="book-pad" style="height: 75px"><button id="more-books" type="button" class="w3-button w3-blue">Más</button></div>');

	var on_more_books = function(event) {
		event.preventDefault();
		$(event.target).prop("disabled", true);
		distlib.shell.set_loading(true);
		$.when(distlib.services.get_books(page_size, book_count)).then(function(books) {
			$(event.target).prop("disabled", false);
			distlib.shell.set_loading(false);
			if (books.length != 0)
				add_books_to_view($("#books-list"), books);
			if (books.length < page_size)
				$("#more-books").remove();
			}
		);
	}

	var on_add_book = function(event) {
		event.preventDefault();
		distlib.shell.set_loading(true);
		$.when(distlib.services.add_book($("#add-book-form").serialize())).then(function(result) {
			distlib.shell.set_loading(false);
			$("#add-book-form")[0].reset()
			set_display_book_modal(false);
			if ($("#empty-books-list").length)
				$("#empty-books-list").replaceWith('<ul class="w3-ul" id="books-list"></ul>');
			add_books_to_view($("#books-list"), [result]);
		})
	};

	var set_display_book_modal = function(status) {
		console.log(status);
		$("#book-modal").css("display", status ? "block" : "none");
	};

	var render = function($container) {
		$container.html(main_html);
		$("close-book-form").click(function(event) {$("close-book-modal").css("display", "none")});
		distlib.shell.set_loading(true);
		$.when(distlib.services.get_books()).then(function(books) {
			distlib.shell.set_loading(false);
			if (books.length == 0)
				$("#books-list").replaceWith('<p id="empty-books-list" class="w3-disabled">No hay libros</p>');
			else {
				add_books_to_view($("#books-list"), books);
				if (books.length >= page_size)
					$("#books-list").after(more_books_button.click(on_more_books));
			}
		});
		$("#show-book-modal").click(function(event) {set_display_book_modal(true)});
		$("#close-book-modal").click(function(event) {set_display_book_modal(false)});
		$("#add-book").click(on_add_book);
	};

	var add_books_to_view = function($container, books) {
		book_count = book_count + books.length;
		for (var i = 0; i < books.length; i = i + 1) {
			var element = $('<li/>').append(
				$('<p/>').append(
					$('<a href="/libros?id=' + books[i].id + '"/>').text(books[i].title).click(function(event) {
						event.preventDefault();
						console.log(event.target.getAttribute("href"));
						history.pushState({}, null, event.target.getAttribute("href"));
						$(window).trigger("hashchange");
					})).append(
					$('<span class="w3-right"/>').text(books[i].year))
				).append(
				$('<p/>').text(books[i].author).append(
					books[i].bearer ? $('<span class="w3-tag w3-right"/>').text('Prestado a ' + books[i].bearer) : null
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