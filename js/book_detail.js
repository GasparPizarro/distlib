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
			+ '<button id="action-button" class="w3-button"></button>'
		+ '</div>'
		+ '<div id="modal" class="w3-modal">'
			+ '<div class="w3-modal-content w3-card-4 w3-animate-opacity" style="max-width:300px">'
				+ '<div class="w3-container">'
					+ '<div class="w3-section">'
						+ '<h3 class="w3-center">¿Are you sure?</h3>'
						+ '<div class="w3-center">'
							+ '<button id="delete-book" class="w3-button w3-red" type="submit">Delete</button>'
							+ ' '
							+ '<button id="cancel-modal" class="w3-button w3-green" type="submit">Cancel</button>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		+ '</div>';

	var book_id;

	var action_button;

	var render = function(container, path_parameters, query_parameters) {
		book_id = path_parameters[0];
		container.innerHTML = main_html;
		if (!book_id)
			return;
		distlib.services.get_book(book_id).then(function(book) {
			var is_mine = book.owner == distlib.user.get_username();
			document.getElementById("book-title").value = book.title;
			document.getElementById("book-author").value = book.author;
			document.getElementById("book-year").value = book.year;
			document.getElementById("book-owner").value = book.owner;
			action_button = document.getElementById("action-button");
			if (is_mine) {
				var button = document.createElement("button");
				button.classList.add("w3-button", "w3-green");
				button.textContent = "Update book";
				button.addEventListener("click", update_book);
				document.getElementById("book-detail").appendChild(document.createTextNode(" "));
				document.getElementById("book-detail").appendChild(button);
				action_button.classList.add("action-delete");
				action_button.classList.add("w3-red");
				action_button.textContent = "Delete book";
			}
			else {
				document.getElementById("book-title").disabled = true;
				document.getElementById("book-author").disabled = true;
				document.getElementById("book-year").disabled = true;
				document.getElementById("book-owner").disabled = true;
				action_button.classList.add("action-ask");
				action_button.classList.add("w3-blue");
				action_button.textContent = "Ask for book";
			}

			if (action_button.classList.contains("action-delete")) {
				if (action_button.classList.contains("w3-disabled"))
					return;
				action_button.addEventListener("click", show_modal);
				document.getElementById("delete-book").addEventListener("click", delete_book);
			}
			if (action_button.classList.contains("action-ask")) {
				action_button.addEventListner("click", ask_for_book);
			}
		})
	};

	var delete_book = function() {
		distlib.services.delete_book(book_id).then(function() {
			distlib.shell.toast("The book has been deleted");
			history.pushState({}, null, "/books");
			window.dispatchEvent(new HashChangeEvent("hashchange"));
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
			action_button.text("Taken");
			action_button.addClass("w3-disabled");
		});
		return false;
	}

	return {
		render: render,
		title: title
	}
}());
