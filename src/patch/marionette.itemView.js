define(function (require) {
    'use strict';
    var Marionette = require('marionette'),
    serializer = require('../helper/serializer');

    // Override serializeData to use .serializeData instead of .toJSON
    // Tested with Marionette 1.8.7
    Marionette.ItemView.prototype.serializeData = function () {
        var data;
        if (this.model) {
            data = serializer.serializeData(this.model);
        } else if (this.collection) {
            return { items: serializer.serializeData(this.collection) };
        } else {
            data = {};
        }
        return data;
    };

    // Overwrite render to enable helpers.
    Marionette.ItemView.prototype.render = (function (parent) {
        return function () {
            var result = parent.call(this),
                $selects = this.$('select[value]');

            // If a select is given a value, then set that option to selected.
            if ($selects) {
                $selects.each(function (i, el) {
                    var $el = this.$(el);
                    $el.val($el.attr('value'));
                }.bind(this));
            }

            return result;
        };
    }) (Marionette.ItemView.prototype.render);
});
