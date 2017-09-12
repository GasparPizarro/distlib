distlib.loans = (function() {

	var title = "Mis préstamos";

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<div class="w3-row">'
				+ '<div class="w3-col l4">'
					+ '<h3>Pendientes de resolución</h3>'
					+ '<table id="new-loans" class="w3-table">'
						+ '<thead>'
							+ '<tr>'
								+ '<th>Título</th>'
								+ '<th>Recipiente</th>'
								+ '<th>Periodo</th>'
								+ '<th></th>'
							+ '</tr>'
						+ '</thead>'
						+ '<tbody>'
						+ '</tbody>'
					+ '</table>'
				+ '</div>'
				+ '<div class="w3-col l4">'
					+ '<h3>Activos</h3>'
					+ '<table id="they-owe-me" class="w3-table">'
						+ '<thead>'
							+ '<tr>'
								+ '<th>Título</th>'
								+ '<th>Recipiente</th>'
								+ '<th>Expiración</th>'
								+ '<th></th>'
							+ '</tr>'
						+ '</thead>'
						+ '<tbody>'
						+ '</tbody>'
					+ '</table>'
				+ '</div>'
			+ '</div>'
		+ '</div>';

	var they_owe_me;

	var new_loans;

	var clear_loans = function() {
		new_loans.find("tbody tr").remove();
		they_owe_me.find("tbody tr").remove();
	}

	var load_loans = function(loans) {
		for (var i = 0; i < loans.length; i = i + 1) {
			if (loans[i].status == 0)
				new_loans.append('<tr id=' + loans[i].id + '><td>' + loans[i].book.title + '</td><td>' + loans[i].recipient + '</td><td class="w3-center">' + loans[i].span + '</td><td><button class="w3-button accept-loan"><i class="fa fa-check"></i></button> <button class="w3-button reject-loan"><i class="fa fa-times"></i></button></td></tr>')
			else {
				var start_date = new Date(loans[i].start);
				var end_date = new Date(loans[i].start);
				end_date.setDate(start_date.getDate() + loans[i].span * 7);
				they_owe_me.append('<tr id="' + loans[i].id + '"><td>' + loans[i].book.title + '</td><td>' + loans[i].recipient + '</td><td' + (end_date < new Date() ? ' class="w3-text-red"' : '') + '>' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear() + '</td><td><button class="w3-button finish-loan"><i class="fa fa-check"></i></button></td></tr>');
			}
		}
		$(".reject-loan").click();
		$(".accept-loan").click(on_accept_loan);
		$(".resolve-loan").click(on_resolve_loan);
		$(".finish-loan").click(on_finish_loan);
	};
	
	var render = function($container) {
		$container.html(main_html);
		they_owe_me = $("#they-owe-me");
		i_owe_them = $("#i-owe-them");
		new_loans = $("#new-loans");
		$.when(distlib.services.get_loans()).then(function(loans) {
			clear_loans();
			load_loans(loans);
		});
	};

	var on_reject_loan = function(event) {
		event.preventDefault();
		var loan_id = $(event.target).closest("tr").attr("id")

		$.ajax({
			url: distlib.services.get_api_host() + "/loans/" + loan_id + "/reject",
			type: "POST",
			success: function() {
				$(event.target).closest("tr").remove();
			}
		});
	};

	var on_accept_loan = function(event) {
		event.preventDefault();
		var loan_id = $(event.target).closest("tr").attr("id");
		$.ajax({
			url: distlib.services.get_api_host() + "/loans/" + loan_id + "/accept",
			type: "POST",
			success: function(loan) {
				$(event.target).closest("tr").remove();
				var start_date = new Date(loan.start);
				var end_date = new Date(loan.start);
				end_date.setDate(start_date.getDate() + loan.span * 7);
				they_owe_me.append('<tr id="' + loan.id + '"><td>' + loan.book.title + '</td><td>' + loan.recipient + '</td><td>' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear() + '</td><td><button class="w3-button finish-loan"><i class="fa fa-check"></i></button></td></tr>');
			}
		});
	};

	var on_resolve_loan  = function(event) {
		event.preventDefault();
		var loan_id = $(event.target).closest("tr").attr("id");
	};

	var on_finish_loan = function(event) {
		event.preventDefault();
		var loan_id = $(event.target).closest("tr").attr("id");
		$.ajax({
			url: distlib.services.get_api_host() + "/loans/" + loan_id + "/finish",
			type: "POST",
			success: function(data) {
				$(event.target).closest("tr").remove();

			}
		});
	};

	return {
		render: render,
		title: title
	}
}());