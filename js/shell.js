distlib.shell = (function() {
	'use strict';

	var router = new RouteRecognizer();

	var stopEvent = function(event) {
		event.preventDefault();
		event.stopPropagation();
	}

	var loadingCount = 0;

	var setLoading = function(status) {
		loadingCount = status ? loadingCount + 1 : Math.max(loadingCount - 1, 0);
		if (loadingCount) {
			document.getElementById("loading").innerHTML = '<i class="fa fa-spin fa-spinner"></i>';
			document.addEventListener("click", stopEvent, true);
			document.addEventListener("keyup", stopEvent, true);
		}
		else {
			document.getElementById("loading").innerHTML = '';
			document.removeEventListener("click", stopEvent, true);
			document.removeEventListener("keyup", stopEvent, true);
		}
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
		+ '<div id="login-modal" class="w3-modal w3-animate-opacity">'
		+ '</div>'


	var wrongUrlHtml = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5>Url errónea</h5>'
		+ '</header>';

	var baseModule = {
		init: function(container) {
			history.pushState({}, null, '/search');
			window.dispatchEvent(new CustomEvent("routing"));
		}
	};

	var logoutModule = {
		init: function(container) {
			distlib.auth.logout();
			history.replaceState({}, null, '/');
		}
	}

	var routing = function(event) {
		var path = window.location.pathname;
		var match = router.recognize(location.pathname + location.search + location.hash);
		if (match) {
			var module = match[0].handler;
			var pathParameters = match[0].params;
			var queryParameters = match.queryParams;
			module.init(document.getElementById('main'), pathParameters, queryParameters);
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
		router.add([{path: '', handler: baseModule}]);
		router.add([{path: '/search', handler: distlib.search}]);
		router.add([{path: '/settings', handler: distlib.settings}]);
		router.add([{path: '/loans', handler: distlib.loans}]);
		router.add([{path: '/books', handler: distlib.books}]);
		router.add([{path: '/books/:id', handler: distlib.bookDetail}]);
		router.add([{path: '/debts', handler: distlib.debts}]);
		router.add([{path: '/profile', handler: distlib.profile}]);
		router.add([{path: '/logout', handler: logoutModule}]);
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
		onClickLink: onClickLink,
		router:router
	};
}());
