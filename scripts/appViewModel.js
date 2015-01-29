define(['./ko', './sammy', './helper/util', './data/stock', './stock'], function(ko, Sammy, util, stock, engine) {
    return function appViewModel() {
        var folders = [],
            ds = stock.dataSource,
            self = this;
        for (var i = 0; i < ds.length; i++) {
            folders.push({
                name: ds[i].category,
                id: i
            });
        }
        self.folders = folders;
        self.chosenFolderId = ko.observable();
        self.chosenFolderData = ko.observable({
            items: [],
            maxAmount: 0
        });
        self.chosenCategoryData = ko.observable();

        self.goToFolder = function(folder) {
            location.hash = folder.id;
            // self.chosenFolderId(folder.id);
        };

        self.goToCategory = function(category) {
            location.hash = category.folder.id + '/' + category.id;
        };

        self.refresh = function() {
            util.setLoading(true);
            engine.loadData(self.chosenFolderId(), function(dataSource) {
                util.setLoading(false);
                var index = self.chosenFolderId();
                var items = dataSource[index].data,
                    maxAmount = -1;
                for (var i = 0; i < items.length; i++) {
                    if(items[i].amount > maxAmount) {
                        maxAmount = items[i].amount;
                    }
                }
                self.chosenFolderData({
                    items: dataSource[index].data,
                    maxAmount: maxAmount 
                });
            });
        };

        function updateSource() {
            
        }

        Sammy(function() {
            this.get('#:folder', function() {
                self.chosenFolderId(this.params.folder);
                self.chosenCategoryData(null);
            });

            this.get('#:folder/:categoryId', function() {
                self.chosenFolderId(this.param.folder);
                self.chosenFolderData(null);
            });

            this.get('', function() {
                this.app.runRoute('get', '#0');
            });
        }).run();

    };
});
