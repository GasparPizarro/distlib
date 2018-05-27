distlib.search = (function() {
	'use strict';

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
	}

	var mainHtml = String()
		+ '<div class="w3-container">'
			+ '<input id="search-box" class="w3-input w3-margin-top" type="text">'
			+ '<ul class="w3-ul" style="display: none" id="books-result" placeholder="No results"></ul>'
			+ '<div id="pagination-buttons" class="w3-center"></div>'
			+ '<div class="w3-center" style="height: 75px">'
		+ '</div>';

	var noResultsHtml = '<p id="empty-books-list" class="w3-disabled">No results</p>';

	var init = function(container, pathParameters, queryParameters) {
		container.innerHTML = mainHtml;
		model.query = queryParameters.q;
		model.page = queryParameters.page ? parseInt(queryParameters.page) : 1;
		view.searchBox = document.getElementById("search-box");
		view.booksResult = document.getElementById("books-result");
		view.paginationButtons = document.getElementById("pagination-buttons");
		search().then(render);
		view.searchBox.addEventListener("keyup", function (event) {
				if (event.keyCode != 13)
					return;
				model.page = 1;
				model.query = view.searchBox.value;
				history.pushState({}, null, window.location.hash + '?q=' + model.query);
				search().then(render);
			}
		);
	};

	var clearResult = function() {
		view.booksResult.innerHTML = "";
	};

	var addBooksToView = function(container, books) {
		for (var i = 0; i < books.length; i = i + 1) {
			var element = document.createElement("li");
			element.innerHTML = String()
				+ '<p>'
					+ '<a href="/books/' + books[i].id + '">'
						+ books[i].title
						+ '<span class="w3-right">' + books[i].year + '</span>'
					+ '</a>'
				+ '</p>'
				+ '<p>'
					+ books[i].author
					+ '<span class="w3-tag w3-right">' + books[i].owner + '</span>'
				+ '</p>'
			container.append(element);
			element.querySelector("a").addEventListener("click", function(event) {
				event.preventDefault();
				history.pushState({}, null, event.target.getAttribute("href"));
				window.dispatchEvent(new CustomEvent("routing"));
			});
		}
	};


	var search = function() {
		if (model.query == null) {
			console.log("there is no data")
			return new Promise(function(_){});
		}
		return distlib.services.search(model.query, model.page).then(
			function(data) {
				model.books = data.books;
				model.pageCount = data.page_count;
			}
		);
	};

	var render = function() {
		console.log("rendering data");
		if (model.books == null)
			return;
		view.booksResult.style.display = "block";
		view.booksResult.innerHTML = "";
		for (var i = 0; i < model.books.length; i = i + 1) {
			var element = document.createElement("li");
			element.innerHTML = String()
				+ '<p>'
					+ '<a href="/books/' + model.books[i].id + '">'
						+ model.books[i].title
						+ '<span class="w3-right">' + model.books[i].year + '</span>'
					+ '</a>'
				+ '</p>'
				+ '<p>'
					+ model.books[i].author
					+ '<span class="w3-tag w3-right">' + model.books[i].owner + '</span>'
				+ '</p>'
			view.booksResult.append(element);
			element.querySelector("a").addEventListener("click", function(event) {
				event.preventDefault();
				history.pushState({}, null, event.target.getAttribute("href"));
				window.dispatchEvent(new CustomEvent("routing"));
			});
		}
		if (model.pageCount == 0)
			return;
		view.paginationButtons.innerHTML = String()
			+ (model.page > 1 ? '<a id="previous-page" href="?q=' + model.query + '&page=' + (model.page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
			+ (model.page <  model.pageCount ? '<a id="next-page" href="?q=' + model.query + '&page=' + (model.page + 1) + '" class="w3-button">&raquo;</a>' : '')
		var previousPageButton = document.getElementById("previous-page");
		var nextPageButton = document.getElementById("next-page");
		if (previousPageButton != null)
			previousPageButton.addEventListener("click", function(event){
				event.preventDefault();
				return goToPage(model.page - 1)
			});
		if (nextPageButton != null)
			nextPageButton.addEventListener("click", function(event){
				event.preventDefault();
				return goToPage(model.page + 1)
			});
		view.searchBox.blur();
	};

	var goToPage = function(page) {
		model.page = page;
		history.pushState({}, null, "/search?q=" + model.query + "&page=" + model.page);
		search().then(render);
	}

	var addPaginationButtons = function(container, pageCount) {
		if (pageCount == 0)
			return;
		container.innerHTML = String()
			+ (model.page > 1 ? '<a id="previous-page" href="?page=' + (model.page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
			+ (model.page <  pageCount ? '<a id="next-page" href="?page=' + (model.page + 1) + '" class="w3-button">&raquo;</a>' : '')
		var previousPageButton = document.getElementById("previous-page");
		var nextPageButton = document.getElementById("next-page");
		if (previousPageButton != null)
			previousPageButton.addEventListener("click", function(event){return goToPage(event, model.page - 1)});
		if (nextPageButton != null)
			nextPageButton.addEventListener("click", function(event){return goToPage(event, model.page + 1)});
	};

	return {
		init: init,
		title: title
	}
}());
