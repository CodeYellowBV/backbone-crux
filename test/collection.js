import test from 'ava';
import { Collection } from '../dist/backbone-crux';
import _ from 'underscore';

test('Collection should have empty attributes if no options are given', t => {
    const collection = new Collection();

    t.true(_.isEmpty(collection.attributes.toJSON()));
});

test('Collection should pass attributes option to attributes model', t => {
    const collection = new Collection(null, { attributes: {
        foo: 'bar',
    } });

    t.deepEqual(collection.attributes.toJSON(), { foo: 'bar' });
});

test('Collection should create a collection from a given array when parse:true is set', t => {
    const inputModels = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const collection = new Collection(inputModels, { parse: true });
    t.is(collection.length, inputModels.length);
});
