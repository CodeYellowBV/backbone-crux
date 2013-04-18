// Crux model.
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(['backbone', 'marionette', 'helper/type.of'], function(Backbone, Marionette, type) {
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
                    options.success = [options.success, clearIsFetching];
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
                    options.error = [options.error, clearIsFetching];
                    break;
                case 'array':
                    options.error.push(success);
                    break;
                default:
                    options.error = clearIsFetching;
                    break;
            }

            Backbone.Model.prototype.fetch.call(this, options);
        },
        isFetching: function() {
            return this._isFetching;
        }


        // /**
        //  * Do not sync attributes defined in modifyExcluded.
        //  */
        // modifyExcluded: ['id', 'created_at', 'updated_at'],
        // initialize: function() {
        //     // Sync all changes (excluding ones defined in modifyExcluded.
        //     this.on('change', this.modify);
        // },
        // /**
        //  * Save all modifications except ones definded in modifyExcluded and
        //  * properties that are '_unpurified'.
        //  */
        // modify: function() {
        //     var diff = _.difference(_.keys(this.changedAttributes()), this.modifyExcluded);
        //     var remaining = [];

        //     // Remove all _unpurified.
        //     _.each(diff, function(val) {
        //         val.indexOf('_unpurified') == -1 && remaining.push(val);
        //     });

        //     console.log('remaining:', remaining);

        //     if (remaining.length > 0) {
        //         this.save();
        //     }
        // }
    });
});
