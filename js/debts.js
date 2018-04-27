distlib.debts = (function() {
	'use strict';

	var title = "Debts";

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<ul class="w3-ul" id="debts-list">'
			+ '</ul>'
		+ '</div>'

	var debts_list;

	var load_debts = function(debts) {
		for (var i = 0; i < debts.length; i = i + 1) {
			var start_date = new Date(debts[i].start);
			var end_date = new Date(debts[i].start);
			end_date.setDate(start_date.getDate() + debts[i].span * 7);
			var debt = document.createElement("li");
			debt.id = debts[i].id;
			debt.innerHTML = String()
				+ '<p>'
					+ debts[i].book.title
					+ '<span class="w3-right">' + debts[i].lender + '</span>'
				+ '</p>'
				+ '<p>'
					+ 'Due on ' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear()
				+ '</p>';
			debts_list.appendChild(debt);
		}
	}

	var clear_debts = function() {
		debts_list.innerHTML = "";
	}

	var render = function(container) {
		container.innerHTML = main_html;
		debts_list = document.getElementById("debts-list");
		distlib.services.get_debts().then(function(debts) {
			clear_debts();
			load_debts(debts);
		});
	};

	return {
		render: render,
		title: title
	}
}());
