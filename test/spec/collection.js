define(function(require) {
    var Collection = require('collection'),
    purl = require('purl');

    describe('Collection crux', function() {
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

        it('should have attributes defined', function() {
            var collection = new Collection(null, {attributes: {
                foo: 'bar'
            }});

            expect(collection.attributes.toJSON().foo).toBe('bar');
        });

        it('should call fetchData on fetch', function() {
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
    });

});