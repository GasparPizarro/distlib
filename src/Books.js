import {BookDetail} from "./BookDetail";
import {Book} from "./models/Book.js";

let Books = function() {
	this.title = "My books";

	this.model = {
		page: 1,
		pageCount: 1,
		books: []
	};

	this.view = {
		container: null,
		booksList: null,
		showBookModal: null,
		addBookForm: {}
	};

	this.mainHtml = (() => {
		let root = document.createElement("div");
		root.classList.add("w3-container");
		root.appendChild((() => {
			this.view.booksList = document.createElement("ul");
			this.view.booksList.id = "books-list";
			this.view.booksList.classList.add("w3-ul");
			this.view.booksList.setAttribute("placeholder", "There are no books");
			return this.view.booksList;
		})());
		root.appendChild((() => {
			let root = document.createElement("button");
			root.classList.add("w3-button", "w3-black", "w3-circle");
			root.style = "padding: 20px; position: fixed; z-index: 1; right: 1em; bottom: 1em;";
			root.appendChild((() => {
				let root = document.createElement("i");
				root.classList.add("fa", "fa-plus", "fa-fw");
				return root;
			})());
			root.addEventListener("click", () => {
				this.view.container.appendChild(this.addBookModal);
				let stupidRemove = function(e) {
					if (!this.view.container.contains(this.addBookModal))
						window.removeEventListener("keydown", stupidRemove);
					else if (e.key == "Escape") {
						this.view.container.removeChild(this.addBookModal);
						window.removeEventListener("keydown", stupidRemove);
					}
				}.bind(this)
				window.addEventListener("keydown", stupidRemove);
			});
			return root;
		})());
		return root;
	})();

	this.deleteBookModal = (() => {
		let root = document.createElement("div");
		let cancelEventListener = (event) => {
			if (event.target == event.currentTarget)
				root.dispatchEvent(new CustomEvent("book-delete-cancel", {bubbles: true}));
		};
		root.classList.add("w3-modal");
		root.style.display = "block";
		root.addEventListener("click", cancelEventListener);
		root.appendChild((() => {
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
							root.addEventListener("click", () => {
								root.dispatchEvent(new CustomEvent("book-delete-confirm", {bubbles: true, detail: {id: 1}}));
							});
							return root;
						})());
						root.appendChild(document.createTextNode(' '));
						root.appendChild((() => {
							let root = document.createElement("button");
							root.classList.add("w3-button", "w3-green", "cancel-modal");
							root.type = "button";
							root.innerText = "Cancel";
							root.addEventListener("click", cancelEventListener);
							return root;
						})());
						return root;
					})());
					return root;
				})());
				return root;
			})());
			return root;
		})());
		return root;
	})();

	this.addBookModal = (() => {
		let root = document.createElement('div');
		root.addEventListener("click", (event) => {
			if (event.target == event.currentTarget)
				this.view.container.removeChild(this.addBookModal);
		});
		root.id = 'book-modal';
		root.style.display = "block";
		root.classList.add('w3-modal', 'w3-animate-opacity');
		root.appendChild((() => {
			let root = document.createElement('div');
			root.classList.add('w3-modal-content');
			root.style.maxWidth = 300;
			root.appendChild((() => {
				let root = document.createElement('div');
				root.classList.add('w3-container');
				root.appendChild((() => {
					let root = document.createElement('h3');
					root.classList.add('w3-center');
					root.innerText = 'New book';
					return root;
				})());
				root.appendChild((() => {
					let root = document.createElement('form');
					root.classList.add('w3-container');
					root.appendChild((() => {
						let root = document.createElement('div');
						root.classList.add('w3-section');
						root.appendChild((() => {
							let root = document.createElement('label');
							root.innerText = 'Title';
							return root;
						})());
						root.appendChild((() => {
							this.view.addBookForm.title = document.createElement('input');
							this.view.addBookForm.title.classList.add('w3-input', 'w3-margin-bottom');
							this.view.addBookForm.title.type = 'text';
							this.view.addBookForm.title.name = 'title';
							this.view.addBookForm.title.required = true;
							return this.view.addBookForm.title;
						})());
						root.appendChild((() => {
							let root = document.createElement('label');
							root.innerText = 'Author';
							return root;
						})());
						root.appendChild((() => {
							this.view.addBookForm.author = document.createElement('input');
							this.view.addBookForm.author.classList.add('w3-input', 'w3-margin-bottom');
							this.view.addBookForm.author.type = 'text';
							this.view.addBookForm.author.name = 'author';
							this.view.addBookForm.author.required = true;
							return this.view.addBookForm.author;
						})());
						root.appendChild((() => {
							let root = document.createElement('label');
							root.innerText = 'Year';
							return root;
						})());
						root.appendChild((() => {
							this.view.addBookForm.year = document.createElement('input');
							this.view.addBookForm.year.classList.add('w3-input', 'w3-margin-bottom');
							this.view.addBookForm.year.type = 'number';
							this.view.addBookForm.year.name = 'year';
							this.view.addBookForm.year.required = true;
							return this.view.addBookForm.year;
						})());
						root.appendChild((() => {
							let root = document.createElement('button');
							root.classList.add('w3-button', 'w3-block', 'w3-green');
							root.type = 'submit';
							root.id = 'add-book';
							root.innerText = 'Add book';
							root.addEventListener('click', this.onAddBook.bind(this));
							return root;
						})());
						return root;
					})());
					return root;
				})());
				return root;
			})());
			return root;
		})());
		return root;
	})();
};


