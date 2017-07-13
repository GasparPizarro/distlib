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
					+ '</table>'
				+ '</div>'
			+ '</div>'
		+ '</div>'
	
	var render = function($container) {
		$container.html(main_html);
		var they_owe_me = $("#they-owe-me");
		var i_owe_them = $("#i-owe-them");
		var new_loans = $("#new-loans");
		$.when(distlib.services.get_loans()).then(function(loans) {
			for (var i = 0; i < loans.length; i = i + 1) {
				if (loans[i].status == 0)
					new_loans.append('<tr id=' + loans[i].id + '><td>' + loans[i].book.title + '</td><td>' + loans[i].recipient + '</td><td class="w3-center">' + loans[i].span + '</td><td><a href="#" class="accept-loan"><i class="fa fa-check"></i></a> <a href="#" class="reject-loan"><i class="fa fa-times"></i></a></td></tr>')
				else {
					var start_date = new Date(loans[i].start);
					var end_date = new Date(loans[i].start);
					end_date.setDate(start_date.getDate() + loans[i].span);
					they_owe_me.append('<tr id="' + loans[i].id + '"><td>' + loans[i].book.title + '</td><td>' + loans[i].recipient + '</td><td>' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear() + '</td><td><a href="#" class="finish-loan"><i class="fa fa-check"></i></a></td></tr>');
				}
			}
			$(".reject-loan").click(function(event) {
				event.preventDefault();
				var loan_id = $(event.target).closest("tr").attr("id")
				console.log("rejecting loan");
				$.ajax({
					url: distlib.services.get_api_host() + "/loans/" + loan_id + "/reject",
					type: "POST",
					success: function() {
						$(event.target).closest("tr").remove();
					}
				});
			});
			$(".accept-loan").click(function(event) {
				event.preventDefault();
				var loan_id = $(event.target).closest("tr").attr("id");
				console.log("Accepting loan " + loan_id)
				$.ajax({
					url: distlib.services.get_api_host() + "/loans/" + loan_id + "/accept",
					type: "POST",
					success: function(loan) {
						$(event.target).closest("tr").remove();
						var start_date = new Date(loan.start);
						var end_date = new Date(loan.start);
						end_date.setDate(start_date.getDate() + loan.span);
						they_owe_me.append('<tr id="' + loan.id + '"><td>' + loan.book.title + '</td><td>' + loan.recipient + '</td><td>' + end_date.getDate() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getFullYear() + '</td><td><a href="#" class="finish-loan"><i class="fa fa-check"></i></a></td></tr>');
					}
				});
			});
			$(".resolve-loan").click(function(event) {
				event.preventDefault();
				var loan_id = $(event.target).closest("tr").attr("id")
				console.log("Resolving loan " + loan_id)
			});
			$(".finish-loan").click(function(event) {
				event.preventDefault();
				var loan_id = $(event.target).closest("tr").attr("id");
				console.log("Finishing loan " + loan_id)
				$.ajax({
					url: distlib.services.get_api_host() + "/loans/" + loan_id + "/finish",
					type: "POST",
					success: function(data) {
						$(event.target).closest("tr").remove();
						console.log("loan has finished");
					}
				})
			});
		});
	};

	return {
		render: render,
		title: title
	}
}());