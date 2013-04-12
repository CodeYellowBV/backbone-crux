/**
 * Add default functionality such as saving an entire collection.
 */
define(['backbone.paginator', 'helper/type.of', 'helper/errorxhr', 'cocktail'], function(Paginator, type, errorXHR) {
    return Paginator.requestPager.extend({
        initialize: function(models, options) {
            if (type.of(options) == 'undefined') {
                options = {};
            }

            options = $.extend(true, {
                attributes: {}
            }, options);

            /**
             * Holds collection attributes. This will be added as data to each
             * fetch.
             */
            this.attributes = new Backbone.Model(options.attributes);

            this.xhr = null;

            // Fetch on all changes.
            // this.attributes.on('change', this.refresh, this);

            // Call parent.
            Backbone.Collection.prototype.initialize.call(this, models, options);
        },
        paginator_core: {
            // the type of the request (GET by default)
            type: 'GET',

            // the type of reply (jsonp by default)
            dataType: 'json',

            // the URL (or base URL) for the service
            url: ''
        },
        paginator_ui: {
            // the lowest page index your API allows to be accessed
            firstPage: 0,

            // which page should the paginator start from
            // (also, the actual page the paginator is on)
            currentPage: 0,

            // how many items per page should be shown
            perPage: 20,

            // a default number of total pages to query in case the API or
            // service you are using does not support providing the total
            // number of pages for us.
            // 10 as a default in case your service doesn't return the total
            totalPages: 10
        },
        server_api: {
            'limit': function() {
                return this.perPage
            },
            'offset': function() {
                return this.currentPage * this.perPage
            }
        },
        parse: function(response) {
            this.totalRecords = response.totalRecords;
            return response.data;
        },
        /**
         * Refresh data collection.
         */
        refresh: function(params) {
            if (params) {
                switch(true) {
                    case _.isNull(params):
                    case _.isEmpty(params):
                        this.attributes.clear();
                        break;
                    default:
                        this.attributes.set(params);
                        break;
                }
                
            }

            // Set paging start to 0.
            this.currentPage = 0;

            if (this.xhr) {
                this.xhr.abort();
            }

            this.xhr = this.fetch({
                update: true
            });

            return this.xhr;
        },
        save: function(options) {
            if (this.xhr) {
                this.xhr.abort();
            }

            this.xhr = Backbone.sync('update', this, options);
        },
        /**
         * Override default fetch to add attributes to fetch.
         * 
         * @param object
         *            options
         */
        fetch: function(options) {
            var defaults = {
                data: this.attributes.toJSON()
            };

            var xhr = Backbone.Collection.prototype.fetch.call(this, _.extend(defaults, options));

            // Trigger fetch.
            this.trigger('fetch', xhr);
            console.log('triggered fetch');
            
            return xhr;
        },
        /**
         * Fetch 1 model by id from collection if exists, else from server.
         * 
         * Inspired by Stackoverflow.
         * 
         * @see http://stackoverflow.com/questions/6262444/get-collection-id-in-backbone-without-loading-the-entire-collection
         * @return Crux/Model
         */
        fetchOne: function(id, params) {
            var model = this.get(id);
            var params = params || {};

            if (typeof model == 'undefined') {
                var attributes = {};
                attributes[this.model.prototype.idAttribute] = id;
                model = new this.model(attributes);
                this.add(model);
                model.fetch(params);
            }

            return model;
        }
    });
});