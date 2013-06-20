// Crux model.
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(function(require) {
    var Marionette = require('marionette'),
    _ = require('underscore');

    // Overwrite getTemplate to show loadingTemplate && loadingTemplateCollection during fetch.
    Marionette.View.prototype.getTemplate = (function(parent){
        return function(options) {
            // Check if model is loading.
            var isModelFetching = !_.isUndefined(this.model) && this.model.isFetching && _.isFunction(this.model.isFetching) && this.model.isFetching(),
            // Check if collecion is loading.
            isCollectionFetching = !_.isUndefined(this.collection) && this.collection.isFetching && _.isFunction(this.collection.isFetching) && this.collection.isFetching(),
            // Check if there is a loadingTemplate.
            loadingTemplate = Marionette.getOption(this, 'loadingTemplate'),
            // Check if there is a loadingTemplateCollection.
            loadingTemplateCollection = Marionette.getOption(this, 'loadingTemplateCollection');

            switch(true) {
                // Model is loading and there is a loadingTemplate.
                case isModelFetching && !_.isUndefined(loadingTemplate):
                    return loadingTemplate;

                // Collection is loading and there is a loadingTemplateCollection.
                case isCollectionFetching && !_.isUndefined(loadingTemplateCollection):
                    return loadingTemplateCollection;

                // None of the above, default to Marionette.
                default:
                    return parent.call(this, options);
            }
        }
    })(Marionette.View.prototype.getTemplate);

    // Overwrite route to trigger before and after route.
    Marionette.AppRouter.prototype.route = (function(parent){
        return function(route, methodName, callback) {
            parent.call(this, route, methodName, _.wrap(callback, function(callback){
                var routable = true;

                if(_.isFunction(this.beforeRoute)) {
                    routable = this.beforeRoute(route, methodName) !== false;
                }

                if(routable) {
                    callback.apply(this, [].splice.call(arguments,1));  
                }
            }));
        }
    })(Marionette.AppRouter.prototype.route);
});