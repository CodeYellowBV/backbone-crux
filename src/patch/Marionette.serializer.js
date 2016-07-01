import Marionette from 'backbone.marionette';
import serializer from '../helper/serializer';

// Override serializeData to use .toHuman instead of .toJSON
// Note that this disables the default behavior of Marionette where
// a collection gets serialized as `items`.
function serializeData() {
    let data;
    if (this.model) {
        data = serializer.toHuman(this.model);
    } else {
        data = {};
    }

    return data;
}

Marionette.ItemView.prototype.serializeData = serializeData;
Marionette.CompositeView.prototype.serializeData = serializeData;
