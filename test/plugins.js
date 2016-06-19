import test from 'ava';
import _ from 'underscore';
import Marionette from 'backbone.marionette';
import '../dist/backbone-crux';

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

    t.context.app.content.show(view);
    t.is(view.$el.text(), 'Bind!');

    t.context.app.content.empty();
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
