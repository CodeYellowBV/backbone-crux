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
export default {
    // Add events to sync.
    events(parent) {
        return function (method, model, options) {
            let xhr = null;

            // Shorthand function for triggering events.
            const trigger = function (triggerStr, ...args) {
                if (model.trigger) {
                    if (triggerStr.match(/success/)) { // DIRTY HACK - Pass along data from XHR if it was successful *RickDG
                        model.trigger(triggerStr, args[0]);
                    } else {
                        model.trigger(triggerStr);
                    }
                }
            };

            // Name of the flag to keep track of requests.
            const flag = `inSync${method.charAt(0).toUpperCase()}${method.slice(1)}`;

            // Set flag.
            model[flag] = true;

            // Trigger 'before' event.
            trigger(`before:${method}`);

            // Call parent.
            xhr = parent.call(this, method, model, options);

            // Trigger 'after' event. If xhr exists, then request is in progress.
            // Otherwise something failed and cleanup.
            if (xhr) {
                xhr.done((data, textStatus, jqXhr) => {
                    model[flag] = false;
                    trigger(`after:${method}:success`, data, textStatus, jqXhr);
                });

                xhr.fail((jqXhr, textStatus, errorThrown) => {
                    model[flag] = false;
                    trigger(`after:${method}:error`, jqXhr, textStatus, errorThrown);
                });

                xhr.always(() => {
                    model[flag] = false;
                    trigger(`after:${method}`);
                });
            } else {
                // Set flag.
                model[flag] = false;
                trigger(`after:${method}`);
            }

            return xhr;
        };
    },
};
