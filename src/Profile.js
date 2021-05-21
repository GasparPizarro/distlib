import {getProfile, updateProfile} from "./services";
import {logout, getUsername} from "./auth";

let Profile = function() {
	this.title = "Profile";

	this.mainHtml = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5 id="username">username</h5>'
		+ '</header>'
		+ '<form id="profile-form" class="w3-container w3-half">'
			+ '<h6>Profile</h6>'
			+ '<p>'
				+ '<label class="w3-text">First Name</label>'
				+ '<input id="first-name" na	me="first-name" class="w3-input" type="text"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-text">Last Name</label>'
				+ '<input id="last-name" name="last-name" class="w3-input" type="text"/>'
			+ '</p>'
			+ '<button id="update-profile-button" type="button" class="w3-button w3-green">Update profile</button>'
		+ '</form>'
		+ '<form id="password-form" class="w3-container w3-half">'
			+ '<h6>Change password (requires relogin)</h6>'
			+ '<p>'
				+ '<label class="w3-text">Old password</label>'
				+ '<input id="old-password" name="old-password" class="w3-input" type="password"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-text">New password</label>'
				+ '<input id="new-password-1" name="new-password-1" class="w3-input" type="password"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-text">Confirm new password</label>'
				+ '<input id="new-password-2" name="new-password-2" class="w3-input" type="password"/>'
			+ '</p>'
			+ '<button id="update-password-button" type="button" class="w3-button w3-green">Update password</button>'
		+ '</form>';

	this.username = null;
	this.firstName = null;
	this.lastName = null;
	this.updateProfileButton = null;
	this.updatePasswordButton = null;

};


Profile.prototype.onClickUpdateProfile = async function(event) {
	event.preventDefault();
	let firstName = document.getElementById("first-name").value;
	let lastName = document.getElementById("last-name").value;
	await updateProfile({firstName: firstName, lastName: lastName});
	window.app.toast("Profile has been updated");
};

Profile.prototype.onClickUpdatePassword = async function(event) {
	event.preventDefault();
	let oldPassword = document.getElementById("old-password").value;
	let newPassword1 = document.getElementById("new-password-1").value;
	let newPassword2 = document.getElementById("new-password-2").value;
	if (oldPassword) {
		if (newPassword1 != newPassword2) {
			window.app.toast("New passwords do not match");
			return;
		}
	}
	let response = await this.updateProfile({oldPassword: oldPassword, newPassword: newPassword2});
	if (response.ok) {
		window.app.toast("Profile has been updated");
		logout();
	}
	else
		window.app.toast("Wrong password");
};

Profile.prototype.init = async function(container) {
	container.innerHTML = this.mainHtml;
	this.username = document.getElementById("username");
	this.firstName = document.getElementById("first-name");
	this.lastName = document.getElementById("last-name");
	this.updateProfileButton = document.getElementById("update-profile-button");
	this.updatePasswordButton = document.getElementById("update-password-button");
	this.username.textContent = getUsername();
	let profile = await getProfile();
	this.firstName.value = profile.first_name;
	this.lastName.value = profile.last_name;
	this.updateProfileButton.addEventListener("click", this.onClickUpdateProfile);
	this.updatePasswordButton.addEventListener("click", this.onClickUpdatePassword);
	document.getElementById("profile-form").addEventListener("keypress", (event) => {
		if (event.keyCode != 13)
			return;
		this.onClickUpdateProfile(event);
	});
	document.getElementById("password-form").addEventListener("keypress", (event) => {
		if (event.keyCode != 13)
			return;
		this.onClickUpdatePassword(event);
	});
};

export {Profile};
