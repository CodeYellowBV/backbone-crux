# backbone-crux

Simple but unmissable additions to Backbone, Backbone.Paginator and Marionette. These include adding extra events to sync and sensible default for Backbone.Paginator.


## Changelog

### 2.2.0
- Added patch/Marionette.serializer.js to override the default serializer. 
- Removed patch/marionette.itemView.js.

### 2.1.0
- Renamed marionette.appRouter.js to Marionette.AppRouter.js and added getOption for beforeRoute.

### 2.0.11 + 2.0.12
- Refactored patch/Marionette.ItemView.selectValue.js so the value for selects will be available in onRender.

### 2.0.10
- Refactored patch/Marionette.ItemView.bindPlugins.js to patch/Marionette.ItemView.plugins.js.

### 2.0.9
- Refactored bindPlugins to plugins attribute.

### 2.0.8
- Added patch for ItemView to add bindPlugins and addPlugin. In bindPlugin you can bootstrap plugins which are bound once
  after render and unbound after destroy.

### 2.0.0
- Upgraded backbone.paginator to v2. Breaks all pagination support for the v1 branch. Pagination now works with page and per_page instead of limit/offset. The parse function is split into parseRecords and parseState.

### 1.2.4
- Added marionette.itemView patch for serializeData.

### 1.2.3
- Add serializeData method, should be used to serialize models for use in templates.

### 1.2.2
- isEmpty returns true if the attributes are a subset of the defaults, and
  allows nested models to be void or null.

### 1.2.1
- Bugfix: Invert logic of model.isEmpty. Previously, it did exactly the opposite of
  what was documented...
- Add static isEmpty method to Model that tells whether a given model or attribute
  hash is equal to the defaults of the model (subclass).

### 1.2.0
- Enhance toJSON to recursively JSONify the attributes (nested models in particular)

### 1.1.16
- Fix bower dependencies
- Bugfix: defaults may be a function.
- Feature: Collection accepts a plain array as well.

### 1.1.12

- Style fixes.

### 1.1.11

- Typechecking paginator ui.

### 1.1.10

- Added loadingCollectionTemplate alias for loadingTemplateCollection.

### 1.1.9

- Bugfix.

### 1.1.8

- Bugfix: copy/paste.

### 1.1.7

- Bugfix: rickDG quickfix.

### 1.1.6

- Bugfix: status flag not set.

### 1.1.5

- Paginator options.

### 1.1.4

- Wreqr bugfix.

### 1.1.0

- Wreqr now returns class instead of instance.

### 1.1.0

- [BREAKING] Removed marionette.extensions in favor of patch dir.
- [BREAKING] Moved to src/ dir.
- Added comments.
- Added wreqr.


### 1.0.0

- [BREAKING] Removed view.js.
- Added Jasmine.
- Added Grunt.


###0.1.0

- Removed before:fetch and after:fetch in favor of before:[method]. Method can be create, update, patch, delete and read (as in Backbone.sync). Find and replace all:

before:fetch with before:read
after:fetch with after:read


#Legal

Distributed under MIT license.
