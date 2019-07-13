Ext.define("Rambox.store.ServicesList", {
	extend: "Ext.data.Store",
	alias: "store.serviceslist",

	requires: ["Ext.data.proxy.LocalStorage"],

	model: "Rambox.model.ServiceList",

	proxy: {
		type: "memory"
	},

	sorters: [
		{
			property: "name",
			direction: "ASC"
		}
	],

	autoLoad: true,
	autoSync: true,
	pageSize: 100000,
	data: [
		{
			id: "whatsapp",
			logo: "whatsapp.png",
			name: "WhatsApp",
			description: locale["services[0]"],
			url: "https://web.whatsapp.com/",
			type: "messaging",
			js_unread:
				"function checkUnread(){const elements = document.querySelectorAll('#pane-side .P6z4j, .unread');let count = 0;for (let i = 0; i < elements.length; i++) {if (elements[i].parentNode.parentNode.querySelectorAll('#pane-side *[data-icon=\"muted\"]').length === 0) {count++;}}updateBadge(count);}function updateBadge(count){if(count && count>=1){rambox.setUnreadCount(count);}else{rambox.clearUnreadCount();}}setInterval(checkUnread, 1e3);(async()=>{try{const a=await window.navigator.serviceWorker.getRegistrations();for(const b of a)b.unregister()}catch(a){}})();"
		},
		{
			id: "bukalapak",
			logo: "bukalapak.jpg",
			name: "Bukalapak",
			description: locale["services[0]"],
			url: "https://www.bukalapak.com/",
			type: "ecommerce",
			js_unread:
				"function checkUnread(){let e=document.querySelectorAll('.c-badge--notif .c-badge__content'),t=0;for(let n=0;n<e.length;n++){if(e[n].innerHTML !== ''){t+=parseInt(e[n].innerHTML)}}updateBadge(t)}function updateBadge(e){e&&e>=1?rambox.setUnreadCount(e):rambox.clearUnreadCount()}setInterval(checkUnread,1e3),(async()=>{try{const e=await window.navigator.serviceWorker.getRegistrations();for(const t of e)t.unregister()}catch(e){}})();"
		},
		{
			id: "tokopedia",
			logo: "tokopedia.png",
			name: "Tokopedia",
			description: locale["services[0]"],
			url: "https://www.tokopedia.com/",
			type: "ecommerce",
			js_unread:
				"function checkUnread(){let e=document.querySelectorAll('.notif'),t=0;for(let n=0;n<e.length;n++){t+=parseInt(e[n].innerHTML)}updateBadge(t)}function updateBadge(e){e&&e>=1?rambox.setUnreadCount(e):rambox.clearUnreadCount()}setInterval(checkUnread,1e3),(async()=>{try{const e=await window.navigator.serviceWorker.getRegistrations();for(const t of e)t.unregister()}catch(e){}})();"
		},
		{
			id: "shopee",
			logo: "shopee.jpg",
			name: "Shopee",
			description: locale["services[0]"],
			url: "https://www.shopee.com/",
			type: "ecommerce",
			js_unread:
				"function checkUnread(){let e=document.querySelectorAll('.badge.active'),t=0;for(let n=0;n<e.length;n++){t+=parseInt(e[n].innerHTML)}updateBadge(t)}function updateBadge(e){e&&e>=1?rambox.setUnreadCount(e):rambox.clearUnreadCount()}setInterval(checkUnread,1e3),(async()=>{try{const e=await window.navigator.serviceWorker.getRegistrations();for(const t of e)t.unregister()}catch(e){}})();"
		}
	]
});
