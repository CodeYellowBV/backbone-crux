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

        describe('Serialization', function () {
            // Create an instance of a model using test data.
            function modelFactory(MSerializable) {
                return new (MSerializable.extend({
                    defaults: function() {
                        return {
                            someModel: new (MSerializable.extend({
                                defaults: {
                                    key1: 1,
                                    key2: 2
                                }
                            }))(),
                            deeplyNested: new (MSerializable.extend({
                                defaults: {
                                    deepNonEmpty: new (MSerializable.extend({
                                        defaults: {
                                            key3: 3
                                        }
                                    }))(),
                                    deepEmpty: new MSerializable()
                                }
                            }))(),
                            emptyModel: new MSerializable(),
                            primitive: 1
                        };
                    }
                }))();
            }
            var flatModelData = {
                someModel: {
                    key1: 1,
                    key2: 2
                },
                deeplyNested: {
                    deepNonEmpty: {
                        key3: 3
                    },
                    deepEmpty: {}
                },
                emptyModel: {},
                primitive: 1
            };

            describe('#toJSON', function() {
                it('should return the attributes of the model by default', function() {
                    var model = modelFactory(Model);
                    expect(model.toJSON()).toEqual(flatModelData);
                });

                it('should return the attributes according to the custom serialization rules', function() {
                    // Exclude empty models.
                    var MSerializable = Model.extend({
                        toJSON: function () {
                            if (this.isEmpty())
                                return null;
                            return Model.prototype.toJSON.call(this);
                        }
                    });
                    var model = modelFactory(MSerializable);
                    // Because the model hasn't changed from their defaults, the model must be null.
                    expect(model.toJSON()).toBe(null);

                    model.set('primitive', 2);
                    expect(model.toJSON()).toEqual({
                        someModel: null,
                        deeplyNested: null,
                        emptyModel: null,
                        primitive: 2
                    });


                    model.get('deeplyNested').get('deepNonEmpty').set('key3', 4);
                    expect(model.toJSON()).toEqual({
                        someModel: null,
                        deeplyNested: {
                            deepNonEmpty: {
                                key3: 4
                            },
                            deepEmpty: null
                        },
                        emptyModel: null,
                        primitive: 2
                    });
                });
            }); // describe toJSON

            describe('#serializeData', function() {
                it('should return the attributes of the model by default', function() {
                    var model = modelFactory(Model);
                    expect(model.serializeData()).toEqual(flatModelData);
                });

                it('should return the attributes according to the custom serialization rules', function() {
                    var MSerializable = Model.extend({
                        serializeData: function () {
                            // Default implementation.
                            return Model.prototype.serializeData.call(this);
                        }
                    });
                    var model = modelFactory(MSerializable);
                    expect(model.serializeData()).toEqual(flatModelData);
                });
            }); // describe serializeData
        }); // describe serialize
    }); // describe Model

});
