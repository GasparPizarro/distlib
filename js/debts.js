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
		for (var i = 0; i < debts.length; i = i + 1) {
			var startDate = new Date(debts[i].start);
			var endDate = new Date(debts[i].start);
			endDate.setDate(startDate.getDate() + debts[i].span * 7);
			var debt = document.createElement("li");
			debt.id = debts[i].id;
			debt.innerHTML = String()
				+ '<p>'
					+ debts[i].book.title
					+ '<span class="w3-right">' + debts[i].lender + '</span>'
				+ '</p>'
				+ '<p>'
					+ 'Due on ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear()
				+ '</p>';
			debtsList.appendChild(debt);
		}
	}

	var clearDebts = function() {
		debtsList.innerHTML = "";
	}

	var init = function(container) {
		container.innerHTML = mainHtml;
		debtsList = document.getElementById("debts-list");
		distlib.services.getDebts().then(function(debts) {
			clearDebts();
			loadDebts(debts);
		});
	};

	return {
		init: init,
		title: title
	}
}());
