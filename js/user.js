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
		$.ajax({
			url: distlib.services.get_api_host() + "/token",
			type: "POST",
			data: 'username=' + the_username + '&password=' + the_password,
			success: function(data, textStatus, jqXHR) {
				username = the_username;
				token = data.token;
				localStorage.setItem("token", data.token);
				localStorage.setItem("username", the_username);
				$.ajaxSetup({
					headers: {
						Authorization: ('Token ' + data.token)
					}
				});
				$(document).trigger("login");
			},
			error: function() {
				$(document).trigger("bad-login");
			}
		});
	}

	var get_username = function() {
		return username;
	};

	var logout = function() {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		$(document).trigger("logout");
	}

	return {
		get_username: get_username,
		initModule: initModule,
		login: login,
		logout: logout
	};
}());
