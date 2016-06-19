import test from 'ava';
import { Collection } from '../../dist/backbone-crux';
import Backbone from 'backbone';
import sinon from 'sinon';

test.beforeEach(t => {
    t.context.stub = sinon.stub(Backbone, 'ajax');
});

test.afterEach(t => {
    t.context.stub.restore();
});

test('fetchData is called', t => {
    const CollectionA = Collection.extend({ url: 'api/test' });
    const collection = new CollectionA(null, {
        attributes: {
            foo: 'bar',
            bar: 'baz',
        },
    });
    const spy = sinon.spy(collection, 'fetchData');

    collection.fetch();

    t.true(t.context.stub.calledOnce);
    t.true(spy.calledOnce);
});

test('correct data is sent', t => {
    const CollectionA = Collection.extend({ url: 'api/test' });
    const collection = new CollectionA(null, {
        attributes: {
            foo: 'bar',
            bar: 'baz',
        },
    });

    collection.fetch();

    t.deepEqual(t.context.stub.args[0][0].data, {
        foo: 'bar',
        bar: 'baz',
        page: 1,
        per_page: 25,
    });
});

test('totalRecords is parsed from server', t => {
    const collection = new Collection();

    collection.parse({
        data: [],
        totalRecords: 300,
    });

    t.is(collection.state.totalPages, 300 / collection.state.pageSize);
});
