distlib.BookDetail = function(book) {

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

	var render = function(container) {
		view.container = container;
		var upper = document.createElement("div");
		upper.classList.add("w3-container");
		view.title = document.createElement("span");
		view.title.innerText = book.title;
		view.title.addEventListener("dblclick", edit);
		var buttons = document.createElement("div");
		buttons.classList.add("w3-right");
		view.buttons.delete = document.createElement("button");
		view.buttons.delete.classList.add("w3-button");
		view.buttons.delete.innerHTML = '<i class="fa fa-times"></i>';
		view.buttons.delete.addEventListener("click", showModal);
		view.buttons.request = document.createElement("button");
		view.buttons.request.classList.add("w3-button");
		view.buttons.request.innerHTML = '<i class="fa fa-exchange"></i>';

		buttons.appendChild(view.buttons.delete);
		buttons.appendChild(view.buttons.request);

		upper.appendChild(view.title);
		upper.appendChild(buttons);

		var lower = document.createElement("div");
		lower.classList.add("w3-container");
		view.author = document.createElement("div");
		view.author.style.display = "inline";
		view.author.innerText = book.author;
		view.author.addEventListener("dblclick", edit);
		view.year = document.createElement("div");
		view.year.style.display = "inline";
		view.year.innerText = book.year;
		view.year.addEventListener("dblclick", edit);
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
		view.title.innerHTML = '<input style="width: ' + (book.title.length + 1) * 8 + 'px" + onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.title + '">';
		view.author.innerHTML = '<input style="width: ' + (book.author.length + 1) * 8 + 'px" + onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.author + '">';
		view.year.innerHTML = '<input style="width: ' + (book.year.length + 1) * 8 + 'px" + onkeypress="this.style.width = ((this.value.length + 1) * 8) + \'px\';" type="text" value="' + book.year + '">';
		var acceptOnEnter = function(event) {
			if (event.keyCode != 13)
				return;
			acceptChanges(event);
		}
		view.title.addEventListener("keyup", acceptOnEnter);
		view.author.addEventListener("keyup", acceptOnEnter);
		view.year.addEventListener("keyup", acceptOnEnter);
		document.addEventListener("click", function clickingOutside(event) {
			if (!view.title.contains(event.target) && !view.author.contains(event.target) && !view.year.contains(event.target)) {
				rejectChanges(event);
				document.removeEventListener("click", clickingOutside);
			}
		});
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
			console.log("dispatching event");
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
