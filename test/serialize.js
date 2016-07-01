import test from 'ava';
import _ from 'underscore';
import Marionette from 'backbone.marionette';
import { Model } from '../dist/backbone-crux';

test.beforeEach(t => {
    t.context.app = new Marionette.Application();
    t.context.app.start();
    document.body.innerHTML = '<div class="_content"></div>';
    t.context.app.addRegions({
        content: '._content',
    });

    const ModelA = Model.extend({
        toHuman() {
            const data = Model.prototype.toHuman.call(this);
            data.foo = 'baz';
            return data;
        },
    });
    t.context.model = new ModelA({
        id: 1,
        nested: new ModelA({ foo: 'bar' }),
    });
});

test('ItemView serializer should work', t => {
    const View = Marionette.ItemView.extend({
        template: _.template('<div class="hoi"><%-id%> <%-nested.foo%></div>'),
    });
    const view = new View({ model: t.context.model });
    t.context.app.content.show(view);
    t.is(view.$el.text(), '1 baz');
});

test('CompositeView serializer should work', t => {
    const View = Marionette.CompositeView.extend({
        template: _.template('<div class="hoi"><%-id%> <%-nested.foo%></div>'),
    });
    const view = new View({ model: t.context.model });
    t.context.app.content.show(view);
    t.is(view.$el.text(), '1 baz');
});

test('LayoutView serializer should work', t => {
    const View = Marionette.LayoutView.extend({
        template: _.template('<div class="hoi"><%-id%> <%-nested.foo%></div>'),
    });
    const view = new View({ model: t.context.model });
    t.context.app.content.show(view);
    t.is(view.$el.text(), '1 baz');
});
