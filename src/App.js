import RouteRecognizer from "route-recognizer";
import * as auth from "./auth";
import {Books} from "./Books";
import {Search} from "./Search";
import {Loans} from "./Loans";
import {Debts} from "./Debts";
import {Profile} from "./Profile";
import {Menu} from "./Menu";

let App = function() {
	this.router = new RouteRecognizer();
	this.loadingCount = 0;
	this.wrongUrlHtml = (() => {
		let root = document.createElement("header");
		root.classList.add("w3-container");
		root.appendChild((() => {
			let root = document.createElement("h5");
			root.innerText = "Url errónea";
			return root;
		})());
		return root;
	})();

	this.barHtml = (() => {
		let root = document.createElement("div");
		root.classList.add("w3-bar", "w3-top", "w3-black", "w3-large", "w3-center");
		root.style.zIndex = 4;
		root.appendChild((() => {
			this.sandwichButton = document.createElement("button");
			this.sandwichButton.classList.add("w3-bar-item", "w3-button", "w3-hide-large", "w3-hover-none", "w3-hover-text-light-grey");
			this.sandwichButton.appendChild((() => {
				let root = document.createElement("i");
				root.classList.add("fa", "fa-bars");
				return root;
			})());
			return this.sandwichButton;
		})());
		root.appendChild((() => {
			this.modTitle = document.createElement("div");
			this.modTitle.classList.add("w3-bar-item");
			this.modTitle.textContent = "The Distributed Library";
			return this.modTitle;
		})());
		root.appendChild((() => {
			this.loadingNode = document.createElement("div");
			this.loadingNode.id = "loading";
			this.loadingNode.classList.add("w3-bar-item", "w3-right");
			return this.loadingNode;
		})());
		return root;
	})();

	this.menuHtml = (() => {
		let root = document.createElement("div");
		root.id = "menu";
		return root;
	})();

	this.mainHtml = (() => {
		let root = document.createElement("div");
		root.id = "main";
		root.classList.add("w3-main");
		root.style.marginLeft = "250px";
		root.style.marginTop = "43px";
		return root;
	})();

	this.toastHtml = (() => {
		let root = document.createElement("div");
		root.id = "toast";
		root.classList.add("w3-center", "w3-black");
		return root;
	})();

	this.loadingHtml = (() => {
		let root = document.createElement("i");
		root.classList.add("fa", "fa-spin", "fa-spinner");
		return root;
	})();

	this.loginModalHtml = (() => {
		let root = document.createElement("div");
		root.id = "login-modal";
		root.classList.add("w3-modal", "w3-animate-opacity");
		return root;
	})();

	this.baseModule = {
		init: function() {
			history.pushState({}, null, '/search');
			window.dispatchEvent(new CustomEvent("routing"));
		}
	};

	this.logoutModule = {
		init: function() {
			auth.logout();
			history.replaceState({}, null, '/');
		}
	};

	this.routes = [
		{path: '', handler: this.baseModule},
		{path: '/search', handler: new Search()},
		{path: '/loans', handler: new Loans()},
		{path: '/books', handler: new Books()},
		{path: '/debts', handler: new Debts()},
		{path: '/profile', handler: new Profile()},
		{path: '/logout', handler: this.logoutModule}
	];

	this.routes.forEach((route) => {
		this.router.add([route]);
	});
};

App.prototype.setLoading = function(status) {
	this.loadingCount = status ? this.loadingCount + 1 : Math.max(this.loadingCount - 1, 0);
	if (this.loadingCount && !this.loadingNode.hasChildNodes())
		this.loadingNode.appendChild(this.loadingHtml);
	else if (this.loadingCount == 0)
		this.loadingNode.innerHTML = '';
};


App.prototype.toast = function(message) {
	this.toastHtml.textContent = message;
	this.toastHtml.style.display = "block";
	setTimeout(() => {
		this.toastHtml.style.display = "none";
	}, 3000);
};

App.prototype.routing = function() {
	let match = this.router.recognize(location.pathname + location.search + location.hash);

	/* Ugly trick to remove event listeners */
	let clone = this.mainHtml.cloneNode(false);
	this.mainHtml.replaceWith(clone);
	this.mainHtml = clone;

	if (match) {
		let module = match[0].handler;
		let pathParameters = match[0].params;
		module.init(this.mainHtml, pathParameters, match.queryParams);
		if (module.title)
			this.modTitle.textContent = module.title;
	}
	else
		this.mainHtml.appendChild(this.wrongUrlHtml);
};

App.prototype.run = function(theContainer) {
	this.container = theContainer;
	this.container.appendChild(this.barHtml);
	this.container.appendChild(this.menuHtml);
	this.container.appendChild(this.mainHtml);
	this.container.appendChild(this.toastHtml);
	this.container.appendChild(this.loginModalHtml);
	let menu = new Menu();
	menu.init(this.menuHtml);
	this.sandwichButton.addEventListener("click", menu.onClickSandwich.bind(menu));
	window.addEventListener("routing", this.routing.bind(this));
	window.addEventListener("popstate", () => {
		window.dispatchEvent(new CustomEvent("routing"));
	});
	window.addEventListener("logout", () => {
		this.loginModalHtml.style.display = "block";
		this.modTitle.textContent = "The Distributed Library";
		this.mainHtml.innerHTML = "";
	});
	window.addEventListener("login", this.onLogin.bind(this));
	auth.init(this.loginModalHtml);
	window.dispatchEvent(new CustomEvent("routing"));
};

App.prototype.onLogin = function() {
	this.loginModalHtml.style.display = "none";
};


export {App};
