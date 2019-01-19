import RouteRecognizer from "route-recognizer";
import {BookDetail} from "./BookDetail";
import * as shell from "./shell"
import * as services from "./services";
import * as auth from "./auth";
import './css/w3.css';
import './css/css.css';
import './css/font-awesome.css';


window.onload = function() {

	document.body.classList.add("w3-light-grey");
	document.body.id = "distlib";
	document.title = "The Distributed Library";
	document.head.name = "viewport";
	document.head.content = "width=320; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;";

	var oldFetch = window.fetch;


	window.fetch = function() {
		shell.setLoading(true);
		var newArguments = newArguments = Array.prototype.slice.call(arguments);;
		if (auth.getToken()) {
			if (arguments.length <= 1)
				newArguments.push({});
			newArguments[1].headers = {
				"Authorization": "Token " + auth.getToken()
			};
		}
		else
			newArguments = arguments;
		return oldFetch.apply(null, newArguments).catch(function(response) {
			shell.toast("Cannot connect with servers");
		}).finally(function() {
			shell.setLoading(false);
		});
	};

	shell.init(document.body);
}
