define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    /**
     * Overwrite render to enable select helper. Use as follows:
     *
     * <select value="<%-value%>">
     *     <option value="<%-value%>">This item will be selected.</option>
     * </select
     * 
     */
    Marionette.ItemView.prototype.bindUIElements = (function (parent) {
        return function () {
            var $selects = this.$('select[value]'),
                result = null;

            if (parent) {
                result = parent.call(this);
            }

            // If a select is given a value, then set that option to selected.
            if ($selects) {
                $selects.each(function (i, el) {
                    var $el = this.$(el);
                    $el.val($el.attr('value'));
                }.bind(this));
            }

            return result;
        };
    }) (Marionette.ItemView.prototype.bindUIElements);
});
