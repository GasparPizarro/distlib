distlib.profile = (function() {
	"use strict";

	var title = "Profile";

	var mainHtml = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5 id="username">username</h5>'
		+ '</header>'
		+ '<form id="profile-form" class="w3-container w3-half">'
			+ '<h6>Profile</h6>'
			+ '<p>'
				+ '<label class="w3-text">First Name</label>'
				+ '<input id="first-name" name="first-name" class="w3-input" type="text"/>'
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
		+ '</form>'

	var username;
	var firstName;
	var lastName;
	var updateProfileButton;
	var updatePasswordButton;

	var onClickUpdateProfile = function(event) {
		event.preventDefault();
		var firstName = document.getElementById("first-name").value;
		var lastName = document.getElementById("last-name").value;

		distlib.services.updateProfile({firstName: firstName, lastName: lastName}).then(function() {
			distlib.shell.toast("Profile has been updated");
		});
	};

	var onClickUpdatePassword = function(event) {
		event.preventDefault();
		var oldPassword = document.getElementById("old-password").value;
		var newPassword1 = document.getElementById("new-password-1").value;
		var newPassword2 = document.getElementById("new-password-2").value;

		if (oldPassword) {
			if (newPassword1 != newPassword2) {
				distlib.shell.toast("New passwords do not match");
				return;
			}
		}
		distlib.services.updateProfile({oldPassword: oldPassword, newPassword: newPassword2}).then(function(response) {
			if (response.ok) {
				distlib.shell.toast("Profile has been updated");
				distlib.auth.logout();
			}
			else
				distlib.shell.toast("Wrong password");
		});
	};

	var init = function(container, pathParameters, queryParameters) {
		container.innerHTML = mainHtml;
		username = document.getElementById("username");
		firstName = document.getElementById("first-name");
		lastName = document.getElementById("last-name");
		updateProfileButton = document.getElementById("update-profile-button");
		updatePasswordButton = document.getElementById("update-password-button");
		username.textContent = distlib.auth.getUsername();
		distlib.services.getProfile().then(function(profile) {
			firstName.value = profile.first_name;
			lastName.value = profile.last_name;
		})
		updateProfileButton.addEventListener("click", onClickUpdateProfile);
		updatePasswordButton.addEventListener("click", onClickUpdatePassword);
		document.getElementById("profile-form").addEventListener("keypress", function(event) {
				if (event.keyCode != 13)
					return;
				onClickUpdateProfile(event);
			}
		);
		document.getElementById("password-form").addEventListener("keypress", function(event) {
				if (event.keyCode != 13)
					return;
				onClickUpdatePassword(event);
			}
		);
	};

	return {
		title: title,
		init: init
	}
}());
