/**
 * Sync helper to add extra events to Backbone.sync
 */
export default {
    events(parent) {
        return function (method, model, options) {
            let xhr = null;

            const trigger = function (triggerStr, ...args) {
                if (model.trigger) {
                    if (triggerStr.match(/success/)) {
                        model.trigger(triggerStr, args[0]);
                    } else {
                        model.trigger(triggerStr);
                    }
                }
            };

            // Name of the flag to keep track of requests.
            const flag = `inSync${method.charAt(0).toUpperCase()}${method.slice(1)}`;

            model[flag] = true;

            trigger(`before:${method}`);

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
                model[flag] = false;
                trigger(`after:${method}`);
            }

            return xhr;
        };
    },
};
