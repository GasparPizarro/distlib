distlib.Loan = function(id, book, recipient, start, span, status) {
	this.id = id;
	this.book = book;
	this.recipient = recipient;
	this.start = start;
	this.span = span;
	this.status = status;
}

distlib.Loan.prototype.update = function() {
	while (this.container.firstChild)
		this.container.removeChild(this.container.firstChild);

	var upper = document.createElement("div");

	var title = document.createElement("span");
	title.innerText = this.book.title;

	var buttons = document.createElement("div");
	buttons.classList.add("w3-right");

	if (this.status == 0) {
		var accept = document.createElement("button");
		accept.classList.add("w3-button");
		accept.innerHTML = '<i class="fa fa-check"></i>';
		accept.addEventListener("click", this.accept.bind(this));
		buttons.appendChild(accept);

		var reject = document.createElement("button");
		reject.classList.add("w3-button");
		reject.innerHTML = '<i class="fa fa-times"></i>';
		reject.addEventListener("click", this.reject.bind(this));
		buttons.appendChild(reject);
	}
	else {
		var accept = document.createElement("button");
		accept.classList.add("w3-button");
		accept.innerHTML = '<i class="fa fa-check"></i>';
		accept.addEventListener("click", this.finish.bind(this));
		buttons.appendChild(accept);
	}

	upper.appendChild(title);
	upper.appendChild(buttons);

	var lower = document.createElement("div");

	var recipient = document.createElement("span");
	recipient.innerText = this.recipient

	var time = document.createElement("span");
	if (this.status == 0)
		time.innerText = this.span + ' weeks';
	else {
		var startDate = new Date(this.start);
		var endDate = new Date(this.start);
		endDate.setDate(startDate.getDate() + this.span * 7);
		time.innerText = 'Due on ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear();
	}

	lower.appendChild(recipient);
	lower.appendChild(document.createTextNode(" | "));
	lower.appendChild(time)

	this.container.appendChild(upper);
	this.container.appendChild(lower);
};

distlib.Loan.prototype.render = function(container) {
	this.container = container;
	this.update();
};

distlib.Loan.prototype.accept = function() {
	distlib.services.acceptLoan(this.id).then(function(loan) {
		this.status = loan.status;
		this.update();
	}.bind(this));
};

distlib.Loan.prototype.reject = function() {
	distlib.services.rejectLoan(this.id).then(function(loan) {
		this.status = loan.status;
		this.container.dispatchEvent(new CustomEvent("reject-loan", {bubbles: true}));
	}.bind(this));
};

distlib.Loan.prototype.finish = function() {
	distlib.services.finishLoan(this.id).then(function(loan) {
		this.status = loan.status;
		this.container.dispatchEvent(new CustomEvent("finish-loan", {bubbles: true}));
	}.bind(this));
};
