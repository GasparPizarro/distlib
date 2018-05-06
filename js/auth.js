distlib.auth = (function() {
	'use strict';

	var main_html = String()
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
		+ '</div>';

	var username = null;
	var token = null;

	var onLogin = function(event) {
		document.getElementById("login-form").reset();
		window.dispatchEvent(new CustomEvent("routing"));
	};

	var login = function(the_username, the_password) {
		var form = new FormData();
		form.append("username", the_username);
		form.append("password", the_password);
		fetch(distlib.services.api_host + "/token", {
			method: "POST",
			body: form,
		}).then(function(response) {
			if (response.ok) {
				return response.json().then(function(data) {
					username = the_username;
					token = data.token;
					localStorage.setItem("token", data.token);
					localStorage.setItem("username", the_username);
					window.dispatchEvent(new CustomEvent("login"));
				})
			}
			else {
				wrongCredentials();
			}
		}).catch(wrongCredentials);
	}

	var wrongCredentials = function() {
		if (!document.getElementById("bad-login"))
			document.getElementById("login-status").innerHTML = '<p id="bad-login" class="w3-text-red">Wrong credentials</p>';
	};

	var logout = function() {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		window.dispatchEvent(new CustomEvent("logout"));
	}



	var init = function(container) {
		container.innerHTML = main_html;
		username = localStorage.getItem("username");
		token = localStorage.getItem("token");
		if (username == null || token == null)
			window.dispatchEvent(new CustomEvent("logout"));
		else
			window.dispatchEvent(new CustomEvent("login"));
		window.addEventListener('login', onLogin);
		document.getElementById("login-form").onsubmit = function(event) {
			var username = document.querySelector("#login-form [name=username]").value;
			var password = document.querySelector("#login-form [name=password]").value;
			login(username, password);
			return false;
		};
	};

	var get_username = function() {
		return username;
	};

	var get_token = function() {
		return token;
	}


	return {
		init: init,
		get_username: get_username,
		get_token: get_token,
		logout: logout
	}
}());
