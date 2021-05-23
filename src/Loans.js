import {LoanDetail} from "./LoanDetail";
import {Loan} from "./models/Loan";

let app = window.app;

let Loans = function() {
	this.title = "Loans";
	this.loansList;
	this.mainHtml = (() => {
		let root = document.createElement("div");
		root.classList.add("w3-container");
		root.appendChild((() => {
			this.loansList = document.createElement("ul");
			this.loansList.classList.add("w3-ul");
			this.loansList.setAttribute("placeholder", "There are no loans");
			return this.loansList;
		})());
		return root;
	})();
};

Loans.prototype.loadLoans = function(loans) {
	for (let i = 0; i < loans.length; i = i + 1) {
		let loan = loans[i];
		let element = document.createElement("li");
		new LoanDetail(loan).render(element);
		this.loansList.appendChild(element);
	}
};

Loans.prototype.init = async function(container) {
	container.appendChild(this.mainHtml);
	let loans = await Loan.all();
	this.loansList.replaceChildren();
	this.loadLoans(loans);
	this.loansList.addEventListener("reject-loan", function(event) {
		event.target.remove();
		app.toast("The loan has been rejected");
	});
	this.loansList.addEventListener("finish-loan", function(event) {
		event.target.remove();
		app.toast("The loan has been finished");
	});
};

export {Loans};
