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
