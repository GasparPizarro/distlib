import * as services from "./services";

var loginForm;

var loginStatus;

var mainHtml = (() => {
	let root = document.createElement('div');
	root.classList.add('w3-modal-content');
	root.appendChild((() => {
		let root = document.createElement('div');
		root.classList.add('w3-container');
		root.appendChild((() => {
			loginForm = document.createElement('form');
			loginForm.classList.add('w3-container');
			loginForm.appendChild((() => {
				let root = document.createElement('div');
				root.classList.add('w3-section');
				root.appendChild((() => {
					let root = document.createElement('label');
					root.innerText = 'Username';
					return root;
				})());
				root.appendChild((() => {
					let root = document.createElement('input');
					root.classList.add('w3-input', 'w3-margin-bottom');
					root.type = 'text';
					root.name = 'username'
					root.required = true;
					return root;
				})());
				root.appendChild((() => {
					let root = document.createElement('label');
					root.innerText = 'Password';
					return root;
				})());
				root.appendChild((() => {
					let root = document.createElement('input');
					root.classList.add('w3-input', 'w3-margin-bottom');
					root.type = 'password';
					root.name = 'password';
					root.required = true;
					return root;
				})());
				root.appendChild((() => {
					loginStatus = document.createElement('div');
					loginStatus.classList.add('w3-center');
					return loginStatus;
				})());
				root.appendChild((() => {
					let root = document.createElement('button');
					root.classList.add('w3-button', 'w3-block', 'w3-green');
					root.type = 'submit';
					root.id = 'login';
					root.innerText = 'Ingresar';
					return root;
				})());
				return root;
			})());
			return loginForm;
		})());
		return root;
	})());
	return root;
})();

var username = null;
var token = null;

var onLogin = function() {
	loginForm.reset();
	window.dispatchEvent(new CustomEvent("routing"));
};

var login = async function(theUsername, thePassword) {
	var form = new FormData();
	form.append("username", theUsername);
	form.append("password", thePassword);
	if (document.getElementById("bad-login"))
		while(loginStatus.firstChild)
			loginStatus.removeChild(loginStatus.firstChild);
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
};

var wrongCredentials = function() {
	if (!document.getElementById("bad-login"))
		loginStatus.innerHTML = '<p id="bad-login" class="w3-text-red">Wrong credentials</p>';
};

var logout = function() {
	localStorage.removeItem("token");
	localStorage.removeItem("username");
	username = null;
	token = null;
	window.dispatchEvent(new CustomEvent("logout"));
};

var init = function(container) {
	container.appendChild(mainHtml);
	username = localStorage.getItem("username");
	token = localStorage.getItem("token");
	if (username == null || token == null)
		window.dispatchEvent(new CustomEvent("logout"));
	else
		window.dispatchEvent(new CustomEvent("login"));
	window.addEventListener('login', onLogin);
	loginForm.onsubmit = function() {
		var username = loginForm.querySelector("[name=username]").value;
		var password = loginForm.querySelector("[name=password]").value;
		login(username, password);
		return false;
	};
};

var getUsername = function() {
	return username;
};

var getToken = function() {
	return token;
};

export {init, getUsername, getToken, logout};
