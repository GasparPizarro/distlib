distlib.book_detail = (function() {

	var title = "Mis libros";

	var main_html = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5 id="book-title"></h5>'
		+ '</header>'
		+ '<div id="modal" class="w3-modal">'
			+ '<div class="w3-modal-content w3-card-4 w3-animate-opacity" style="max-width:300px">'
				+ '<div class="w3-center"><br>'
					+ '<span onclick="document.getElementById(\'modal\').style.display=\'none\'" class="w3-button w3-display-topright" title="Close Modal">&times;</span>'
				+ '</div>'
				+ '<div class="w3-container">'
					+ '<div class="w3-section">'
						+ '<h3 class="w3-center">¿Está seguro?</h3>'
						+ '<div class="w3-center">'
							+ '<button id="delete-book" class="w3-button w3-red" type="submit">Eliminar</button>'
							+ ' '
							+ '<button onclick="document.getElementById(\'modal\').style.display=\'none\'" class="w3-button w3-green" type="submit">Cancelar</button>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		+ '</div>'
		+ '<div class="w3-container" id="book_detail">'
			+ '<dl>'
				+ '<dt>Autor</dt>'
				+ '<dd id="book-author"></dd>'
				+ '<dt>Año</dt>'
				+ '<dd id="book-year"></dd>'
				+ '<dt>Dueño</dt>'
				+ '<dd id="book-owner"></dd>'
			+ '</dl> '
			+ '<a id="action-button" class="w3-button"></a>'
		+ '</div>';


	var render = function($container, params) {
		$container.html(main_html);
		target_node = $container;
		if (!params.id)
			return;
		$.when(distlib.services.get_book(params.id)).then(function(book) {
			var is_mine = book.owner == distlib.user.get_username();
			$("#book-title").html(book.title);
			$("#book-author").html(book.author);
			$("#book-year").html(book.year);
			$("#book-owner").html(book.owner);
			action_button = $("#action-button");
			if (is_mine)
				action_button.addClass("action-delete").addClass("w3-red").text("Eliminar libro");
			else
				action_button.addClass("action-ask").addClass("w3-blue").text("Solicitar libro");

			if (action_button.hasClass("action-delete")) {
				if (action_button.hasClass("w3-disabled"))
					return;
				action_button.click(function(event) {
					event.preventDefault();
					var modal = document.getElementById('modal');
					modal.style.display = "block";
				});
				$("#delete-book").click(function(event) {
					event.preventDefault();
					$.when(distlib.services.delete_book(params.id)).then(function(result) {
						history.pushState({}, null, "mis_libros");
						$(window).trigger('hashchange');
					})
				});
			}
			if (action_button.hasClass("action-ask")) {
				action_button.click(function(event) {
					event.preventDefault();
					$.when(distlib.services.ask_for_book(book.id)).then(function(data) {
						console.log(data)
						distlib.shell.toast("Se ha envíado un correo a el dueño del libro");
						action_button.text("Solicitado");
						action_button.addClass("w3-disabled");
					});
				});
			}
		})
	};

	return {
		render: render,
		title: title
	}
}());