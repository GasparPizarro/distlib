distlib = (function() {
	'use strict';

	var initModule = function($container) {
		distlib.shell.initModule($container);
		distlib.user.initModule();
	};

	return {
		initModule: initModule
	};
}());
