
distlib.shell = (function() {
	'use strict';

	var router = {

		routes: [],

		get_query_parameters: function(query) {
			if (query)
				return query.replace(/(^\?)/, '').split("&").map(function(n){return n = n.split("="), this[n[0]] = decodeURI(n[1]), this}.bind({}))[0];
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

	var set_loading = function(status) {
		if (status)
			loading_modal.style.display = "block";
		else
			loading_modal.style.display = "none";
	};

	var main_html = String()
		+ '<div class="w3-bar w3-top w3-black w3-large w3-center" style="z-index:4">'
			+ '<button id="the-button" class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey"><i class="fa fa-bars"></i></button>'
			+ '<div id="mod_title" class="w3-bar-item">The Distributed Library</div>'
			+ '<div id="loading" class="w3-bar-item w3-right"></div>'
		+ '</div>'
		+ '<div id="menu">'
		+ '</div>'
		+ '<div id="main" class="w3-main" style="margin-left:250px;margin-top:43px;">'
		+ '</div>'
		+ '<div id="toast" class="w3-center w3-black"></div>'
		+ '<div id="loading-modal" class="w3-modal" style="z-index:4">'
			+ '<div class="w3-modal-content w3-center" style="max-width:20px">'
				+ '<i class="fa fa-spin fa-spinner"></i>'
			+ '</div>'
		+ '</div>'
		+ '<div id="login-modal" class="w3-modal w3-animate-opacity">'
			+ '<div class="w3-modal-content" style="max-width:300px">'
				+ '<div class="w3-container">'
					+ '<form id="login-form" class="w3-container">'
						+ '<div class="w3-section">'
							+ '<label>Username</label>'
							+ '<input class="w3-input w3-margin-bottom" type="text" name="username" required>'
							+ '<label>Password</label>'
							+ '<input class="w3-input w3-margin-bottom" type="password" name="password" required>'
							+ '<div id="login-status" class="w3-center"></div>'
							+ '<button class="w3-button w3-block w3-green" type="submit" id="login">Ingresar</button>'
						+ '</div>'
					+ '</form>'
				+ '</div>'
			+ '</div>'
		+ '</div>';

	var wrong_url_html = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5>Url errónea</h5>'
		+ '</header>';

	var base_module = {
		render: function(container) {
			history.pushState({}, null, '/search');
			$(document).trigger('hashchange');
		}
	};

	var logout_module = {
		render: function(container) {
			distlib.user.logout();
			history.pushState({}, null, '/');
		}
	}

	var routes = [
		{path: /\/$/, module: base_module},
		{path: /\/search$/, module: distlib.search},
		{path: /\/settings$/, module: distlib.settings},
		{path: /\/loans$/, module: distlib.loans},
		{path: /\/books$/, module: distlib.books},
		{path: /\/books\/(\w+)$/, module: distlib.book_detail},
		{path: /\/debts$/, module: distlib.debts},
		{path: /\/profile$/, module: distlib.profile},
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
			if (module.title)
				document.getElementById('mod_title').textContent = module.title;
		}
		else
			document.getElementById("main").innerHTML = wrong_url_html;
	};

	var toast = function(message) {
		var element = $(document.getElementById("toast"));
		element.text(message);
		element.fadeIn();
		setTimeout(function() {
			element.fadeOut();
		}, 3000);
	}

	var container;

	var loading_modal;

	var on_logout = function(event) {
		document.getElementById("login-modal").style.display = "block";
		document.getElementById("mod_title").textContent = "The Distributed Library";
		document.getElementById("menu-username").innerHTML = "";
		document.getElementById("main").innerHTML = "";
	};

	var on_login = function(event) {
		document.getElementById("login-modal").style.display = "none";
		document.getElementById("menu-username").textContent = distlib.user.get_username();
		document.getElementById("login-form").reset();
		$(document).trigger('hashchange');
	}

	var initModule = function($container) {
		router.routes = routes;
		container = $container;
		container.html(main_html);
		loading_modal = document.getElementById("loading-modal");
		distlib.menu.initModule($('#menu'));
		$(document).bind("hashchange", routing);
		$(document).ajaxStart(function() {set_loading(true)});
		$(document).ajaxStop(function() {set_loading(false)});
		$(window).bind("popstate", function() {$(document).trigger('hashchange')});
		$(document).on("logout", on_logout);
		$(document).on('login', on_login);
		$(document).on('bad-login', function(event) {
			if (!document.getElementById("bad-login"))
				document.getElementById("login-status").innerHTML = '<p id="bad-login" class="w3-text-red">Wrong credentials</p>';
		});
		$("#login").click(function(event) {
			var username = document.querySelector("#login-form [name=username]").value;
			var password = document.querySelector("#login-form [name=password]").value;
			distlib.user.login(username, password);
			return false;
		});
	};

	return {
		initModule: initModule,
		toast: toast,
		set_loading: set_loading
	};
}());
