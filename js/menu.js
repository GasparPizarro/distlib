distlib.menu = (function(){
	'use strict';

	var mySidebar;
	var overlayBg;

	var main_html = String()
		+ '<nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index: 3; width: 250px; display: none;" id="mySidebar">'
			+ '<br>'
			+ '<div class="w3-container w3-row">'
				+ '<div class="w3-col s4">'
					+ '<img src="/img/avatar2.png" class="w3-circle w3-margin-right" style="width:46px">'
				+ '</div>'
				+ '<div class="w3-col">'
					+ '<a href="/profile"><span><strong id="menu-username"></strong></span></a>'
				+ '</div>'
			+ '</div>'
			+ '<br>'
			+ '<div class="w3-bar-block" id="actions">'
				+ '<a href="/search" class="w3-bar-item w3-button w3-padding"><i class="fa fa-search fa-fw"></i> Search</a>'
				+ '<a href="/books" class="w3-bar-item w3-button w3-padding"><i class="fa fa-book fa-fw"></i> My books</a>'
				+ '<a href="/loans" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw"></i> Loans</a>'
				+ '<a href="/debts" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw "></i> Debts</a>'
				+ '<a href="/logout" class="w3-bar-item w3-button w3-padding"><i class="fa fa-sign-out fa-fw"></i> Log out</a>'
			+ '</div>'
		+ '</nav>'
		+ '<div class="w3-overlay w3-hide-large w3-animate-opacity" style="cursor: pointer; display: none;" title="close side menu" id="myOverlay"></div>'

	var activate = function(menu, path) {
		for (var i = 0; i < menu.length; i = i + 1) {
			if (menu[i].getAttribute('href') == path)
				menu[i].classList.add("w3-blue");
			else
				menu[i].classList.remove("w3-blue");
		}
	};

	var onClickSandwich = function($event) {
		if (mySidebar.style.display == 'block') {
			mySidebar.style.display = 'none';
			overlayBg.style.display = 'none';
		}
		else {
			mySidebar.style.display = 'block';
			overlayBg.style.display = 'block';
		}
	}

	var onClickOverlay = function(event) {
		mySidebar.style.display = 'none';
		overlayBg.style.display = 'none';
	}

	var onClickLink = function(event) {
		event.preventDefault();
		history.pushState({}, null, $(this).attr("href"));
		$(document).trigger("hashchange");
		return false;
	}

	var initModule = function($container) {
		$container.innerHTML = main_html;
		mySidebar = document.getElementById('mySidebar');
		overlayBg = document.getElementById('myOverlay');
		document.getElementById('the-button').addEventListener("click", onClickSandwich);
		document.getElementById('myOverlay').addEventListener("click", onClickOverlay);
		document.querySelectorAll('#actions a').forEach(function(element) {element.addEventListener("click", onClickLink)});
		$(document).on('hashchange', function() {
			activate(document.getElementById("actions").childNodes, '/' + location.pathname.substring(1));
			onClickOverlay();
		});
	}

	return {initModule: initModule}
}());
