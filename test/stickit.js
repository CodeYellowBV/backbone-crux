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
});

test('Marionette UI bindings for backbone.stickit should work', t => {
    const model = new Model({ id: 2 });
    const View = Marionette.ItemView.extend({
        template: _.template('<div class="foo"></div>'),
        ui: {
            foo: '.foo',
        },
        onRender() {
            this.stickit();
        },
        bindings: {
            '@ui.foo': 'id',
        },
    });
    const view = new View({ model });

    t.context.app.content.show(view);
    t.is(view.$el.text(), '2');
});
