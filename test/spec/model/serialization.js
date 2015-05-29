define(function (require) {
    'use strict';

    var Model = require('src/model');

    return function () {
        describe('serialization', function () {
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

                it('should return a plain JavaScript object for nested models', function() {
                    var date = new Date(),
                        model = new Model({
                        key: new Model({
                                key2: new Model({
                                    key3: 1,
                                    value: date
                                })
                            }),
                            value: '',
                            list: [1],
                            collection: [new Model({a:1})]
                        }),
                        plainObject = {
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
            });
        });
    };
});