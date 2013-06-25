// Crux model.
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(function(require) {
    var Backbone = require('backbone');

    return {
        events: function(parent){
            return function(method, model, options) {
                var xhr = null, 
                flag = 'inSync' + method.charAt(0).toUpperCase() + method.slice(1);

                model[flag] = true;

                model.trigger && model.trigger('before:' + method);

                xhr = parent.call(this, method, model, options);

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
                    model[flag] = false;
                    model.trigger && model.trigger('after:' + method);
                }

                return xhr;
            }
        }
    };
});