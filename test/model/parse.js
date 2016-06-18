import test from 'ava';
import { Model } from '../../dist/backbone-crux';

test('when called with {ignore: true}, should always return {} upon parse', t => {
    const model = new Model();
    t.deepEqual(model.parse({ foo: 'bar' }, { ignore: true }), {});
});

test('when called without ignore, should call its prototype', t => {
    const model = new Model();
    t.deepEqual(model.parse({ foo: 'bar' }), { foo: 'bar' });
});
