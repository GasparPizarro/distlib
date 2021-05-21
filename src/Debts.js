import {getDebts} from "./services";

let Debts = function() {
	this.title = "Debts";

	this.mainHtml = (() => {
		let root = document.createElement("div");
		root.classList.add("w3-container");
		root.appendChild((() => {
			this.debtsList = document.createElement("ul");
			this.debtsList.classList.add("w3-ul");
			this.debtsList.setAttribute("placeholder", "There are no debts");
			return this.debtsList;
		})());
		return root;
	})();
};


Debts.prototype.loadDebts = function(debts) {
	while (this.debtsList.firstChild)
		this.debtsList.removeChild(this.debtsList.firstChild);
	for (let i = 0; i < debts.length; i = i + 1) {
		let startDate = new Date(debts[i].start);
		let endDate = new Date(debts[i].start);
		endDate.setDate(startDate.getDate() + debts[i].span * 7);
		let debt = document.createElement("li");
		debt.id = debts[i].id;
		let upper = document.createElement("div");
		let title = document.createElement("span");
		title.innerText = debts[i].book.title;
		upper.appendChild(title);
		let lender = document.createElement("span");
		lender.classList.add("w3-right");
		lender.innerText = debts[i].lender;
		upper.appendChild(lender);
		let lower = document.createElement("div");
		let dueDate = document.createElement("span");
		dueDate.innerText = 'Due on ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear();
		lower.appendChild(dueDate);
		debt.appendChild(upper);
		debt.appendChild(lower);
		this.debtsList.append(debt);
	}
};

Debts.prototype.init = async function(container) {
	while (container.firstChild)
		container.removeChild(container.firstChild);
	container.appendChild(this.mainHtml);
	let debts = await getDebts();
	this.loadDebts(debts);
};

export {Debts};