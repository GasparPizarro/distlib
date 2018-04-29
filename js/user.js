distlib.user = (function() {
	'use strict';

	var username = null;
	var token = null;

	var initModule = function() {
		username = localStorage.getItem("username");
		token = localStorage.getItem("token");
		if (username == null || token == null)
			window.dispatchEvent(new CustomEvent("logout"));
		else
			window.dispatchEvent(new CustomEvent("login"));
	};

	var login = function(the_username, the_password) {
		var form = new FormData();
		form.append("username", the_username);
		form.append("password", the_password);
		fetch(distlib.services.api_host + "/token", {
			method: "POST",
			body: form,
		}).then(function(response) {
			if (response.status == 200) {
				return response.json().then(function(data) {
					username = the_username;
					token = data.token;
					localStorage.setItem("token", data.token);
					localStorage.setItem("username", the_username);
					window.dispatchEvent(new CustomEvent("login"));
				})
			}
			else
				window.dispatchEvent(new CustomEvent("bad-login"));
		}).catch(function() {window.dispatchEvent(new CustomEvent("bad-login"));});
	}

	var get_username = function() {
		return username;
	};

	var get_token = function() {
		return token;
	}

	var logout = function() {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		window.dispatchEvent(new CustomEvent("logout"));
	}

	return {
		get_username: get_username,
		get_token: get_token,
		initModule: initModule,
		login: login,
		logout: logout
	};
}());
