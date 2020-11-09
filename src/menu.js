import * as shell from "./shell";
import * as auth from "./auth";
import avatar from './img/avatar2.png';

var overlayBg = (() => {
	let root = document.createElement("div");
	root.classList.add("w3-overlay", "w3-hide-large", "w3-animate-opacity");
	root.style.cursor = "pointer";
	root.style.display = "none";
	return root
})();

var logoutButton;

var menuUsername;

var actionButtons;

var mySidebar = (() => {
	let root = document.createElement("nav");
	root.classList.add("w3-sidebar", "w3-collapse", "w3-white", "w3-animate-left");
	root.style = "z-index: 3; width: 250px; display: none;";
	root.appendChild(document.createElement("br"));
	root.appendChild((() => {
		let root = document.createElement("div");
		root.classList.add("w3-container", "w3-row");
		root.appendChild((() => {
			let root = document.createElement("div");
			root.classList.add("w3-container", "w3-row");
			root.appendChild((() => {
				let root = document.createElement("div");
				root.classList.add("w3-col", "s4");
				root.appendChild((() => {
					let root = document.createElement("img");
					root.classList.add("w3-circle", "w3-margin-right");
					root.style.width = "46px";
					root.src = avatar;
					return root;
				})());
				return root;
			})());
			root.appendChild((() => {
				let root = document.createElement("div");
				root.classList.add("w3-col");
				root.appendChild((() => {
					let root = document.createElement("span");
					root.appendChild((() => {
						menuUsername = document.createElement("a");
						menuUsername.href = "/profile";
						menuUsername.style = "font-weight: bold";
						return menuUsername;
					})());
					return root;
				})());
				return root;
			})());
			return root;
		})());
		return root;
	})());
	root.appendChild(document.createElement("br"));
	root.appendChild((() => {
		actionButtons = document.createElement("div");
		actionButtons.classList.add("w3-bar-block");
		let actions = [
			["/search", "fa-search", "Search"],
			["/books", "fa-book", "My books"],
			["/loans", "fa-eye", "Loans"],
			["/debts", "fa-eye", "Debts"],
			["/logout", "fa-sign-out", "Log out"],
		]
		for (let action of actions) {
			actionButtons.appendChild((() => {
				let root = document.createElement("a");
				root.href = action[0];
				root.classList.add("w3-bar-item", "w3-button", "w3-padding");
				root.appendChild((() => {
					let root = document.createElement("i");
					root.classList.add("fa", action[1], "fa-fw");
					return root;
				})());
				root.appendChild(document.createTextNode(" " + action[2]));
				return root;
			})());
		}
		logoutButton = root.lastChild;
		return actionButtons;
	})());
	root.appendChild((() => {
		let root = document.createElement("div");
		root.classList.add("w3-overlay", "w3-hide-large", "w3-animate-opacity");
		root.style.cursos = "pointer";
		root.style.display = "none";
		return root;
	})());
	return root;
})();

var activate = function(menu, path) {
	for (var i = 0; i < menu.length; i = i + 1)
		if (path.startsWith(menu[i].getAttribute('href')))
			menu[i].classList.add("w3-blue");
		else
			menu[i].classList.remove("w3-blue");
};

var onClickSandwich = function() {
	if (mySidebar.style.display == 'block') {
		mySidebar.style.display = 'none';
		overlayBg.style.display = 'none';
	}
	else {
		mySidebar.style.display = 'block';
		overlayBg.style.display = 'block';
	}
};

var onClickOverlay = function() {
	mySidebar.style.display = 'none';
	overlayBg.style.display = 'none';
};

var init = function(container) {
	container.appendChild(mySidebar);
	container.appendChild(overlayBg);
	document.getElementById('the-button').addEventListener("click", onClickSandwich);
	overlayBg.addEventListener("click", onClickOverlay);
	mySidebar.querySelectorAll('a:not(#logout)').forEach((element) => {
		element.addEventListener("click", shell.onClickLink);
	});
	logoutButton.addEventListener("click", (event) => {
		event.preventDefault();
		auth.logout();
	});
	window.addEventListener("login", () => {
		menuUsername.textContent = auth.getUsername();
	});
	window.addEventListener("logout", () => {
		while (menuUsername.firstChild)
			menuUsername.removeChild(menuUsername.firstChild);
	});
	window.addEventListener("routing", () => {
		activate(actionButtons.childNodes, '/' + location.pathname.substring(1));
		onClickOverlay();
	}, false);
};


export {init};
