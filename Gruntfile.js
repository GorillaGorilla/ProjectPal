/**
 * Created by GB115151 on 23/07/2016.
 */
module.exports = function(grunt) {
    grunt.initConfig({

        browserify: {
            'public/app.js': ['public/index.js']
        },
        watch: {
        files: [ "public/**/*.js","public/**/**/*.js","public/*.js"],
            tasks: [ 'browserify' ]
        },
        env: {
            dev: {
                NODE_ENV: 'development'
            },
            test: {
                NODE_ENV: 'test'
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    ext: 'js,html',
                    watch: ['server.js', 'config/**/*.js', 'app/**/*.js']
                }
            }
        },
        mochaTest: {
            src: 'app/tests/**/*.js',
            options: {
                reporter: 'spec'
            }
        },
        jshint: {
            all: {
                src: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js', 'public/modules/**/*.js']
            }
        },
        csslint: {
            all: {
                src: 'public/modules/**/*.css'
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {logConcurrentOutput: true}
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['env:dev', 'lint', "concurrent"]);
    grunt.registerTask('test', ['env:test', 'mochaTest']);
    grunt.registerTask('lint', ['csslint']);
};