distlib.search = (function() {
	'use strict';

	var title = "Buscar libros";

	var book_count = 0;

	var page_size = 10;

	var main_html = String()
		+ '<div class="w3-container">'
			+ '<input id="search-box" class="w3-input w3-margin-top" type="text">'
			+ '<div id="results">'
			+ '</div>'
		+ '</div>';

	var render = function($container, params) {
		$container.html(main_html);
		if (params.q) {
			$("#search-box").val(params.q);
			search(params.q);
		}
		$("#search-box").keyup(
			function (event) {
				if (event.keyCode != 13)
					return;
				search($("#search-box").val());
			}
		);
	}

	var search = function(query) {
		history.pushState({}, null, window.location.hash + '?q=' + query);
		distlib.shell.set_loading(true);
		$.when(distlib.services.search(query)).then(function(data) {
			distlib.shell.set_loading(false);
			var results_html;
			var results_title_html = $('<h5/>').text('Resultados');
			if (data.length == 0)
				results_html = $('<p/>').addClass('w3-disabled').text('No hay resultados');
			else {
				results_html = $('<ul/>').addClass('w3-ul');
				for (var i = 0; i < data.length; i = i + 1)
					results_html.append(String()
						+ '<li>'
							+ '<p>'
								+ '<a href="libros?id=' + data[i].id + '" class="search-result">' + data[i].title + '</a>'
								+ '<span class="w3-right">' + data[i].year + '</span>'
							+ '</p>'
							+ '<p>'
								+ data[i].author + '<span class="w3-tag w3-right">' + data[i].owner + '</span>'
							+ '</p>'
						+ '</li>'
					);
			}
			$("#results").html(results_title_html);
			results_html.insertAfter(results_title_html);
			if (data.length != 0) {
				$(".search-result").click(function(event) {
					event.preventDefault();
					console.log(event.target.getAttribute("href"));
					history.pushState({}, null, event.target.getAttribute("href"));
					$(window).trigger("hashchange");
				});
			}
			$("#search-box").blur();
		});
	};

	return {
		render: render,
		title: title
	}
}());