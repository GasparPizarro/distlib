import {BookDetail} from "./BookDetail";
import {Book} from "./models/Book";
import * as auth from "./auth";

let app = window.app;

let Search = function() {
	this.title = "Book search";

	this.model = {
		query: null,
		page: 1,
		pageCount: 1,
		books: null
	};

	this.view = {
		searchBox: null,
		booksResult: null,
		paginationButtons: null
	};

	this.mainHtml = (() => {
		let root = document.createElement("div");
		root.classList.add("w3-container");
		root.appendChild((() => {
			this.view.searchBox = document.createElement("input");
			this.view.searchBox.classList.add("w3-input", "w3-margin-top");
			this.view.searchBox.type = "text";
			return this.view.searchBox;
		})());
		root.appendChild((() => {
			this.view.booksResult = document.createElement("ul");
			this.view.booksResult.classList.add("w3-ul");
			this.view.booksResult.style.display = "none";
			this.view.booksResult.setAttribute("placeholder", "No results");
			return this.view.booksResult;
		})());
		root.appendChild((() => {
			this.view.paginationButtons = document.createElement("div");
			this.view.paginationButtons.classList.add("w3-center");
			return this.view.paginationButtons;
		})());
		root.appendChild((() => {
			let root = document.createElement("div");
			root.classList.add("w3-center");
			root.style.height = "75px";
			return root;
		})());
		return root;
	})();
};


Search.prototype.init = async function(container, pathParameters, queryParameters) {
	while (container.firstChild)
		container.removeChild(container.firstChild);
	container.appendChild(this.mainHtml);
	this.model.query = queryParameters.q;
	this.model.page = queryParameters.page ? parseInt(queryParameters.page) : 1;
	this.view.booksResult.addEventListener("delete-book", function(event) {
		event.target.remove();
		app.toast("The book has been deleted");
	});
	this.view.searchBox.addEventListener("keyup", async (event) => {
		if (event.keyCode != 13)
			return;
		this.model.page = 1;
		this.model.query = this.view.searchBox.value;
		history.pushState({}, null, window.location.hash + '?q=' + this.model.query);
		let results = await this.search();
		this.render(results);
	});
	let results = await this.search();
	this.render(results);
};

Search.prototype.search = async function() {
	if (this.model.query == null)
		return new Promise(function(){});
	let data = await Book.search(this.model.query, this.model.page);
	this.model.books = data.books;
	this.model.pageCount = data.pageCount;
};

Search.prototype.addBooksToView = function(container, books) {
	for (let i = 0; i < books.length; i = i + 1) {
		let isMine = books[i].owner == auth.getUsername();
		let bookDetail = new BookDetail(books[i], {
			editable: isMine && books[i].bearer == null,
			requestable: !isMine,
			showOwner: true
		});
		let element = document.createElement("li");
		bookDetail.render(element);
		container.append(element);
	}
};

Search.prototype.render = function() {
	if (this.model.books == null)
		return;
	this.view.booksResult.style.display = "block";
	this.view.booksResult.innerHTML = "";
	this.addBooksToView(this.view.booksResult, this.model.books);
	while (this.view.paginationButtons.firstChild)
		this.view.paginationButtons.removeChild(this.view.paginationButtons.firstChild);
	if (this.model.pageCount == 0)
		return;
	if (this.model.page > 1) {
		let previousPageButton = document.createElement("a");
		previousPageButton.href = '?q=' + this.model.query + '&page=' + (this.model.page - 1);
		previousPageButton.classList.add('w3-bar-item', 'w3-button');
		previousPageButton.innerText = '«';
		previousPageButton.addEventListener("click", (event) => {
			event.preventDefault();
			return this.goToPage(this.model.page - 1);
		});
		this.view.paginationButtons.appendChild(previousPageButton);
	}
	if (this.model.page < this.model.pageCount) {
		let nextPageButton = document.createElement("a");
		nextPageButton.href = '?q=' + this.model.query + '&page=' + (this.model.page + 1);
		nextPageButton.classList.add('w3-bar-item', 'w3-button');
		nextPageButton.innerText = '»';
		nextPageButton.addEventListener("click", (event) => {
			event.preventDefault();
			return this.goToPage(this.model.page + 1);
		});
		this.view.paginationButtons.appendChild(nextPageButton);
	}
	this.view.searchBox.blur();
};

Search.prototype.goToPage = async function(page) {
	this.model.page = page;
	history.pushState({}, null, "/search?q=" + this.model.query + "&page=" + this.model.page);
	let results = await this.search();
	this.render(results);
};


export {Search};
