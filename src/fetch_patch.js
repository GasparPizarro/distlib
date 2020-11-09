import {setLoading, toast}  from "./shell";
import * as auth from "./auth";

var oldFetch = window.fetch;

window.fetch = async function() {
	setLoading(true);
	var newArguments = newArguments = Array.prototype.slice.call(arguments);
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
		toast("Cannot connect with servers");
	}).finally(function() {
		setLoading(false);
	});
};
