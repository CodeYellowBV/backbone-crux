/* globals define, describe, it, expect */
define(function (require) {
    'use strict';

    var Model = require('src/model');

    describe('Model', function() {
        it('should return a plain JavaScript object for nested models', function() {
            var date = new Date();
            var model = new Model({
                key: new Model({
                    key2: new Model({
                        key3: 1,
                        value: date
                    })
                }),
                value: '',
                list: [1],
                collection: [new Model({a:1})]
            });

            var plainObject = {
                key: {
                    key2: {
                        key3: 1,
                        value: date.toJSON()
                    }
                },
                value: '',
                list: [1],
                collection: [{a:1}]
            };

            expect(model.toJSON()).toEqual(plainObject);
        });
    });

});
