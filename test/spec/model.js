define(function (require) {
    'use strict';

    describe('Model', function() {
        require('./model/isEmpty')();
        require('./model/serialization')();
        require('./model/parse')();
        require('./model/dot')();
    });
});