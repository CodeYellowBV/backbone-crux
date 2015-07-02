define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        Backbone = require('backbone');

    require('backbone.stickit');

    /**
     * Overwrite backbone.stickit addBinding so it acceps '@ui' selectors.
     */
    Backbone.View.prototype.addBinding = (function (parent) {
        return function (optionalModel, selector, binding) {
            if (typeof selector === 'object') {
                selector = this.normalizeUIKeys(selector);
            } else if (typeof selector === 'string') {
                selector = Marionette.normalizeUIString(selector, this.ui);
            }

            return parent.call(this, optionalModel, selector, binding);
        };
    }) (Backbone.View.prototype.addBinding);
});