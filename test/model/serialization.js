import test from 'ava';
import { Model } from '../../dist/backbone-crux';

// Create an instance of a model using test data.
function modelFactory(MSerializable) {
    return new (MSerializable.extend({
        defaults() {
            return {
                someModel: new (MSerializable.extend({
                    defaults: {
                        key1: 1,
                        key2: 2,
                    },
                }))(),
                deeplyNested: new (MSerializable.extend({
                    defaults: {
                        deepNonEmpty: new (MSerializable.extend({
                            defaults: {
                                key3: 3,
                            },
                        }))(),
                        deepEmpty: new MSerializable(),
                    },
                }))(),
                emptyModel: new MSerializable(),
                primitive: 1,
            };
        },
    }))();
}
const flatModelData = {
    someModel: {
        key1: 1,
        key2: 2,
    },
    deeplyNested: {
        deepNonEmpty: {
            key3: 3,
        },
        deepEmpty: {},
    },
    emptyModel: {},
    primitive: 1,
};

test('serialization toJSON should return the attributes of the model by default', t => {
    const model = modelFactory(Model);
    t.deepEqual(model.toJSON(), flatModelData);
});

test('serialization toJSON should return the attributes according to the custom serialization rules', t => {
    // Exclude empty models.
    const MSerializable = Model.extend({
        toJSON() {
            return this.isEmpty() ? null : Model.prototype.toJSON.call(this);
        },
    });
    const model = modelFactory(MSerializable);
    // Because the model hasn't changed from their defaults, the model must be null.
    t.is(model.toJSON(), null);

    model.set('primitive', 2);
    t.deepEqual(model.toJSON(), {
        someModel: null,
        deeplyNested: null,
        emptyModel: null,
        primitive: 2,
    });

    model.get('deeplyNested').get('deepNonEmpty').set('key3', 4);
    t.deepEqual(model.toJSON(), {
        someModel: null,
        deeplyNested: {
            deepNonEmpty: {
                key3: 4,
            },
            deepEmpty: null,
        },
        emptyModel: null,
        primitive: 2,
    });
});

test('serialization toJSON should return a plain JavaScript object for nested models', t => {
    const date = new Date();
    const model = new Model({
        key: new Model({
            key2: new Model({
                key3: 1,
                value: date,
            }),
        }),
        value: '',
        list: [1],
        collection: [new Model({ a: 1 })],
    });
    const plainObject = {
        key: {
            key2: {
                key3: 1,
                value: date.toJSON(),
            },
        },
        value: '',
        list: [1],
        collection: [{ a: 1 }],
    };

    t.deepEqual(model.toJSON(), plainObject);
});

test('serialization serializeData should return the attributes of the model by default', t => {
    const model = modelFactory(Model);
    t.deepEqual(model.serializeData(), flatModelData);
});

test('serialization serializeData should return the attributes according to the custom serialization rules', t => {
    const MSerializable = Model.extend({
        serializeData() {
            // Default implementation.
            return Model.prototype.serializeData.call(this);
        },
    });
    const model = modelFactory(MSerializable);
    t.deepEqual(model.serializeData(), flatModelData);
});
