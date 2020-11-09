import {getDebts} from "./services";

var title = "Debts";

var debtsList;

var mainHtml = (() => {
	let root = document.createElement("div");
	root.classList.add("w3-container");
	root.appendChild((() => {
		debtsList = document.createElement("ul");
		debtsList.classList.add("w3-ul");
		debtsList.setAttribute("placeholder", "There are no debts");
		return debtsList;
	})());
	return root;
})();


var loadDebts = function(debts) {
	while (debtsList.firstChild)
		debtsList.removeChild(debtsList.firstChild);
	for (var i = 0; i < debts.length; i = i + 1) {
		var startDate = new Date(debts[i].start);
		var endDate = new Date(debts[i].start);
		endDate.setDate(startDate.getDate() + debts[i].span * 7);
		var debt = document.createElement("li");
		debt.id = debts[i].id;
		var upper = document.createElement("div");
		var title = document.createElement("span");
		title.innerText = debts[i].book.title;
		upper.appendChild(title);
		var lender = document.createElement("span");
		lender.classList.add("w3-right");
		lender.innerText = debts[i].lender;
		upper.appendChild(lender);
		var lower = document.createElement("div");
		var dueDate = document.createElement("span");
		dueDate.innerText = 'Due on ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear();
		lower.appendChild(dueDate);
		debt.appendChild(upper);
		debt.appendChild(lower);
		debtsList.append(debt);
	}
};

var init = async function(container) {
	while (container.firstChild)
		container.removeChild(container.firstChild);
	container.appendChild(mainHtml);
	var debts = await getDebts();
	loadDebts(debts);
};

export {init, title};
