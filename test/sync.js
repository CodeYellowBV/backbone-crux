import test from 'ava';
import { Collection, Model } from '../dist/backbone-crux';
import Backbone from 'backbone';
import sinon from 'sinon';
import deferred from 'JQDeferred';

test.beforeEach(t => {
    t.context.stub = sinon.stub(Backbone, 'ajax');
});

test.afterEach(t => {
    t.context.stub.restore();
});

function okResponse() {
    const d = deferred();
    d.resolve({ foo: 'bar' });
    return d.promise();
}

function failResponse() {
    const d = deferred();
    d.reject({ foo: 'baz' });
    return d.promise();
}

test('collection fetch with ok response', t => {
    const CollectionA = Collection.extend({ url: 'api/test' });
    const collection = new CollectionA();
    const spy = sinon.spy(collection, 'trigger');

    t.context.stub.returns(okResponse());

    collection.fetch();

    t.is(spy.callCount, 4);
    t.true(spy.withArgs('before:read').calledOnce);
    t.true(spy.withArgs('after:read').calledOnce);
    t.true(spy.calledWithExactly('after:read:success', { foo: 'bar' }));
    t.true(spy.withArgs('after:read:success').calledOnce);
});

test('collection fetch with fail response', t => {
    const CollectionA = Collection.extend({ url: 'api/test' });
    const collection = new CollectionA();
    const spy = sinon.spy(collection, 'trigger');

    t.context.stub.returns(failResponse());

    collection.fetch();

    t.is(spy.callCount, 4);
    t.true(spy.withArgs('before:read').calledOnce);
    t.true(spy.withArgs('after:read').calledOnce);
    t.true(spy.calledWithExactly('after:read:error'));
    t.true(spy.withArgs('after:read:error').calledOnce);
});

test('model create with fail response', t => {
    const ModelA = Model.extend({ url: 'api/test' });
    const model = new ModelA();
    const spy = sinon.spy(model, 'trigger');

    t.context.stub.returns(failResponse());

    model.save();

    t.is(spy.callCount, 4);
    t.true(spy.withArgs('before:create').calledOnce);
    t.true(spy.withArgs('after:create').calledOnce);
    t.true(spy.withArgs('after:create:error').calledOnce);
});

test('model update with ok response', t => {
    const ModelA = Model.extend({ url: 'api/test' });
    const model = new ModelA({ id: 1 });
    const spy = sinon.spy(model, 'trigger');

    t.context.stub.returns(okResponse());

    model.save();

    t.is(spy.callCount, 4);
    t.true(spy.withArgs('before:update').calledOnce);
    t.true(spy.withArgs('after:update').calledOnce);
    t.true(spy.withArgs('after:update:success').calledOnce);
});
