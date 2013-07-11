// # Wreqr
//
// ###_Extended Backbone.Wreqr with ability to cancel trigger._
//
// Most apps depend heavely on triggers. There are times where you would like
// to stop a trigger from happening. Here the handy beforeTrigger comes in.
// 
// If this is defined as a function, and it returns `false`, then that event won't
// be triggered.
//
// ___
//
// **Author:** AB Zainuddin
//
// **Email:** burhan@codeyellow.nl
//
// **Website:** http://www.codeyellow.nl
//
// **Copyright** Copyright (c) 2013 Code Yellow B.V.
//
// **License:** Distributed under MIT license.
// ___
define(function(require) {
    // Load modules.
    var Wreqr = require('backbone.wreqr'),
    _ = require('underscore');
    
    var Extended = Wreqr.EventAggregator.extend({
        trigger: function () {
            var triggerable = true;

            // Call beforeTrigger.
            if(_.isFunction(this.beforeTrigger)) {
                triggerable = this.beforeTrigger.apply(arguments) !== false;
            }

            // Check triggerable.
            if(triggerable) {
                Wreqr.EventAggregator.prototype.trigger.apply(this, arguments);
            }
        }
    });

    return new Extended();
});
