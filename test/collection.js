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


// TODO: Find a way to mock AJAX requests in ava and enable these tests;

// describe('when fetching a collection', function () {
//     var Uri = require('uri');

//     beforeEach(function () {
//         var CollectionWithUrl = Collection.extend({ url: 'some/url' });

//         this.collection = new CollectionWithUrl(null, {
//             attributes: {
//                 foo: 'bar',
//                 bar: 'baz',
//             },
//         });
//     });

//     it('should call fetchData on fetch and send that data to server', function () {
//         jasmine.Ajax.withMock(function () {
//             var uri = null;

//             spyOn(this.collection, 'fetchData').and.callThrough();
//             this.collection.fetch();

//             expect(this.collection.fetchData).toHaveBeenCalled();
//             expect(this.collection.fetchData.call.length).toBe(1);
//             uri = new Uri(jasmine.Ajax.requests.mostRecent().url);

//             // TODO: fix so that page and per_page are included.
//             expect(_.isEqual(_.omit(uri.search(true), 'page', 'per_page'), this.collection.fetchData())).toBeTruthy();
//         }.bind(this));
//     });

//     it('should copy totalRecords from server response', function () {
//         jasmine.Ajax.withMock(function () {
//             this.collection.fetch();
//             jasmine.Ajax.requests.mostRecent().respondWith({
//                 status: 200,
//                 responseText: JSON.stringify({
//                     data: [],
//                     totalRecords: 300,
//                 }),
//             });

//             expect(this.collection.state.totalPages).toBe(300 / this.collection.state.pageSize);
//         }.bind(this));
//     });
// });
