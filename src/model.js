// # Model
//
// ### _An extended Backbone.Model with commonly used functions._
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
    sync = require('./helper/sync'),
    _ = require('underscore');

    /**
     * Convert an object to a flat object that could be serialized to JSON
     * without any helper functions.
     * Values are recursively serialized.
     */
    function toJSON(value) {
        if (!value)
            return value;

        if (typeof value.toJSON == 'function')
            return value.toJSON();

        if (Array.isArray(value))
            return value.map(toJSON);

        if (typeof value == 'object') {
            var copy = {};
            for (var key in value) {
                copy[key] = toJSON(value[key]);
            }
            return copy;
        }
        return value;
    }

    // Model with default functionality.
    return Backbone.Model.extend({
        // Keep track of latest collections' xhr. This will be overridden with each new request.
        xhr: null,
        /**
         * Returns true if attributes == defaults (excluding id).
         *
         * @return {Boolean} True if attributes == defaults, false otherwise
         */
        isEmpty: function () {
            return !_.isEqual(_.result(this, 'defaults'), this.toJSON());
        },
        /**
         * Saves xhr on fetch.
         *
         * @see Backbone.Model.fetch
         * @param {Object} options
         */
        fetch: function (options) {
            this.xhr = Backbone.Model.prototype.fetch.call(this, options);

            return this.xhr;
        },

        /**
         * Returns a plain object that represents the model's attributes.
         * Object values are recursively converted to JSON.
         */
        toJSON: function () {
            return toJSON(this.attributes);
        },
        /**
         * Extend sync with events.
         */
        sync: sync.events(Backbone.Model.prototype.sync)
    });
});
