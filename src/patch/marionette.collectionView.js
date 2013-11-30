// #Marionette getTemplate patch.
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
define(function (require) {
    var Marionette = require('marionette'),
    _ = require('underscore');

    // Overwrite getTemplate to show loadingTemplate && loadingTemplateCollection during fetch.
    Marionette.CollectionView.prototype.buildItemView = (function (parent) {
        return function (item, ItemViewType, itemViewOptions) {
            // Don't take template from options if it's an emptyView and it has a template.
            if (ItemViewType == Marionette.getOption(this, 'emptyView') && new ItemViewType().template) {
                delete itemViewOptions.template;
            }

            return parent.call(this, item, ItemViewType, itemViewOptions);
        };
    }) (Marionette.CollectionView.prototype.buildItemView);
});