/**
 * Add default functionality such as sync all changes except ones defined in
 * modifyExcluded.
 */
define(['backbone', 'cocktail'], function(Backbone) {
    return Backbone.Model.extend({
        /**
         * Do not sync attributes defined in modifyExcluded.
         */
        modifyExcluded: ['id', 'created_at', 'updated_at'],
        initialize: function() {
            // Sync all changes (excluding ones defined in modifyExcluded.
            this.on('change', this.modify);
        },
        /**
         * Save all modifications except ones definded in modifyExcluded and
         * properties that are '_unpurified'.
         */
        modify: function() {
            var diff = _.difference(_.keys(this.changedAttributes()), this.modifyExcluded);
            var remaining = [];

            // Remove all _unpurified.
            _.each(diff, function(val) {
                val.indexOf('_unpurified') == -1 && remaining.push(val);
            });

            console.log('remaining:', remaining);

            if (remaining.length > 0) {
                this.save();
            }
        }
    });
});