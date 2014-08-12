module.exports = function(grunt) {
    // All source files.
    var sourceFiles = [
        // Main folder.
        '*.js',

        // Tests.
        'test/**/*.js',

        // Src.
        'src/**/*.js'
    ];

    grunt.initConfig({
        watch: {
            quality: {
                files: sourceFiles,
                tasks: ['jshint', 'exec']
            }
        },
        exec: {
            jasmine: {
                command: 'phantomjs components/phantom/examples/run-jasmine.js ./test/index.html'
            },
            docker: {
                command: function() {
                    var cmd = 'docker -i src/ -o doc/ -x components,node_modules';

                    if(this.file.exists('README.md')) {
                        cmd = 'cp README.md src/README.md;' + cmd + ';rm src/README.md';
                    }

                    return cmd;
                }
            }
        },
        jshint: {
            all: {
                src: sourceFiles
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

    grunt.registerTask('default', ['jshint', 'exec', 'watch']);
};