Books.prototype.onAddBook = async function(event) {
	event.preventDefault();
	event.stopPropagation();
	let book = new Book({
		title: this.view.addBookForm.title.value,
		author: this.view.addBookForm.author.value,
		year: this.view.addBookForm.year.value,
	});
	try {
		await book.save();
		window.dispatchEvent(new CustomEvent("routing"));
		window.app.toast("The book has been added");
	}
	catch (err) {
		window.app.toast("Cannot add book");
	}
	return false;
};


Books.prototype.init = async function(container, _, queryParameters) {
	this.view.container = container;
	this.view.container.addEventListener("book-delete", (e) => {
		this.view.container.appendChild(this.deleteBookModal);
		window.addEventListener("keydown", (e) => {
			if (e.key == "Escape")
				this.view.container.removeChild(this.deleteBookModal);
		}, {once: true})
		this.view.container.addEventListener("book-delete-confirm", async () => {
			await e.detail.book.delete()
			window.app.toast("Book is deleted");
			this.view.container.removeChild(this.deleteBookModal);
		}, {once: true});
		this.view.container.addEventListener("book-delete-cancel", () => {
			this.view.container.removeChild(this.deleteBookModal);
		}, {once: true});
	});
	while (this.view.container.firstChild)
		this.view.container.removeChild(this.view.container.firstChild);
	this.view.container.appendChild(this.mainHtml);
	this.model.page = queryParameters.page ? parseInt(queryParameters.page) : 1;
	await this.loadData();
	this.render();
};


Books.prototype.loadData = async function() {
	let data = await Book.all(this.model.page);
	this.model.pageCount = data.pageCount;
	this.model.books = data.books;
};

Books.prototype.render = function() {
	this.view.booksList.innerHTML = "";
	for (let i = 0; i < this.model.books.length; i = i + 1) {
		let li = document.createElement("li");
		let book = new Book(this.model.books[i]);
		let bookDetail = new BookDetail(book, {
			editable: this.model.books[i].bearer == null,
			requestable: false,
			showOwner: false
		});
		bookDetail.render(li);
		this.view.booksList.appendChild(li);
	}
	this.view.booksList.addEventListener("delete-book", function(event) {
		event.target.remove();
		window.app.toast("The book has been deleted");
	});
	window.scrollTo(0, 0);
};

Books.prototype.goToPage = async function(page) {
	this.model.page = page;
	history.pushState({}, null, "/books?page=" + this.model.page);
	await this.loadData();
	this.render();
};

export {Books};
