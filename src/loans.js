import {LoanDetail} from "./LoanDetail";
import {Loan} from "./models/Loan";
import {toast} from "./shell";
import io from 'socket.io-client';

var title = "Loans";

var socket = io.connect("http://localhost:8080");

socket.on('asdf', (msg) => {
    console.log('message: ' + msg);
});

var loansList;

var mainHtml = (() => {
	let root = document.createElement("div");
	root.classList.add("w3-container");
	root.appendChild((() => {
		loansList = document.createElement("ul");
		loansList.classList.add("w3-ul");
		loansList.setAttribute("placeholder", "There are no loans");
		return loansList;
	})());
	return root;
})();


var clearLoans = function() {
	while (loansList.firstChild)
		loansList.removeChild(loansList.firstChild);
};

var loadLoans = function(loans) {
	for (let i = 0; i < loans.length; i = i + 1) {
		let loan = loans[i];
		let element = document.createElement("li");
		new LoanDetail(loan).render(element);
		loansList.appendChild(element);
	}
};

var init = async function(container) {
	while (container.firstChild)
		container.removeChild(container.firstChild);
	container.appendChild(mainHtml);
	let loans = await Loan.all();
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
