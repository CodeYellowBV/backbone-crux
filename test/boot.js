require.config({
    baseUrl: '../',
    urlArgs: 'bust=' + (new Date()).getTime(),
    paths: {
        'jquery': 'components/jquery/jquery',
        'underscore': 'components/underscore/underscore',
        'backbone': 'components/backbone/backbone',
        'marionette': 'components/backbone.marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': 'components/backbone.wreqr/lib/amd/backbone.wreqr',
        'backbone.babysitter': 'components/backbone.babysitter/lib/amd/backbone.babysitter',
        'backbone.paginator': 'components/backbone.paginator/lib/backbone.paginator',
        'purl': 'components/purl/purl'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'purl': {
            exports: 'purl'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.paginator': {
            deps: ['backbone'],
            exports: 'Backbone.Paginator'
        }
    },
    deps: ['jquery', 'underscore']
});

require(['jquery', 'test/spec/index', 'components/jasmine-ajax/lib/mock-ajax', 'test/helper/using'], function($, index) {
    var jasmineEnv = jasmine.getEnv(),
    htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {        
        return htmlReporter.specFilter(spec);
    };

    $(function() { 
        require(index.specs, function() {
            jasmineEnv.execute();
        });
    });
});