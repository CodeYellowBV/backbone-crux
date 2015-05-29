define(function (require) {
    'use strict';

    var Model = require('src/model');

    return function () {
        describe('#isEmpty', function() {
            // Stateless objects used by both isEmpty tests.
            var MInner = Model.extend({
                defaults: {
                    key_inner: 1,
                    another_key: 1
                }
            });
            var MNested = Model.extend({
                defaults: function() {
                    return {
                        key: new MInner()
                    };
                }
            });

            describe('called from a model instance', function() {
                it('should return whether a model is empty', function() {
                    var model = new Model();
                    expect(model.isEmpty()).toBe(true);
                    model.set({key: 1});
                    expect(model.isEmpty()).toBe(false);
                });

                it('should return whether a nested model is empty', function() {
                    var model = new MNested();
                    expect(model.isEmpty()).toBe(true);
                    model.set({key: new MInner()});
                    expect(model.isEmpty()).toBe(true);
                    model.get('key').set({key_inner: 2});
                    expect(model.isEmpty()).toBe(false);
                });
            });

            describe('called statically', function() {
                it('should return whether a model is empty', function() {
                    var model = new Model();
                    expect(model.isEmpty(model)).toBe(true);
                    model.set({key: 1});
                    expect(Model.isEmpty(model)).toBe(false);
                });

                it('should return whether an attribute hash represents an empty model', function() {
                    expect(MInner.isEmpty({key_inner: 1})).toBe(true);
                    expect(MInner.isEmpty({key_inner: 2})).toBe(false);
                });

                it('should return whether a nested model is empty', function() {
                    var model = new MNested();
                    expect(MNested.isEmpty(model)).toBe(true);
                    model.set({key: new MInner()});
                    expect(MNested.isEmpty(model)).toBe(true);
                    model.get('key').set({key_inner: 2});
                    expect(MNested.isEmpty(model)).toBe(false);
                });

                it('should return whether a nested model as a plain object is empty', function() {
                    var attrs = {
                        key: {
                            key_inner: 1,
                            another_key: 1
                        }
                    };
                    expect(MNested.isEmpty(attrs)).toBe(true);
                    attrs.key.key_inner = 2;
                    expect(MNested.isEmpty(attrs)).toBe(false);
                });

                it('should return whether a nested model in an attribute hash is empty', function() {
                    var model = new MNested();
                    var attributes = model.attributes;
                    expect(MNested.isEmpty(attributes)).toBe(true);
                    model.set({key: new MInner()});
                    expect(MNested.isEmpty(attributes)).toBe(true);
                    model.get('key').set({key_inner: 2});
                    expect(MNested.isEmpty(attributes)).toBe(false);
                });

                it('should return true for no input', function() {
                    expect(MNested.isEmpty(undefined)).toBe(true);
                    expect(MNested.isEmpty(null)).toBe(true);
                });

                it('should return whether a partial object is a subset of the defaults', function() {
                    expect(MInner.isEmpty({key_inner: 1})).toBe(true);
                    expect(MInner.isEmpty({another_key: 1})).toBe(true);

                    expect(MNested.isEmpty({})).toBe(true);
                });

                it('should ignore undefined values for primitive keys', function() {
                    // undefined disappears after JSON-serialization, so it should be ignored.
                    expect(MInner.isEmpty({key_inner: undefined})).toBe(true);
                    expect(MNested.isEmpty({key: { key_inner: 1, another_key: undefined}})).toBe(true);
                });

                it('should return false for null instead of a primitive value', function() {
                    expect(MInner.isEmpty({key_inner: null})).toBe(false);
                    expect(MNested.isEmpty({key: { key_inner: 1, another_key: null}})).toBe(false);
                });

                it('shoud accept null and undefined instead of a model', function() {
                    expect(MNested.isEmpty({key: undefined})).toBe(true);
                    expect(MNested.isEmpty({key: null})).toBe(true);
                    expect(MNested.isEmpty({key: { key_inner: 1}})).toBe(true);
                });

                it('should return whether a superset of the defaults is empty', function() {
                    expect(MInner.isEmpty({unknown: 1})).toBe(false);

                    expect(MInner.isEmpty({unknown: null})).toBe(true);
                    expect(MInner.isEmpty({unknown: undefined})).toBe(true);
                });

                it('should return whether a model is empty according to a custom isEmpty method', function() {
                    // Non-default isEmpty, empty if whatever is an odd number.
                    var MCrazy = Model.extend({
                        defaults: {
                            whatever: 1
                        },
                        isEmpty: function() {
                            return (this.get('whatever') % 2) == 1;
                        }
                    });
                    var model = new MCrazy();

                    expect(model.isEmpty()).toBe(true);
                    expect(MCrazy.isEmpty(model)).toBe(true);
                    expect(MCrazy.isEmpty(model.attributes)).toBe(true);

                    model.set('whatever', 2);
                    expect(model.isEmpty()).toBe(false);
                    expect(MCrazy.isEmpty(model)).toBe(false);
                    expect(MCrazy.isEmpty(model.attributes)).toBe(false);

                    model.set('whatever', 3);
                    expect(model.isEmpty()).toBe(true);
                    expect(MCrazy.isEmpty(model)).toBe(true);
                    expect(MCrazy.isEmpty(model.attributes)).toBe(true);
                });
            });
        });
    };
});