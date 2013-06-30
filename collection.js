// Crux Collection
// ---------------
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(function(require) {
    var Backbone = require('backbone'),
    Paginator = require('backbone.paginator'),
    sync = require('./helper/sync'),
    _ = require('underscore');

    // Collection with default functionality.
    return Paginator.requestPager.extend({
        // Variables.
        // Keep track of collections' xhr.
        xhr: null,
        // Initialize
        //-----------
        initialize: function(models, options) {
            options = $.extend(true, {
                attributes: {}
            }, options || {});

            // Config Paginator.
            this.paginator_core = $.extend(true, {
                type: 'GET',
                dataType: 'json',
                // Proxy Backbone.Collection url.
                url: this.url
            }, this.paginator_core || {});

            this.paginator_ui = $.extend(true, {
                firstPage: 0,
                currentPage: 0,
                perPage: 20,
                totalPages: 10
            }, this.paginator_ui || {});

            this.server_api = $.extend(true, {
                'limit': function() {
                    return this.perPage;
                },
                'offset': function() {
                    return this.currentPage * this.perPage;
                }
            }, this.server_api || {});


            // Holds collection attributes. This will be added as data to each fetch.             
            this.attributes = new Backbone.Model(options.attributes);

            // Call parent.
            Paginator.requestPager.prototype.initialize.call(this, models, options);
        },
        // Override default fetch to add attributes.
        fetch: function(options) {
            var that = this,
            defaults = {
                data: this.fetchData()
            };

            this.xhr = Backbone.Collection.prototype.fetch.call(this, _.extend(defaults, options));
            
            return this.xhr;
        },
        fetchData: function() {
            return this.attributes.toJSON();
        },
        parse: function(response) {
            this.totalRecords = response.totalRecords;
            return response.data;
        },
        // Refresh data collection.
        refresh: function(params, options) {
            options = options || {};

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

            // Refresh always resets.
            options.reset = true;

            // Set paging start to 0.
            this.currentPage = 0;

            // Abort other xhr's;
            if (this.xhr) {
                this.xhr.abort();
            }

            this.xhr = this.fetch(params, options);

            return this.xhr;
        },
        // Save entire collection.
        save: function(params) {
            if (this.xhr) {
                this.xhr.abort();
            }

            syncMethod = params.syncMethod || 'update';

            this.xhr = Backbone.sync(syncMethod, this, params);

            return this.xhr;
        },
        // Fetch 1 model by id from collection if exists, else from server.
        //
        // Inspired by Stackoverflow.
        // 
        // `@see http://stackoverflow.com/questions/6262444/get-collection-id-in-backbone-without-loading-the-entire-collection`
        // `@return Model`
        //
        fetchOne: function(id, params) {
            var model = this.get(id);
            
            params = params || {};

            if (typeof model == 'undefined') {
                var attributes = {};
                attributes[this.model.prototype.idAttribute] = id;
                model = new this.model(attributes);
                this.add(model);
                model.fetch(params);
            }

            return model;
        },
        // Extend sync with events.
        sync: sync.events(Paginator.requestPager.prototype.sync)
    });
});