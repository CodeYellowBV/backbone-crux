import Backbone from 'backbone';

// Insert global `window` and `document`,
// so it can pretend this is executed in a browser.
require('jsdom-global')();

// This can only happen after jsdom is initialized.
Backbone.$ = require('jquery')(window);
