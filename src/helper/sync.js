/**
 * Sync helper to add extra events to Backbone.sync
 */
export default {
    events(parent) {
        const sync = this;

        return function (method, model, options) {
            let xhr = null;

            // Name of the flag to keep track of requests.
            const flag = `inSync${method.charAt(0).toUpperCase()}${method.slice(1)}`;

            model[flag] = true;

            sync.before(model, method);

            xhr = parent.call(this, method, model, options);

            // Trigger 'after' event. If xhr exists, then request is in progress.
            // Otherwise something failed and cleanup.
            if (xhr) {
                xhr.done(sync.done(model, method, flag));
                xhr.fail(sync.fail(model, method, flag));
                xhr.always(sync.always(model, method, flag));
            } else {
                model[flag] = false;
                sync.trigger(model, `after:${method}`);
            }

            return xhr;
        };
    },
    trigger(model, ...args) {
        if (model.trigger) {
            model.trigger.apply(model, args);
        }
    },
    before(model, method) {
        this.trigger(model, `before:${method}`);
    },
    done(model, method, flag) {
        const sync = this;

        return function (data, textStatus, jqXhr) {
            model[flag] = false;
            sync.trigger(model, `after:${method}:success`, data, textStatus, jqXhr);
        };
    },
    fail(model, method, flag) {
        const sync = this;

        return function (jqXhr, textStatus, errorThrown) {
            model[flag] = false;
            sync.trigger(model, `after:${method}:error`, jqXhr, textStatus, errorThrown);
        };
    },
    always(model, method, flag) {
        const sync = this;

        return function () {
            model[flag] = false;
            sync.trigger(model, `after:${method}`);
        };
    },
};
