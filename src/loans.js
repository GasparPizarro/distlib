import {LoanDetail} from "./LoanDetail";
import {Loan} from "./models/Loan";
import {toast} from "./shell";

var title = "Loans";

var mainHtml = String()
	+ '<div class="w3-container">'
		+ '<ul class="w3-ul" id="loans-list" placeholder="There are no loans">'
		+ '</ul>'
	+ '</div>';

var loansList;

var clearLoans = function() {
	loansList.innerHTML = "";
};

var loadLoans = function(loans) {
	for (var i = 0; i < loans.length; i = i + 1) {
		let	loan = loans[i];
		var element = document.createElement("li");
		new LoanDetail(loan).render(element);
		loansList.appendChild(element);
	}
};

var init = async function(container) {
	container.innerHTML = mainHtml;
	loansList = document.getElementById("loans-list");
	var loans = await Loan.all();
	clearLoans();
	loadLoans(loans);
	loansList.addEventListener("reject-loan", function(event) {
		event.target.remove();
		toast("The loan has been rejected");
	});
	loansList.addEventListener("finish-loan", function(event) {
		event.target.remove();
		toast("The loan has been finished");
	});
};

export {init, title};
