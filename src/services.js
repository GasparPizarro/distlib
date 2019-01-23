import * as auth from "./auth";

export const apiHost =  "http://" + window.location.hostname + ":5000";

export async function search(query, page = 1, size = 5) {
	var url = new URL(apiHost + "/books/search");
	url.search = new URLSearchParams({
		"q": query,
		"page": page,
		"size": size
	});
	var response = await fetch(url, {type: "GET"});
	var data = await response.json();
	return {
		books: data,
		pageCount: parseInt(response.headers.get("page-count"))
	};
};

export async function getBooks(page = 0, size = 10) {
	var url = new URL(apiHost + "/books");
	url.search = new URLSearchParams({
		"page": page,
		"size": size
	})
	var response = await fetch(url, {
		type: "GET"
	});
	var json = await response.json();
	return {
		books: json,
		pageCount: response.headers.get("page-count")
	}
};

export function getLoans() {
	return fetch(apiHost + "/loans", {
		method: "GET"
	}).then(response => response.json());
};

export async function getDebts() {
	return (await fetch(apiHost + "/debts", {method: "GET"})).json()
};

export function askForBook(bookId) {
	var form = new FormData();
	form.append("book_id", bookId);
	form.append("recipient", auth.getUsername());
	form.append("time_range", 1);
	return fetch(apiHost + "/loans", {
		method: "POST",
		body: form
	})
};

export function addBook(book) {
	var form = new FormData();
	form.append("title", book.title);
	form.append("author", book.author);
	form.append("year", book.year);
	return fetch(apiHost + "/books", {
		method: "POST",
		body: form
	});
};

export function deleteBook(bookId) {
	return fetch(apiHost + "/books/" + bookId, {
		method: "DELETE"
	});
};

export async function updateBook(bookId, title, author, year) {
	var form = new FormData();
	form.append("title", title);
	form.append("author", author);
	form.append("year", year);
	var response = await fetch(apiHost + "/books/" + bookId, {
		method: "PUT",
		body: form
	});
	if (!response.ok)
		throw "Error"
};

export async function acceptLoan(loanId) {
	var form = new FormData();
	form.append("status", "accepted");
	return (await fetch(apiHost + "/loans/" + loanId, {
		method: "PATCH",
		body: form
	})).json();
};

export function rejectLoan(loanId) {
	var form = new FormData();
	form.append("status", "rejected");
	return fetch(apiHost + "/loans/" + loanId, {
		method: "PATCH",
		body: form
	});
};

export function finishLoan(loanId) {
	var form = new FormData();
	form.append("status", "finished");
	return fetch(apiHost + "/loans/" + loanId, {
		method: "PATCH",
		body: form
	});
};

export async function getProfile() {
	return (await fetch(apiHost + "/profile", {method: "GET"})).json()
}

export function updateProfile({firstName, lastName, oldPassword, newPassword} = {}) {
	var form = new FormData();
	if (oldPassword)
		form.append("old_password", oldPassword);
	if (newPassword)
		form.append("new_password", newPassword);
	if (firstName)
		form.append("first_name", firstName);
	if (lastName)
		form.append("last_name", lastName);
	return fetch(apiHost + "/profile", {
		method: "POST",
		body: form
	})
}
