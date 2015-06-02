// First load main config.
require(['../test/config/require'], function() {
    'use strict';
    
    // Change baseUrl to app dir.
    require.config({'baseUrl': './../'});

    // // Override specific test environment config.
    // require(['./test/config/require'], function() {
    
        // Then load app. 
        require([
            'jquery',
            'test/spec/index',
            'jasmine.mock-ajax',
        ], function($, index) {
            $(function() {
                var jasmineEnv = jasmine.getEnv();

                // Reporter to be used in conjunction with Rob's run-headless-chromium.js
                // See also http://wasbazi.com/blog/running-jasmine-tests-with-phantomjs-ci-setup-part-two/
                var ConsoleReporter = jasmineRequire.ConsoleReporter(),
                consoleReporter = new ConsoleReporter({
                    print: function (message) {
                        // Append magic bytes to signal that the line has not ended yet.
                        // This is needed because ConsoleReporter will add the trailing newlines
                        // if desired, i.e. it expects console.log to behave as print, not println.
                        /* global console */
                        console.log(message + '\x03\b');
                    },
                    onComplete: function(isSuccess) {
                        var exitCode = isSuccess ? 0 : 1;
                        // Magic string to signal completion of the tests
                        console.info('All tests completed!' + exitCode);
                    },
                    showColors: true
                });

                jasmineEnv.addReporter(consoleReporter);
                
                // jasmineEnv.specFilter = function(spec) {
                //     return htmlReporter.specFilter(spec);
                // };

                require(index.specs, function() {
                    if (typeof cy_jasmineCoreOnload === 'function') {
                        // defined in index.html, starts the tests.
                        /* globals cy_jasmineCoreOnload */
                        cy_jasmineCoreOnload();
                    } else {
                        jasmineEnv.execute();
                    }
                });
            });
        });
    // });
});
