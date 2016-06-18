define(function (require) {
    'use strict';
    var Marionette = require('marionette'),
        serializer = require('../helper/serializer');

    // Override serializeData to use .serializeData instead of .toJSON
    // Tested with Marionette 1.8.7
    Marionette.ItemView.prototype.serializeData = function () {
        var data;
        if (this.model) {
            data = serializer.serializeData(this.model);
        } else if (this.collection) {
            return { items: serializer.serializeData(this.collection) };
        } else {
            data = {};
        }
        return data;
    };
});
