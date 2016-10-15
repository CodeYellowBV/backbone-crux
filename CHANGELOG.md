### 6.1.1
- Expose helper/sync to support custom sync handlers.
 
### 6.1.0
- Add support for defining plugins as a function.
 
### 6.0.0
- Previously the variable `items` in a template contained a serialized collection. This has been removed because it is better to use a `CollectionView` instead. If you really need it you can manually serialize it with one line of code.

### 5.0.0
- All files are now bundled and you should use `dist/backbone-crux.js`. Patches are applied automatically. To get the base collection or model, use `import { Collection } from 'backbone-crux'`.
- Converted source code to ES6.
- Fixed unit tests.
- Removed `<select value="x">`; use backbone.stickit.
- Removed `loadingTemplate` option for views; use [marionette-busy](https://www.npmjs.com/package/marionette-busy).
- Removed deprecated method `refresh` in collection.
- Removed method `fetchOne` in collection.
- Removed `save` method in collection.
- Removed `beforeTrigger` hack for events; use proper controllers instead.
- Removed hack to cancel route.

### 4.1.0
- Add array support for `ignore`.

### 4.0.1
- Added CompositeView.render patch to Marionette.plugins.

### 4.0.0
- [BREAKING] You now must define your own base model, that Crux extends. It should be called `crux-base-model`. This way you can use backbone-relation or another module as your base model.

### 3.0.0
- Removed `Model.dot()` and `Model.convertAttributes()`; this is moved to backbone-relation.

### 2.3.0
- Renamed patch/Marionette.ItemView.plugins.js to patch/Marionette.plugins.js.
- Added plugins to CollectionView.

### 2.2.5
- Added `Model.dot()`.

### 2.2.4
- Added the `ignore` option to `Model.parse()`.
- Moved from Grunt to Gulp.
- Updated tests / tasks.
- Removed `doc` folder.
- Fixed linting issues.

### 2.2.3
- Updated patch/Marionette.ItemView.plugins.js to also bind plugins for behaviors.

### 2.2.2
- Updated patch/Marionette.ItemView.plugins.js to handle multiple view rendering.

### 2.2.1
- Added missing toHuman serializer.

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


### 0.1.0

- Removed before:fetch and after:fetch in favor of before:[method]. Method can be create, update, patch, delete and read (as in Backbone.sync). Find and replace all:

before:fetch with before:read
after:fetch with after:read
