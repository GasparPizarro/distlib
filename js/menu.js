distlib.menu = (function(){
	'use strict';

	var mySidebar;
	var overlayBg;

	var mainHtml = String()
		+ '<nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index: 3; width: 250px; display: none;" id="mySidebar">'
			+ '<br>'
			+ '<div class="w3-container w3-row">'
				+ '<div class="w3-col s4">'
					+ '<img src="/img/avatar2.png" class="w3-circle w3-margin-right" style="width:46px">'
				+ '</div>'
				+ '<div class="w3-col">'
					+ '<span><a href="/profile" id="menu-username" style="font-weight: bold"></a></span>'
				+ '</div>'
			+ '</div>'
			+ '<br>'
			+ '<div class="w3-bar-block" id="actions">'
				+ '<a href="/search" class="w3-bar-item w3-button w3-padding"><i class="fa fa-search fa-fw"></i> Search</a>'
				+ '<a href="/books" class="w3-bar-item w3-button w3-padding"><i class="fa fa-book fa-fw"></i> My books</a>'
				+ '<a href="/loans" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw"></i> Loans</a>'
				+ '<a href="/debts" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw "></i> Debts</a>'
				+ '<a href="/logout" id="logout" class="w3-bar-item w3-button w3-padding"><i class="fa fa-sign-out fa-fw"></i> Log out</a>'
			+ '</div>'
		+ '</nav>'
		+ '<div class="w3-overlay w3-hide-large w3-animate-opacity" style="cursor: pointer; display: none;" title="close side menu" id="myOverlay"></div>'

	var activate = function(menu, path) {
		for (var i = 0; i < menu.length; i = i + 1) {
			if (path.startsWith(menu[i].getAttribute('href')))
				menu[i].classList.add("w3-blue");
			else
				menu[i].classList.remove("w3-blue");
		}
	};

	var onClickSandwich = function() {
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

	var init = function(container) {
		container.innerHTML = mainHtml;
		mySidebar = document.getElementById('mySidebar');
		overlayBg = document.getElementById('myOverlay');
		document.getElementById('the-button').addEventListener("click", onClickSandwich);
		document.getElementById('myOverlay').addEventListener("click", onClickOverlay);
		mySidebar.querySelectorAll('a:not(#logout)').forEach(function(element) {element.addEventListener("click", distlib.shell.onClickLink)});
		document.getElementById("logout").addEventListener("click", function(event) {
			event.preventDefault();
			distlib.auth.logout();
		});
		window.addEventListener("login", function() {
			document.getElementById("menu-username").textContent = distlib.auth.getUsername();
		});
		window.addEventListener("logout", function() {
			document.getElementById("menu-username").innerHTML = "";
		});
		window.addEventListener("routing", function() {
			activate(document.getElementById("actions").childNodes, '/' + location.pathname.substring(1));
			onClickOverlay();
		}, false);
	}

	var addNotification = function(link) {
		var item = document.querySelector('a[href="' + link + '"]');
		if (item == null)
			return;
		if (item.getElementsByTagName("span").length) {
			var badge = item.getElementsByTagName("span")[0];
			var current = parseInt(badge.textContent);
			current = current + 1;
			badge.textContent = current;
		}
		else {
			var badge = document.createElement("span");
			badge.classList.add("w3-badge", "w3-right");
			badge.textContent = "1";
			item.appendChild(badge);
		}
	}

	return {
		init: init,
		addNotification: addNotification
	}
}());
