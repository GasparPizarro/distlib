import {BookDetail} from "./BookDetail";
import {Book} from "./models/Book";
import {toast} from "./shell";
import * as auth from "./auth";

var title = "Book search";

var model = {
	query: null,
	page: 1,
	pageCount: 1,
	books: null
};

var view = {
	searchBox: null,
	booksResult: null,
	paginationButtons: null
};

var mainHtml = (() => {
	let root = document.createElement("div");
	root.classList.add("w3-container");
	root.appendChild((() => {
		view.searchBox = document.createElement("input");
		view.searchBox.classList.add("w3-input", "w3-margin-top");
		view.searchBox.type = "text";
		return view.searchBox;
	})());
	root.appendChild((() => {
		view.booksResult = document.createElement("ul");
		view.booksResult.classList.add("w3-ul");
		view.booksResult.style.display = "none";
		view.booksResult.setAttribute("placeholder", "No results");
		return view.booksResult;
	})());
	root.appendChild((() => {
		view.paginationButtons = document.createElement("div");
		view.paginationButtons.classList.add("w3-center");
		return view.paginationButtons;
	})());
	root.appendChild((() => {
		let root = document.createElement("div");
		root.classList.add("w3-center");
		root.style.height = "75px";
		return root;
	})());
	return root;
})();

var init = async function(container, pathParameters, queryParameters) {
	while (container.firstChild)
		container.removeChild(container.firstChild);
	container.appendChild(mainHtml);
	model.query = queryParameters.q;
	model.page = queryParameters.page ? parseInt(queryParameters.page) : 1;
	view.booksResult.addEventListener("delete-book", function(event) {
		event.target.remove();
		toast("The book has been deleted");
	});
	view.searchBox.addEventListener("keyup", async function (event) {
		if (event.keyCode != 13)
			return;
		model.page = 1;
		model.query = view.searchBox.value;
		history.pushState({}, null, window.location.hash + '?q=' + model.query);
		var results = await search();
		render(results);
	});
	var results = await search();
	render(results);
};

var addBooksToView = function(container, books) {
	for (var i = 0; i < books.length; i = i + 1) {
		var isMine = books[i].owner == auth.getUsername();
		var bookDetail = new BookDetail(books[i], {
			editable: isMine && books[i].bearer == null,
			requestable: !isMine,
			showOwner: true
		});
		var element = document.createElement("li");
		bookDetail.render(element);
		container.append(element);
	}
};

var search = async function() {
	if (model.query == null)
		return new Promise(function(){});
	var data = await Book.search(model.query, model.page);
	model.books = data.books;
	model.pageCount = data.pageCount;
};

var render = function() {
	if (model.books == null)
		return;
	view.booksResult.style.display = "block";
	view.booksResult.innerHTML = "";
	addBooksToView(view.booksResult, model.books);
	while (view.paginationButtons.firstChild)
		view.paginationButtons.removeChild(view.paginationButtons.firstChild);
	if (model.pageCount == 0)
		return;
	if (model.page > 1) {
		var previousPageButton = document.createElement("a");
		previousPageButton.href = '?q=' + model.query + '&page=' + (model.page - 1);
		previousPageButton.classList.add('w3-bar-item', 'w3-button');
		previousPageButton.innerText = '«';
		previousPageButton.addEventListener("click", function(event){
			event.preventDefault();
			return goToPage(model.page - 1);
		});
		view.paginationButtons.appendChild(previousPageButton);
	}
	if (model.page < model.pageCount) {
		var nextPageButton = document.createElement("a");
		nextPageButton.href = '?q=' + model.query + '&page=' + (model.page + 1);
		nextPageButton.classList.add('w3-bar-item', 'w3-button');
		nextPageButton.innerText = '»';
		nextPageButton.addEventListener("click", function(event){
			event.preventDefault();
			return goToPage(model.page + 1);
		});
		view.paginationButtons.appendChild(nextPageButton);
	}
	view.searchBox.blur();
};

var goToPage = async function(page) {
	model.page = page;
	history.pushState({}, null, "/search?q=" + model.query + "&page=" + model.page);
	var results = await search();
	render(results);
};

export {init, title};
