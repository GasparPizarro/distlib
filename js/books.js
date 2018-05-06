distlib.books = (function() {
	'use strict';

	var title = "My books";

	var page;

	var page_count;

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<ul class="w3-ul" id="books-list" placeholder="There are no books">'
			+ '</ul>'
			+ '<div id="pagination-buttons" class="w3-center"></div>'
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

	var pagination_buttons;

	var show_book_modal;

	var render = function(container, _, query_parameters) {
		container.innerHTML = main_html;
		page = query_parameters.page ? parseInt(query_parameters.page) : 1;
		var backend_page = page - 1;
		books_list = document.getElementById("books-list");
		pagination_buttons = document.getElementById("pagination-buttons");
		loadCurrentPage();
		document.getElementById("show-book-modal").addEventListener("click", showModal);
		document.getElementById("add-book").addEventListener("click", on_add_book);
	};

	var loadCurrentPage = function() {
		var backendPage = page - 1;
		distlib.services.get_books(backendPage).then(function(data) {
			page_count = data.page_count;
			clearBooks();
			addBooksToView(books_list, data.books);
			addPaginationButtons(pagination_buttons, page_count);
			window.scrollTo(0, 0);
		});
	};

	var addPaginationButtons = function(container, page_count) {
		if (page_count == 0)
			return;
		pagination_buttons.innerHTML = String()
			+ (page > 1 ? '<a id="previous-page" href="?page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
			+ (page <  page_count ? '<a id="next-page" href="?page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
		var previous_page_button = document.getElementById("previous-page");
		var next_page_button = document.getElementById("next-page");
		if (previous_page_button != null)
			previous_page_button.addEventListener("click", function(event){return goToPage(event, page - 1)});
		if (next_page_button != null)
			next_page_button.addEventListener("click", function(event){return goToPage(event, page + 1)});
	};

	var goToPage = function(event, the_page) {
		event.preventDefault();
		event.stopPropagation();
		page = the_page;
		history.pushState({}, null, "/books?page=" + page);
		loadCurrentPage();
		return false;
	};

	var on_add_book = function(event) {
		event.preventDefault();
		event.stopPropagation();
		var book = {
			title: document.querySelector("#add-book-form [name=title]").value,
			author: document.querySelector("#add-book-form [name=author]").value,
			year: document.querySelector("#add-book-form [name=year]").value,
		}
		distlib.services.add_book(book).then(function(result) {
			window.dispatchEvent(new CustomEvent("routing"));
			distlib.shell.toast("The book has been added");
		})
		return false;
	};

	var showModal = function(event) {
		event.preventDefault();
		event.stopPropagation();
		var modal = document.getElementById('book-modal');
		modal.style.display = "block";
		modal.addEventListener("click", hideModal);
		document.addEventListener("keydown", escapeFromModal);
		return false;
	};

	var escapeFromModal = function(event) {
		if (event.key == "Escape")
			document.getElementById('book-modal').style.display = "none";
	}

	var hideModal = function(event) {
		var modal = document.getElementById('book-modal');
		if (event.target == modal)
			modal.style.display = "none";
		return false;
			}

	var clearBooks = function() {
		books_list.innerHTML = "";
	}

	var addBooksToView = function(container, books) {
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
				+ '</p>';
			container.appendChild(li);
			li.querySelector("a").addEventListener("click", goToBook);
		}
	}

	var goToBook = function(event) {
		event.preventDefault();
		history.pushState({}, null, event.target.getAttribute("href"));
		window.dispatchEvent(new CustomEvent("routing"));
	}

	return {
		render: render,
		title: title
	}
}());
