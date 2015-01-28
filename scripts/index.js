require.config({
    paths: {
        jquery: 'http://cdn.staticfile.org/jquery/1.9.1/jquery.min',
        ko: './lib/knockout',
        sammy: './lib/sammy',
        fundList: 'http://hqqd.fund123.cn/funddataforsearch'
    },
    shim: {
        'fundList': {
            exports: 'fundArray'
        }
    }
});

require(['./ko',  './appViewModel', './domReady!'], function(ko, appViewModel, doc) {
    ko.applyBindings(new appViewModel());
});
