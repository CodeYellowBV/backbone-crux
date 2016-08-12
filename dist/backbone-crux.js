(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('backbone.marionette'), require('backbone'), require('backbone.stickit'), require('underscore'), require('backbone.paginator'), require('crux-base-model')) :
  typeof define === 'function' && define.amd ? define('backbone-crux', ['exports', 'backbone.marionette', 'backbone', 'backbone.stickit', 'underscore', 'backbone.paginator', 'crux-base-model'], factory) :
  (factory((global.backboneCrux = global.backboneCrux || {}),global.Marionette,global.Backbone,global.Backbone.Stickit,global._,global.Backbone.PageableCollection,global.cruxBaseModel));
}(this, function (exports,Marionette,Backbone,backbone_stickit,_,Paginator,BaseModel) { 'use strict';

  Marionette = 'default' in Marionette ? Marionette['default'] : Marionette;
  Backbone = 'default' in Backbone ? Backbone['default'] : Backbone;
  _ = 'default' in _ ? _['default'] : _;
  Paginator = 'default' in Paginator ? Paginator['default'] : Paginator;
  BaseModel = 'default' in BaseModel ? BaseModel['default'] : BaseModel;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  /**
   * Overwrite backbone.stickit addBinding so it acceps '@ui' selectors.
   */
  Backbone.View.prototype.addBinding = function (parent) {
      return function (optionalModel, selector, binding) {
          if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === 'object') {
              selector = this.normalizeUIKeys(selector);
          } else if (typeof selector === 'string') {
              selector = Marionette.normalizeUIString(selector, this.ui);
          }

          return parent.call(this, optionalModel, selector, binding);
      };
  }(Backbone.View.prototype.addBinding);

  /**
   * Build _plugins from plugins (notice the underscore prefix). The reset of the
   * code relies on the compiled _plugins variable instead of the plugins
   * definition.
   */
  function buildPluginsDefinition(parent) {
      return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
          }

          var result = parent.apply(this, args);

          this._plugins = _.result(this, 'plugins');

          return result;
      };
  }

  /**
   * Unbinds plugins.
   *
   * @param  {Marionette.View|Marionette.Bahavior} view The view or behavior to bind the plugins to.
   */
  function unbind(view) {
      if (view._plugins) {
          _.each(view._plugins, function (plugin, name) {
              if (!plugin.unbind) {
                  throw new Error('You added a plugin ' + name + ' without an unbind function. Please specify how to unbind the plugin!');
              }

              if (plugin.isBound) {
                  plugin.unbind.call(this);
                  plugin.isBound = false;
              }
          }.bind(view));
      }
  }
  /**
   * Bind plugins
   *
   * @param  {Marionette.View|Marionette.Bahavior} view The view or behavior to bind the plugins to.
   */
  function bind(view) {
      _.each(view._plugins, function (plugin) {
          plugin.bind.call(view);
          plugin.isBound = true;
      });
  }

  function render(parent) {
      return function () {
          var result = null;

          // Unbind all bound plugins.
          unbind(this);
          _.each(this._behaviors, function (behavior) {
              unbind(behavior);
          });

          // Render view.
          parent.call(this);

          // (Re)bind all plugins.
          bind(this);
          _.each(this._behaviors, function (behavior) {
              bind(behavior);
          });

          return result;
      };
  }

  function destroy(parent) {
      return function () {
          var result = null;

          unbind(this);
          _.each(this._behaviors, function (behavior) {
              unbind(behavior);
          });

          parent.call(this);

          return result;
      };
  }

  Marionette.ItemView.prototype.plugins = null;
  Marionette.CollectionView.prototype.plugins = null;

  /**
   * Overwrite render + destroy to enable binding of plugins. This will also
   * bind behaviors if you define plugins on them.
   *
   * Example:
   *
   * plugins: {
   *     mask: {
   *         bind: function () {
   *              this.ui.input.mask('9999-99');
   *         },
   *         unbind: function () {
   *             this.ui.input.unmask();
   *         }
   *     }
   * }
   */
  Marionette.View = Marionette.View.extend({
      constructor: buildPluginsDefinition(Marionette.View.prototype.constructor)
  });

  Marionette.Behavior = Marionette.Behavior.extend({
      constructor: buildPluginsDefinition(Marionette.Behavior.prototype.constructor)
  });

  Marionette.ItemView.prototype.render = function (parent) {
      return render(parent);
  }(Marionette.ItemView.prototype.render);

  Marionette.ItemView.prototype.destroy = function (parent) {
      return destroy(parent);
  }(Marionette.ItemView.prototype.destroy);

  Marionette.CollectionView.prototype.render = function (parent) {
      return render(parent);
  }(Marionette.CollectionView.prototype.render);

  Marionette.CollectionView.prototype.destroy = function (parent) {
      return destroy(parent);
  }(Marionette.CollectionView.prototype.destroy);

  Marionette.CompositeView.prototype.render = function (parent) {
      return render(parent);
  }(Marionette.CompositeView.prototype.render);

  Marionette.CompositeView.prototype.destroy = function (parent) {
      return destroy(parent);
  }(Marionette.CompositeView.prototype.destroy);

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

          if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
              var _ret = function () {
                  var copy = {};
                  Object.keys(value).forEach(function (key) {
                      copy[key] = serialize(value[key]);
                  });
                  return {
                      v: copy
                  };
              }();

              if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
          return value;
      };
  }

  var serializer = {
      toJSON: serializerFactory('toJSON'),
      serializeData: serializerFactory('serializeData'),
      toHuman: serializerFactory('toHuman')
  };

  // Override serializeData to use .toHuman instead of .toJSON
  // Note that this disables the default behavior of Marionette where
  // a collection gets serialized as `items`.
  function serializeData() {
      var data = void 0;
      if (this.model) {
          data = serializer.toHuman(this.model);
      } else {
          data = {};
      }

      return data;
  }

  Marionette.ItemView.prototype.serializeData = serializeData;
  Marionette.CompositeView.prototype.serializeData = serializeData;

  /**
   * Sync helper to add extra events to Backbone.sync
   */
  var sync = {
      events: function events(parent) {
          return function (method, model, options) {
              var xhr = null;

              var trigger = function trigger(triggerStr) {
                  if (model.trigger) {
                      if (triggerStr.match(/success/)) {
                          model.trigger(triggerStr, arguments.length <= 1 ? undefined : arguments[1]);
                      } else {
                          model.trigger(triggerStr);
                      }
                  }
              };

              // Name of the flag to keep track of requests.
              var flag = "inSync" + method.charAt(0).toUpperCase() + method.slice(1);

              model[flag] = true;

              trigger("before:" + method);

              xhr = parent.call(this, method, model, options);

              // Trigger 'after' event. If xhr exists, then request is in progress.
              // Otherwise something failed and cleanup.
              if (xhr) {
                  xhr.done(function (data, textStatus, jqXhr) {
                      model[flag] = false;
                      trigger("after:" + method + ":success", data, textStatus, jqXhr);
                  });

                  xhr.fail(function (jqXhr, textStatus, errorThrown) {
                      model[flag] = false;
                      trigger("after:" + method + ":error", jqXhr, textStatus, errorThrown);
                  });

                  xhr.always(function () {
                      model[flag] = false;
                      trigger("after:" + method);
                  });
              } else {
                  model[flag] = false;
                  trigger("after:" + method);
              }

              return xhr;
          };
      }
  };

  var collection = Paginator.extend({
      // Keep track of latest collections' xhr. This will be overridden with each new request.
      xhr: null,
      // You can define defaults for attributes here.
      attributes: {},
      /**
       * Initialize attributes and set configs.
       *
       * @param {Object} models Proxy to Paginator.initiliaze.
       * @param {Object} options If attributes key exists, then this is copied to attributes model.
       */
      initialize: function initialize(models, options) {
          options = options || {};

          // Holds collection attributes. This will be added as data to each fetch.
          this.attributes = new Backbone.Model(_.extend({}, this.attributes, options.attributes));

          // Call parent.
          return Paginator.prototype.initialize.call(this, models, options);
      },

      /**
       * Override default fetch to add attributes.
       *
       * @param {Object} options Proxy to Backbone.Collection.fetch
       * @return {Object|null} jqXHR or null on fail.
       */
      fetch: function fetch(options) {
          var defaults = {
              // Get data for fetch.
              data: this.fetchData()
          };

          this.xhr = Paginator.prototype.fetch.call(this, _.extend(defaults, options));

          return this.xhr;
      },

      /**
       * Extra data to send with each fetch. Defaults to attributes.
       *
       * @return {Object} Data
       */
      fetchData: function fetchData() {
          return this.attributes.toJSON();
      },

      /**
       * Save server totalRecords response. Expects response in this format:
       *
       * {
       *      data: [{
       *          {
       *              key1: value1,
       *              key2: value2,
       *          },
       *          {
       *              key1: value1,
       *              key2: value2,
       *          },
       *      }],
       *      totalRecords: 1234
       * }
       *
       * OR
       *
       * [{
       *     key1: value1,
       *     key2: value2,
       * }, { .. }, ... ]
       *
       * @param {Object} response
       * @return {Object} Data
       */
      parseRecords: function parseRecords(resp) {
          if (Array.isArray(resp)) {
              // Allow resp to be a plain array.
              // Use case: To allow the use of nested models/collections without requiring
              // that each array is wrapped in a {data:array, totalRecords:int} object.
              this.totalRecords = resp.length;
              return resp;
          }

          return resp.data;
      },
      parseState: function parseState(resp) {
          return {
              totalRecords: resp.totalRecords
          };
      },
      serializeData: function serializeData() {
          return this.models.map(serializer.serializeData);
      },

      /**
       * Extend sync with events.
       */
      sync: sync.events(Paginator.extend({ mode: 'server' | 'infinite' }).prototype.sync)
  });

  var _isPrototypeOf = Object.prototype.isPrototypeOf;

  function isInstanceOf(Constructor, instance) {
      // Detects:
      // - instance = Object.create(Constructor.prototype)
      // - instance = new Constructor
      // - instance = Constructor.extend()  (Backbone-style)
      if (_isPrototypeOf.call(Constructor.prototype, instance) || instance instanceof Constructor || Constructor.__super__ && _isPrototypeOf.call(Constructor.__super__, instance)) {
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
  function _isEmpty(Model, attrs) {
      // jshint eqnull: true
      if (!attrs) {
          return true;
      }
      // Create a default model, without invoking any constructor.
      var defaultModel = Object.create(Model.prototype);
      // Could contain nested models
      var defaults = _.result(defaultModel, 'defaults') || {};
      // Only compare keys that are set.
      var defaultKeys = Object.keys(defaults).filter(function (key) {
          return (
              // Omit "undefined" as well because it disappears when JSON-serialized.
              _.has(attrs, key) && attrs[key] !== undefined
          );
      });
      var nonDefaultKeys = _.difference(Object.keys(attrs), defaultKeys);
      if (nonDefaultKeys.length > 0) {
          for (var i = 0; i < nonDefaultKeys.length; ++i) {
              if (attrs[nonDefaultKeys[i]] != null) {
                  // At least one of the non-default keys is not void,
                  // so assume that the model is not empty.
                  return false;
              }
          }
      }
      // Nested models have been flattened.
      var flattenedDefaults = serializer.toJSON(defaults);
      // Check for the remaining keys whether the value is "empty".
      return _.every(defaultKeys, function (key) {
          var attrValue = attrs[key];
          var defaultValue = flattenedDefaults[key];
          var modelValue = defaults[key];
          if (attrValue == null && defaultValue == null) {
              // Both of them are null or undefined
              return true;
          }
          // Collection
          if (isInstanceOf(Backbone.Collection, modelValue)) {
              var _ret = function () {
                  if (!modelValue.length && _.isEmpty(attrValue)) {
                      // Empty collection.
                      return {
                          v: true
                      };
                  }
                  var ModelType = modelValue.prototype.model;
                  if (!ModelType || !attrValue) {
                      // Not a model, or attrValue is 0, false or ''.
                      return {
                          v: false
                      };
                  }
                  // Every value must either be a falsey value, or empty according
                  // to the model definition.
                  // The following assumes that the default collection is empty.
                  // TODO: What if the default collection has some values?
                  return {
                      v: attrValue.every(function (modelAttrs) {
                          return _isEmpty(ModelType, modelAttrs);
                      })
                  };
              }();

              if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
          // If the attribute default value is a model, use the model's rules
          // to check whether the attribute is empty.
          if (isInstanceOf(Model, modelValue)) {
              if (_.isEmpty(attrValue) && typeof modelValue.isEmpty === 'function' && modelValue.isEmpty()) {
                  return true;
              }
              return _isEmpty(modelValue.constructor, attrValue);
          }
          return _.isEqual(defaultValue, attrValue);
      });
  }

  // Model with default functionality.
  var model = BaseModel.extend({
      // Keep track of latest collections' xhr. This will be overridden with each new request.
      xhr: null,
      /**
       * @return {boolean} whether the model is empty.
       */
      isEmpty: function isEmpty() {
          return _isEmpty(this.constructor, serializer.toJSON(this.attributes));
      },

      /**
       * Saves xhr on fetch.
       *
       * @see Model.fetch
       * @param {Object} options
       */
      fetch: function fetch(options) {
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
      parse: function parse(response, options) {
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
      toJSON: function toJSON() {
          return serializer.toJSON(this.attributes);
      },
      serializeData: function serializeData() {
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
      toHuman: function toHuman() {
          return serializer.serializeData(this.attributes);
      },
      fromHuman: function fromHuman(key, val, options) {
          return this.set(key, val, options);
      },

      /**
       * Extend sync with events.
       */
      sync: sync.events(BaseModel.prototype.sync)
  }, {
      /**
       * @see #isEmpty
       **/
      isEmpty: function isEmpty(attrs) {
          if (attrs instanceof this) {
              return attrs.isEmpty();
          } else if (!attrs) {
              return true;
          }
          var model = Object.create(this.prototype);
          model.constructor = this;
          model.attributes = attrs;
          return model.isEmpty();
      }
  });

  exports.Collection = collection;
  exports.Model = model;

  Object.defineProperty(exports, '__esModule', { value: true });

}));