let LoanDetail = function(loan) {
	this.loan = loan;
};

LoanDetail.prototype.update = function() {
	while (this.container.firstChild)
		this.container.removeChild(this.container.firstChild);

	let upper = document.createElement("div");

	let title = document.createElement("span");
	title.innerText = this.loan.book.title;

	let buttons = document.createElement("div");
	buttons.classList.add("w3-right");

	let accept = document.createElement("button");
	accept.classList.add("w3-button");
	accept.appendChild((() => {
		let root = document.createElement("i");
		root.classList.add("fa", "fa-check");
		return root;
	})());
	if (this.loan.status == 0) {
		accept.addEventListener("click", this.accept.bind(this));
		accept.title = 'Accept';
		buttons.appendChild(accept);
		let reject = document.createElement("button");
		reject.title = 'Reject';
		reject.classList.add("w3-button");
		reject.appendChild((() => {
			let root = document.createElement("i");
			root.classList.add("fa", "fa-times");
			return root;
		})());
		reject.addEventListener("click", this.reject.bind(this));
		buttons.appendChild(reject);
	}
	else {
		accept.addEventListener("click", this.finish.bind(this));
		accept.title = 'Finish';
		buttons.appendChild(accept);
	}

	upper.appendChild(title);
	upper.appendChild(buttons);

	let lower = document.createElement("div");

	let recipient = document.createElement("span");
	recipient.innerText = this.loan.recipient;

	let time = document.createElement("span");
	if (this.loan.status == 0)
		time.innerText = this.loan.span + ' weeks';
	else {
		let startDate = new Date(this.loan.start);
		let endDate = new Date(this.loan.start);
		endDate.setDate(startDate.getDate() + this.loan.span * 7);
		time.innerText = 'Due on ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear();
	}

	lower.appendChild(recipient);
	lower.appendChild(document.createTextNode(" | "));
	lower.appendChild(time);

	this.container.appendChild(upper);
	this.container.appendChild(lower);
};

LoanDetail.prototype.render = function(container) {
	this.container = container;
	this.update();
};

LoanDetail.prototype.accept = async function() {
	let loan = await this.loan.accept();
	this.loan.status = loan.status;
	this.update();
};

LoanDetail.prototype.reject = async function() {
	let loan = await this.loan.reject();
	this.loan.status = loan.status;
	this.container.dispatchEvent(new CustomEvent("reject-loan", {bubbles: true}));
};

LoanDetail.prototype.finish = async function() {
	let loan = await this.loan.finish();
	this.loan.status = loan.status;
	this.container.dispatchEvent(new CustomEvent("finish-loan", {bubbles: true}));
};

export {LoanDetail};
