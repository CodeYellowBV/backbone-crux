// Crux model.
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(['backbone', 'marionette', 'underscore', 'helper/type.of'], function(Backbone, Marionette, _, type) {
    return Backbone.Model.extend({
        _isFetching: false,
        /**
         * Returns true if attributes == defaults (excluding id).
         * 
         * @return bool True if empty
         */
        isEmpty: function() {
            return !_.isEqual(this.defaults, this.toJSON());
        },
        fetch: function(options) {
            var that = this,
            
            // Set data after succes.
            clearIsFetching = function(response) {
                that._isFetching = false;
                that.trigger('after:fetch');
            };

            options = options || {};
            
            this._isFetching = true;
            this.trigger('before:fetch');

            // Add success handler.
            switch (type.of(options.success)) {
                case 'function':
                    options.success = _.wrap(options.success, function(func, model, resp, options){
                        clearIsFetching();
                        func(model, resp, options);
                    });
                    break;
                case 'array':
                    options.success.push(clearIsFetching);
                    break;
                default:
                    options.success = clearIsFetching;
                    break;
            }

            // Add error handler.
            switch (type.of(options.error)) {
                case 'function':
                    options.error = _.wrap(options.error, function(func, model, resp, options){
                        clearIsFetching();
                        func(model, resp, options);
                    });
                    break;
                case 'array':
                    options.error.push(success);
                    break;
                default:
                    options.error = clearIsFetching;
                    break;
            }

            return Backbone.Model.prototype.fetch.call(this, options);
        },
        isFetching: function() {
            return this._isFetching;
        }
    });
});
