import RouteRecognizer from "route-recognizer";
import {BookDetail} from "./BookDetail";
import * as shell from "./shell"
import * as services from "./services";
import * as auth from "./auth";
import "./fetch_patch";
import "stretchy";
import "./css/w3.css";
import "./css/css.css";
import "./css/font-awesome.css";


window.onload = function() {

	document.body.classList.add("w3-light-grey");
	document.body.id = "distlib";
	document.title = "The Distributed Library";
	document.head.name = "viewport";
	document.head.content = "initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

	Stretchy.selectors.filter = ".stretchy";

	shell.init(document.body);
}
