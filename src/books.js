import {BookDetail} from "./BookDetail";
import {toast} from "./shell";
import {Book} from "./models/Book.js";
import "stretchy";

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
	addBookForm: null
};

var onAddBook = async function(event) {
	event.preventDefault();
	event.stopPropagation();
	var book = new Book({
		title: view.addBookForm.querySelector("[name=title]").value,
		author: view.addBookForm.querySelector("[name=author]").value,
		year: view.addBookForm.querySelector("[name=year]").value,
	});
	try {
		await book.save();
		window.dispatchEvent(new CustomEvent("routing"));
		toast("The book has been added");
	}
	catch (err) {
		toast("Cannot add book");
	}
	return false;
};

var modalNode = (() => {
	let root = document.createElement('div');
	root.id = 'book-modal';
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
				view.addBookForm = document.createElement('form');
				view.addBookForm.classList.add('w3-container');
				view.addBookForm.appendChild((() => {
					let root = document.createElement('div');
					root.classList.add('w3-section');
					root.appendChild((() => {
						let root = document.createElement('label');
						root.innerText = 'Title';
						return root;
					})());
					root.appendChild((() => {
						let root = document.createElement('input');
						root.classList.add('w3-input', 'w3-margin-bottom');
						root.type = 'text';
						root.name = 'title';
						root.required = true;
						return root;
					})());
					root.appendChild((() => {
						let root = document.createElement('label');
						root.innerText = 'Author';
						return root;
					})());
					root.appendChild((() => {
						let root = document.createElement('input');
						root.classList.add('w3-input', 'w3-margin-bottom');
						root.type = 'text';
						root.name = 'author';
						root.required = true;
						return root;
					})());
					root.appendChild((() => {
						let root = document.createElement('label');
						root.innerText = 'Year';
						return root;
					})());
					root.appendChild((() => {
						let root = document.createElement('input');
						root.classList.add('w3-input', 'w3-margin-bottom');
						root.type = 'number';
						root.name = 'year';
						root.required = true;
						return root;
					})());
					root.appendChild((() => {
						let root = document.createElement('button');
						root.classList.add('w3-button', 'w3-block', 'w3-green');
						root.type = 'submit';
						root.id = 'add-book'
						root.innerText = 'Add book';
						root.addEventListener('click', onAddBook);
						return root;
					})());
					return root;
				})());
				return view.addBookForm;
			})());
			return root;
		})());
		return root;
	})());
	return root;
})();

var mainHtml = (() => {
	let root = document.createElement("div");
	root.classList.add("w3-container");
	root.appendChild((() => {
		view.booksList = document.createElement("ul");
		view.booksList.id = "books-list";
		view.booksList.classList.add("w3-ul");
		view.booksList.setAttribute("placeholder", "There are no books");
		return view.booksList;
	})());
	root.appendChild((() => {
		view.paginationButtons = document.createElement("div");
		view.paginationButtons.classList.add("w3-center");
		return view.paginationButtons;
	})());
	root.appendChild((() => {
		view.showBookModal = document.createElement("button");
		view.showBookModal.classList.add("w3-button", "w3-black", "w3-circle");
		view.showBookModal.style = "padding: 20px; position: fixed; z-index: 1; right: 1em; bottom: 1em;";
		view.showBookModal.appendChild((() => {
			let root = document.createElement("i");
			root.classList.add("fa", "fa-plus", "fa-fw");
			return root;
		})());
		return view.showBookModal;
	})());
	return root;
})();

var init = async function(container, _, queryParameters) {
	view.container = container;
	while (view.container.firstChild)
		view.container.removeChild(view.container.firstChild)
	view.container.appendChild(mainHtml);
	model.page = queryParameters.page ? parseInt(queryParameters.page) : 1;
	await loadData();
	render();
	view.showBookModal.addEventListener("click", showModal);
};

var loadData = async function() {
	var data = await Book.all(model.page);
	model.pageCount = data.pageCount;
	model.books = data.books;
};

var render = function() {
	view.booksList.innerHTML = "";
	for (var i = 0; i < model.books.length; i = i + 1) {
		var li = document.createElement("li");
		var book = new Book(model.books[i]);
		var bookDetail = new BookDetail(book, {
			editable: model.books[i].bearer == null,
			requestable: false,
			showOwner: false
		});
		bookDetail.render(li);
		view.booksList.appendChild(li);
	}
	view.booksList.addEventListener("delete-book", function(event) {
		event.target.remove();
		toast("The book has been deleted");
	});
	view.paginationButtons.innerHTML = String()
		+ (model.page > 1 ? '<a id="previous-page" href="?page=' + (model.page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
		+ (model.page < model.pageCount ? '<a id="next-page" href="?page=' + (model.page + 1) + '" class="w3-button">&raquo;</a>' : '');
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

var goToPage = async function(page) {
	model.page = page;
	history.pushState({}, null, "/books?page=" + model.page);
	await loadData();
	render();
};


var showModal = function(event) {
	event.preventDefault();
	event.stopPropagation();
	view.container.appendChild(modalNode);
	var modal = document.getElementById('book-modal');
	modal.style.display = "block";
	modal.addEventListener("click", hideModal);
	document.addEventListener("keydown", escapeFromModal);
	return false;
};

var escapeFromModal = function(event) {
	if (event.key == "Escape")
		document.getElementById('book-modal').style.display = "none";
};

var hideModal = function(event) {
	var modal = document.getElementById('book-modal');
	if (event.target == modal)
		modal.style.display = "none";
	return false;
};

export {init, title};
