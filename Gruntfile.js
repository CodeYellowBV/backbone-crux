module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            testing: {
                files: 'test/spec/*.js',
                tasks: ['exec']  
            },
            linting: {
                files: '*.js',
                tasks: ['jshint']
            }
        },
        exec: {
            jasmine: {
                command: 'phantomjs components/phantom/examples/run-jasmine.js http://localhost/backbone-crux/test'
            }
        },
        jshint: {
            all: {
                src: ['*.js', 'test/**/*.js']
            },
            options: {
                globals: {
                    require: true
                },
                ignores: [],
                onecase: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', 'watch');
};