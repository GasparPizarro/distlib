import * as auth from "./auth";

export const apiHost =  "http://" + window.location.hostname + ":5000";

export function search(query, page = 1, size = 5) {
	var url = new URL(apiHost + "/books/search");
	url.search = new URLSearchParams({
		"q": query,
		"page": page,
		"size": size
	});
	return fetch(url, {
		type: "GET"
	}).then(response => response.json().then(json => ({books: json, pageCount: parseInt(response.headers.get("page-count"))})));
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

export function getDebts() {
	return fetch(apiHost + "/debts", {
		method: "GET"
	}).then(response => response.json());
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

export function updateBook(bookId, data) {
	var form = new FormData();
	form.append("title", data.title);
	form.append("author", data.author);
	form.append("year", data.year);
	return fetch(apiHost + "/books/" + bookId, {
		method: "PUT",
		body: form
	});
};

export function acceptLoan(loanId) {
	var form = new FormData();
	form.append("status", "accepted");
	return fetch(apiHost + "/loans/" + loanId, {
		method: "PATCH",
		body: form
	}).then(response => response.json());
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

export function getProfile() {
	return fetch(apiHost + "/profile", {
		method: "GET"
	}).then(response => response.json());
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
