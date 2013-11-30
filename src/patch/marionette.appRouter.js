// # Marionette AppRouter patch.
//
// ### _Ability to cancel route._
//
// Depends on helper/sync. When included, Marionette.View.getTemplate will be patched with extra features:
//
//  If loadingTemlate is definded and model is currently loading, then loadingTemplate is rendered instead of template. 
//
//  If loadingTemlateCollectio is definded and collection is currently loading, then loadingTemplateCollection is rendered instead of template. 
//
// ___
//
// **Author:** AB Zainuddin
//
// **Email:** burhan@codeyellow.nl
//
// **Website:** http://www.codeyellow.nl
//
// **Copyright:** Copyright (c) 2013 Code Yellow B.V.
//
// **License:** Distributed under MIT license.
// ___
define(function (require) {
    var Marionette = require('marionette'),
    _ = require('underscore');

    // Overwrite route to trigger before and after route.
    Marionette.AppRouter.prototype.route = (function (parent) {
        return function(route, methodName, callback) {
            parent.call(this, route, methodName, _.wrap(callback, function (callback) {
                var routable = true;

                // Call beforeRoute if exists.
                if (_.isFunction(this.beforeRoute)) {
                    routable = this.beforeRoute(route, methodName) !== false;
                }

                // Only route if routable.
                if (routable) {
                    callback.apply(this, [].splice.call(arguments,1));  
                }
            }));
        };
    }) (Marionette.AppRouter.prototype.route);
});