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

require(['./ko', './components/navMenu', './domReady!'], function(ko, navMenu, doc) {
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
    navMenu.init(document.getElementById('nav'), menuItems);
});