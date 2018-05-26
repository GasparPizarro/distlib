distlib.books = (function() {
	'use strict';

	var title = "My books";

	var page;

	var pageCount;

	var mainHtml = String()
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

	var noBooksHtml = '<p id="empty-books-list" class="w3-disabled">There are no books</p>';

	var booksList;

	var paginationButtons;

	var showBookModal;

	var init = function(container, _, queryParameters) {
		container.innerHTML = mainHtml;
		page = queryParameters.page ? parseInt(queryParameters.page) : 1;
		var backendPage = page - 1;
		booksList = document.getElementById("books-list");
		paginationButtons = document.getElementById("pagination-buttons");
		loadCurrentPage();
		document.getElementById("show-book-modal").addEventListener("click", showModal);
		document.getElementById("add-book").addEventListener("click", onAddBook);
	};

	var loadCurrentPage = function() {
		var backendPage = page - 1;
		distlib.services.getBooks(backendPage).then(function(data) {
			pageCount = data.pageCount;
			clearBooks();
			addBooksToView(booksList, data.books);
			addPaginationButtons(paginationButtons, pageCount);
			window.scrollTo(0, 0);
		});
	};

	var addPaginationButtons = function(container, pageCount) {
		if (pageCount == 0)
			return;
		container.innerHTML = String()
			+ (page > 1 ? '<a id="previous-page" href="?page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
			+ (page <  pageCount ? '<a id="next-page" href="?page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
		var previousPageButton = document.getElementById("previous-page");
		var nextPageButton = document.getElementById("next-page");
		if (previousPageButton != null)
			previousPageButton.addEventListener("click", function(event){return goToPage(event, page - 1)});
		if (nextPageButton != null)
			nextPageButton.addEventListener("click", function(event){return goToPage(event, page + 1)});
	};

	var goToPage = function(event, thePage) {
		event.preventDefault();
		event.stopPropagation();
		page = thePage;
		history.pushState({}, null, "/books?page=" + page);
		loadCurrentPage();
		return false;
	};

	var onAddBook = function(event) {
		event.preventDefault();
		event.stopPropagation();
		var book = {
			title: document.querySelector("#add-book-form [name=title]").value,
			author: document.querySelector("#add-book-form [name=author]").value,
			year: document.querySelector("#add-book-form [name=year]").value,
		}
		distlib.services.addBook(book).then(function(result) {
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
		booksList.innerHTML = "";
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
			li.querySelector("p a").addEventListener("click", goToBook);
		}
	}

	var goToBook = function(event) {
		event.preventDefault();
		history.pushState({}, null, event.target.getAttribute("href"));
		window.dispatchEvent(new CustomEvent("routing"));
	}

	return {
		init: init,
		title: title
	}
}());
