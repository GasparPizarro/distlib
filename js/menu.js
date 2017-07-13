distlib.menu = (function(){
	'use strict';
	var main_html = String()
		+ '<nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index: 3; width: 250px; display: none;" id="mySidebar">'
			+ '<br>'
			+ '<div class="w3-container w3-row">'
				+ '<div class="w3-col s4">'
					+ '<img src="img/avatar2.png" class="w3-circle w3-margin-right" style="width:46px">'
				+ '</div>'
				+ '<div class="w3-col">'
					+ '<span><strong id="menu-username"></strong></span>'
				+ '</div>'
			+ '</div>'
			+ '<br>'
			+ '<div class="w3-bar-block" id="actions">'
				+ '<a href="busqueda" class="w3-bar-item w3-button w3-padding"><i class="fa fa-search fa-fw"></i> Busqueda</a>'
				+ '<a href="mis_libros" class="w3-bar-item w3-button w3-padding"><i class="fa fa-book fa-fw"></i> Mis libros</a>'
				+ '<a href="prestamos" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw"></i> Préstamos</a>'
				+ '<a href="deudas" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw "></i> Deudas</a>'
				+ '<a id="logout" href="logout" class="w3-bar-item w3-button w3-padding"><i class="fa fa-sign-out fa-fw"></i> Salir</a>'
			+ '</div>'
		+ '</nav>'
		+ '<div class="w3-overlay w3-hide-large w3-animate-opacity" style="cursor: pointer; display: none;" title="close side menu" id="myOverlay"></div>'

	var activate = function(menu, path) {
		for (var i = 0; i < menu.length; i = i + 1) {
			if (menu[i].getAttribute('href') != path)
				$(menu[i]).removeClass("w3-blue");
			else
				$(menu[i]).addClass("w3-blue");
		}
	};

	var onClickMenu = function(event) {
		event.preventDefault();
		history.pushState({}, null, '/' + event.target.getAttribute("href"));
		$.gevent.publish("hashchange");
	};

	var onClickSandwich = function($event) {
		var mySidebar = $('#mySidebar');
		var overlayBg = $('#myOverlay');
		if (mySidebar.css('display') === 'block') {
			mySidebar.css('display', 'none');
			overlayBg.css('display', 'none');
		}
		else {
			mySidebar.css('display', 'block');
			overlayBg.css('display', 'block');
		}
	}

	var onClickOverlay = function(event) {
		var mySidebar = $('#mySidebar');
		var overlayBg = $('#myOverlay');
		mySidebar.css('display', 'none');
		overlayBg.css('display', 'none');
	}

	var initModule = function($container) {
		$container.html(main_html);
		$("#menu-username").text(distlib.user.get_username());
		$("#actions").click(onClickMenu);
		$('#the-button').click(onClickSandwich);
		$('#myOverlay').click(onClickOverlay);
		$.gevent.subscribe($("#mySidebar"), 'hashchange', function() {
			activate($("#actions").children(), location.pathname.substring(1));
			onClickOverlay();
		})
		$('#logout').click(function(event) {
			event.preventDefault();
			distlib.user.logout();
		});
	}

	return {initModule: initModule}
}());
