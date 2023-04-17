import {apiHost} from "../services";

let Book = function({id = null, owner = null, title = null, author = null, year = null}) {
	this.id = id;
	this.owner = owner;
	this.title = title;
	this.author = author;
	this.year = year;
};

Book.prototype.delete = function() {
	return fetch(apiHost + "/books/" + this.id, {
		method: "DELETE"
	});
};

Book.prototype.request = function(recipient, timeRange = 1) {
	let form = new FormData();
	form.append("book_id", this.id);
	form.append("recipient", recipient);
	form.append("time_range", timeRange);
	return fetch(apiHost + "/loans", {
		method: "POST",
		body: form
	});
};

Book.prototype.update = async function({title = null, author = null, year = null}) {
	let form = new FormData();
	if (title != null)
		form.append("title", title);
	if (author != null)
		form.append("author", author);
	if (year != null)
		form.append("year", year);
	let response = await fetch(apiHost + "/books/" + this.id, {
		method: "PUT",
		body: form
	});
	if (response.status != 200)
		throw Error;
	if (title != null)
		this.title = title;
	if (author != null)
		this.author = author;
	if (year != null)
		this.year = year;
};

Book.prototype.save = async function() {
	let form = new FormData();
	if (this.id == null) {
		form.append("title", this.title);
		form.append("author", this.author);
		form.append("year", this.year);
		let response = await fetch(apiHost + "/books", {
			method: "POST",
			body: form
		});
		let data = await response.json();
		this.id = data.id;
	}
	else
		this.update({title: this.title, author: this.year, year: this.year});
};

Book.all = async function(page = 0, size = 10) {
	let url = new URL(apiHost + "/books");
	url.search = new URLSearchParams({
		"page": page,
		"size": size
	});
	let response = await fetch(url, {type: "GET"});
	let json = await response.json();
	return {
		books: json.map((datum) => new Book(datum)),
		pageCount: response.headers.get("page-count")
	};
};

Book.search = async function search(query, page = 1, size = 5, mine = true) {
	let url = new URL(apiHost + "/books/search");
	url.search = new URLSearchParams({
		"q": query,
		"page": page,
		"size": size,
		"mine": mine,
	});
	let response = await fetch(url, {type: "GET"});
	let data = await response.json();
	return {
		books: data.map((datum) => new Book(datum)),
		pageCount: parseInt(response.headers.get("page-count"))
	};
};

export {Book};
