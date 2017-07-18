distlib.search = (function() {
	'use strict';

	var title = "Buscar libros";

	var book_count = 0;

	var page_size = 10;

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<input id="search-box" class="w3-input w3-margin-top" type="text">'
		+ '</div>';

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
				$('<p/>').text(books[i].author).append('<span class="w3-tag w3-right">' + books[i].owner + '</span>')
			);
			$container.append(element);
		}
	};

	var more_books_button = $('<div class="w3-center" id="book-pad" style="height: 75px"><button id="more-books" type="button" class="w3-button w3-blue">Más</button></div>');

	var on_more_books = function(event) {
		event.preventDefault();
		$(event.target).addClass("w3-disabled");
		distlib.shell.set_loading(true);
		$.when(distlib.services.search($("#search-box").val(), page_size, book_count)).then(function(books) {
			$(event.target).removeClass("w3-disabled");
			distlib.shell.set_loading(false);
			if (books.length != 0)
				add_books_to_view($("#books-list"), books);
			if (books.length < page_size)
				$("#more-books").remove();
			}
		);
	}

	var render = function($container, params) {
		console.log(params);
		$container.html(main_html);
		if (params.q || params.q == "") {
			$("#search-box").val(params.q);
			search(params.q);
		}
		$("#search-box").keyup(
			function (event) {
				if (event.keyCode != 13)
					return;
				search($("#search-box").val());
			}
		);
	}

	var search = function(query) {
		history.pushState({}, null, window.location.hash + '?q=' + query);
		distlib.shell.set_loading(true);
		$("#search-box").nextAll().remove();
		$.when(distlib.services.search(query)).then(function(books) {
			distlib.shell.set_loading(false);
			if (books.length == 0)
				$("#search-box").after('<p id="empty-books-list" class="w3-disabled">No hay libros</p>');
			else {
				$("#search-box").after('<ul class="w3-ul" id="books-list"></ul>');
				add_books_to_view($("#books-list"), books);
				if (books.length >= page_size)
					$("#books-list").after(more_books_button.click(on_more_books));
			}
			if (books.length != 0) {
				$(".search-result").click(function(event) {
					event.preventDefault();
					console.log(event.target.getAttribute("href"));
					history.pushState({}, null, event.target.getAttribute("href"));
					$(window).trigger("hashchange");
				});
			}
			$("#search-box").blur();
		});
	};

	return {
		render: render,
		title: title
	}
}());