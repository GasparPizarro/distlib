distlib.search = (function() {
	'use strict';

	var title = "Book search";

	var page;

	var query;

	var mainHtml = String()
		+ '<div class="w3-container">'
			+ '<input id="search-box" class="w3-input w3-margin-top" type="text">'
			+ '<div id="books-result"></div>'
			+ '<div id="pagination-buttons" class="w3-center"></div>'
			+ '<div class="w3-center" id="book-pad" style="height: 75px">'
		+ '</div>';

	var noResultsHtml = '<p id="empty-books-list" class="w3-disabled">No results</p>';

	var searchBox;

	var booksResult;

	var bookPad;

	var init = function(container, pathParameters, queryParameters) {
		container.innerHTML = mainHtml;
		query = queryParameters.q;
		page = queryParameters.page ? parseInt(queryParameters.page) : 1;
		searchBox = document.getElementById("search-box");
		bookPad = document.getElementById("book-pad");
		booksResult = document.getElementById("books-result");
		if (query || query == "") {
			searchBox.value = query;
			search(query, page);
		}
		searchBox.addEventListener("keyup", function (event) {
				if (event.keyCode != 13)
					return;
				history.pushState({}, null, window.location.hash + '?q=' + searchBox.value);
				window.dispatchEvent(new CustomEvent("routing"));
			}
		);
	};

	var clearResult = function() {
		booksResult.innerHTML = "";
		bookPad.innerHTML = "";
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

	var search = function(query, page) {
		clearResult();
		distlib.services.search(query, page - 1).then(function(data) {
			var books = data.books;
			var pageCount = data.pageCount;
			if (books.length == 0)
				booksResult.innerHTML = noResultsHtml;
			else {
				booksResult.innerHTML = '<ul class="w3-ul" id="books-list"></ul>';
				addBooksToView(document.getElementById("books-list"), books);
				addPaginationButtons(document.getElementById("pagination-buttons"), pageCount);
			}
			searchBox.blur();
		});
	};

	var addPaginationButtons = function(container, pageCount) {
		if (pageCount == 0)
			return;
		container.innerHTML = String()
			+ (page > 1 ? '<a id="previous-page" href="?page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
			+ (page <  pageCount ? '<a id="next-page" href="?page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
		var previousPageButton = document.getElementById("previous-page");
		var nextPageButton = document.getElementById("next-page");
		if (previousPageButton != null)
			previousPageButton.addEventListener("click", function(event){return goToPage(event, page - 1)});
		if (nextPageButton != null)
			nextPageButton.addEventListener("click", function(event){return goToPage(event, page + 1)});
	};

	return {
		init: init,
		title: title
	}
}());
