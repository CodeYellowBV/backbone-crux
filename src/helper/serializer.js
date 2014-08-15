define(function() {
    'use strict';
    /**
     * Convert an object to a flat object that could be serialized to JSON
     * without any helper functions.
     * Values are recursively serialized.
     */
    function serializerFactory(serializeMethodName) {
        return function serialize(value) {
            if (!value)
                return value;

            if (typeof value[serializeMethodName] == 'function')
                return value[serializeMethodName]();

            if (Array.isArray(value))
                return value.map(serialize);

            if (typeof value == 'object') {
                var copy = {};
                Object.keys(value).forEach(function(key) {
                    copy[key] = serialize(value[key]);
                });
                return copy;
            }
            return value;
        };
    }
    return {
        toJSON: serializerFactory('toJSON'),
        serializeData: serializerFactory('serializeData')
    };
});
