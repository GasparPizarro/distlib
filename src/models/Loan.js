import { apiHost } from "../services";

class Loan {
	constructor({ id = null, book = null, recipient = null, start = null, span = null, status = null }) {
		this.id = id;
		this.book = book;
		this.recipient = recipient;
		this.start = start;
		this.span = span;
		this.status = status;
	}

	static async all() {
		let response = await fetch(apiHost + "/loans", {
			method: "GET"
		});
		let json = await response.json();
		return json.map((datum) => new Loan(datum));

	}

	async accept() {
		let form = new FormData();
		form.append("status", "accepted");
		return (await fetch(apiHost + "/loans/" + this.id, {
			method: "PATCH",
			body: form
		})).json();
	}

	reject() {
		let form = new FormData();
		form.append("status", "rejected");
		return fetch(apiHost + "/loans/" + this.id, {
			method: "PATCH",
			body: form
		});
	}

	finish() {
		let form = new FormData();
		form.append("status", "finished");
		return fetch(apiHost + "/loans/" + this.id, {
			method: "PATCH",
			body: form
		});
	};
}

export { Loan };
