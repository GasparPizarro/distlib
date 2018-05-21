distlib.profile = (function() {
	"use strict";

	var title = "Profile";

	var mainHtml = String()
		+ '<header class="w3-container" style="padding-top:22px">'
			+ '<h5 id="username">username</h5>'
		+ '</header>'
		+ '<form id="profile-form" class="w3-container">'
			+ '<p>'
				+ '<label class="w3-text">First Name</label>'
				+ '<input id="first-name" name="first-name" class="w3-input" type="text"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-text">Last Name</label>'
				+ '<input id="last-name" name="last-name" class="w3-input" type="text"/>'
			+ '</p>'
			+ '<h6>Change password</h6>'
			+ '<p>'
				+ '<label class="w3-text">Old password</label>'
				+ '<input id="old-password" name="old-password" class="w3-input" type="password"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-text">New password</label>'
				+ '<input id="new-password" name="new-password" class="w3-input" type="password"/>'
			+ '</p>'
			+ '<p>'
				+ '<label class="w3-text">Confirm new password</label>'
				+ '<input id="new-password" name="new-password-2" class="w3-input" type="password"/>'
			+ '</p>'
			+ '<button id="update-profile-button" type="button" class="w3-button w3-green">Update data</button>'
		+ '</form>'

	var username;
	var firstName;
	var lastName;
	var updateProfileButton;

	var onClickUpdate = function(event) {
		event.preventDefault();
		distlib.services.updateProfile().then(function() {
			distlib.shell.toast("Profile has been updated");
		});
	};

	var render = function(container, pathParameters, queryParameters) {
		container.innerHTML = mainHtml;
		username = document.getElementById("username");
		firstName = document.getElementById("first-name");
		lastName = document.getElementById("last-name");
		updateProfileButton = document.getElementById("update-profile-button");
		username.textContent = distlib.auth.getUsername();
		distlib.services.getProfile().then(function(profile) {
			firstName.value = profile.first_name;
			lastName.value = profile.last_name;
		})
		updateProfileButton.addEventListener("click", onClickUpdate);
		document.getElementById("profile-form").addEventListener("keypress", function(event) {
				if (event.keyCode != 13)
					return;
				onClickUpdate(event);
			}
		);
	};

	return {
		title: title,
		render: render
	}
}());
