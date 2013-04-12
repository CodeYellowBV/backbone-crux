/**
 * Add default functionality such as saving an entire collection.
 */
define(['backbone', 'helper/type.of', 'cocktail'], function(Backbone, type) {
    return Backbone.Router.extend({
        initialize: function(options) {
            if (type.of(options) == 'undefined') {
                options = {};
            }

            options = $.extend(true, {
                attributes: {}
            }, options);

            /**
             * Holds collection attributes. This will be added as data to each
             * fetch.
             */
            this.attributes = new Backbone.Model(options.attributes);

            // Call parent.
            Backbone.Router.prototype.initialize.call(this, options);
        },
        removeViews: function() {
            _.each(this.views, function(view) {
                view.remove();
                console.log('$$$$$$$$$$ removed');
            });
            
            this.views.length = 0;
            return this;
        },
    });
});