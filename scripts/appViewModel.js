define(['./ko', './sammy', './helper/util', './data/stock', './stock', './estimate'], function(ko, Sammy, util, stock, engine, estimate) {
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
        self.withScope = ko.observable();
        self.folders = folders;
        self.chosenFolderId = ko.observable();
        self.chosenFolderData = ko.observable();
        self.chosenCategoryId = ko.observable();
        self.chosenCategoryData = ko.observable();
        self.amountOrder = ko.observable('desc');
        self.changeOrder = ko.observable('desc');
        self.sortingName = 'amount';
        self.tooltipData = ko.observable();
        self.showTooltip = ko.observable(false);
        self.autoRefresh = false;
        self.frequency = 10;
        self.showWindow = ko.observable(false);
        self.bodyVisible = ko.observable(true);
        self.holdings = ko.observable(JSON.stringify(estimate.getFunds()));

        var timer;

        self.onKeyDown = function(data, e) {
            if(e.keyCode === 27) {// ESC key
                var current = self.bodyVisible();
                self.bodyVisible(!current);
            } else {
                return true;
            }
        };

        self.setHoldings = function() {
            self.showWindow(true);
        };

        self.saveHoldings = function() {
            estimate.saveFunds(JSON.parse(self.holdings()));
            self.showWindow(false);
        };

        self.giveUp = function() {
            self.showWindow(false);
        };

        self.toggleAutoRefresh = function() {
            self.autoRefresh = !self.autoRefresh;
            if (self.autoRefresh) {
                timer = setInterval(function() {
                    self.refresh();
                }, self.frequency * 1000)
            } else {
                clearInterval(timer);
            }
        };

        self.setFrequency = function(vm, e) {
            self.frequency = +e.target.value;
            clearInterval(timer);
            if (self.autoRefresh) {
                timer = setInterval(function() {
                    self.refresh();
                }, self.frequency * 1000)
            }
        };

        self.goToFolder = function(folder) {
            location.hash = folder.id;
        };

        self.goToCategory = function(category) {
            location.hash = self.chosenFolderId() + '/' + category.id;
        };

        self.goUp = function() {
            location.hash = self.chosenFolderId();
        };

        self.refresh = function(sortName, sortOrder) {
            util.setLoading(true);
            engine.loadData(self.chosenFolderId(), function(dataSource) {
                util.setLoading(false);
                updateSource(sortName, sortOrder);
            });
        };

        self.sortAmount = function() {
            self.sortingName = 'amount';
            var order = self.amountOrder;
            if (order() === 'desc') {
                order('asc');
            } else {
                order('desc');
            }
            initData('amount', order());
        };

        self.sortChange = function() {
            self.sortingName = 'change';
            var order = self.changeOrder;
            if (order() === 'desc') {
                order('asc');
            } else {
                order('desc');
            }
            initData('change', order());
        };

        self.showDetail = function(data, e) {
            var price = data.price,
                change = (+data.change * 100).toFixed(1),
                amount = (+data.amount / 10000).toFixed(2);
            var items = [{
                key: '当前价：',
                value: price,
                showTrend: true
            }, {
                key: '涨跌幅：',
                value: change + '%',
                showTrend: true
            }, {
                key: '成交额：',
                value: amount + '万',
                showTrend: false
            }];
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

        function updateFolder(folderId, sortName, sortOrder) {
            var items = stock.dataSource[folderId].data,
                maxAmount = -Infinity;
            for (var i = 0; i < items.length; i++) {
                if (items[i].amount > maxAmount) {
                    maxAmount = items[i].amount;
                }
                items[i].change = items[i].change || 0;
                items[i].id = i;
            }
            sortName = sortName || 'amount';
            sortOrder = sortOrder || 'desc';
            items.sort(function(a, b) {
                var ret = a[sortName] - b[sortName];
                return sortOrder == 'asc' ? ret : -ret;
            });
            self.chosenFolderData({
                items: items,
                maxAmount: maxAmount
            });
        }

        function updateCategory(folderId, categoryId, sortName, sortOrder) {
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
            sortName = sortName || 'amount';
            sortOrder = sortOrder || 'desc';
            bindItems.sort(function(a, b) {
                var ret = a[sortName] - b[sortName];
                return sortOrder == 'asc' ? ret : -ret;
            });
            self.chosenCategoryData({
                items: bindItems,
                maxAmount: maxAmount
            });
        }

        function updateSource() {
            var folderId = self.chosenFolderId(),
                categoryId = self.chosenCategoryId();
            var sortName = self.sortingName,
                order = {
                    amount: self.amountOrder(),
                    change: self.changeOrder()
                },
                sortOrder = order[sortName];
            if (categoryId != null) {
                updateCategory(folderId, categoryId, sortName, sortOrder);
                self.chosenFolderData(null);
            } else {
                updateFolder(folderId, sortName, sortOrder);
                self.chosenCategoryData(null);
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