import * as auth from "./auth";

let oldFetch = window.fetch;

window.fetch = async function() {
	app.setLoading(true);
	let newArguments = Array.prototype.slice.call(arguments);
	if (auth.getToken()) {
		if (arguments.length <= 1)
			newArguments.push({});
		newArguments[1].headers = {
			"Authorization": "Token " + auth.getToken()
		};
	}
	else
		newArguments = arguments;
	return oldFetch.apply(null, newArguments).catch(function() {
		app.toast("Cannot connect with servers");
	}).finally(function() {
		app.setLoading(false);
	});
};
