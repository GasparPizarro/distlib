distlib.search = (function() {
	'use strict';

	var title = "Book search";

	var page;

	var query;

	var mainHtml = String()
		+ '<div class="w3-container">'
			+ '<input id="search-box" class="w3-input w3-margin-top" type="text">'
			+ '<div id="books-result"></div>'
			+ '<div class="w3-center" id="book-pad" style="height: 75px">'
		+ '</div>';

	var noResultsHtml = '<p id="empty-books-list" class="w3-disabled">No results</p>';

	var searchBox;

	var booksResult;

	var bookPad;

	var render = function(container, pathParameters, queryParameters) {
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
				if (pageCount > 0) {
					var paginationButtons = document.createElement("div");
					paginationButtons.classList.add("w3-center");
					paginationButtons.innerHTML = String()
						+ '<div class="w3-bar">'
							+ ((page > 1) ? '<a href="?q=' + query + '&page=' + (page - 1) + '" class="w3-bar-item w3-button">&laquo;</a>' : '')
							+ ((page <= pageCount) ? '<a href="?q=' + query + '&page=' + (page + 1) + '" class="w3-button">&raquo;</a>' : '')
						+ '</div>';
					booksResult.after(paginationButtons);
					paginationButtons.querySelectorAll("a").forEach(function(element){element.addEventListener("click", function(event){event.preventDefault(); console.log("asdfadsf")})});
				}
			}
			searchBox.blur();
		});
	};

	return {
		render: render,
		title: title
	}
}());
