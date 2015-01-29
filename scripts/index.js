require.config({
    paths: {
        jquery: ['http://cdn.staticfile.org/jquery/1.9.1/jquery.min', './lib/jquery.min'],
        ko: './lib/knockout',
        // ko: './lib/knockout-3.2.0.debug',
        sammy: './lib/sammy',
        fundList: 'http://hqqd.fund123.cn/funddataforsearch'
    },
    shim: {
        'fundList': {
            exports: 'fundArray'
        }
    }
});

require(['./ko', './appViewModel', './domReady!', './stock'], function(ko, appViewModel, doc, engine) {
    ko.bindingHandlers.quote = {
        init: function(element, valueAccessor) {
            // var observable = valueAccessor();
            // $(element).width(observable);
        },
        update: function(element, valueAccessor) {
            var observable = valueAccessor();
            var width = (observable.amount / observable.maxAmount) * 80 + '%';
            var color = engine.getColor(observable.change);
            $(element).width(width).css('background-color', color);
        }
    };
    ko.applyBindings(new appViewModel());
});