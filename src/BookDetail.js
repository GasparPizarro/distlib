import {toast} from "./shell";
import * as auth from "./auth";

var BookDetail = function(book, {requestable, editable, showOwner} = {}) {
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

BookDetail.prototype.deleteElement = (() => {
	let root = document.createElement("div");
	root.classList.add("w3-modal-content", "w3-card-4", "w3-animate-opacity");
	root.style.maxWidth = 300;
	root.appendChild((() => {
		let root = document.createElement("div");
		root.classList.add("w3-container");
		root.appendChild((() => {
			let root = document.createElement("div");
			root.classList.add("w3-section");
			root.appendChild((() => {
				let root = document.createElement("h3");
				root.classList.add("w3-center");
				root.innerText = "Are you sure?";
				return root;
			})());
			root.appendChild((() => {
				let root = document.createElement("div");
				root.classList.add("w3-center");
				root.appendChild((() => {
					let root = document.createElement("button");
					root.classList.add("w3-button", "w3-red", "delete-book");
					root.type = "button";
					root.innerText = "Delete";
					return root;
				})());
				root.appendChild(document.createTextNode(' '));
				root.appendChild((() => {
					let root = document.createElement("button");
					root.classList.add("w3-button", "w3-green", "cancel-modal");
					root.type = "button";
					root.innerText = "Cancel";
					return root;
				})());
				return root;
			})());
			return root;
		})())
		return root;
	})());
	return root;
})()


BookDetail.prototype.render = function(container) {
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
		this.view.buttons.delete.appendChild((() => {
			let root = document.createElement('i');
			root.classList.add('fa', 'fa-times');
			return root;
		})());
		this.view.buttons.delete.addEventListener("click", this.showModal.bind(this));
		buttons.appendChild(this.view.buttons.delete);
	}
	if (this.requestable) {
		this.view.buttons.request = document.createElement("button");
		this.view.buttons.request.classList.add("w3-button");
		this.view.buttons.request.appendChild((() => {
			let root = document.createElement('i');
			root.classList.add('fa', 'fa-exchange');
			return root;
		})());
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

BookDetail.prototype.edit = function(event) {
	if (this.editing)
		return;
	this.editing = true;
	this.view.title.innerHTML = '';
	this.view.title.appendChild(this.createInput(this.book.title));
	this.view.author.innerHTML = '';
	this.view.author.appendChild(this.createInput(this.book.author));
	this.view.year.innerHTML = ''
	this.view.year.appendChild(this.createInput(this.book.year.toString(), true));
	var acceptOnEnter = async (event) => {
		if (event.keyCode != 13)
			return;
		this.acceptChanges(event);
		this.editing = false;
		this.view.title.removeEventListener("keydown", acceptOnEnter, true);
		this.view.author.removeEventListener("keydown", acceptOnEnter, true);
		this.view.year.removeEventListener("keydown", acceptOnEnter, true);
	};
	this.view.title.addEventListener("keydown", acceptOnEnter, true);
	this.view.author.addEventListener("keydown", acceptOnEnter, true);
	this.view.year.addEventListener("keydown", acceptOnEnter, true);
	document.addEventListener("click", function clickingOutside(event) {
		if (!this.view.title.contains(event.target) && !this.view.author.contains(event.target) && !this.view.year.contains(event.target)) {
			this.rejectChanges(event);
			this.editing = false;
			document.removeEventListener("click", clickingOutside);
		}
	}.bind(this));
	document.addEventListener("keydown", function escaping(event) {
		if (event.keyCode != 27)
			return;
		this.rejectChanges(event);
		this.editing = false;
		document.removeEventListener("keydown", escaping);
		event.target.blur();
	}.bind(this));
	event.target.childNodes[0].focus();
};

BookDetail.prototype.showModal = function() {
	var modal = document.createElement("div");
	modal.classList.add("w3-modal");
	modal.style.display = "block";
	modal.appendChild(this.deleteElement);
	this.view.container.appendChild(modal);
	modal.addEventListener("click", function(event) {
		var cancelModal = modal.getElementsByClassName("cancel-modal")[0];
		if (event.target == modal || event.target == cancelModal)
			modal.style.display = "none";
		return false;
	});
	window.addEventListener("keypress", function closeModal(event) {
		if (event.keyCode == 27) {
			modal.style.display = "none";
			window.removeEventListener("keypress", closeModal);
		}
		return false;
	});
	modal.getElementsByClassName("delete-book")[0].addEventListener("click", async function() {
		await this.book.delete();
		this.view.container.dispatchEvent(new CustomEvent("delete-book", {bubbles: true}));
	}.bind(this));
};

BookDetail.prototype.rejectChanges = function() {
	this.view.title.innerText = this.book.title;
	this.view.author.innerText = this.book.author;
	this.view.year.innerText = this.book.year;
};

BookDetail.prototype.createInput = function(text, isNumber = false) {
	var element = document.createElement("input");
	if (isNumber)
		element.type = "number";
	else
		element.type = "text";
	element.value = text;
	element.style.padding = 0;
	element.classList.add("w3-border-0", "stretchy");
	return element;
};

BookDetail.prototype.requestBook = async function() {
	await this.book.request(auth.getUsername());
	toast("An email has been sent to the book's owner");
	this.view.buttons.request.classList.add("w3-disabled");
};

BookDetail.prototype.acceptChanges = async function() {
	try {
		await this.book.update({
			title: this.view.title.firstChild.value,
			author: this.view.author.firstChild.value,
			year: this.view.year.firstChild.value
		});
		toast("The book has been updated");
	}
	catch (err) {
		toast("There were errors with the update");
	}
	finally {
		this.view.title.innerText = this.book.title;
		this.view.author.innerText = this.book.author;
		this.view.year.innerText = this.book.year;
	}
};

export {BookDetail};
