define(function (require) {
    'use strict';
    
    var Backbone = require('backbone'),
        Paginator = require('backbone.paginator'),
        sync = require('./helper/sync'),
        serializer = require('./helper/serializer'),
        $ = require('jquery'),
        _ = require('underscore');

    return Paginator.extend({
        // Keep track of latest collections' xhr. This will be overridden with each new request.
        xhr: null,
        // You can define defaults for attributes here.
        attributes: {},
        /**
         * Initialize attributes and set configs.
         *
         * @param {Object} models Proxy to Paginator.initiliaze.
         * @param {Object} options If attributes key exists, then this is copied to attributes model.
         */
        initialize: function (models, options) {
            options = options || {};

            // Holds collection attributes. This will be added as data to each fetch.
            this.attributes = new Backbone.Model($.extend(true, {}, this.attributes, options.attributes || {}));

            // Call parent.
            return Paginator.prototype.initialize.call(this, models, options);
        },

        /**
         * Override default fetch to add attributes.
         *
         * @param {Object} options Proxy to Backbone.Collection.fetch
         * @return {Object|null} jqXHR or null on fail.
         */
        fetch: function (options) {
            var defaults = {
                // Get data for fetch.
                data: this.fetchData()
            };

            this.xhr = Paginator.prototype.fetch.call(this, _.extend(defaults, options));

            return this.xhr;
        },

        /**
         * Extra data to send with each fetch. Defaults to attributes.
         *
         * @return {Object} Data
         */
        fetchData: function () {
            return this.attributes.toJSON();
        },

        /**
         * Save server totalRecords response. Expects response in this format:
         *
         * {
         *      data: [{
         *          {
         *              key1: value1,
         *              key2: value2,
         *          },
         *          {
         *              key1: value1,
         *              key2: value2,
         *          },
         *      }],
         *      totalRecords: 1234
         * }
         *
         * OR
         *
         * [{
         *     key1: value1,
         *     key2: value2,
         * }, { .. }, ... ]
         *
         * @param {Object} response
         * @return {Object} Data
         */
        parseRecords: function (resp, options) {
            if (Array.isArray(resp)) {
                // Allow resp to be a plain array.
                // Use case: To allow the use of nested models/collections without requiring
                // that each array is wrapped in a {data:array, totalRecords:int} object.
                this.totalRecords = resp.length;
                return resp;
            }

            return resp.data;
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.totalRecords
            };
        },
        // Save entire collection.
        save: function (params) {
            params = params || {};

            if (this.xhr) {
                this.xhr.abort();
            }

            var syncMethod = params.syncMethod || 'update';

            this.xhr = Backbone.sync(syncMethod, this, params);

            return this.xhr;
        },

        /**
         * Fetch 1 model by id from collection if exists, else from server.
         *
         * Inspired by Stackoverflow.
         *
         * @see http://stackoverflow.com/questions/6262444/get-collection-id-in-backbone-without-loading-the-entire-collection
         * @return Model
         */
        fetchOne: function (id, params) {
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

        serializeData: function () {
            return this.models.map(serializer.serializeData);
        },

        /**
         * Extend sync with events.
         */
        sync: sync.events(Paginator.extend({mode: 'server' | 'infinite'}).prototype.sync),

        // #Deprecated!
        /**
         * Refresh data collection.
         *
         */
        refresh: function(params, options) {
            options = options || {};

            if (params) {
                switch (true) {
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
    });
});
