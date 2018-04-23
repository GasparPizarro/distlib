distlib.user = (function() {
	'use strict';

	var username = null;
	var token = null;

	var initModule = function() {
		username = localStorage.getItem("username");
		token = localStorage.getItem("token");
		if (username == null || token == null)
			$(document).trigger("logout");
		else {
			$.ajaxSetup({
				headers: {
					Authorization: ('Token ' + token)
				}
			});
			$(document).trigger("login");
		}
	};

	var login = function(the_username, the_password) {
		var form = new FormData();
		form.append("username", the_username);
		form.append("password", the_password);
		fetch(distlib.services.get_api_host() + "/token", {
			method: "POST",
			body: form,
		}).then(function(response) {
			if (response.status == 200) {
				return response.json().then(function(data) {
					username = the_username;
					token = data.token;
					localStorage.setItem("token", data.token);
					localStorage.setItem("username", the_username);
					$(document).trigger("login");
				})
			}
			else
				$(document).trigger("bad-login")
		}).catch(function() {$(document).trigger("bad-login")});
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
		$(document).trigger("logout");
	}

	return {
		get_username: get_username,
		get_token: get_token,
		initModule: initModule,
		login: login,
		logout: logout
	};
}());
