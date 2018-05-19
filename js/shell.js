distlib.shell = (function() {
	'use strict';

	var router = {

		routes: [],

		getQueryParameters: function(query) {
			if (query)
				return query.replace(/(^\?)/, '').split("&").map(function(n){return n = n.split("="), this[n[0]] = decodeURI(n[1]), this}.bind({}))[0];
			else
				return {};
		},

		matchRoute: function(path) {
			for (var i = 0; i < this.routes.length; i = i + 1) {
				var route = this.routes[i];
				var match = route.path.exec(path);
				if (match != null) {
					return {
						module: route.module,
						pathParameters: match.slice(1)
					}
				}
			}
			return null;
		}
	};

	var setLoading = function(status) {
		if (status)
			loadingModal.style.display = "block";
		else
			loadingModal.style.display = "none";
	};

	var mainHtml = String()
		+ '<div class="w3-bar w3-top w3-black w3-large w3-center" style="z-index:4">'
			+ '<button id="the-button" class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey"><i class="fa fa-bars"></i></button>'
			+ '<div id="modTitle" class="w3-bar-item">The Distributed Library</div>'
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


	var wrongUrlHtml = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5>Url errónea</h5>'
		+ '</header>';

	var baseModule = {
		render: function(container) {
			history.pushState({}, null, '/search');
			window.dispatchEvent(new CustomEvent("routing"));
		}
	};

	var logoutModule = {
		render: function(container) {
			distlib.auth.logout();
			history.replaceState({}, null, '/');
		}
	}

	var routes = [
		{path: /\/$/, module: baseModule},
		{path: /\/search$/, module: distlib.search},
		{path: /\/settings$/, module: distlib.settings},
		{path: /\/loans$/, module: distlib.loans},
		{path: /\/books$/, module: distlib.books},
		{path: /\/books\/(\w+)$/, module: distlib.bookDetail},
		{path: /\/debts$/, module: distlib.debts},
		{path: /\/profile$/, module: distlib.profile},
		{path: /\/logout$/, module: logoutModule},
	];

	var routing = function(event) {
		var path = window.location.pathname;
		var queryParameters = router.getQueryParameters(window.location.search);
		var resolution = router.matchRoute(path);
		if (resolution) {
			var module = resolution.module;
			var pathParameters = resolution.pathParameters;
			module.render(document.getElementById('main'), pathParameters, queryParameters);
			if (module.title)
				document.getElementById('modTitle').textContent = module.title;
		}
		else
			document.getElementById("main").innerHTML = wrongUrlHtml;
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

	var loadingModal;

	var onClickLink = function(event) {
		event.preventDefault();
		history.pushState({}, null, event.target.getAttribute("href"));
		window.dispatchEvent(new CustomEvent("routing"));
		return false;
	}

	var init = function(theContainer) {
		router.routes = routes;
		container = theContainer;
		container.innerHTML = mainHtml;
		loadingModal = document.getElementById("loading-modal");
		distlib.menu.init(document.getElementById('menu'));
		window.addEventListener("routing", routing);
		window.addEventListener("popstate", function() {window.dispatchEvent(new CustomEvent("routing"));});
		window.addEventListener("logout", clearForLogin);
		window.addEventListener("login", onLogin);
		distlib.auth.init(document.getElementById("login-modal"));
		window.dispatchEvent(new CustomEvent("routing"));
	};

	var clearForLogin = function() {
		document.getElementById("login-modal").style.display = "block";
		document.getElementById("modTitle").textContent = "The Distributed Library";
		document.getElementById("main").innerHTML = "";
	};

	var onLogin = function() {
		document.getElementById("login-modal").style.display = "none";
	};

	return {
		init: init,
		toast: toast,
		setLoading: setLoading,
		onClickLink: onClickLink
	};
}());
