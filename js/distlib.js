distlib = (function() {
	'use strict';

	var oldFetch = window.fetch;

	window.fetch = function() {
		distlib.shell.setLoading(true);
		var newArguments = newArguments = Array.prototype.slice.call(arguments);;
		if (distlib.auth.getToken()) {
			if (arguments.length <= 1)
				newArguments.push({});
			newArguments[1].headers = {
				"Authorization": "Token " + distlib.auth.getToken()
			};
		}
		else
			newArguments = arguments;
		return oldFetch.apply(null, newArguments).catch(function(response) {
			distlib.shell.toast("Cannot connect with servers");
		}).finally(function() {
			distlib.shell.setLoading(false);
		});
	};

	var main = function(container) {
		distlib.shell.init(container);
	};

	return {
		main: main
	};
}());
