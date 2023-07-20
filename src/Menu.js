import * as auth from "./auth";
import avatar from './img/avatar2.png';

class Menu {
	constructor() {
		this.logoutbutton;
		this.menuUsername;
		this.actionButtons;
		this.background = (() => {
			let root = document.createElement("div");
			root.classList.add("w3-overlay", "w3-hide-large", "w3-animate-opacity");
			root.style.cursor = "pointer";
			root.style.display = "none";
			return root;
		})();
		this.sidebar = (() => {
			let root = document.createElement("nav");
			root.classList.add("w3-sidebar", "w3-collapse", "w3-white", "w3-animate-left");
			root.style.zIndex = 3;
			root.style.width = "250px";
			root.style.display = "none";
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
								this.menuUsername = document.createElement("a");
								this.menuUsername.href = "/profile";
								this.menuUsername.style = "font-weight: bold";
								return this.menuUsername;
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
				this.actionButtons = document.createElement("div");
				this.actionButtons.classList.add("w3-bar-block");
				let actions = [
					["/search", "fa-search", "Search"],
					["/books", "fa-book", "My books"],
					["/loans", "fa-eye", "Loans"],
					["/debts", "fa-eye", "Debts"],
					["/logout", "fa-sign-out", "Log out"],
				];
				for (let action of actions) {
					this.actionButtons.appendChild((() => {
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
				this.logoutbutton = root.lastChild;
				return this.actionButtons;
			})());
			root.appendChild((() => {
				let root = document.createElement("div");
				root.classList.add("w3-overlay", "w3-hide-large", "w3-animate-opacity");
				root.style.cursor = "pointer";
				root.style.display = "none";
				return root;
			})());
			return root;
		})();
	};

	activate(menu, path) {
		for (let i = 0; i < menu.length; i = i + 1)
			if (path.startsWith(menu[i].getAttribute('href')))
				menu[i].classList.add("w3-blue");
			else
				menu[i].classList.remove("w3-blue");
	};

	onClickSandwich() {
		if (this.sidebar.style.display == 'block') {
			this.sidebar.style.display = 'none';
			this.background.style.display = 'none';
		}
		else {
			this.sidebar.style.display = 'block';
			this.background.style.display = 'block';
		}
	};


	onClickOverlay() {
		this.sidebar.style.display = 'none';
		this.background.style.display = 'none';
	};

	init(container) {
		container.appendChild(this.sidebar);
		container.appendChild(this.background);
		this.background.addEventListener("click", this.onClickOverlay.bind(this));
		this.sidebar.querySelectorAll('a:not(#logout)').forEach((element) => {
			element.addEventListener("click", function (event) {
				event.preventDefault();
				history.pushState({}, null, event.target.getAttribute("href"));
				window.dispatchEvent(new CustomEvent("routing"));
				return false;
			});
		});
		this.logoutbutton.addEventListener("click", (event) => {
			event.preventDefault();
			auth.logout();
		});
		window.addEventListener("login", () => {
			this.menuUsername.textContent = auth.getUsername();
		});
		window.addEventListener("logout", () => {
			this.menuUsername.replaceChildren();
		});
		window.addEventListener("routing", () => {
			this.activate(this.actionButtons.childNodes, '/' + location.pathname.substring(1));
			this.onClickOverlay();
		}, false);
	};
}

export { Menu };
