define(function (require) {
    'use strict';

    var Model = require('src/model');

    return function () {
        describe('#parse', function() {
            beforeEach(function () {
                this.model = new Model();
            });

            describe('when called with {ignore: true}', function() {
                it('should always return {} upon parse', function() {
                    expect(this.model.parse({foo: 'bar'}, {ignore: true})).toEqual({});
                });
            });

            describe('when called without ignore', function() {
                it('should call its prototype', function() {
                    expect(this.model.parse({foo: 'bar'})).toEqual({foo: 'bar'});
                });
            });
        });
    };
});
