distlib.profile = (function() {
	"use strict";

	var title = "Perfil";

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
			+ '<button id="update-profile-button" type="button" class="w3-button w3-green">Actualizar</button>'
		+ '</form>'

	var username;
	var first_name;
	var last_name;
	var update_profile_button;


	var on_click_update = function(event) {
		event.preventDefault();
		$.ajax({
			url: distlib.services.get_api_host() + "/profile",
			type: "POST",
			data: $("#profile-form").serialize(),
			success: function() {
				distlib.shell.toast("Perfil actualizado");
			}
		});
	};


	var render = function(container, path_parameters, query_parameters) {
		container.html(main_html);
		username = $("#username");
		first_name = $("#first-name");
		last_name = $("#last-name");
		update_profile_button = $("#update-profile-button");
		username.text(distlib.user.get_username());
		$.ajax({
			url: distlib.services.get_api_host() + "/profile",
			type: "GET",
			success: function(profile) {
				first_name.val(profile.first_name);
				last_name.val(profile.last_name);
			}
		});
		update_profile_button.click(on_click_update);
		$("#profile-form").keyup(
			function(event) {
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