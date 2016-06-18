import Marionette from 'backbone.marionette';
import _ from 'underscore';

/**
 * Binds plugins.
 *
 * @param  {Marionette.View|Marionette.Bahavior} view The view or behavior to bind the plugins to.
 */
function unbind(view) {
    if (view.plugins) {
        _.each(view.plugins, function (plugin, name) {
            if (!plugin.unbind) {
                throw new Error(`You added a plugin ${name} without an unbind function. Please specify how to unbind the plugin!`);
            }

            if (plugin.isBound) {
                plugin.unbind.call(this);
                plugin.isBound = false;
            }
        }.bind(view));
    }
}
/**
 * Unbind plugins
 *
 * @param  {Marionette.View|Marionette.Bahavior} view The view or behavior to bind the plugins to.
 */
function bind(view) {
    _.each(view.plugins, (plugin) => {
        plugin.bind.call(view);
        plugin.isBound = true;
    });
}

function render(parent) {
    return function () {
        const result = null;

        // Unbind all bound plugins.
        unbind(this);
        _.each(this._behaviors, (behavior) => {
            unbind(behavior);
        });

        // Render view.
        parent.call(this);

        // (Re)bind all plugins.
        bind(this);
        _.each(this._behaviors, (behavior) => {
            bind(behavior);
        });

        return result;
    };
}

function destroy(parent) {
    return function () {
        const result = null;

        unbind(this);
        _.each(this._behaviors, (behavior) => {
            unbind(behavior);
        });

        parent.call(this);

        return result;
    };
}

Marionette.ItemView.prototype.plugins = null;
Marionette.CollectionView.prototype.plugins = null;

/**
 * Overwrite render + destroy to enable binding of plugins. This will also
 * bind behaviors if you define plugins on them.
 *
 * Example:
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
Marionette.ItemView.prototype.render = ((parent) =>
    render(parent)
)(Marionette.ItemView.prototype.render);

Marionette.ItemView.prototype.destroy = ((parent) =>
    destroy(parent)
)(Marionette.ItemView.prototype.destroy);

Marionette.CollectionView.prototype.render = ((parent) =>
    render(parent)
)(Marionette.CollectionView.prototype.render);

Marionette.CollectionView.prototype.destroy = ((parent) =>
    destroy(parent)
)(Marionette.CollectionView.prototype.destroy);

Marionette.CompositeView.prototype.render = ((parent) =>
    render(parent)
)(Marionette.CompositeView.prototype.render);

Marionette.CompositeView.prototype.destroy = ((parent) =>
    destroy(parent)
)(Marionette.CompositeView.prototype.destroy);
