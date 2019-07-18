Ext.define("Rambox.Application", {
	extend: "Ext.app.Application",

	name: "Rambox",

	requires: [
		"Rambox.ux.Auth0",
		"Rambox.util.MD5",
		"Ext.window.Toast",
		"Ext.util.Cookies"
	],

	stores: ["ServicesList", "Services"],

	profiles: ["Offline", "Online"],

	config: {
		totalServicesLoaded: 0,
		totalNotifications: 0
	},
	launch: function() {
		// Prevent track if the user have disabled this option (default: false)
		if (!ipc.sendSync("sendStatistics")) {
			ga_storage = {
				_enableSSL: Ext.emptyFn,
				_disableSSL: Ext.emptyFn,
				_setAccount: Ext.emptyFn,
				_setDomain: Ext.emptyFn,
				_setLocale: Ext.emptyFn,
				_setCustomVar: Ext.emptyFn,
				_deleteCustomVar: Ext.emptyFn,
				_trackPageview: Ext.emptyFn,
				_trackEvent: Ext.emptyFn
			};
		}

		// Set Google Analytics events
		ga_storage._setAccount("UA-80680424-1");
		ga_storage._trackPageview("/index.html", "main");
		ga_storage._trackEvent(
			"Versions",
			require("electron").remote.app.getVersion()
		);

		// Load language for Ext JS library
		Ext.Loader.loadScript({
			url: Ext.util.Format.format(
				"ext/packages/ext-locale/build/ext-locale-{0}.js",
				localStorage.getItem("locale-auth0") || "en"
			)
		});

		// Initialize Auth0
		if (auth0Cfg.clientID !== "" && auth0Cfg.domain !== "")
			Rambox.ux.Auth0.init();

		// Set cookies to help Tooltip.io messages segmentation
		Ext.util.Cookies.set(
			"version",
			require("electron").remote.app.getVersion()
		);
		if (Ext.util.Cookies.get("auth0") === null)
			Ext.util.Cookies.set("auth0", false);

		// Add shortcuts to switch services using CTRL + Number
		document.keyMapping = new Ext.util.KeyMap({
			target: document,
			binding: [
				{
					key: "\t",
					ctrl: true,
					alt: false,
					shift: false,
					handler: function(key) {
						var tabPanel = Ext.cq1("app-main");
						var activeIndex = tabPanel.items.indexOf(tabPanel.getActiveTab());
						var i = activeIndex + 1;

						// "cycle" (go to the start) when the end is reached or the end is the spacer "tbfill"
						if (
							i === tabPanel.items.items.length ||
							(i === tabPanel.items.items.length - 1 &&
								tabPanel.items.items[i].id === "tbfill")
						)
							i = 0;

						// skip spacer
						while (tabPanel.items.items[i].id === "tbfill") i++;

						tabPanel.setActiveTab(i);
					}
				},
				{
					key: "f",
					ctrl: false,
					alt: true,
					shift: true,
					handler: function(key) {
						var currentTab = Ext.cq1("app-main").getActiveTab();
						if (currentTab.getWebView) currentTab.showSearchBox(true);
					}
				},
				{
					key: "\t",
					ctrl: true,
					alt: false,
					shift: true,
					handler: function(key) {
						var tabPanel = Ext.cq1("app-main");
						var activeIndex = tabPanel.items.indexOf(tabPanel.getActiveTab());
						var i = activeIndex - 1;
						if (i < 0) i = tabPanel.items.items.length - 1;
						while (tabPanel.items.items[i].id === "tbfill" || i < 0) i--;
						tabPanel.setActiveTab(i);
					}
				},
				{
					key: Ext.event.Event.PAGE_DOWN,
					ctrl: true,
					alt: false,
					shift: false,
					handler: function(key) {
						var tabPanel = Ext.cq1("app-main");
						var activeIndex = tabPanel.items.indexOf(tabPanel.getActiveTab());
						var i = activeIndex + 1;

						// "cycle" (go to the start) when the end is reached or the end is the spacer "tbfill"
						if (
							i === tabPanel.items.items.length ||
							(i === tabPanel.items.items.length - 1 &&
								tabPanel.items.items[i].id === "tbfill")
						)
							i = 0;

						// skip spacer
						while (tabPanel.items.items[i].id === "tbfill") i++;

						tabPanel.setActiveTab(i);
					}
				},
				{
					key: Ext.event.Event.PAGE_UP,
					ctrl: true,
					alt: false,
					shift: false,
					handler: function(key) {
						var tabPanel = Ext.cq1("app-main");
						var activeIndex = tabPanel.items.indexOf(tabPanel.getActiveTab());
						var i = activeIndex - 1;
						if (i < 0) i = tabPanel.items.items.length - 1;
						while (tabPanel.items.items[i].id === "tbfill" || i < 0) i--;
						tabPanel.setActiveTab(i);
					}
				},
				{
					key: [Ext.event.Event.NUM_PLUS, Ext.event.Event.NUM_MINUS, 187, 189],
					ctrl: true,
					alt: false,
					shift: false,
					handler: function(key) {
						var tabPanel = Ext.cq1("app-main");
						if (tabPanel.items.indexOf(tabPanel.getActiveTab()) === 0)
							return false;

						key === Ext.event.Event.NUM_PLUS || key === 187
							? tabPanel.getActiveTab().zoomIn()
							: tabPanel.getActiveTab().zoomOut();
					}
				},
				{
					key: [Ext.event.Event.NUM_ZERO, "0"],
					ctrl: true,
					alt: false,
					shift: false,
					handler: function(key) {
						var tabPanel = Ext.cq1("app-main");
						if (tabPanel.items.indexOf(tabPanel.getActiveTab()) === 0)
							return false;

						tabPanel.getActiveTab().resetZoom();
					}
				},
				{
					key: "123456789",
					ctrl: true,
					alt: false,
					handler: function(key) {
						key = key - 48;
						if (key >= Ext.cq1("app-main").items.indexOf(Ext.getCmp("tbfill")))
							key++;
						Ext.cq1("app-main").setActiveTab(key);
					}
				},
				{
					key: 188, // comma
					ctrl: true,
					alt: false,
					handler: function(key) {
						Ext.cq1("app-main").setActiveTab(0);
					}
				},
				{
					key: Ext.event.Event.F1,
					ctrl: false,
					alt: false,
					shift: false,
					handler: function(key) {
						var btn = Ext.getCmp("disturbBtn");
						btn.toggle();
						Ext.cq1("app-main")
							.getController()
							.dontDisturb(btn, true);
					}
				},
				{
					key: Ext.event.Event.F2,
					ctrl: false,
					alt: false,
					shift: false,
					handler: function(key) {
						var btn = Ext.getCmp("lockRamboxBtn");
						Ext.cq1("app-main")
							.getController()
							.lockRambox(btn);
					}
				}
			]
		});

		// Mouse Wheel zooming
		document.addEventListener("mousewheel", function(e) {
			if (e.ctrlKey) {
				var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

				var tabPanel = Ext.cq1("app-main");
				if (tabPanel.items.indexOf(tabPanel.getActiveTab()) === 0) return false;

				if (delta === 1) {
					// Zoom In
					tabPanel.getActiveTab().zoomIn();
				} else {
					// Zoom Out
					tabPanel.getActiveTab().zoomOut();
				}
			}
		});

		// Define default value
		if (localStorage.getItem("dontDisturb") === null)
			localStorage.setItem("dontDisturb", false);
		ipc.send("setDontDisturb", localStorage.getItem("dontDisturb")); // We store it in config

		if (localStorage.getItem("locked")) {
			console.info("Lock Rambox:", "Enabled");
			Ext.cq1("app-main")
				.getController()
				.showLockWindow();
		}

		// Remove spinner
		Ext.get("spinner").destroy();
	},

	updateTotalNotifications: function(newValue, oldValue) {
		newValue = parseInt(newValue);
		if (newValue > 0) {
			if (Ext.cq1("app-main").getActiveTab().record) {
				document.title =
					"Rambox (" +
					Rambox.util.Format.formatNumber(newValue) +
					") - " +
					Ext.cq1("app-main")
						.getActiveTab()
						.record.get("name");
			} else {
				document.title =
					"Rambox (" + Rambox.util.Format.formatNumber(newValue) + ")";
			}
		} else {
			if (Ext.cq1("app-main") && Ext.cq1("app-main").getActiveTab().record) {
				document.title =
					"Rambox - " +
					Ext.cq1("app-main")
						.getActiveTab()
						.record.get("name");
			} else {
				document.title = "Rambox";
			}
		}
	}
});
