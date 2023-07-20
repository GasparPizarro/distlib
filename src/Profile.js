import { getProfile, updateProfile } from "./services";
import { logout, getUsername } from "./auth";

class Profile {
	constructor() {
		this.title = "Profile";

		this.header = (() => {
			let root = document.createElement("header");
			root.classList.add("w3-container");
			root.style.paddingTop = "22px";
			root.appendChild((() => {
				this.username = document.createElement("h5");
				this.username.textContent = "username";
				return this.username;
			})());
			return root;
		})();
		this.profileForm = (() => {
			let root = document.createElement("form");

			root.classList.add("w3-container", "w3-half");
			root.appendChild((() => {
				let root = document.createElement("h6");
				root.textContent = "Profile";
				return root;
			})());
			root.appendChild((() => {
				let root = document.createElement("p");
				root.appendChild((() => {
					let root = document.createElement("label");
					root.textContent = "First name";
					return root;
				})());
				root.appendChild((() => {
					this.firstName = document.createElement("input");
					this.firstName.classList.add("w3-input");
					this.firstName.type = "text";
					return this.firstName;
				})());
				return root;
			})());
			root.appendChild((() => {
				let root = document.createElement("p");
				root.appendChild((() => {
					let root = document.createElement("label");
					root.textContent = "Last name";
					return root;
				})());
				root.appendChild((() => {
					this.lastName = document.createElement("input");
					this.lastName.classList.add("w3-input");
					this.lastName.type = "text";
					return this.lastName;
				})());
				return root;
			})());
			root.appendChild((() => {
				this.updateProfileButton = document.createElement("button");
				this.updateProfileButton.type = "button";
				this.updateProfileButton.classList.add("w3-button", "w3-green");
				this.updateProfileButton.textContent = "Update profile";
				return this.updateProfileButton;
			})());
			return root;
		})();

		this.passwordForm = (() => {
			let root = document.createElement("form");
			root.classList.add("w3-container", "w3-half");
			root.appendChild((() => {
				let root = document.createElement("h6");
				root.textContent = "Change password (requires relogin)";
				return root;
			})());
			root.appendChild((() => {
				let root = document.createElement("p");
				root.appendChild((() => {
					let root = document.createElement("label");
					root.textContent = "Old password";
					return root;
				})());
				root.appendChild((() => {
					this.oldPassword = document.createElement("input");
					this.oldPassword.classList.add("w3-input");
					this.oldPassword.type = "password";
					return this.oldPassword;
				})());
				return root;
			})());
			root.appendChild((() => {
				let root = document.createElement("p");
				root.appendChild((() => {
					let root = document.createElement("label");
					root.textContent = "New password";
					return root;
				})());
				root.appendChild((() => {
					this.newPassword1 = document.createElement("input");
					this.newPassword1.classList.add("w3-input");
					this.newPassword1.type = "password";
					return this.newPassword1;
				})());
				return root;
			})());
			root.appendChild((() => {
				let root = document.createElement("p");
				root.appendChild((() => {
					let root = document.createElement("label");
					root.textContent = "Confirm new password";
					return root;
				})());
				root.appendChild((() => {
					this.newPassword2 = document.createElement("input");

					this.newPassword2.classList.add("w3-input");
					this.newPassword2.type = "password";
					return this.newPassword2;
				})());
				return root;
			})());
			root.appendChild((() => {
				this.updatePasswordButton = document.createElement("button");
				this.updatePasswordButton.type = "button";
				this.updatePasswordButton.classList.add("w3-button", "w3-green");
				this.updatePasswordButton.textContent = "Update password";
				return this.updatePasswordButton;
			})());
			return root;
		})();

	}

	async onClickUpdateProfile(event) {
		event.preventDefault();
		await updateProfile({ firstName: this.firstName.value, lastName: this.lastName.value });
		window.app.toast("Profile has been updated");
	};

	async onClickUpdatePassword(event) {
		event.preventDefault();
		if (this.oldPassword.value) {
			if (this.newPassword1.value != this.newPassword2.value) {
				window.app.toast("New passwords do not match");
				return;
			}
		}
		let response = await updateProfile({ oldPassword: this.oldPassword.value, newPassword: this.newPassword2.value });
		if (response.ok) {
			window.app.toast("Profile has been updated");
			logout();
			// this.passwordForm.reset()
		}
		else
			window.app.toast("Wrong password");
	};

	async init(container) {
		container.appendChild(this.header);
		container.appendChild(this.profileForm);
		container.appendChild(this.passwordForm);
		this.username.textContent = getUsername();
		let profile = await getProfile();
		this.firstName.value = profile.first_name;
		this.lastName.value = profile.last_name;
		this.updateProfileButton.addEventListener("click", this.onClickUpdateProfile.bind(this));
		this.updatePasswordButton.addEventListener("click", this.onClickUpdatePassword.bind(this));
		this.profileForm.addEventListener("keypress", (event) => {
			if (event.key != "Enter")
				return;
			this.onClickUpdateProfile(event);
		});
		this.passwordForm.addEventListener("keypress", (event) => {
			if (event.key != "Enter")
				return;
			this.onClickUpdatePassword(event);
		});
	}
}

export { Profile };
