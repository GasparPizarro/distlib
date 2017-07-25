distlib.debts = (function() {
	'use strict';

	var title = "Deudas";

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<div class="w3-row">'
				+ '<div class="w3-col l4">'
					+ '<table id="i-owe-them" class="w3-table">'
						+ '<thead>'
							+ '<tr>'
								+ '<th>Título</th>'
								+ '<th>Dueño</th>'
								+ '<th>Expiración</th>'
							+ '</tr>'
						+ '</thead>'
						+ '<tbody>'
						+ '</tbody>'
					+ '</table>'
				+ '</div>'
			+ '</div>'
		+ '</div>'

	var i_owe_them;

	var load_debts = function(debts) {
		for (var i = 0; i < debts.length; i = i + 1) {
			var start_date = new Date(debts[i].start);
			var end_date = new Date(debts[i].start);
			end_date.setDate(start_date.getDate() + debts[i].span * 7);
			i_owe_them.append('<tr id="' + debts[i].id + '"><td>' + debts[i].book.title + '</td><td>' + debts[i].lender + '</td><td' + (end_date < new Date() ? ' class="w3-text-red"' : '') + '>' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear() + '</td></tr>');
		}
	}

	var clear_debts = function() {
		i_owe_them.find("tbody tr").remove();
	}

	var render = function(container) {
		container.html(main_html);
		i_owe_them = $("#i-owe-them");
		$.when(distlib.services.get_debts()).then(function(debts) {
			clear_debts();
			load_debts(debts);
		});
	};

	return {
		render: render,
		title: title
	}
}());