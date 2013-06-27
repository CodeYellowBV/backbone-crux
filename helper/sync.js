// Crux model.
//
// Sync helper to add extra events to Backbone.sync.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(function(require) {
    var Backbone = require('backbone');

    return {
        // Add events to sync.
        events: function(parent){
            return function(method, model, options) {                
                var xhr = null, 

                // Name of the flag to keep track of requests.
                flag = 'inSync' + method.charAt(0).toUpperCase() + method.slice(1);

                // Set flag.
                model[flag] = true;

                // Trigger 'before' event.
                model.trigger && model.trigger('before:' + method);

                // Call parent.
                xhr = parent.call(this, method, model, options);

                // Trigger 'after' event. If xhr exists, then request is in progress.
                // Otherwise something failed and cleanup.
                if(xhr) {
                    xhr.done(function(data, textStatus, jqXhr){
                        model.trigger && model.trigger('after:' + method + ':success', data, textStatus, jqXhr);
                    });

                    xhr.fail(function(jqXhr, textStatus, errorThrown){                    
                        model.trigger && model.trigger('after:' + method + ':error', jqXhr, textStatus, errorThrown);
                    })

                    xhr.always(function(){
                        model[flag] = false;
                        model.trigger && model.trigger('after:' + method);
                    });
                } else {
                    // Set flag.
                    model[flag] = false;
                    model.trigger && model.trigger('after:' + method);
                }

                return xhr;
            }
        }
    };
});