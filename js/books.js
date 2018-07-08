distlib.books = (function() {
	'use strict';

	var title = "My books";

	var model = {
		page: 1,
		pageCount: 1,
		books: []
	};

	var view = {
		container: null,
		booksList: null,
		paginationButtons: null,
		showBookModal: null,
	}


	var BookDetail = function(book) {

		var deleteHtml = String()
			+ '<div class="w3-modal-content w3-card-4 w3-animate-opacity" style="max-width:300px">'
				+ '<div class="w3-container">'
					+ '<div class="w3-section">'
						+ '<h3 class="w3-center">¿Are you sure?</h3>'
						+ '<div class="w3-center">'
							+ '<button id="delete-book" class="w3-button w3-red" type="button">Delete</button>'
							+ ' '
							+ '<button id="cancel-modal" class="w3-button w3-green" type="button">Cancel</button>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>';

		var view = {
			container: null,
			title: null,
			author: null,
			year: null,
			buttons: {
				edit: null,
				delete: null,
				request: null
			}
		}

		var render = function(container) {
			view.container = container;
			var upper = document.createElement("div");
			upper.classList.add("w3-container");
			view.title = document.createElement("span");
			view.title.innerText = book.title;
			var buttons = document.createElement("div");
			buttons.classList.add("w3-right");

			view.buttons.edit = document.createElement("button");
			view.buttons.edit.classList.add("w3-button");
			view.buttons.edit.innerHTML = '<i class="fa fa-pencil"></i>';
			view.buttons.edit.addEventListener("click", edit);
			view.buttons.delete = document.createElement("button");
			view.buttons.delete.classList.add("w3-button");
			view.buttons.delete.innerHTML = '<i class="fa fa-times"></i>';
			view.buttons.delete.addEventListener("click", showModal);
			view.buttons.request = document.createElement("button");
			view.buttons.request.classList.add("w3-button");
			view.buttons.request.innerHTML = '<i class="fa fa-exchange"></i>';

			buttons.appendChild(view.buttons.edit);
			buttons.appendChild(view.buttons.delete);
			buttons.appendChild(view.buttons.request);

			upper.appendChild(view.title);
			upper.appendChild(buttons);

			var lower = document.createElement("div");
			lower.classList.add("w3-container");
			view.author = document.createElement("div");
			view.author.style.display = "inline";
			view.author.innerText = book.author;
			view.year = document.createElement("div");
			view.year.style.display = "inline";
			view.year.innerText = book.year;
			lower.appendChild(view.author);
			lower.appendChild(document.createTextNode(" | "));
			lower.appendChild(view.year);
			if (book.bearer != null) {
				var bearer = document.createElement("span");
				bearer.classList.add("w3-tag", "w3-right");
				bearer.textContent = 'Lent to ' + book.bearer;
				lower.appendChild(bearer);
			}
			container.appendChild(upper);
			container.appendChild(lower);
		};

		var edit = function(event) {
			view.title.innerHTML = '<input onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.title + '">';
			view.author.innerHTML = '<input onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.author + '">';
			view.year.innerHTML = '<input onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.year + '">';
			view.buttons.edit.innerHTML = '<i class="fa fa-undo"></i>'
			view.buttons.edit.removeEventListener("click", edit);
			view.buttons.edit.addEventListener("click", rejectChanges);
			var acceptOnEnter = function(event) {
				if (event.keyCode != 13)
					return;
				acceptChanges(event);
			}
			view.title.addEventListener("keyup", acceptOnEnter);
			view.author.addEventListener("keyup", acceptOnEnter);
			view.year.addEventListener("keyup", acceptOnEnter);
		}

		var showModal = function(event) {
			console.log("Deleting");
			var modal = document.createElement("div");
			modal.classList.add("w3-modal");
			modal.style.display = "block";
			modal.innerHTML = deleteHtml;
			view.container.appendChild(modal);
		}

		var rejectChanges = function(event) {
			view.title.innerText = book.title;
			view.author.innerText = book.author;
			view.year.innerText = book.year;
			view.buttons.edit.innerHTML = '<i class="fa fa-pencil"></i>';
			view.buttons.edit.removeEventListener("click", rejectChanges);
			view.buttons.edit.addEventListener("click", edit);
		}

		var acceptChanges = function(event) {
			book.title = view.title.firstChild.value;
			book.author = view.author.firstChild.value;
			book.year = view.year.firstChild.value;
			distlib.services.updateBook(book.id, book).then(function() {
				distlib.shell.toast("The book has been updated");
				view.title.innerText = book.title;
				view.author.innerText = book.author;
				view.year.innerText = book.year;
				view.buttons.edit.innerHTML = '<i class="fa fa-pencil"></i>'
				view.buttons.edit.removeEventListener("click", rejectChanges);
				view.buttons.edit.addEventListener("click", edit);
			})
		}

		return {
			render: render
		}
	};

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

	var init = function(container, _, queryParameters) {
		view.container = container
		view.container.innerHTML = mainHtml;
		model.page = queryParameters.page ? parseInt(queryParameters.page) : 1;
		view.booksList = document.getElementById("books-list");
		view.paginationButtons = document.getElementById("pagination-buttons");
		loadData().then(render);
		document.getElementById("show-book-modal").addEventListener("click", showModal);
		document.getElementById("add-book").addEventListener("click", onAddBook);
	};

	var loadData = function() {
		return distlib.services.getBooks(model.page).then(function(data) {

			model.pageCount = data.pageCount;
			model.books = data.books;
		});
	};

	var render = function() {
		view.booksList.innerHTML = "";
		for (var i = 0; i < model.books.length; i = i + 1) {
			var li = document.createElement("li");
			var bookDetail = BookDetail(model.books[i]);
			bookDetail.render(li);
			view.booksList.appendChild(li);
			// li.querySelector("p a").addEventListener("click", goToBook);
		}
		view.paginationButtons.innerHTML = String()
			+ (model.page > 1 ? '<a id="previous-page" href="?page=' + (model.page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
			+ (model.page < model.pageCount ? '<a id="next-page" href="?page=' + (model.page + 1) + '" class="w3-button">&raquo;</a>' : '')
		var previousPageButton = document.getElementById("previous-page");
		var nextPageButton = document.getElementById("next-page");
		if (previousPageButton != null)
			previousPageButton.addEventListener("click", function(event) {
				event.preventDefault();
				goToPage(model.page - 1);
			});
		if (nextPageButton != null)
			nextPageButton.addEventListener("click", function(event) {
				event.preventDefault();
				goToPage(model.page + 1);
			});
		window.scrollTo(0, 0);
	};

	var goToPage = function(page) {
		model.page = page;
		history.pushState({}, null, "/books?page=" + model.page);
		loadData().then(render);
	}

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
