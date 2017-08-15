distlib.shell = (function() {
	'use strict';

	var router = {

		routes: [],

		get_query_parameters: function(query) {
			if (query)
				return query.replace(/(^\?)/, '').split("&").map(function(n){return n = n.split("="), this[n[0]] = n[1], this}.bind({}))[0];
			else
				return {};
		},

		match_route: function(path) {
			for (var i = 0; i < this.routes.length; i = i + 1) {
				var route = this.routes[i];
				var match = route.path.exec(path);
				if (match != null) {
					return {
						module: route.module,
						path_parameters: match.slice(1)
					}
				}
			}
			return null;
		}
	};

	var loading_html = '<i class="fa fa-spin fa-spinner"></i>';

	var set_loading = function(status) {
		if (status)
			$("#loading").html(loading_html);
		else
			$("#loading").empty();
	};

	var main_html = String()
		+ '<div class="w3-bar w3-top w3-black w3-large w3-center" style="z-index:4">'
			+ '<button id="the-button" class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey"><i class="fa fa-bars"></i></button>'
			+ '<div id="mod_title" class="w3-bar-item">BibDist</div>'
			+ '<div id="loading" class="w3-bar-item w3-right"></div>'
		+ '</div>'
		+ '<div id="menu">'
		+ '</div>'
		+ '<div id="main" class="w3-main" style="margin-left:250px;margin-top:43px;">'
		+ '</div>'
		+ '<div id="toast" class="w3-center w3-black"></div>';
	
	var wrong_url_html = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5>Url errónea</h5>'
		+ '</header>';

	var base_module = {
		render: function(container) {
			history.pushState({}, null, '/busqueda');
			$(document).trigger('hashchange');
		}
	};

	var logout_module = {
		render: function(container) {
			distlib.user.logout();
			history.pushState({}, null, '/');
			$(document).trigger('hashchange');
		}
	}

	var routes = [
		{path: /\/$/, module: base_module},
		{path: /\/busqueda$/, module: distlib.search},
		{path: /\/ajustes$/, module: distlib.settings},
		{path: /\/prestamos$/, module: distlib.loans},
		{path: /\/libros$/, module: distlib.books},
		{path: /\/libros\/(\w+)$/, module: distlib.book_detail},
		{path: /\/deudas$/, module: distlib.debts},
		{path: /\/perfil$/, module: distlib.profile},
		{path: /\/logout$/, module: logout_module},
	];

	var routing = function(event) {
		var path = window.location.pathname;
		var query_parameters = router.get_query_parameters(window.location.search);
		var resolution = router.match_route(path);
		if (resolution) {
			var module = resolution.module;
			var path_parameters = resolution.path_parameters;
			module.render($('#main'), path_parameters, query_parameters);
			$('#mod_title').text(module.title);
		}
		else
			$('#main').html(wrong_url_html);
	};

	var toast = function(message) {
		var element = $('#toast')
		element.text(message);
		element.fadeIn();
		setTimeout(function() {
			element.fadeOut();
		}, 3000);
	}

	var login_html = String()
		+ '<div id="id01" class="w3-modal w3-animate-opacity" style="display: block;">'
			+ '<div class="w3-modal-content" style="max-width:300px">'
				+ '<div class="w3-container">'
					+ '<form id="login-form" class="w3-container">'
						+ '<div class="w3-section">'
							+ '<label>Usuario</label>'
							+ '<input class="w3-input w3-margin-bottom" type="text" name="username" required>'
							+ '<label>Contraseña</label>'
							+ '<input class="w3-input w3-margin-bottom" type="password" name="password" required>'
							+ '<div id="login-status" class="w3-center"></div>'
							+ '<button class="w3-button w3-block w3-green" type="submit" id="login">Ingresar</button>'
						+ '</div>'
					+ '</form>'
				+ '</div>'
			+ '</div>'
		+ '</div>';

	var container;

	var on_logout = function(event) {
		container.html(login_html);
		$(document).on('bad-login', function(event) {
			if (!$("#bad-login").length)
				$("#login-status").html('<p id="bad-login" class="w3-text-red">Credenciales incorrectas</p>');
		});
		$("#login").click(function(event) {
			event.preventDefault();
			$("#login-status").html('<p id="loading-login">' + loading_html + '</p>');
			distlib.user.login($("#login-form [name=username]").val(), $("#login-form [name=password]").val());
		});
	};

	var on_login = function(event) {
		container.html(main_html);
		distlib.menu.initModule($('#menu'));
		$(document).trigger('hashchange');
	}

	var on_click_link = function(event) {
		event.preventDefault();
		history.pushState({}, null, $(this).attr("href"));
		$(document).trigger("hashchange");
	};

	var initModule = function($container) {
		router.routes = routes;
		container = $container;
		$(document).bind("hashchange", routing);
		$(document).ajaxStart(function() {set_loading(true)});
		$(document).ajaxStop(function() {set_loading(false)});
		$(window).bind("popstate", function() {$(document).trigger('hashchange')});
		$(document).on("logout", on_logout);
		$(document).on('login', on_login);
		$(document).on('click', "a", on_click_link);
	};

	return {
		initModule: initModule,
		toast: toast,
		set_loading: set_loading
	};
}());