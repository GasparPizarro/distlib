distlib.BookDetail = function(book, {requestable, editable, showOwner} = {}) {

	var deleteHtml = String()
		+ '<div class="w3-modal-content w3-card-4 w3-animate-opacity" style="max-width:300px">'
			+ '<div class="w3-container">'
				+ '<div class="w3-section">'
					+ '<h3 class="w3-center">¿Are you sure?</h3>'
					+ '<div class="w3-center">'
						+ '<button class="w3-button w3-red delete-book" type="button">Delete</button>'
						+ ' '
						+ '<button class="w3-button w3-green cancel-modal" type="button">Cancel</button>'
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

	var editing = false;

	var render = function(container) {
		view.container = container;
		var upper = document.createElement("div");
		upper.classList.add("w3-container");
		view.title = document.createElement("span");
		view.title.innerText = book.title;
		if (editable)
			view.title.addEventListener("click", edit);
		var buttons = document.createElement("div");
		buttons.classList.add("w3-right");
		if (editable) {
			view.buttons.delete = document.createElement("button");
			view.buttons.delete.classList.add("w3-button");
			view.buttons.delete.innerHTML = '<i class="fa fa-times"></i>';
			view.buttons.delete.addEventListener("click", showModal);
			buttons.appendChild(view.buttons.delete);
		}
		if (requestable) {
			view.buttons.request = document.createElement("button");
			view.buttons.request.classList.add("w3-button");
			view.buttons.request.innerHTML = '<i class="fa fa-exchange"></i>';
			view.buttons.request.addEventListener("click", requestBook);
			buttons.appendChild(view.buttons.request);
		}


		upper.appendChild(view.title);
		upper.appendChild(buttons);

		var lower = document.createElement("div");
		lower.classList.add("w3-container");
		view.author = document.createElement("div");
		view.author.style.display = "inline";
		view.author.innerText = book.author;
		if (editable)
			view.author.addEventListener("click", edit);
		view.year = document.createElement("div");
		view.year.style.display = "inline";
		view.year.innerText = book.year;
		if (editable)
			view.year.addEventListener("click", edit);
		lower.appendChild(view.author);
		lower.appendChild(document.createTextNode(" | "));
		lower.appendChild(view.year);
		if (book.bearer != null) {
			var bearer = document.createElement("span");
			bearer.classList.add("w3-tag", "w3-right");
			bearer.textContent = 'Lent to ' + book.bearer;
			lower.appendChild(bearer);
		}
		if (showOwner) {
			var owner = document.createElement("span");
			owner.classList.add("w3-tag", "w3-right");
			owner.innerText = book.owner;
			lower.appendChild(owner);
		}
		container.appendChild(upper);
		container.appendChild(lower);
	};

	var edit = function(event) {
		if (editing)
			return;
		editing = true;
		view.title.innerHTML = '<input style="width: ' + (book.title.length + 1) * 8 + 'px" + onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.title + '">';
		view.author.innerHTML = '<input style="width: ' + (book.author.length + 1) * 8 + 'px" + onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.author + '">';
		view.year.innerHTML = '<input style="width: ' + (book.year.length + 1) * 8 + 'px" + onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.year + '">';
		var acceptOnEnter = function(event) {
			if (event.keyCode != 13)
				return;
			acceptChanges(event);
			editing = false;
		}
		view.title.addEventListener("keyup", acceptOnEnter);
		view.author.addEventListener("keyup", acceptOnEnter);
		view.year.addEventListener("keyup", acceptOnEnter);
		document.addEventListener("click", function clickingOutside(event) {
			if (!view.title.contains(event.target) && !view.author.contains(event.target) && !view.year.contains(event.target)) {
				rejectChanges(event);
				editing = false;
				document.removeEventListener("click", clickingOutside);
			}
		});
		document.addEventListener("keyup", function escaping(event) {
			if (event.keyCode != 27)
				return;
			rejectChanges(event);
			editing = false;
			document.removeEventListener("keyup", escaping);
		});
		event.target.childNodes[0].focus();
	}

	var showModal = function(event) {
		var modal = document.createElement("div");
		modal.classList.add("w3-modal");
		modal.style.display = "block";
		modal.innerHTML = deleteHtml;
		view.container.appendChild(modal);
		modal.addEventListener("click", function(event) {
				var cancelModal = modal.getElementsByClassName("cancel-modal")[0];
				if (event.target == modal || event.target == cancelModal)
					modal.style.display = "none";
				return false;
			}
		)
		modal.getElementsByClassName("delete-book")[0].addEventListener("click", function(event) {
			distlib.services.deleteBook(book.id).then(function() {
				view.container.dispatchEvent(new CustomEvent("delete-book", {bubbles: true}));
			});
		});
	}

	var rejectChanges = function(event) {
		view.title.innerText = book.title;
		view.author.innerText = book.author;
		view.year.innerText = book.year;
	}

	var requestBook = function(event) {
		distlib.services.askForBook(book.id).then(function(data) {
			distlib.shell.toast("An email has been sent to the book's owner");
			view.buttons.request.classList.add("w3-disabled");
		});
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
		})
	}

	return {
		render: render
	}
};
