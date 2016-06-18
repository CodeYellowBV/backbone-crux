import babel from 'rollup-plugin-babel';

export default {
    entry: './src/index.js',
    format: 'umd',
    dest: 'dist/backbone-crux.js',
    globals: {
        backbone: 'Backbone',
        'backbone.marionette': 'Marionette',
        underscore: '_',
        'crux-base-model': 'cruxBaseModel',
        'backbone.paginator': 'Backbone.PageableCollection',
        'backbone.stickit': 'Backbone.Stickit',
    },
    moduleId: 'backbone-crux',
    moduleName: 'backboneCrux',
    external: [
        'backbone',
        'backbone.marionette',
        'underscore',
        'crux-base-model',
        'backbone.paginator',
        'backbone.stickit',
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
            babelrc: false,
            presets: ['es2015-rollup'],
        }),
    ],
};
