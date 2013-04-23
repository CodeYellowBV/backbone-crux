// Crux model.
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(['marionette', 'underscore'], function(Marionette, _) {

    // Overwrite getTemplate to accomodate loadingTemplate.
    Marionette.View.prototype.getTemplate = (function(parent){
        return function(options) {
            switch(true) {
                // Check if model is loading and if there is a loadingTemplate.
                case this.model && this.model.isFetching && _.isFunction(this.model.isFetching) && this.model.isFetching() && Marionette.getOption(this, "loadingTemplate") != 'undefined':
                    return Marionette.getOption(this, "loadingTemplate");
                    break;
                default:
                    return parent.call(this, options);    
                    break;
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