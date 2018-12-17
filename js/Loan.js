distlib.Loan = function(loan) {

	var view = {
		container: null,
		title: null,
		buttons: {
			accept: null,
			reject: null,
			finish: null,
		},
		recipient: null,
		time: null
	};

	model = {}

	var update = function() {
		while (view.container.firstChild)
			view.container.removeChild(view.container.firstChild);

		var upper = document.createElement("div");

		view.title = document.createElement("span");
		view.title.innerText = model.loan.book.title;

		view.buttons = document.createElement("div");
		view.buttons.classList.add("w3-right");

		if (model.loan.status == 0) {
			view.buttons.accept = document.createElement("button");
			view.buttons.accept.classList.add("w3-button");
			view.buttons.accept.innerHTML = '<i class="fa fa-check"></i>';
			view.buttons.accept.addEventListener("click", accept);
			view.buttons.appendChild(view.buttons.accept);

			view.buttons.reject = document.createElement("button");
			view.buttons.reject.classList.add("w3-button");
			view.buttons.reject.innerHTML = '<i class="fa fa-times"></i>';
			view.buttons.reject.addEventListener("click", reject);
			view.buttons.appendChild(view.buttons.reject);
		}
		else {
			view.buttons.accept = document.createElement("button");
			view.buttons.accept.classList.add("w3-button");
			view.buttons.accept.innerHTML = '<i class="fa fa-check"></i>';
			view.buttons.accept.addEventListener("click", finish);
			view.buttons.appendChild(view.buttons.accept);
		}

		upper.appendChild(view.title);
		upper.appendChild(view.buttons);

		var lower = document.createElement("div");

		var recipient = document.createElement("span");
		recipient.innerText = model.loan.recipient

		view.time = document.createElement("span");
		if (model.loan.status == 0)
			view.time.innerText = model.loan.span + ' weeks';
		else {
			var startDate = new Date(model.loan.start);
			var endDate = new Date(model.loan.start);
			endDate.setDate(startDate.getDate() + model.loan.span * 7);
			view.time.innerText = 'Due on ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear();
		}

		lower.appendChild(recipient);
		lower.appendChild(document.createTextNode(" | "));
		lower.appendChild(view.time)

		view.container.appendChild(upper);
		view.container.appendChild(lower);
	}

	var render = function(container) {
		view.container = container;
		model.loan = loan;
		update();
	};

	var accept = function() {
		distlib.services.acceptLoan(loan.id).then(function(loan) {
			model.loan = loan;
			update();
		});
	};

	var finish = function() {
		distlib.services.finishLoan(loan.id).then(function() {
			view.container.dispatchEvent(new CustomEvent("finish-loan", {bubbles: true}));
		});
	};

	var reject = function() {
		distlib.services.rejectLoan(loan.id).then(function() {
			view.container.dispatchEvent(new CustomEvent("reject-loan", {bubbles: true}));
		});
	};

	return {
		render: render
	}
};
