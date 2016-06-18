# backbone-crux

Simple but unmissable additions to Backbone, Backbone.Paginator and Marionette. These include adding extra events to sync and sensible default for Backbone.Paginator.

# Running tests

To run the tests (and also lint the source files), run:

```
npm test
```

# Model

This section describes what functionality is added to the Backbone.Model.

## parse {ignore: true || ['keys', 'to', 'be', 'ignored']}

Extended parse to add a new feature: ignore. If `options.igore = true`, the parse function returns an empty object and effectively ignores the server response. This can be useful when you use patch where you simply want to set an attribute and not let the server result influence other attributes. If you supply an array, those keys will be omitted from the response before parsing.

# patch

## Backbone.View.stickit.addBinding.js

Marionette has the nifty `@ui` syntax to refer to html elements, but stickit 
does not. This patch enables the `ui@` syntax for stickit bindings.

# Legal

Distributed under ISC license.
