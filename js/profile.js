distlib.profile = (function() {
	"use strict";

	var title = "Profile";

	var main_html = String()
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
			+ '<button id="update-profile-button" type="button" class="w3-button w3-green">Update data</button>'
		+ '</form>'

	var username;
	var first_name;
	var last_name;
	var update_profile_button;

	var on_click_update = function(event) {
		event.preventDefault();
		distlib.services.update_profile().then(function() {
			distlib.shell.toast("Profile has been updated");
		});
	};

	var render = function(container, path_parameters, query_parameters) {
		container.innerHTML = main_html;
		username = document.getElementById("username");
		first_name = document.getElementById("first-name");
		last_name = document.getElementById("last-name");
		update_profile_button = document.getElementById("update-profile-button");
		username.textContent = distlib.auth.get_username();
		distlib.services.get_profile().then(function(profile) {
			first_name.value = profile.first_name;
			last_name.value = profile.last_name;
		})
		update_profile_button.addEventListener("click", on_click_update);
		document.getElementById("profile-form").addEventListener("keypress", function(event) {
				if (event.keyCode != 13)
					return;
				on_click_update(event);
			}
		);
	};

	return {
		title: title,
		render: render
	}
}());
