// # Sync helper
//
// ### _Sync helper to add extra events to Backbone.sync._
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
    'use strict';

    return {
        // Add events to sync.
        events: function (parent) {
            return function (method, model, options) {
                var xhr = null,

                // Shorthand function for triggering events.
                trigger = function (triggerStr) {
                    if (model.trigger) {
                        if(triggerStr.match(/success/)) { //DIRTY HACK - Pass along data from XHR if it was successful *RickDG
                            model.trigger(triggerStr,arguments[1]);
                        } else {
                            model.trigger(triggerStr);
                        }
                    }
                },

                // Name of the flag to keep track of requests.
                flag = 'inSync' + method.charAt(0).toUpperCase() + method.slice(1);

                // Set flag.
                model[flag] = true;

                // Trigger 'before' event.
                trigger('before:' + method);

                // Call parent.
                xhr = parent.call(this, method, model, options);

                // Trigger 'after' event. If xhr exists, then request is in progress.
                // Otherwise something failed and cleanup.
                if (xhr) {
                    xhr.done(function (data, textStatus, jqXhr) {
                        model[flag] = false;
                        trigger('after:' + method + ':success', data, textStatus, jqXhr);
                    });

                    xhr.fail(function (jqXhr, textStatus, errorThrown) {
                        model[flag] = false;
                        trigger('after:' + method + ':error', jqXhr, textStatus, errorThrown);
                    });

                    xhr.always(function () {
                        model[flag] = false;
                        trigger('after:' + method);
                    });
                } else {
                    // Set flag.
                    model[flag] = false;
                    trigger('after:' + method);
                }

                return xhr;
            };
        }
    };
});
