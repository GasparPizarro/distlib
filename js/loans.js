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
			distlib.Loan(loans[i]).render(element);
			loansList.appendChild(element);
		}
		document.querySelectorAll(".accept-loan").forEach(function(element){element.addEventListener("click", onAcceptLoan)});
		document.querySelectorAll(".finish-loan").forEach(function(element){element.addEventListener("click", onFinishLoan)});
	};

	var init = function(container) {
		container.innerHTML = mainHtml;
		loansList = document.getElementById("loans-list");
		distlib.services.getLoans().then(function(loans) {
			clearLoans();
			loadLoans(loans);
		});
		var deleteLoan = function(event) {
			event.target.remove();
		};
		loansList.addEventListener("reject-loan", deleteLoan);
		loansList.addEventListener("finish-loan", deleteLoan);
	};

	return {
		init: init,
		title: title
	}
}());
