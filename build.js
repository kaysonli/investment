({
    baseUrl: './scripts',
    out: './scripts/main.dist.js',
    name: 'main',
    // appDir: './',
    // dir: './dist',
    // modules: [
    //     {
    //         name: 'main'
    //     }
    // ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone/backbone',
        backboneLocalstorage: 'lib/backbone/backbone.localStorage',
        text: 'lib/require/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        }
    }
})