#backbone-crux 

Simpel but unmissable additions to Backbone, Backbone.Paginator and Marionette. These include adding extra events to sync and sensible default for Backbone.Paginator.


##Changelog

###1.1.0

- Wreqr now returns class instead of instance.

###1.1.0

- [BREAKING] Removed marionette.extensions in favor of patch dir.
- [BREAKING] Moved to src/ dir.
- Added comments.
- Added wreqr.


###1.0.0

- [BREAKING] Removed view.js.
- Added Jasmine.
- Added Grunt.


###0.1.0

- Removed before:fetch and after:fetch in favor of before:[method]. Method can be create, update, patch, delete and read (as in Backbone.sync). Find and replace all:

before:fetch with before:read
after:fetch with after:read


#Legal

Distributed under MIT license.