distlib.bookDetail = (function() {
	'use strict';

	var title = "Book detail";

	var mainHtml = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5>Book detail</h5>'
		+ '</header>'
		+ '<div id="book-detail" class="w3-container">'
			+ '<p>'
				+ '<label class="w3-label">Title</label>'
				+ '<input id="book-title" name="title" class="w3-input" type="text"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-label">Author</label>'
				+ '<input id="book-author" name="author" class="w3-input" type="text"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-label">Year</label>'
				+ '<input id="book-year" name="year" class="w3-input" type="number"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-label">Owner</label>'
				+ '<input id="book-owner" class="w3-input" type="text" disabled/>'
			+ '</p>'
			+ '<div id="bookActions"></div>'
		+ '</div>'
		+ '<div id="modal" class="w3-modal">'
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
			+ '</div>'
		+ '</div>';

	var noBookHtml = "Not found";

	var bookId;

	var actionButton;

	var render = function(container, pathParameters, queryParameters) {
		bookId = pathParameters[0];
		if (!bookId)
			return;
		distlib.services.getBook(bookId).then(function(book) {
			if (!book) {
				container.innerHTML = noBookHtml;
				return;
			}
			container.innerHTML = mainHtml;
			var bookActions = document.getElementById("bookActions");
			var isMine = book.owner == distlib.auth.getUsername();
			document.getElementById("book-title").value = book.title;
			document.getElementById("book-author").value = book.author;
			document.getElementById("book-year").value = book.year;
			document.getElementById("book-owner").value = book.owner;
			if (isMine) {
				var updateButton = document.createElement("button");
				updateButton.classList.add("w3-button", "w3-green");
				updateButton.textContent = "Update book";
				updateButton.addEventListener("click", updateBook);
				bookActions.appendChild(updateButton);
				bookActions.appendChild(document.createTextNode(" "));
				var deleteButton = document.createElement("button");
				deleteButton.classList.add("w3-button", "w3-red");
				deleteButton.textContent = "Delete book";
				deleteButton.addEventListener("click", showModal);
				bookActions.appendChild(deleteButton);
			}
			else {
				document.getElementById("book-title").disabled = true;
				document.getElementById("book-author").disabled = true;
				document.getElementById("book-year").disabled = true;
				document.getElementById("book-owner").disabled = true;
				var askButton = document.createElement("button");
				askButton.classList.add("action-ask");
				askButton.classList.add("w3-button", "w3-blue");
				askButton.textContent = "Ask for book";
				askButton.addEventListener("click", askForBook);
				bookActions.appendChild(askButton);
			}
		})
	};

	var deleteBook = function() {
		console.log("asdfasdf");
		distlib.services.deleteBook(bookId).then(function() {
			distlib.shell.toast("The book has been deleted");
			history.pushState({}, null, "/books");
			window.dispatchEvent(new CustomEvent("routing"));
		});
		return false;
	}

	var showModal = function(event) {
		event.preventDefault();
		event.stopPropagation();
		var modal = document.getElementById('modal');
		modal.style.display = "block";
		modal.addEventListener("click", hideModal);
		document.getElementById("delete-book").addEventListener("click", deleteBook);
		return false;
	};

	var hideModal = function(event) {
		var modal = document.getElementById('modal');
		var cancelModal = document.getElementById("cancel-modal");
		if (event.target == modal || event.target == cancelModal)
			modal.style.display = "none";
		return false;
	};

	var updateBook = function() {
		var data = {
			"title": document.getElementById("book-title").value,
			"author": document.getElementById("book-author").value,
			"year": document.getElementById("book-year").value
		}
		distlib.services.updateBook(bookId, data).then(function() {
			distlib.shell.toast("The book has been updated");
		})
		return false;
	};

	var askForBook = function(event) {
		distlib.services.askForBook(bookId).then(function(data) {
			distlib.shell.toast("An email has been sent to the book's owner");
			actionButton.textContent = "Taken";
			actionButton.classList.add("w3-disabled");
		});
		return false;
	}

	return {
		render: render,
		title: title
	}
}());
