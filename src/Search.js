import {BookDetail} from "./BookDetail";
import {Book} from "./models/Book";
import * as auth from "./auth";

let app = window.app;

let Search = function() {
	this.title = "Book search";

	this.model = {
		query: '',
		page: 1,
		pageCount: 1,
		books: null
	};

	this.view = {
		searchBox: null,
		includeMine: null,
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
			let root = document.createElement("p");
			root.appendChild((() => {
				this.view.includeMine = document.createElement("input");
				this.view.includeMine.classList.add("w3-check");
				this.view.includeMine.type = "checkbox";
				this.view.includeMine.checked = false;
				return this.view.includeMine;
			})());
			root.appendChild(document.createTextNode("\n"));
			root.appendChild((() => {
				let root = document.createElement("label");
				root.textContent = "Include mine";
				return root;
			})());
			return root;
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

Search.prototype.getPaginationButtons = function() {
	let root = document.createElement("div");
	root.classList.add("w3-bar");
	if (this.model.page > 1) {
		root.appendChild((() => {
			let root = document.createElement("a");
			root.href = "#";
			root.classList.add("w3-bar-item", "w3-button");
			root.textContent = "«";
			root.href = '?q=' + this.model.query + '&page=1' + (this.view.includeMine.checked ? '&mine=true' : '');
			root.addEventListener("click", () => {
				event.preventDefault();
				this.goToPage(1);
			})
			return root;
		})());
		root.appendChild((() => {
			let root = document.createElement("a");
			root.href = "#";
			root.classList.add("w3-bar-item", "w3-button");
			root.textContent = "<";
			root.href = '?q=' + this.model.query + '&page=' + (this.model.page - 1).toString() + (this.view.includeMine.checked ? '&mine=true' : '');
			root.addEventListener("click", () => {
				event.preventDefault();
				this.goToPage(this.model.page - 1);
			})
			return root;
		})());
	}
	root.appendChild((() => {
		let root = document.createElement("a");
		root.classList.add("w3-bar-item", "w3-button");
		root.textContent = this.model.page;
		return root;
	})());
	if (this.model.page < this.model.pageCount) {
		root.appendChild((() => {
			let root = document.createElement("a");
			root.classList.add("w3-bar-item", "w3-button");
			root.textContent = ">";
			root.href = '?q=' + this.model.query + '&page=' + (this.model.page + 1).toString() + (this.view.includeMine.checked ? '&mine=true' : '');
			root.addEventListener("click", () => {
				event.preventDefault();
				this.goToPage(this.model.page + 1);
			})
			return root;
		})());
		root.appendChild((() => {
			let root = document.createElement("a");
			root.classList.add("w3-bar-item", "w3-button");
			root.textContent = "»";
			root.href = '?q=' + this.model.query + '&page=' + this.model.pageCount + (this.view.includeMine.checked ? '&mine=true' : '');
			root.addEventListener("click", () => {
				event.preventDefault();
				this.goToPage(this.model.pageCount);
			})
			return root;
		})());
	}
	return root;
};


Search.prototype.init = async function(container, pathParameters, queryParameters) {
	container.replaceChildren();
	container.appendChild(this.mainHtml);
	this.model.query = queryParameters.q;
	this.model.page = queryParameters.page ? parseInt(queryParameters.page) : 1;
	this.view.booksResult.addEventListener("delete-book", function(event) {
		event.target.remove();
		app.toast("The book has been deleted");
	});
	this.view.includeMine.addEventListener("click", async () => {
		history.replaceState({}, null, "/search?q=" + this.model.query + "&page=" + this.model.page + "&mine=" + this.view.includeMine.checked);
		await this.search();
		this.render();
	});
	this.view.searchBox.value = this.model.query || "";
	this.view.includeMine.checked = queryParameters.mine == "true";
	this.view.searchBox.addEventListener("keyup", async (event) => {
		if (event.keyCode != 13)
			return;
		this.model.query = this.view.searchBox.value;
		history.pushState({}, null, window.location.hash + '?q=' + this.model.query);
		await this.search();
		this.render();
	});
	await this.search();
	this.render();
};

Search.prototype.search = async function() {
	if (this.model.query == null)
		return new Promise(function(){});
	let data = await Book.search(this.model.query, this.model.page, 10, this.view.includeMine.checked);
	this.model.books = data.books;
	this.model.pageCount = data.pageCount;
};

Search.prototype.addBooksToView = function(container, books) {
	for (let i = 0; i < books.length; i = i + 1) {
		let isMine = books[i].owner == auth.getUsername();
		let bookDetail = new BookDetail(books[i], {
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
	this.view.booksResult.replaceChildren();
	this.addBooksToView(this.view.booksResult, this.model.books);
	this.view.paginationButtons.replaceChildren();
	this.view.paginationButtons.appendChild(this.getPaginationButtons());
	this.view.searchBox.blur();
};

Search.prototype.goToPage = async function(page) {
	this.model.page = page;
	history.pushState({}, null, "/search?q=" + this.model.query + "&page=" + this.model.page);
	let results = await this.search();
	this.render(results);
};


export {Search};
