distlib = (function() {
	'use strict';

	var main = function(container) {
		distlib.shell.initModule(container);
		distlib.user.initModule();
	};

	return {
		main: main
	};
}());
