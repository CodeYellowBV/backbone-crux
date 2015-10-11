define(function(require) {
    'use strict';

    var Wreqr = require('backbone.wreqr'),
        _ = require('underscore');

    return Wreqr.EventAggregator.extend({
        trigger: function () {
            var triggerable = true;

            // Call beforeTrigger.
            if(_.isFunction(this.beforeTrigger)) {
                triggerable = this.beforeTrigger.apply(this, arguments) !== false;
            }

            // Check triggerable.
            if(triggerable) {
                Wreqr.EventAggregator.prototype.trigger.apply(this, arguments);
            }
        }
    });
});
