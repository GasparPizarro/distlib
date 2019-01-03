distlib.BookDetail = function(book, {requestable, editable, showOwner} = {}) {
	this.book = book;
	this.requestable = requestable;
	this.editable = editable;
	this.showOwner = showOwner;

	this.view = {
		container: null,
		title: null,
		author: null,
		year: null,
		buttons: {
			edit: null,
			delete: null,
			request: null
		}
	};

	this.editing = false;
};

distlib.BookDetail.prototype.deleteHtml = String()
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

distlib.BookDetail.prototype.render = function(container) {
	this.view.container = container;
	var upper = document.createElement("div");
	this.view.title = document.createElement("span");
	this.view.title.innerText = this.book.title;
	if (this.editable)
		this.view.title.addEventListener("click", this.edit.bind(this));
	var buttons = document.createElement("div");
	buttons.classList.add("w3-right");
	if (this.editable) {
		this.view.buttons.delete = document.createElement("button");
		this.view.buttons.delete.classList.add("w3-button");
		this.view.buttons.delete.innerHTML = '<i class="fa fa-times"></i>';
		this.view.buttons.delete.addEventListener("click", this.showModal.bind(this));
		buttons.appendChild(this.view.buttons.delete);
	}
	if (this.requestable) {
		this.view.buttons.request = document.createElement("button");
		this.view.buttons.request.classList.add("w3-button");
		this.view.buttons.request.innerHTML = '<i class="fa fa-exchange"></i>';
		this.view.buttons.request.addEventListener("click", this.requestBook.bind(this));
		buttons.appendChild(this.view.buttons.request);
	}


	upper.appendChild(this.view.title);
	upper.appendChild(buttons);

	var lower = document.createElement("div");
	this.view.author = document.createElement("span");
	this.view.author.innerText = this.book.author;
	if (this.editable)
		this.view.author.addEventListener("click", this.edit.bind(this));
	this.view.year = document.createElement("span");
	this.view.year.innerText = this.book.year;
	if (this.editable)
		this.view.year.addEventListener("click", this.edit.bind(this));
	lower.appendChild(this.view.author);
	lower.appendChild(document.createTextNode(" | "));
	lower.appendChild(this.view.year);
	if (this.book.bearer != null) {
		var bearer = document.createElement("span");
		bearer.classList.add("w3-tag", "w3-right");
		bearer.textContent = 'Lent to ' + this.book.bearer;
		lower.appendChild(bearer);
	}
	if (this.showOwner) {
		var owner = document.createElement("span");
		owner.classList.add("w3-tag", "w3-right");
		owner.innerText = this.book.owner;
		lower.appendChild(owner);
	}
	container.appendChild(upper);
	container.appendChild(lower);
};

distlib.BookDetail.prototype.createInput = function(text) {
	var element = document.createElement("input");
	element.type = "text";
	element.value = text;
	element.style.width = text.length * 9 + "px";
	element.classList = "w3-input, w3-border-0";
	element.addEventListener("input", function() {
		this.style.width = this.value.length * 9 + 'px';
	});
	return element;
};

distlib.BookDetail.prototype.edit = function(event) {
	if (this.editing)
		return;
	this.editing = true;
	this.view.title.innerHTML = '';
	this.view.title.appendChild(this.createInput(this.book.title));
	this.view.author.innerHTML = '';
	this.view.author.appendChild(this.createInput(this.book.author));
	this.view.year.innerHTML = ''
	this.view.year.appendChild(this.createInput(this.book.year.toString()));
	var acceptOnEnter = function(event) {
		if (event.keyCode != 13)
			return;
		this.acceptChanges(event);
		this.editing = false;
	}
	this.view.title.addEventListener("keyup", acceptOnEnter.bind(this));
	this.view.author.addEventListener("keyup", acceptOnEnter.bind(this));
	this.view.year.addEventListener("keyup", acceptOnEnter.bind(this));
	document.addEventListener("click", function clickingOutside(event) {
		if (!this.view.title.contains(event.target) && !this.view.author.contains(event.target) && !this.view.year.contains(event.target)) {
			this.rejectChanges(event);
			this.editing = false;
			document.removeEventListener("click", clickingOutside);
		}
	}.bind(this));
	document.addEventListener("keyup", function escaping(event) {
		if (event.keyCode != 27)
			return;
		this.rejectChanges(event);
		this.editing = false;
		document.removeEventListener("keyup", escaping);
	}.bind(this));
	event.target.childNodes[0].focus();
};

distlib.BookDetail.prototype.showModal = function() {
	var modal = document.createElement("div");
	modal.classList.add("w3-modal");
	modal.style.display = "block";
	modal.innerHTML = this.deleteHtml;
	this.view.container.appendChild(modal);
	modal.addEventListener("click", function(event) {
			var cancelModal = modal.getElementsByClassName("cancel-modal")[0];
			if (event.target == modal || event.target == cancelModal)
				modal.style.display = "none";
			return false;
		}
	)
	window.addEventListener("keypress", function closeModal(event) {
		if (event.keyCode == 27) {
			modal.style.display = "none";
			window.removeEventListener("keypress", closeModal);
		}
		return false;
	});
	modal.getElementsByClassName("delete-book")[0].addEventListener("click", function() {
		distlib.services.deleteBook(this.book.id).then(function() {
			this.view.container.dispatchEvent(new CustomEvent("delete-book", {bubbles: true}));
		}.bind(this));
	}.bind(this));
};

distlib.BookDetail.prototype.rejectChanges = function() {
	this.view.title.innerText = this.book.title;
	this.view.author.innerText = this.book.author;
	this.view.year.innerText = this.book.year;
};

distlib.BookDetail.prototype.requestBook = function() {
	distlib.services.askForBook(this.book.id).then(function(data) {
		distlib.shell.toast("An email has been sent to the book's owner");
		this.view.buttons.request.classList.add("w3-disabled");
	}.bind(this));
};

distlib.BookDetail.prototype.acceptChanges = function(event) {
	this.book.title = this.view.title.firstChild.value;
	this.book.author = this.view.author.firstChild.value;
	this.book.year = this.view.year.firstChild.value;
	distlib.services.updateBook(this.book.id, this.book).then(function() {
		distlib.shell.toast("The book has been updated");
		this.view.title.innerText = this.book.title;
		this.view.author.innerText = this.book.author;
		this.view.year.innerText = this.book.year;
	}.bind(this))
};
