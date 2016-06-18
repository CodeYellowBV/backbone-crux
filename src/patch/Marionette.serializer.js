import Marionette from 'backbone.marionette';
import serializer from '../helper/serializer';

// Override serializeData to use .serializeData instead of .toJSON
Marionette.ItemView.prototype.serializeData = function () {
    let data;
    if (this.model) {
        data = serializer.toHuman(this.model);
    } else if (this.collection) {
        return { items: serializer.toHuman(this.collection) };
    } else {
        data = {};
    }

    return data;
};

// Override serializeData to use .serializeData instead of .toJSON
Marionette.CompositeView.prototype.serializeData = function () {
    let data;
    if (this.model) {
        data = serializer.toHuman(this.model);
    } else if (this.collection) {
        return { items: serializer.toHuman(this.collection) };
    } else {
        data = {};
    }

    return data;
};
