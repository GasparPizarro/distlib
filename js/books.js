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
		$container.innerHTML = main_html;
		page = query_parameters.page ? parseInt(query_parameters.page) : 1;
		var backend_page = page - 1;
		books_list = document.getElementById("books-list");
		distlib.services.get_books(backend_page).then(function(data) {
			var books = data.books;
			var page_count = data.page_count;
			clear_books();
			load_books(books);
			if (page_count > 0) {
				var pagination_buttons = document.createElement("div");
				pagination_buttons.setAttribute("id", "pagination-buttons");
				pagination_buttons.setAttribute("class", "w3-center");
				books_list.after(pagination_buttons);
				pagination_buttons.innerHTML = String()
					+ '<div class="w3-bar">'
						+ (page > 1 ? '<a href="?page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
						+ (page <= page_count ? '<a href="?page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
					+ '</div>';
				$("#pagination-buttons a").click(onClickLink);
			}
		})
	};

	var onClickLink = function() {
		history.pushState({}, null, $(this).attr("href"));
		$(document).trigger("hashchange");
		return false;
	};

	var on_add_book = function() {
		var book = {
			title: document.querySelector("#add-book-form [name=title]").value,
			author: document.querySelector("#add-book-form [name=author]").value,
			year: document.querySelector("#add-book-form [name=year]").value,
		}
		distlib.services.add_book(book).then(function(result) {
			$(document).trigger("hashchange");
			distlib.shell.toast("The book has been added");
		})
		return false;
	};

	var show_modal = function() {
		var modal = document.getElementById('book-modal');
		$("#close-book-modal").click(hide_modal);
		modal.style.display = "block";
		$(document).click(hide_modal);
		return false;
	};

	var hide_modal = function(event) {
		var modal = document.getElementById('book-modal');
		if (modal == event.target) {
			modal.style.display = "none";
			$(document).unbind("click", hide_modal);
		}
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
		books_list.innerHTML = "";
	}

	var onClickLink = function(event) {
		event.preventDefault();
		history.pushState({}, null, $(this).attr("href"));
		$(document).trigger("hashchange");
	}

	var add_books_to_view = function($container, books) {
		for (var i = 0; i < books.length; i = i + 1) {
			var li = document.createElement("li");
			li.innerHTML = String()
				+ '<p>'
					+ '<a href="/books/' + (books[i].id) + '">' + books[i].title + '</a>'
					+ '<span class="w3-right">' + books[i].year + '</span>'
				+ '</p>'
				+ '<p>'
					+ books[i].author
					+ (books[i].bearer != null ? '<span class="w3-tag w3-right">' + 'Lent to ' + books[i].bearer + '</span>' : '')
				+ '</p>'
			$container.appendChild(li);
		}
	}

	return {
		render: render,
		title: title
	}
}());
