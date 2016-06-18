import Marionette from 'marionette';
import serializer from '../helper/serializer';

// Override serializeData to use .serializeData instead of .toJSON
Marionette.ItemView.prototype.serializeData = function () {
    let data;
    if (this.model) {
        data = serializer.serializeData(this.model);
    } else if (this.collection) {
        return { items: serializer.serializeData(this.collection) };
    } else {
        data = {};
    }
    return data;
};
