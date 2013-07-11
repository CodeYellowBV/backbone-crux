define(function(require) {
    var Collection = require('src/collection'),
    purl = require('purl'),
    _ = require('underscore');

    describe('Collection', function() {
        // Mock ajax.
        beforeEach(function(){
            jasmine.Ajax.useMock();
        });

        it('should copy url to paginator_core.url on initialize', function() {
            var collection = new Collection(null, {url: 'some/test/url'});

            expect(collection.paginator_core.url).toBe('some/test/url');
        });

        it('should have a function fetch defined', function() {
            var collection = new Collection();

            expect(collection.fetch).toBeDefined();
        });

        it('should have empty attributes if no options are given', function() {
            var collection = new Collection();

            expect(_.isEmpty(collection.attributes.toJSON())).toBeTruthy();
        });

        it('should pass attributes option to attributes model', function() {
            var collection = new Collection(null, {attributes: {
                foo: 'bar'
            }});

            expect(collection.attributes.toJSON().foo).toBe('bar');
        });

        it('should call fetchData on fetch and send that data to server', function() {
            var collection = new Collection(null, {attributes: {
                foo: 'bar'
            }}),
            params = {};

            spyOn(collection, 'fetchData').andCallThrough();

            collection.fetch();

            expect(collection.fetchData).toHaveBeenCalled();
            expect(collection.fetchData.calls.length).toBe(1);
            expect(_.isEqual(
                // Ignore default params.
                _.omit(purl(mostRecentAjaxRequest().url).param(), ['_', 'limit', 'offset']),
                collection.fetchData()
            )).toBeTruthy();
        });

        it('should copy totalRecords from server response', function() {
            var collection = new Collection();

            collection.fetch();
            
            mostRecentAjaxRequest().response({
                status: 200,
                responseText: JSON.stringify({
                    data: [],
                    totalRecords: 3
                })
            });

            expect(collection.totalRecords).toBe(3);
        });
    });

});