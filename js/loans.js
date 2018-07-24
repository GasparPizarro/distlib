distlib.loans = (function() {

	var title = "Loans";

	var mainHtml = String()
		+ '<div class="w3-container">'
			+ '<ul class="w3-ul" id="loans-list" placeholder="There are no loans">'
			+ '</ul>'
		+ '</div>'

	var loansList;

	var clearLoans = function() {
		loansList.innerHTML = "";
	}

	var loadLoans = function(loans) {
		for (var i = 0; i < loans.length; i = i + 1) {
			element = document.createElement("li");
			element.id = loans[i].id;
			if (loans[i].status == 0) {
				element.innerHTML = String()
					+ '<div class="w3-container">'
						+ '<span>' + loans[i].book.title + '</span>'
						+ '<div class="w3-right"><button class="w3-button accept-loan"><i class="fa fa-check"></i></button><button class="w3-button reject-loan"><i class="fa fa-times"></i></button></div>'
					+ '</div>'
					+ '<div class="w3-container">'
						+ loans[i].recipient
						+ ' | '
						+ loans[i].span + ' semanas'
					+ '</div>';
			}
			else {
				var startDate = new Date(loans[i].start);
				var endDate = new Date(loans[i].start);
				endDate.setDate(startDate.getDate() + loans[i].span * 7);
				element.innerHTML = String()
					+ '<p>'
						+ loans[i].book.title
						+ '<span class="w3-right">' + loans[i].recipient + '</span>'
					+ '</p>'
					+ '<p>'
						+ 'Due on ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear()
						+ '<span class="w3-right"><button class="w3-button finish-loan"><i class="fa fa-check"></i></button></span>'
					+ '</p>';
			}
			loansList.appendChild(element);
		}
		document.querySelectorAll(".accept-loan").forEach(function(element){element.addEventListener("click", onAcceptLoan)});
		document.querySelectorAll(".reject-loan").forEach(function(element){element.addEventListener("click", onRejectLoan)});
		document.querySelectorAll(".finish-loan").forEach(function(element){element.addEventListener("click", onFinishLoan)});
	};

	var init = function(container) {
		container.innerHTML = mainHtml;
		loansList = document.getElementById("loans-list");
		distlib.services.getLoans().then(function(loans) {
			clearLoans();
			loadLoans(loans);
		});
	};

	var onRejectLoan = function(event) {
		event.preventDefault();
		var loanId = event.target.closest("li").getAttribute("id")
		distlib.services.rejectLoan(loanId).then(function() {
			event.target.closest("li").remove();
		});
	};

	var onAcceptLoan = function(event) {
		event.preventDefault();
		var loanId = event.target.closest("li").getAttribute("id");
		distlib.services.acceptLoan(loanId).then(function(loan) {
			event.target.closest("li").remove();
			var startDate = new Date(loan.start);
			var endDate = new Date(loan.start);
			endDate.setDate(startDate.getDate() + loan.span * 7);
			var element = document.createElement("li");
			element.id = loan.id;
			element.innerHTML = String()
				+ '<p>'
					+ loan.book.title
					+ '<span class="w3-right">' + loan.recipient + '</span>'
				+ '</p>'
				+ '<p>'
					+ 'Due on ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear()
					+ '<span class="w3-right"><button class="w3-button finish-loan"><i class="fa fa-check"></i></button></span>'
				+ '</p>';
			loansList.appendChild(element);
		});

	};

	var onResolveLoan  = function(event) {
		event.preventDefault();
		var loanId = event.target.closest("li").getAttribute("id");
	};

	var onFinishLoan = function(event) {
		event.preventDefault();
		var loanId = event.target.closest("li").getAttribute("id");
		distlib.services.finishLoan(loanId).then(function() {
			event.target.closest("li").remove();
		});
	};

	return {
		init: init,
		title: title
	}
}());
