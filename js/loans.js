distlib.loans = (function() {

	var title = "Loans";

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<ul class="w3-ul" id="loans-list">'
			+ '</ul>'
		+ '</div>'

	var loans_list;

	var clear_loans = function() {
		loans_list.innerHTML = "";
	}

	var load_loans = function(loans) {
		for (var i = 0; i < loans.length; i = i + 1) {
			element = document.createElement("li");
			element.id = loans[i].id;
			if (loans[i].status == 0) {
				element.innerHTML = String()
					+ '<p>'
						+ loans[i].book.title
						+ '<span class="w3-right">' + loans[i].recipient + '</span>'
					+ '</p>'
					+ '<p>'
						+ loans[i].span + ' semanas'
						+ '<span class="w3-right"><button class="w3-button accept-loan"><i class="fa fa-check"></i></button><button class="w3-button reject-loan"><i class="fa fa-times"></i></button></span>'
					+ '</p>';
			}
			else {
				var start_date = new Date(loans[i].start);
				var end_date = new Date(loans[i].start);
				end_date.setDate(start_date.getDate() + loans[i].span * 7);
				element.innerHTML = String()
					+ '<p>'
						+ loans[i].book.title
						+ '<span class="w3-right">' + loans[i].recipient + '</span>'
					+ '</p>'
					+ '<p>'
						+ 'Due on ' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear()
						+ '<span class="w3-right"><button class="w3-button finish-loan"><i class="fa fa-check"></i></button></span>'
					+ '</p>';
			}
			loans_list.appendChild(element);
		}
		document.querySelectorAll(".accept-loan").forEach(function(element){element.addEventListener("click", on_accept_loan)});
		document.querySelectorAll(".reject-loan").forEach(function(element){element.addEventListener("click", on_reject_loan)});
		document.querySelectorAll(".finish-loan").forEach(function(element){element.addEventListener("click", on_finish_loan)});
	};

	var render = function(container) {
		container.innerHTML = main_html;
		loans_list = document.getElementById("loans-list");
		distlib.services.get_loans().then(function(loans) {
			clear_loans();
			load_loans(loans);
		});
	};

	var on_reject_loan = function(event) {
		event.preventDefault();
		var loan_id = event.target.closest("li").getAttribute("id")
		distlib.services.reject_loan(loan_id).then(function() {
			event.target.closest("li").remove();
		});
	};

	var on_accept_loan = function(event) {
		event.preventDefault();
		var loan_id = event.target.closest("li").getAttribute("id");
		distlib.services.accept_loan(loan_id).then(function(loan) {
			event.target.closest("li").remove();
			var start_date = new Date(loan.start);
			var end_date = new Date(loan.start);
			end_date.setDate(start_date.getDate() + loan.span * 7);
			var element = document.createElement("li");
			element.id = loan.id;
			element.innerHTML = String()
				+ '<p>'
					+ loan.book.title
					+ '<span class="w3-right">' + loan.recipient + '</span>'
				+ '</p>'
				+ '<p>'
					+ 'Due on ' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear()
					+ '<span class="w3-right"><button class="w3-button finish-loan"><i class="fa fa-check"></i></button></span>'
				+ '</p>';
			loans_list.appendChild(element);
		});

	};

	var on_resolve_loan  = function(event) {
		event.preventDefault();
		var loan_id = event.target.closest("li").getAttribute("id");
	};

	var on_finish_loan = function(event) {
		event.preventDefault();
		var loan_id = event.target.closest("li").getAttribute("id");
		distlib.services.finish_loan(loan_id).then(function() {
			event.target.closest("li").remove();
		});
	};

	return {
		render: render,
		title: title
	}
}());
