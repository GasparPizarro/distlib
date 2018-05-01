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

	var render = function(container, _, query_parameters) {
		container.innerHTML = main_html;
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
						+ (page > 1 ? '<a id="previous-page" href="?page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
						+ (page <= page_count ? '<a id="next-page" href="?page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
					+ '</div>';
				var previous_page_button = document.getElementById("previous-page");
				var next_page_button = document.getElementById("next-page");
				if (previous_page_button != null)
					previous_page_button.addEventListener("click", goToPreviousPage);
				if (next_page_button != null)
					next_page_button.addEventListener("click", goToNextPage);
			}
		})
	};

	var goToPage = function(page) {
		history.pushState(null, null, "/books?page=" + page);
		clear_books();
		var backend_page = page - 1;
		distlib.services.get_books(backend_page).then(function(data) {
			load_books(data.books);
			if (document.getElementById("pagination-buttons") != null)
				document.getElementById("pagination-buttons").remove();
			if (data.page_count > 0) {
				var pagination_buttons = document.createElement("div");
				pagination_buttons.setAttribute("id", "pagination-buttons");
				pagination_buttons.setAttribute("class", "w3-center");
				books_list.after(pagination_buttons);
				pagination_buttons.innerHTML = String()
					+ '<div class="w3-bar">'
						+ (page > 1 ? '<a id="previous-page" href="?page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
						+ (page < data.page_count ? '<a id="next-page" href="?page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
					+ '</div>';
				var previous_page_button = document.getElementById("previous-page");
				var next_page_button = document.getElementById("next-page");
				if (previous_page_button != null)
					previous_page_button.addEventListener("click", goToPreviousPage);
				if (next_page_button != null)
					next_page_button.addEventListener("click", goToNextPage);
			}
		});
	};

	var goToNextPage = function(event) {
		event.preventDefault();
		event.stopPropagation();
		page = page + 1;
		goToPage(page);
	};

	var goToPreviousPage = function(event) {
		event.preventDefault();
		event.stopPropagation();
		page = page - 1;
		goToPage(page);
	}

	var on_add_book = function(event) {
		event.preventDefault();
		event.stopPropagation();
		var book = {
			title: document.querySelector("#add-book-form [name=title]").value,
			author: document.querySelector("#add-book-form [name=author]").value,
			year: document.querySelector("#add-book-form [name=year]").value,
		}
		distlib.services.add_book(book).then(function(result) {
			window.dispatchEvent(new HashChangeEvent("hashchange"));
			distlib.shell.toast("The book has been added");
		})
		return false;
	};

	var show_modal = function(event) {
		event.preventDefault();
		event.stopPropagation();
		var modal = document.getElementById('book-modal');
		modal.style.display = "block";
		modal.addEventListener("click", hide_modal);
		document.addEventListener("keydown", escapeFromModal);
		return false;
	};

	var escapeFromModal = function(event) {
		if (event.key == "Escape")
			document.getElementById('book-modal').style.display = "none";
	}

	var hide_modal = function(event) {
		var modal = document.getElementById('book-modal');
		if (event.target == modal)
			modal.style.display = "none";
		return false;
	}

	var load_books = function(books) {
		if (books.length == 0)
			books_list.replaceWith(no_books_html);
		else
			add_books_to_view(books_list, books);
		document.getElementById("show-book-modal").addEventListener("click", show_modal);
		document.getElementById("add-book").addEventListener("click", on_add_book);
		document.querySelectorAll("#books-list a").forEach(function(element){element.addEventListener("click", distlib.shell.onClickLink)});
	}

	var clear_books = function() {
		books_list.innerHTML = "";
	}

	var add_books_to_view = function(container, books) {
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
			container.appendChild(li);
		}
	}

	return {
		render: render,
		title: title
	}
}());
