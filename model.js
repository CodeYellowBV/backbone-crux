// Crux model.
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(function(require) {
    var Backbone = require('backbone'),
    sync = require('./helper/sync'),
    _ = require('underscore');

    // Model with default functionality.
    return Backbone.Model.extend({
        // Returns true if attributes == defaults (excluding id).
        isEmpty: function() {
            return !_.isEqual(this.defaults, this.toJSON());
        },
        fetch: function(options) {
            this.xhr = Backbone.Model.prototype.fetch.call(this, options);

            return this.xhr;
        },
        sync: sync.events(Backbone.Model.prototype.sync)
    });
});