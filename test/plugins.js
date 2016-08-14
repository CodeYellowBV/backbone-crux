import test from 'ava';
import _ from 'underscore';
import Marionette from 'backbone.marionette';
import '../dist/backbone-crux';
import sinon from 'sinon';

test.beforeEach(t => {
    t.context.app = new Marionette.Application();
    t.context.app.start();
    document.body.innerHTML = '<div class="_content"></div>';
    t.context.app.addRegions({
        content: '._content',
    });
});

function testView(t, viewType) {
    const View = Marionette[viewType].extend({
        template: _.template('<div class="eureka"></div>'),
        ui: {
            eureka: '.eureka',
        },
        plugins: {
            mask: {
                bind() {
                    this.ui.eureka.text('Bind!');
                },
                unbind() {
                    this.ui.eureka.text('Unbind!');
                },
            },
        },
    });
    const view = new View();
    const bindSpy = sinon.spy(view.plugins.mask, 'bind');
    const unbindSpy = sinon.spy(view.plugins.mask, 'unbind');

    t.context.app.content.show(view);
    t.true(bindSpy.calledOnce);
    t.false(unbindSpy.called);
    t.is(view.$el.text(), 'Bind!');

    t.context.app.content.empty();
    t.true(bindSpy.calledOnce);
    t.is(view.$el.text(), 'Unbind!');
}

test('plugin bind / unbind should work', t => {
    testView(t, 'ItemView');
    testView(t, 'LayoutView');
    testView(t, 'CompositeView');
});

test('multiple plugin bind / unbind should work', t => {
    const View = Marionette.ItemView.extend({
        template: _.template('<div class="eureka"></div><div class="foo"></div>'),
        ui: {
            eureka: '.eureka',
            foo: '.foo',
        },
        plugins: {
            mask: {
                bind() {
                    this.ui.eureka.text('BindA!');
                },
                unbind() {
                    this.ui.eureka.text('UnbindA!');
                },
            },
            abcd: {
                bind() {
                    this.ui.foo.text('BindB!');
                },
                unbind() {
                    this.ui.foo.text('UnbindB!');
                },
            },
        },
    });
    const view = new View();

    t.context.app.content.show(view);
    t.is(view.$el.text(), 'BindA!BindB!');

    t.context.app.content.empty();
    t.is(view.$el.text(), 'UnbindA!UnbindB!');
});

test('should work with behaviors', t => {
    const Foo = Marionette.Behavior.extend({
        ui: {
            eureka: '.eureka',
        },
        plugins: {
            mask: {
                bind() {
                    this.ui.eureka.text('Behavior!');
                },
                unbind() {
                    this.ui.eureka.text('Unbehavior!');
                },
            },
        },
    });
    const View = Marionette.ItemView.extend({
        template: _.template('<div class="eureka"></div>'),
        behaviors: {
            foo: {
                behaviorClass: Foo,
            },
        },
    });
    const view = new View();

    t.context.app.content.show(view);
    t.is(view.$el.text(), 'Behavior!');

    t.context.app.content.empty();
    t.is(view.$el.text(), 'Unbehavior!');
});


test('defining plugins as a function', t => {
    const View = Marionette.ItemView.extend({
        template: _.template('Initial text'),
        plugins() {
            return {
                mask: {
                    bind() {
                        this.$el.text('BindA!');
                    },
                    unbind() {
                        this.$el.text('UnbindA!');
                    },
                },
            };
        },
    });
    const view = new View();
    const spy = sinon.spy(view, 'plugins');

    t.context.app.content.show(view);
    t.true(spy.calledOnce);
    t.is(view.$el.text(), 'BindA!');

    t.context.app.content.empty();
    t.true(spy.calledOnce);
    t.is(view.$el.text(), 'UnbindA!');
});
