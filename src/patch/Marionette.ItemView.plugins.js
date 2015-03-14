define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        _ = require('underscore');

    Marionette.ItemView.prototype.plugins = null;

    /**
     * Overwrite render + destroy to enable binding of plugins. Example:
     *
     * plugins: {
     *     mask: {
     *         bind: function () {
     *              this.ui.input.mask('9999-99');
     *         },
     *         unbind: function () {
     *             this.ui.input.unmask();
     *         }
     *     }
     * }
     */
    Marionette.ItemView.prototype.render = (function (parent) {
        return function () {
            var result = null;

            parent.call(this);

            if (this.plugins) {
                _.each(this.plugins, function (plugin, name) {
                    if (!plugin.isBound) {
                        if (!plugin.unbind) {
                            throw new Error('You added a plugin ' + name + ' without an unbind function. Please specify how to unbind the plugin!');
                        }

                        plugin.bind.call(this);
                        plugin.isBound = true;
                    }
                }.bind(this));
            }

            return result;
        };
    }) (Marionette.ItemView.prototype.render);

    Marionette.ItemView.prototype.destroy = (function (parent) {
        return function () {
            var result = null;

            if (this.plugins) {
                _.each(this.plugins, function (plugin) {
                    if (plugin.isBound) {
                        plugin.unbind.call(this);
                        plugin.isBound = false;
                    }
                }.bind(this));
            }

            parent.call(this);

            return result;
        };
    }) (Marionette.ItemView.prototype.destroy);
});
