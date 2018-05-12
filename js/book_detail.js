distlib.book_detail = (function() {
	'use strict';

	var title = "Book detail";

	var main_html = String()
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
			+ '<div id="book_actions"></div>'
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

	var no_book_html = "Not found";

	var book_id;

	var action_button;

	var render = function(container, path_parameters, query_parameters) {
		book_id = path_parameters[0];
		if (!book_id)
			return;
		distlib.services.get_book(book_id).then(function(book) {
			if (!book) {
				container.innerHTML = no_book_html;
				return;
			}
			container.innerHTML = main_html;
			var book_actions = document.getElementById("book_actions");
			var is_mine = book.owner == distlib.auth.get_username();
			document.getElementById("book-title").value = book.title;
			document.getElementById("book-author").value = book.author;
			document.getElementById("book-year").value = book.year;
			document.getElementById("book-owner").value = book.owner;
			if (is_mine) {
				var update_button = document.createElement("button");
				update_button.classList.add("w3-button", "w3-green");
				update_button.textContent = "Update book";
				update_button.addEventListener("click", update_book);
				book_actions.appendChild(update_button);
				book_actions.appendChild(document.createTextNode(" "));
				var delete_button = document.createElement("button");
				delete_button.classList.add("w3-button", "w3-red");
				delete_button.textContent = "Delete book";
				delete_button.addEventListener("click", show_modal);
				book_actions.appendChild(delete_button);
			}
			else {
				document.getElementById("book-title").disabled = true;
				document.getElementById("book-author").disabled = true;
				document.getElementById("book-year").disabled = true;
				document.getElementById("book-owner").disabled = true;
				var ask_button = document.createElement("button");
				ask_button.classList.add("action-ask");
				ask_button.classList.add("w3-button", "w3-blue");
				ask_button.textContent = "Ask for book";
				ask_button.addEventListener("click", ask_for_book);
				book_actions.appendChild(ask_button);
			}
		})
	};

	var delete_book = function() {
		distlib.services.delete_book(book_id).then(function() {
			distlib.shell.toast("The book has been deleted");
			history.pushState({}, null, "/books");
			window.dispatchEvent(new CustomEvent("routing"));
		});
		return false;
	}

	var show_modal = function(event) {
		event.preventDefault();
		event.stopPropagation();
		var modal = document.getElementById('modal');
		modal.style.display = "block";
		modal.addEventListener("click", hide_modal);
		return false;
	};

	var hide_modal = function(event) {
		var modal = document.getElementById('modal');
		var cancel_modal = document.getElementById("cancel-modal");
		if (event.target == modal || event.target == cancel_modal)
			modal.style.display = "none";
		return false;
	};

	var update_book = function() {
		var data = {
			"title": document.getElementById("book-title").value,
			"author": document.getElementById("book-author").value,
			"year": document.getElementById("book-year").value
		}
		distlib.services.update_book(book_id, data).then(function() {
			distlib.shell.toast("The book has been updated");
		})
		return false;
	};

	var ask_for_book = function(event) {
		distlib.services.ask_for_book(book_id).then(function(data) {
			distlib.shell.toast("An email has been sent to the book's owner");
			action_button.textContent = "Taken";
			action_button.classList.add("w3-disabled");
		});
		return false;
	}

	return {
		render: render,
		title: title
	}
}());
