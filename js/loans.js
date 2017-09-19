distlib.loans = (function() {

	var title = "Loans";

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<ul class="w3-ul" id="loans-list">'
			+ '</ul>'
		+ '</div>'

	var loans_list;

	var clear_loans = function() {
		loans_list.empty();
	}

	var load_loans = function(loans) {
		for (var i = 0; i < loans.length; i = i + 1) {
			if (loans[i].status == 0)
				loans_list.append('<li id="' + loans[i].id + '">'
					+ '<p>'
						+ loans[i].book.title
						+ '<span class="w3-right">' + loans[i].recipient + '</span>'
					+ '</p>'
					+ '<p>'
						+ loans[i].span + ' semanas'
						+ '<span class="w3-right"><button class="w3-button accept-loan"><i class="fa fa-check"></i></button><button class="w3-button reject-loan"><i class="fa fa-times"></i></button></span>'
					+ '</p>'
				+ '</li>');
			else {
				var start_date = new Date(loans[i].start);
				var end_date = new Date(loans[i].start);
				end_date.setDate(start_date.getDate() + loans[i].span * 7);
				loans_list.append('<li id="' + loans[i].id + '">'
					+ '<p>'
						+ loans[i].book.title
						+ '<span class="w3-right">' + loans[i].recipient + '</span>'
					+ '</p>'
					+ '<p>'
						+ 'Due on ' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear()
						+ '<span class="w3-right"><button class="w3-button finish-loan"><i class="fa fa-check"></i></button></span>'
					+ '</p>'
				+ '</li>');
			}
		}
		$(".accept-loan").click(on_accept_loan);
		$(".reject-loan").click(on_reject_loan);
		$(".finish-loan").click(on_finish_loan);
	};
	
	var render = function($container) {
		$container.html(main_html);
		loans_list = $("#loans-list");
		$.when(distlib.services.get_loans()).then(function(loans) {
			clear_loans();
			load_loans(loans);
		});
	};

	var on_reject_loan = function(event) {
		event.preventDefault();
		var loan_id = $(event.target).closest("li").attr("id")

		$.ajax({
			url: distlib.services.get_api_host() + "/loans/" + loan_id + "/reject",
			type: "POST",
			success: function() {
				$(event.target).closest("li").remove();
			}
		});
	};

	var on_accept_loan = function(event) {
		event.preventDefault();
		var loan_id = $(event.target).closest("li").attr("id");
		$.ajax({
			url: distlib.services.get_api_host() + "/loans/" + loan_id + "/accept",
			type: "POST",
			success: function(loan) {
				$(event.target).closest("li").remove();
				var start_date = new Date(loan.start);
				var end_date = new Date(loan.start);
				end_date.setDate(start_date.getDate() + loan.span * 7);
				loans_list.append('<li id="' + loan.id + '">'
					+ '<p>'
						+ loan.book.title
						+ '<span class="w3-right">' + loan.recipient + '</span>'
					+ '</p>'
					+ '<p>'
						+ 'Due on ' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear()
						+ '<span class="w3-right"><button class="w3-button finish-loan"><i class="fa fa-check"></i></button></span>'
					+ '</p>'
				+ '</li>')
			}
		});
	};

	var on_resolve_loan  = function(event) {
		event.preventDefault();
		var loan_id = $(event.target).closest("li").attr("id");
	};

	var on_finish_loan = function(event) {
		event.preventDefault();
		var loan_id = $(event.target).closest("li").attr("id");
		$.ajax({
			url: distlib.services.get_api_host() + "/loans/" + loan_id + "/finish",
			type: "POST",
			success: function(data) {
				$(event.target).closest("li").remove();

			}
		});
	};

	return {
		render: render,
		title: title
	}
}());