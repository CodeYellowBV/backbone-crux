import Marionette from 'marionette';
import serializer from '../helper/serializer';

// Override serializeData to use .serializeData instead of .toJSON
Marionette.CompositeView.prototype.serializeData = function () {
    let data;
    if (this.model) {
        data = serializer.serializeData(this.model);
    } else {
        data = {};
    }
    return data;
};

export {};
