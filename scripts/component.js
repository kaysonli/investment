require.config({
    paths: {
        jquery: ['http://cdn.staticfile.org/jquery/1.9.1/jquery.min', './lib/jquery.min'],
        ko: './lib/knockout',
        // ko: './lib/knockout-3.2.0.debug',
    },
    shim: {
        'fundList': {
            exports: 'fundArray'
        }
    }
});

require(['./ko', './components/navMenu', './domReady!', './components/select2'], function(ko, navMenu, doc, select2) {
    var menuItems = [{
        text: '行业',
        id: 'industry',
        items: ['银行类', '券商', '计算机']
    }, {
        text: '地域',
        id: 'area',
        items: ['北京', '上海', '广东', '浙江']
    }, {
        text: '概念',
        id: 'concept',
        items: ['融资融券', '沪深300', '创业板']
    }];
    // navMenu.init(document.getElementById('nav'), menuItems);
    function TestViewModel() {
        this.options = [{
            code: 'sh000001',
            name: '上证指数'
        }, {
            code: 'sh601218',
            name: '吉鑫科技',
            buyPrice: 7.65,
            shares: 300
        }, {
            code: 'sz000930',
            name: '中粮生化',
            buyPrice: 7.82,
            shares: 400
        }, {
            code: 'sz160706',
            name: '嘉实 300',
            buyPrice: 0.944,
            shares: 1400
        }, {
            code: 'sh601398',
            name: '工商银行',
            buyPrice: 5.166,
            shares: 900
        }, {
            code: 'sh601899',
            name: '紫金矿业',
            buyPrice: 3.8,
            shares: 100
        }];
        this.selectedItem = this.options[0];
    }
    ko.components.register('editable-select', select2);
    ko.applyBindings(new TestViewModel());
});
