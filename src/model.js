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

    /**
     * Returns whether the given model or attribute set is equal to the defaults
     * of the given model.
     *
     * @param {Backbone.Model} Model - The Model class or any subclass.
     * @param {Backbone.Model|Object} attributes - Model or attribute hash
     * @return {boolean} true if the JSON representation of the input is equal to
     *   the model's default attributes.
     */
    function staticIsEmpty(Model, attrs) {
        if (attrs instanceof Model) {
            attrs = attrs.toJSON();
        } else {
            attrs = toJSON(attrs);
        }

        attrs = attrs || {};

        // Create a default model, bypassing any constructors.
        var model = Object.create(Model.prototype);
        model.attributes = _.result(model, 'defaults');
        var defaults = model.toJSON() || {};

        return _.isEqual(defaults, attrs);
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
            return staticIsEmpty(this.constructor, this);
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
    }, {
        /**
         * @see staticIsEmpty
         *
         * If you override the Model's toJSON method with crazy logic and you want re-use
         * that logic in this static method, override the static method with
         *
         *   if (attrs instanceof this) {
         *       return attrs.isEmpty();
         *   } else {
         *       var model = Object.create(this.prototype);
         *       model.attributes = attrs;
         *       return model.isEmpty();
         *   }
         **/
        isEmpty: function(attrs) {
            return staticIsEmpty(this, attrs);
        }
    });
});
