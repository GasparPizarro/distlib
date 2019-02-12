import * as shell from "./shell";
import "./fetch_patch";
import Stretchy from "./lib/stretchy";
import "./css/w3.css";
import "./css/css.css";
import "./css/font-awesome.css";


window.onload = function() {

	document.body.classList.add("w3-light-grey");
	document.body.id = "distlib";
	document.title = "The Distributed Library";
	var tag = document.createElement("meta");
	tag.name = "viewport";
	tag.content = "initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
	document.head.appendChild(tag);

	Stretchy.selectors.filter = ".stretchy";

	shell.init(document.body);
};
