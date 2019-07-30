var LoanDetail = function(loan) {
	this.loan = loan;
};

LoanDetail.prototype.update = function() {
	while (this.container.firstChild)
		this.container.removeChild(this.container.firstChild);

	var upper = document.createElement("div");

	var title = document.createElement("span");
	title.innerText = this.loan.book.title;

	var buttons = document.createElement("div");
	buttons.classList.add("w3-right");

	var accept = document.createElement("button");
	accept.classList.add("w3-button");
	accept.innerHTML = '<i class="fa fa-check"></i>';
	if (this.loan.status == 0) {
		accept.addEventListener("click", this.accept.bind(this));
		buttons.appendChild(accept);
		var reject = document.createElement("button");
		reject.classList.add("w3-button");
		reject.innerHTML = '<i class="fa fa-times"></i>';
		reject.addEventListener("click", this.reject.bind(this));
		buttons.appendChild(reject);
	}
	else {
		accept.addEventListener("click", this.finish.bind(this));
		buttons.appendChild(accept);
	}

	upper.appendChild(title);
	upper.appendChild(buttons);

	var lower = document.createElement("div");

	var recipient = document.createElement("span");
	recipient.innerText = this.loan.recipient;

	var time = document.createElement("span");
	if (this.loan.status == 0)
		time.innerText = this.loan.span + ' weeks';
	else {
		var startDate = new Date(this.loan.start);
		var endDate = new Date(this.loan.start);
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
	var loan = await this.loan.accept();
	this.loan.status = loan.status;
	this.update();
};

LoanDetail.prototype.reject = async function() {
	var loan = await this.loan.reject();
	this.loan.status = loan.status;
	this.container.dispatchEvent(new CustomEvent("reject-loan", {bubbles: true}));
};

LoanDetail.prototype.finish = async function() {
	var loan = await this.loan.finish();
	this.loan.status = loan.status;
	this.container.dispatchEvent(new CustomEvent("finish-loan", {bubbles: true}));
};

export {LoanDetail};
