define(['./ko', './sammy', './helper/util', './data/stock', './stock'], function(ko, Sammy, util, stock, engine) {
    return function appViewModel() {
        var folders = [],
            ds = stock.dataSource,
            self = this,
            loaded = [];
        for (var i = 0; i < ds.length; i++) {
            folders.push({
                name: ds[i].category,
                id: i
            });
            loaded[i] = false;
        }
        self.folders = folders;
        self.chosenFolderId = ko.observable();
        self.chosenFolderData = ko.observable({});
        self.chosenCategoryId = ko.observable();
        self.chosenCategoryData = ko.observable({});
        self.amountOrder = ko.observable('desc');
        self.changeOrder = ko.observable('desc');
        self.tooltipData = ko.observable({
            tipItems: []
        });
        self.showTooltip = ko.observable(false);

        self.goToFolder = function(folder) {
            location.hash = folder.id;
        };

        self.goToCategory = function(category) {
            location.hash = self.chosenFolderId() + '/' + category.id;
        };

        self.goUp = function() {
            location.hash = self.chosenFolderId();
        };

        self.refresh = function() {
            util.setLoading(true);
            engine.loadData(self.chosenFolderId(), function(dataSource) {
                util.setLoading(false);
                updateSource();
            });
        };

        self.sortAmount = function() {
            var order = self.amountOrder;
            if (order() === 'desc') {
                order('asc');
            } else {
                order('desc');
            }
            engine.sortData('amount', order());
            initData();
        };

        self.sortChange = function() {
            var order = self.changeOrder;
            if (order() === 'desc') {
                order('asc');
            } else {
                order('desc');
            }
            engine.sortData('change', order());
            initData();
        };

        self.showDetail = function(data, e) {
            var price = data.price,
                change = (+data.change * 100).toFixed(1),
                amount = (+data.amount / 10000).toFixed(2);
            var items = [{
                key: '涨跌幅：',
                value: change + '%',
                showTrend: true
            }, {
                key: '成交额：',
                value: amount + '万',
                showTrend: false
            }];
            if(data.price != null) {
                items.unshift({
                    key: '当前价：',
                    value: price,
                    showTrend: true
                });
            }
            self.tooltipData({
                name: data.name,
                tipItems: items,
                change: change,
                x: e.pageX + 50,
                y: e.pageY - 50
            });
            self.showTooltip(true);
        };

        self.hideDetail = function(data, e) {
            self.showTooltip(false);
        };

        function initData() {
            var reload = !loaded[self.chosenFolderId()];
            if (reload) {
                self.refresh();
                loaded[self.chosenFolderId()] = true;
            } else {
                updateSource();
            }
        }

        function updateFolder(folderId) {
            var items = stock.dataSource[folderId].data,
                maxAmount = -Infinity;
            for (var i = 0; i < items.length; i++) {
                if (items[i].amount > maxAmount) {
                    maxAmount = items[i].amount;
                }
                items[i].change = items[i].change || 0;
                items[i].id = i;
            }
            self.chosenFolderData({
                items: stock.dataSource[folderId].data,
                maxAmount: maxAmount
            });
        }

        function updateCategory(folderId, categoryId) {
            var items = stock.dataSource[folderId].data[categoryId].stocks,
                maxAmount = -Infinity,
                bindItems = [];
            for (var i = 0; i < items.length; i++) {
                var info = engine.getStockInfo(items[i]);
                if (info.amount > maxAmount) {
                    maxAmount = info.amount;
                }
                info.change = info.change || 0;
                info.id = i;
                bindItems.push(info);
            }
            self.chosenCategoryData({
                items: bindItems,
                maxAmount: maxAmount
            });
        }

        function updateSource() {
            var folderId = self.chosenFolderId(),
                categoryId = self.chosenCategoryId();
            if (categoryId != null) {
                updateCategory(folderId, categoryId);
                self.chosenFolderData({});
            } else {
                updateFolder(folderId);
                self.chosenCategoryData({});
            }
        }

        Sammy(function() {
            this.get('#:folder', function() {
                self.chosenFolderId(this.params.folder);
                self.chosenCategoryId(null);
                initData();
            });

            this.get('#:folder/:categoryId', function() {
                self.chosenCategoryId(this.params.categoryId);
                self.chosenFolderId(this.params.folder);
                initData();
            });

            this.get('', function() {
                this.app.runRoute('get', '#0');
            });
        }).run();

    };
});