define(function (require) {
    'use strict';

    var Model = require('src/model');

    return function () {
        describe('#dot', function() {
            beforeEach(function () {
                this.model = new Model({
                    'foo': 'bar',
                    'foo.bar': 'baz',
                    nested1: new Model({
                        'foo1': 'bar1',
                        'foo1.bar': 'baz1',
                        nested2: new Model({
                            'foo2': 'bar2',
                            'foo2.bar': 'baz2',
                            nested3: new Model({
                                'foo3': 'bar3',
                                'foo3.bar': 'baz3',
                            })
                        })
                    }),
                    'trick': new Model({
                        'shot': 'boom'
                    }),
                    'trick.shot': 'headshot'
                });
            });
            
            describe('when called with no arguments', function() {
                it('should return undefined', function() {
                    expect(this.model.dot()).toBe(undefined);
                });
            });

            describe('when called to get a non-nested attribute', function() {
                it('should behave like get', function() {
                    expect(this.model.dot('foo')).toBe('bar');
                    expect(this.model.dot('trick').get('shot')).toBe('boom');
                });
            });

            describe('when called to get a nested attribute', function() {
                it('should return the nested attribute', function() {
                    expect(this.model.dot('foo')).toBe('bar');

                    expect(this.model.dot('nested1.nested2.nested3.foo3')).toBe('bar3');
                    expect(this.model.dot('nested1.nested2.nested3.foo3.bar')).toBe(undefined);
                    expect(this.model.dot('trick.shot')).toBe('boom');
                });
            });

            describe('when called to get a non existing attribute', function() {
                it('should return undefined', function() {
                    expect(this.model.dot('does.not.exists')).toBe(undefined);
                    expect(this.model.dot('nested1.does.not.exists')).toBe(undefined);
                    expect(this.model.dot('nested1.nested2.does.not.exists')).toBe(undefined);
                    expect(this.model.dot('nested1.nested2.nested3.does.not.exists')).toBe(undefined);
                });
            });
        });
    };
});