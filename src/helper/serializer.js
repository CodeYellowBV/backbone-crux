/**
 * Recursively convert an object to a flat object using a specified
 * serialization method name, with a fallback to .toJSON().
 */
function serializerFactory(serializeMethodName) {
    return function serialize(value) {
        if (!value) {
            return value;
        }

        if (typeof value[serializeMethodName] === 'function') {
            return value[serializeMethodName]();
        } else if (typeof value.toJSON === 'function') {
            return value.toJSON();
        }

        if (Array.isArray(value)) {
            return value.map(serialize);
        }

        if (typeof value === 'object') {
            const copy = {};
            Object.keys(value).forEach((key) => {
                copy[key] = serialize(value[key]);
            });
            return copy;
        }
        return value;
    };
}

export default {
    toJSON: serializerFactory('toJSON'),
    serializeData: serializerFactory('serializeData'),
    toHuman: serializerFactory('toHuman'),
};
