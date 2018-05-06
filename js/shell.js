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
		+ '</div>'


	var wrong_url_html = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5>Url errónea</h5>'
		+ '</header>';

	var base_module = {
		render: function(container) {
			history.pushState({}, null, '/search');
			window.dispatchEvent(new HashChangeEvent("hashchange"));
		}
	};

	var logout_module = {
		render: function(container) {
			distlib.auth.logout();
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
			module.render(document.getElementById('main'), path_parameters, query_parameters);
			if (module.title)
				document.getElementById('mod_title').textContent = module.title;
		}
		else
			document.getElementById("main").innerHTML = wrong_url_html;
	};

	var toast = function(message) {
		var element = document.getElementById("toast");
		element.textContent = message;
		element.style.display = "block";
		setTimeout(function() {
			element.style.display = "none";
		}, 3000);
	}

	var container;

	var loading_modal;

	var onClickLink = function(event) {
		event.preventDefault();
		history.pushState({}, null, event.target.getAttribute("href"));
		window.dispatchEvent(new HashChangeEvent("hashchange"));
		return false;
	}

	var initModule = function(the_container) {
		router.routes = routes;
		container = the_container;
		container.innerHTML = main_html;
		loading_modal = document.getElementById("loading-modal");
		distlib.menu.init(document.getElementById('menu'));
		window.addEventListener("hashchange", routing);
		window.addEventListener("popstate", function() {window.dispatchEvent(new HashChangeEvent("hashchange"));});
		window.addEventListener("logout", clearForLogin);
		window.addEventListener("login", onLogin);
		distlib.auth.init(document.getElementById("login-modal"));
		window.dispatchEvent(new HashChangeEvent("hashchange"));
	};

	var clearForLogin = function() {
		document.getElementById("login-modal").style.display = "block";
		document.getElementById("mod_title").textContent = "The Distributed Library";
		document.getElementById("main").innerHTML = "";
	};

	var onLogin = function() {
		document.getElementById("login-modal").style.display = "none";
	};

	return {
		initModule: initModule,
		toast: toast,
		set_loading: set_loading,
		onClickLink: onClickLink
	};
}());
