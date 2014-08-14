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

        // Stateless objects used by both isEmpty tests.
        var MInner = Model.extend({
            defaults: {
                key_inner: 1
            }
        });
        var MNested = Model.extend({
            defaults: function() {
                return {
                    key: new MInner()
                };
            }
        });

        describe('#isEmpty', function() {
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

        describe('isEmpty (static)', function() {
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
                        key_inner: 1
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

            it('should return whether a model is empty according to a custom isEmpty method', function() {
                // Non-default isEmpty, empty if whatever is an odd number.
                var MCrazy = Model.extend({
                    defaults: {
                        whatever: 1
                    },
                    isEmpty: function() {
                        return (this.get('whatever') % 2) == 1;
                    }
                }, {
                    isEmpty: function(attrs) {
                        // As suggested by the documentation within src/model.js
                        if (attrs instanceof this) {
                            return attrs.isEmpty();
                        } else {
                            var model = Object.create(this.prototype);
                            model.attributes = attrs;
                            return model.isEmpty();
                        }
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

});
