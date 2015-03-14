define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        _ = require('underscore');

    Marionette.ItemView.prototype._plugins = null;

    Marionette.ItemView.prototype.addPlugin = function (bind, unbind) {       
        if (!unbind) {
            throw new Error('You added a plugin without an unbind function. Please specify how to unbind the plugin!');
        }

        this._plugins.push({
            bind: bind,
            unbind: unbind,
            isBound: false
        });
    };

    /**
     * Overwrite render + destroy to enable binding of plugins. Example:
     *
     * bindPlugins: function () {
     *     this.ui.input.mask('9999-99');
     * }
     *
     * unbindPlugins: function () {
     *     // Make sure input was masked before unmasking.
     *     if (this.ui.input.unmask) {
     *         this.ui.input.unmask();
     *     }
     * }
     * 
     */
    Marionette.ItemView.prototype.render = (function (parent) {
        return function () {
            var result = null;

            parent.call(this);

            if (!this._plugins && this.bindPlugins) {
                this._plugins = [];
                this.bindPlugins();
                this._pluginsBound = true;
            }

            _.each(this._plugins, function (plugin) {
                if (!plugin.isBound) {
                    plugin.bind.call(this);
                    plugin.isBound = true;
                }
            }.bind(this));

            return result;
        };
    }) (Marionette.ItemView.prototype.render);

    Marionette.ItemView.prototype.destroy = (function (parent) {
        return function () {
            var result = null;

            _.each(this._plugins, function (plugin, index) {
                if (plugin.isBound) {
                    plugin.unbind.call(this);
                    plugin.isBound = false;
                }
            }.bind(this));

            this._plugins = null;

            parent.call(this);

            return result;
        };
    }) (Marionette.ItemView.prototype.destroy);
});
