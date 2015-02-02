define(['../helper/util', '../ko'], function(util, ko) {

	function NavMenu(menuItems) {
		var self = this;
		var options = [];
		for (var i = 0; i < menuItems.length; i++) {
			var m = menuItems[i];
			options.push({
				text: m.text,
				id: m.id,
				visible: ko.observable(false),
				items: m.items
			});
		};
		self.menuItems = options;
		self.chosenMenuId = ko.observable();

		self.chooseMenu = function(data) {
			self.chosenMenuId(data.id);
		}

		self.showMenuItems = function(item) {
			item.visible(true);
		};

		self.hideMenuItems = function(item) {
			item.visible(false);
		};

		self.itemsVisible = ko.observable(false);

	}

	return {
		init: function(navDom, menuItems) {
			ko.applyBindings(new NavMenu(menuItems), navDom);
		}
	}
});