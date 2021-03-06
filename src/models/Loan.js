import {apiHost} from "../services";

var Loan = function({id = null, book = null, recipient = null, start = null, span = null, status = null}) {
	this.id = id;
	this.book = book;
	this.recipient = recipient;
	this.start = start;
	this.span = span;
	this.status = status;
};

Loan.all = async function() {
	var response = await fetch(apiHost + "/loans", {
		method: "GET"
	});
	var json = await response.json();
	return json.map((datum) => new Loan(datum));
};

Loan.prototype.accept = async function() {
	var form = new FormData();
	form.append("status", "accepted");
	return (await fetch(apiHost + "/loans/" + this.id, {
		method: "PATCH",
		body: form
	})).json();
};

Loan.prototype.reject = function() {
	var form = new FormData();
	form.append("status", "rejected");
	return fetch(apiHost + "/loans/" + this.id, {
		method: "PATCH",
		body: form
	});
};

Loan.prototype.finish = function() {
	var form = new FormData();
	form.append("status", "finished");
	return fetch(apiHost + "/loans/" + this.id, {
		method: "PATCH",
		body: form
	});
};


export {Loan};
