import Backbone from 'backbone';
import BaseModel from 'crux-base-model';
import sync from './helper/sync';
import serializer from './helper/serializer';
import _ from 'underscore';
const _isPrototypeOf = Object.prototype.isPrototypeOf;

function isInstanceOf(Constructor, instance) {
    // Detects:
    // - instance = Object.create(Constructor.prototype)
    // - instance = new Constructor
    // - instance = Constructor.extend()  (Backbone-style)
    if (_isPrototypeOf.call(Constructor.prototype, instance) ||
        instance instanceof Constructor ||
        Constructor.__super__ && _isPrototypeOf.call(Constructor.__super__, instance)) {
        return true;
    }
    return false;
}

/**
 * @param {Model} Model - The model for the attribute hash
 * @param {object} attrs - The JSON-ified attribute hash of the model.
 * @return {boolean} true if the JSON representation of the input is a subset
 *   of the model's default attributes. Nested models and collections are
 *   recursively processed.
 */
function isEmpty(Model, attrs) {
    // jshint eqnull: true
    if (!attrs) {
        return true;
    }
    // Create a default model, without invoking any constructor.
    const defaultModel = Object.create(Model.prototype);
    // Could contain nested models
    const defaults = _.result(defaultModel, 'defaults') || {};
    // Only compare keys that are set.
    const defaultKeys = Object.keys(defaults).filter((key) =>
        // Omit "undefined" as well because it disappears when JSON-serialized.
        _.has(attrs, key) && attrs[key] !== undefined
    );
    const nonDefaultKeys = _.difference(Object.keys(attrs), defaultKeys);
    if (nonDefaultKeys.length > 0) {
        for (let i = 0; i < nonDefaultKeys.length; ++i) {
            if (attrs[nonDefaultKeys[i]] != null) {
                // At least one of the non-default keys is not void,
                // so assume that the model is not empty.
                return false;
            }
        }
    }
    // Nested models have been flattened.
    const flattenedDefaults = serializer.toJSON(defaults);
    // Check for the remaining keys whether the value is "empty".
    return _.every(defaultKeys, (key) => {
        const attrValue = attrs[key];
        const defaultValue = flattenedDefaults[key];
        const modelValue = defaults[key];
        if (attrValue == null && defaultValue == null) {
            // Both of them are null or undefined
            return true;
        }
        // Collection
        if (isInstanceOf(Backbone.Collection, modelValue)) {
            if (!modelValue.length && _.isEmpty(attrValue)) {
                // Empty collection.
                return true;
            }
            const ModelType = modelValue.prototype.model;
            if (!ModelType || !attrValue) {
                // Not a model, or attrValue is 0, false or ''.
                return false;
            }
            // Every value must either be a falsey value, or empty according
            // to the model definition.
            // The following assumes that the default collection is empty.
            // TODO: What if the default collection has some values?
            return attrValue.every((modelAttrs) =>
                isEmpty(ModelType, modelAttrs)
            );
        }
        // If the attribute default value is a model, use the model's rules
        // to check whether the attribute is empty.
        if (isInstanceOf(Model, modelValue)) {
            if (_.isEmpty(attrValue) && typeof modelValue.isEmpty == 'function' && modelValue.isEmpty()) {
                return true;
            }
            return isEmpty(modelValue.constructor, attrValue);
        }
        return _.isEqual(defaultValue, attrValue);
    });
}

// Model with default functionality.
export default BaseModel.extend({
    // Keep track of latest collections' xhr. This will be overridden with each new request.
    xhr: null,

    /**
     * @return {boolean} whether the model is empty.
     */
    isEmpty() {
        return isEmpty(this.constructor, serializer.toJSON(this.attributes));
    },

    /**
     * Saves xhr on fetch.
     *
     * @see Model.fetch
     * @param {Object} options
     */
    fetch(options) {
        this.xhr = BaseModel.prototype.fetch.call(this, options);

        return this.xhr;
    },

    /**
     * Extended parse to add a new feature: ignore. If options.igore = true,
     * the parse function returns an emtpy object and effectively
     * ignores the server response. This can be usefull when you use
     * patch where you simply want to set an attribute and not let the
     * server result influence other attributes.
     */
    parse(response, options) {
        if (options && options.ignore) {
            if (Array.isArray(options.ignore)) {
                return _.omit(response, options.ignore);
            }

            return {};
        }
        return BaseModel.prototype.parse.call(this, response, options);
    },

    /**
     * Returns a plain object that represents the model's attributes.
     * Object values are recursively converted to JSON.
     * This method SHOULD be used to generate data that can directly be sent
     * to the server with the .save() method.
     */
    toJSON() {
        return serializer.toJSON(this.attributes);
    },

    serializeData() {
        return this.toHuman();
    },

    /**
     * Return a plain object that represents the model's attributes,
     * All values are recursively flattened using the the serializeData method.
     * This method SHOULD be used to create a flat object that is used to feed
     * templates. Models should never be null'd by this method, so that templates
     * can refer to the model's attributes without worrying whether the model
     * exists or not.
     */
    toHuman() {
        return serializer.serializeData(this.attributes);
    },
    fromHuman(key, val, options) {
        return this.set(key, val, options);
    },

    /**
     * Extend sync with events.
     */
    sync: sync.events(BaseModel.prototype.sync),
}, {
    /**
     * @see #isEmpty
     **/
    isEmpty(attrs) {
        if (attrs instanceof this) {
            return attrs.isEmpty();
        } else if (!attrs) {
            return true;
        }
        const model = Object.create(this.prototype);
        model.constructor = this;
        model.attributes = attrs;
        return model.isEmpty();
    },
});
