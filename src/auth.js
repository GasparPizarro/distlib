import * as services from "./services";

var mainHtml = String()
+ '<div class="w3-modal-content">'
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

var login = async function(theUsername, thePassword) {
	var form = new FormData();
	form.append("username", theUsername);
	form.append("password", thePassword);
	if (document.getElementById("bad-login"))
		document.getElementById("login-status").innerHTML= "";
	try {
		var response = await fetch(services.apiHost + "/token", {
			method: "POST",
			body: form,
		});

		if (response.ok) {
			var data = await response.json();
			username = theUsername;
			token = data.token;
			localStorage.setItem("token", data.token);
			localStorage.setItem("username", theUsername);
			window.dispatchEvent(new CustomEvent("login"));
		}
		else {
			wrongCredentials();
		}
	} catch (err) {
		wrongCredentials();
	}
}

var wrongCredentials = function() {
	if (!document.getElementById("bad-login"))
		document.getElementById("login-status").innerHTML = '<p id="bad-login" class="w3-text-red">Wrong credentials</p>';
};

var logout = function() {
	localStorage.removeItem("token");
	localStorage.removeItem("username");
	username = null;
	token = null;
	window.dispatchEvent(new CustomEvent("logout"));
}

var init = function(container) {
	container.innerHTML = mainHtml;
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

var getUsername = function() {
	return username;
};

var getToken = function() {
	return token;
}


export {init, getUsername, getToken, logout};
