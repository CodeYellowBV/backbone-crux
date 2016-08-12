# backbone-crux

[![Build Status](https://travis-ci.org/CodeYellowBV/backbone-crux.svg?branch=master)](https://travis-ci.org/CodeYellowBV/backbone-crux)

An opinionated library with simple, but unmissable additions to Backbone, Backbone.Paginator, backbone.stickit and Marionette.

At Code Yellow, we’ve been relying on these additions for over two years.

```
$ npm install backbone-crux --save
```

## Usage

### Model

This section describes what functionality is added to the `Backbone.Model`.

#### parse {ignore: true || ['keys', 'to', 'be', 'ignored']}

Extended parse to add a new feature: ignore. If `options.ignore = true`, the parse function returns an empty object and effectively ignores the server response. This can be useful when you use patch where you simply want to set an attribute and not let the server result influence other attributes. If you supply an array, those keys will be omitted from the response before parsing.

#### isEmpty

`isEmpty` checks whether a model is still in the original, default, state, and thuss practically empty. An example:

```js
import { Model } from 'backbone-crux';

const Bar = Model.extend({
    defaults() {
        return {
            id: null,
            type: 'foo',
        }
    }
});

const bar = new Bar();
bar.isEmpty(); // true
bar.set('type', 'bar');
bar.isEmpty(); // false
```

#### toJSON

`toJSON` is modified to recursively flatten everything. This means that if you nest a model in a model, and then call `model.save()`, `toJSON` is also called for the nested model.

#### toHuman

`toHuman` will recursively flatten everything, like `toJSON`. `Marionette.View` automatically uses `toHuman` and adds it to your template.

#### fromHuman

`fromHuman` can be used in a view to parse data from a human readable format to a server readable format. By default it does the exact same as `set`, but you can override it in your model.

### Collection

This section describes what functionality is added to the `Backbone.Collection`.

#### Paginator

The collection is always extended from [backbone.paginator](https://github.com/backbone-paginator/backbone.paginator), and automatically parses API responses to fit into the collection.

The following format is expected from the API:

```json
{
    "data": [{}, {}],
    "totalRecords": 2,
}
```

`totalRecords` should contain all records that were found (so not only the records that are in `data`!).

#### attributes

The collection has a model, called `attributes` in it. This model represents the data that will be added to each request.

```js
import { Collection } from 'backbone-crux';

const collection = new Collection(null, {
    uri: 'api/example'
    attributes: {
        foo: 'bar',
    },
});

collection.fetch();
```

This will result in a fetch to `api/example?foo=bar`. Because the attributes are a model, it is very easy to listen to state changes and e.g. update a filter.

To add an attribute, you can do: `collection.attributes.set('lorem', 'ipsum')`. All new fetches will then use `api/example?foo=bar&lorem=ipsum`.

#### fetchData

By default, a fetch is done with data from the `attributes` model. It is possible to override this, and enforce that only specific attributes are used:

```js
import { Collection } from 'backbone-crux';

export default Collection.extend({
    fetchData() {
        return _.omit(this.attributes, 'foo');
    },
});
```

#### xhr

A XHR request for a fetch will be stored in `collection.xhr`. This allows you to e.g. easily abort a request when a view gets destroyed.

### Stickit UI bindings with Marionette

Marionette has the nifty `@ui` syntax to refer to html elements, but stickit 
does not. With backbone-crux, the `@ui` syntax is automatically enabled for stickit bindings.

Example:

```js
export default Marionette.ItemView.extend({
    ui: {
        title: '._title',
    },
    onRender() {
        this.stickit();
    },
    bindings: {
        '@ui.title': 'title',
    },
});
```

### XHR events

For every XHR request a model or collection does, a couple of events will be fired. The name of these events has the method in it (`create`, `read`, `update`, or `delete`).

The event `before:<method>` is fired just before the XHR request takes place. After the XHR request, `after:<method>` will be fired. Depending on the outcome of the request, `after:<method>:success` and `after:<method>:error` will be fired.

An example of how you can use this:

```js
export default Marionette.ItemView.extend({
    modelEvents: {
        'after:read:success': 'onAfterReadSuccess',
    },
    onAfterReadSuccess() {
        console.log('Look ma, I’m done fetching!');
    }
});
```

### Marionette plugins

Using external plugins can be quite a pain with Marionette. The `onRender` method can get very messy fast. Also, forgetting to destroy plugins can lead to small memory leaks. Marionette plugins aims to fix these problems. An example:

```js
export default Marionette.ItemView.extend({
    ui: {
        input: '._input',
    },
    plugins: {
        mask: {
            bind() {
                this.ui.input.mask('9999-99');
            },
            unbind() {
                this.ui.input.unmask();
            },
        },
    },
});
```

`bind` is called when rendering a view. `unbind` is called when a view gets destroyed.

You can also define plugins as a function:
```js
export default Marionette.ItemView.extend({
    ui: {
        input: '._input',
    },
    plugins() {
        return {
            mask: {
                bind() {
                    this.ui.input.mask('9999-99');
                },
                unbind() {
                    this.ui.input.unmask();
                },
            },
        };
    },
});
```

## Development

To run the tests (and also lint the source files), run:

```
npm test
```

## Legal

Distributed under ISC license.
