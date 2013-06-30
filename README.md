#backbone-crux

Simpel but unmissable additions to Backbone.


#Changelog

* = Breaking.

##1.0.0

* Breaking: Removed view.js.
- Added Jasmine.
- Added Grunt.


##0.1.0

- Removed before:fetch and after:fetch in favor of before:[method]. Method can be create, update, patch, delete and read (as in Backbone.sync). Find and replace all:

before:fetch with before:read
after:fetch with after:read