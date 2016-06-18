import test from 'ava';
import { Model } from '../../dist/backbone-crux';

const MInner = Model.extend({
    defaults: {
        key_inner: 1,
        another_key: 1,
    },
});
const MNested = Model.extend({
    defaults: () => ({
        key: new MInner(),
    }),
});

test('isEmpty should return whether a model is empty', t => {
    const model = new Model();
    t.true(model.isEmpty());
    model.set({ key: 1 });
    t.false(model.isEmpty());
});

test('isEmpty should return whether a nested model is empty', t => {
    const model = new MNested();
    t.true(model.isEmpty());
    model.set({ key: new MInner() });
    t.true(model.isEmpty());
    model.get('key').set({ key_inner: 2 });
    t.false(model.isEmpty());
});

test('isEmpty should return whether a model is empty statically', t => {
    const model = new Model();
    t.true(model.isEmpty(model));
    model.set({ key: 1 });
    t.false(Model.isEmpty(model));
});

test('isEmpty should return whether an attribute hash represents an empty model', t => {
    t.true(MInner.isEmpty({ key_inner: 1 }));
    t.false(MInner.isEmpty({ key_inner: 2 }));
});

test('isEmpty should return whether a nested model is empty', t => {
    const model = new MNested();
    t.true(MNested.isEmpty(model));
    model.set({ key: new MInner() });
    t.true(MNested.isEmpty(model));
    model.get('key').set({ key_inner: 2 });
    t.false(MNested.isEmpty(model));
});

test('isEmpty should return whether a nested model as a plain object is empty', t => {
    const attrs = {
        key: {
            key_inner: 1,
            another_key: 1,
        },
    };
    t.true(MNested.isEmpty(attrs));
    attrs.key.key_inner = 2;
    t.false(MNested.isEmpty(attrs));
});

test('isEmpty should return whether a nested model in an attribute hash is empty', t => {
    const model = new MNested();
    const attributes = model.attributes;
    t.true(MNested.isEmpty(attributes));
    model.set({ key: new MInner() });
    t.true(MNested.isEmpty(attributes));
    model.get('key').set({ key_inner: 2 });
    t.false(MNested.isEmpty(attributes));
});

test('isEmpty should return true for no input', t => {
    t.true(MNested.isEmpty(undefined));
    t.true(MNested.isEmpty(null));
});

test('isEmpty should return whether a partial object is a subset of the defaults', t => {
    t.true(MInner.isEmpty({ key_inner: 1 }));
    t.true(MInner.isEmpty({ another_key: 1 }));

    t.true(MNested.isEmpty({}));
});

test('isEmpty should ignore undefined values for primitive keys', t => {
    // undefined disappears after JSON-serialization, so it should be ignored.
    t.true(MInner.isEmpty({ key_inner: undefined }));
    t.true(MNested.isEmpty({ key: { key_inner: 1, another_key: undefined } }));
});

test('isEmpty should return false for null instead of a primitive value', t => {
    t.false(MInner.isEmpty({ key_inner: null }));
    t.false(MNested.isEmpty({ key: { key_inner: 1, another_key: null } }));
});

test('isEmpty should accept null and undefined instead of a model', t => {
    t.true(MNested.isEmpty({ key: undefined }));
    t.true(MNested.isEmpty({ key: null }));
    t.true(MNested.isEmpty({ key: { key_inner: 1 } }));
});

test('isEmpty should return whether a superset of the defaults is empty', t => {
    t.false(MInner.isEmpty({ unknown: 1 }));

    t.true(MInner.isEmpty({ unknown: null }));
    t.true(MInner.isEmpty({ unknown: undefined }));
});

test('isEmpty should return whether a model is empty according to a custom isEmpty method', t => {
    // Non-default isEmpty, empty if whatever is an odd number.
    const MCrazy = Model.extend({
        defaults: {
            whatever: 1,
        },
        isEmpty() {
            return (this.get('whatever') % 2) === 1;
        },
    });
    const model = new MCrazy();

    t.true(model.isEmpty());
    t.true(MCrazy.isEmpty(model));
    t.true(MCrazy.isEmpty(model.attributes));

    model.set('whatever', 2);
    t.false(model.isEmpty());
    t.false(MCrazy.isEmpty(model));
    t.false(MCrazy.isEmpty(model.attributes));

    model.set('whatever', 3);
    t.true(model.isEmpty());
    t.true(MCrazy.isEmpty(model));
    t.true(MCrazy.isEmpty(model.attributes));
});
