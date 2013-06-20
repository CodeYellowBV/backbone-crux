// Crux model.
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(['backbone', 'marionette', 'underscore'], function(Backbone, Marionette, _) {
    // Remember if model is fetching.
    var _isFetching = false;

    return Backbone.Model.extend({
        // Keep track of model' xhr.
        xhr: null,
        // Returns true if attributes == defaults (excluding id).
        isEmpty: function() {
            return !_.isEqual(this.defaults, this.toJSON());
        },
        fetch: function(options) {
            var that = this;
            
            _isFetching = true;
            this.trigger('before:fetch');

            this.xhr = Backbone.Model.prototype.fetch.call(this, options);

            if(this.xhr) {
                this.xhr.done(function(data, textStatus, jqXhr){
                    that.trigger('after:fetch:success', data, textStatus, jqXhr);
                });

                this.xhr.fail(function(jqXhr, textStatus, errorThrown){                    
                    that.trigger('after:fetch:error', jqXhr, textStatus, errorThrown);
                })

                this.xhr.always(function(){                    
                    _isFetching = false;
                    that.trigger('after:fetch');
                });
            }
        },
        isFetching: function() {
            return _isFetching;
        }
    });
});
