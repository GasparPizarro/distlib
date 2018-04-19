distlib.book_detail = (function() {
	'use strict';

	var title = "Book detail";

	var main_html = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5>Book detail</h5>'
		+ '</header>'
		+ '<form id="book-detail" class="w3-container">'
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
				+ '<div class="w3-center"><br>'
					+ '<span onclick="document.getElementById(\'modal\').style.display=\'none\'" class="w3-button w3-display-topright" title="Close Modal">&times;</span>'
				+ '</div>'
				+ '<div class="w3-container">'
					+ '<div class="w3-section">'
						+ '<h3 class="w3-center">¿Are you sure?</h3>'
						+ '<div class="w3-center">'
							+ '<button id="delete-book" class="w3-button w3-red" type="submit">Delete</button>'
							+ ' '
							+ '<button onclick="document.getElementById(\'modal\').style.display=\'none\'" class="w3-button w3-green" type="submit">Cancel</button>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		+ '</div>';

	var book_id;

	var action_button;

	var render = function($container, path_parameters, query_parameters) {
		book_id = path_parameters[0];
		$container.html(main_html);
		var target_node = $container;
		if (!book_id)
			return;
		$.when(distlib.services.get_book(book_id)).then(function(book) {
			var is_mine = book.owner == distlib.user.get_username();
			$("#book-title").val(book.title);
			$("#book-author").val(book.author);
			$("#book-year").val(book.year);
			$("#book-owner").val(book.owner);
			action_button = $("#action-button");
			if (is_mine) {
				var button = $('<button class="w3-button w3-green">Update book</button>');
				button.click(update_book);
				$("#book-detail").append(' ').append(button);
				action_button.addClass("action-delete").addClass("w3-red").text("Delete book");
			}
			else {
				$("#book-title").prop("disabled", true);
				$("#book-author").prop("disabled", true);
				$("#book-year").prop("disabled", true);
				$("#book-owner").prop("disabled", true);
				action_button.addClass("action-ask").addClass("w3-blue").text("Ask for book");
			}

			if (action_button.hasClass("action-delete")) {
				if (action_button.hasClass("w3-disabled"))
					return;
				action_button.click(function(event) {
					event.preventDefault();
					var modal = document.getElementById('modal');
					modal.style.display = "block";
				});
				$("#delete-book").click(function(event) {
					event.preventDefault();
					$.when(distlib.services.delete_book(book_id)).then(function(result) {
						distlib.shell.toast("The book has been deleted");
						history.pushState({}, null, "/books");
						$(document).trigger('hashchange');
					})
				});
			}
			if (action_button.hasClass("action-ask")) {
				action_button.click(ask_for_book);
			}
		})
	};

	var update_book = function() {
		var data = {
			"title": $("#book-title").val(),
			"author": $("#book-author").val(),
			"year": $("#book-year").val()
		}
		$.when(distlib.services.update_book(book_id, data)).then(function(result) {
			console.log("updated book");
		})
		return false;
	};

	var ask_for_book = function(event) {
		event.preventDefault();
		$.when(distlib.services.ask_for_book(book_id)).then(function(data) {
			distlib.shell.toast("An email has been sent to the book's owner");
			action_button.text("Taken");
			action_button.addClass("w3-disabled");
		});
	}

	return {
		render: render,
		title: title
	}
}());
