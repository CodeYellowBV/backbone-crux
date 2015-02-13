// # Collection
//
// ### _An extended Backbone.requestPager with commonly used functions._
//
// Based on [Backbone.Paginator](https://github.com/backbone-paginator/backbone.paginator) to add
// commonly used functions/properties:
//
// 1. Collection attributes
//
//  These attributes are by default send with each fetch.
//
// 2. Sync override
//
//  To add extra before:method and after:method events.
//
// 3. Sensible defaults for requestPager settings.
//
//  Such as using Backbone.Collections' url for paginatore_core.url.
//
// ___
//
// **Author:** AB Zainuddin
//
// **Email:** burhan@codeyellow.nl
//
// **Website:** http://www.codeyellow.nl
//
// **Copyright** Copyright (c) 2013 Code Yellow B.V.
//
// **License:** Distributed under MIT license.
// ___
define(function (require) {
    'use strict';
    // Load modules.
    var Backbone = require('backbone'),
    Paginator = require('backbone.paginator'),
    sync = require('./helper/sync'),
    serializer = require('./helper/serializer'),
    $ = require('jquery'),
    _ = require('underscore');

    return Paginator.extend({
        // TODO [Kees]: read in the upgrade docs this is necessary, not sure though
        mode: 'server' | 'infinite',
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

            // Config Paginator.
            this.paginator_core = $.extend(
                true,
                {
                    type: 'GET',
                    dataType: 'json',
                    // Proxy Backbone.Collection url.
                    url: this.url
                },
                options.paginator_core || {},
                this.paginator_core || {}
            );

            this.paginator_ui = $.extend(
                true, {
                    firstPage: 0,
                    currentPage: 0,
                    perPage: 20,
                    totalPages: 10
                },
                this.paginator_ui || {},
                options.paginator_ui || {}
            );

            this.server_api = $.extend(
                true, {
                    'limit': function() {
                        return this.perPage;
                    },
                    'offset': function() {
                        return this.currentPage * this.perPage;
                    }
                },
                this.server_api || {},
                options.server_api || {}
            );

            // Make sure everything is of correct type.
            this.paginator_ui.firstPage = parseInt(this.paginator_ui.firstPage, 10);
            this.paginator_ui.currentPage = parseInt(this.paginator_ui.currentPage, 10);
            this.paginator_ui.perPage = parseInt(this.paginator_ui.perPage, 10);
            this.paginator_ui.totalPages = parseInt(this.paginator_ui.totalPages, 10);

            // Calculate pager info on success.
            this.on('after:read', this.info, this);

            // Holds collection attributes. This will be added as data to each fetch.
            this.attributes = new Backbone.Model($.extend(true, {}, this.attributes, options.attributes || {}));

            // Call parent.
            Paginator.extend({mode: 'server' | 'infinite'}).prototype.initialize.call(this, models, options);
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
        // parse: function (response) {
        //     if (Array.isArray(response)) {
        //         // Allow response to be a plain array.
        //         // Use case: To allow the use of nested models/collections without requiring
        //         // that each array is wrapped in a {data:array, totalRecords:int} object.
        //         this.totalRecords = response.length;
        //         return response;
        //     }
        //     this.totalRecords = response.totalRecords;
        //     return response.data;
        // },
        parseRecords: function (resp, options) {
            return resp.data;
        },
        parseState: function (resp, queryParams, state, options) {
            return {
                totalRecords: resp.totalRecords
            };
        },
        // Save entire collection.
        save: function (params) {
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
