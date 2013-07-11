// # Marionette getTemplate patch.
//
// ###_Extend ._
//
// Depends on helper/sync. When included, Marionette.View.getTemplate will be patched with extra features:
//
//  If loadingTemlate is definded and model is currently loading, then loadingTemplate is rendered instead of template. 
//
//  If loadingTemlateCollectio is definded and collection is currently loading, then loadingTemplateCollection is rendered instead of template. 
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
define(function(require) {
    var Marionette = require('marionette'),
    _ = require('underscore');

    // Overwrite getTemplate to show loadingTemplate && loadingTemplateCollection during fetch.
    Marionette.View.prototype.getTemplate = (function (parent){
        return function (options) {
            // Check if model is loading.
            var isModelFetching = !_.isUndefined(this.model) && this.model.inSyncRead,
            // Check if collecion is loading.
            isCollectionFetching = !_.isUndefined(this.collection) && this.collection.inSyncRead,
            // Check if there is a loadingTemplate.
            loadingTemplate = Marionette.getOption(this, 'loadingTemplate'),
            // Check if there is a loadingTemplateCollection.
            loadingTemplateCollection = Marionette.getOption(this, 'loadingTemplateCollection');

            switch(true) {
                // Model is loading and there is a loadingTemplate.
                case isModelFetching && !_.isUndefined(loadingTemplate):
                    return loadingTemplate;

                // Collection is loading and there is a loadingTemplateCollection.
                case isCollectionFetching && !_.isUndefined(loadingTemplateCollection):
                    return loadingTemplateCollection;

                // None of the above, default to Marionette.
                default:
                    return parent.call(this, options);
            }
        };
    }) (Marionette.View.prototype.getTemplate);
});