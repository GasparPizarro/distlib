distlib.debts = (function() {
	'use strict';

	var title = "Debts";

	var mainHtml = String()
		+ '<div class="w3-container">'
			+ '<ul class="w3-ul" id="debts-list" placeholder="There are no debts">'
			+ '</ul>'
		+ '</div>'

	var debtsList;

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
	}

	var init = function(container) {
		container.innerHTML = mainHtml;
		debtsList = document.getElementById("debts-list");
		distlib.services.getDebts().then(loadDebts);
	};

	return {
		init: init,
		title: title
	}
}());
