// Crux model.
//
// Add default functionality.
// 
// http://www.codeyellow.nl
//
// April 2013, AB Zainuddin
define(['marionette', 'cocktail', 'underscore'], function(Marionette, Cocktail, _) {

    // Overwrite getTemplate to accomodate loadingTemplate.
    Marionette.View.prototype.getTemplate = (function(getTemplate){
        return function(options) {
            switch(true) {
                // Check if model is loading and if there is a loadingTemplate.
                case this.model && this.model.isFetching && _.isFunction(this.model.isFetching) && this.model.isFetching() && Marionette.getOption(this, "loadingTemplate") != 'undefined':
                    return Marionette.getOption(this, "loadingTemplate");
                    break;
                default:
                    return getTemplate.call(this, options);    
                    break;
            }
        }
    })(Marionette.View.prototype.getTemplate);

    // Overwrite getTemplate to accomodate loadingTemplate.
    Marionette.AppRouter.prototype.route = (function(route){
        return function(options) {
            switch(true) {
                // Check if model is loading and if there is a loadingTemplate.
                case this.model && this.model.isFetching && _.isFunction(this.model.isFetching) && this.model.isFetching() && Marionette.getOption(this, "loadingTemplate") != 'undefined':
                    return Marionette.getOption(this, "loadingTemplate");
                    break;
                default:
                    return getTemplate.call(this, options);    
                    break;
            }
        }
    })(Marionette.View.prototype.getTemplate);

    return Marionette;



    // return Backbone.View.extend({
//         initialize: function(options){
// //            if(type.of(window.views) == 'undefined') {
// //                window.views = [];
// //            }
// //            
// //            window.views.push(this);
//             this.subviews = [];
            
//             Backbone.View.prototype.initialize.call(this, options);
            
// //            console.log('created ' + this.cid);
//         },
//         /**
//          * Assign target $el where render should occure. Useful for subviews.
//          * 
//          * @link http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/
//          */
//         assign: function(selector) {
//             var $el = null;

//             if (type.of(selector) == 'string') {
//                 $el = this.$(selector);
//             } else {
//                 $el = selector;
//             }

//             this.setElement($el);
            
//             return this;
//         },
//         remove: function() {
//             this.trigger('beforeRemove ' + this.cid);
            
//             this.removeSubviews();
//             this.undelegateEvents();

//             this.$el.removeData().unbind(); 

//             Backbone.View.prototype.remove.call(this);
//         },
//         subview: function() {
//             var subviews = this.subviews; 
            
//             _.each(arguments, function(subview){
//                 subviews.push(subview);   
// //                console.log('added subview ' + subview.cid);
//             });
//         },
//         removeSubviews: function() {
//             _.each(this.subviews, function(subview) {
//                 subview.remove();
//             });
            
//             this.subviews.length = 0;
//         },
//         countSubviews: function() {
//             var count = 0;
            
//             _.each(this.subviews, function(subview) {
//                count += subview.countSubviews();
               
//             });
            
//             count += this.subviews.length;
            
//             return count;
//         },
//         renderSubviews: function() {
//             _.each(this.subviews, function(subview) {
//                 subview.render();
//              });
//         }
        
        
    
    // });
});