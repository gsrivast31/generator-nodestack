'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 3000;
var path = require('path');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    client: 'public',
    temp: '.tmp',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: true
      }, 
      livereload: {
        options: {
          livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
        },
        files: [
          '<%%= yeoman.client %>/*.html',
          '{<%%= yeoman.temp %>,<%%= yeoman.client %>}/styles/{,*/}*.css',
          '{<%%= yeoman.temp %>,<%%= yeoman.client %>}/scripts/{,*/}*.js',
          '<%%= yeoman.client %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
          '<%%= yeoman.client %>/templates/*.{handlebars}',
          'test/spec/**/*.js'
        ]
      },
      handlebars: {
        files: [
          '<%%= yeoman.client %>/templates/*.handlebars'
        ],
        tasks: ['handlebars']
      },
      test: {
        files: ['<%%= yeoman.client %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
        tasks: ['test:true']
      }
    },
    express: {
      options: {
        port: SERVER_PORT,
        hostname: '*'
      },
      livereload: {
        options: {
          livereload: true,
          server: 'app.js',
          bases: ['<%%= yeoman.temp %>', path.resolve(__dirname, '<%%= yeoman.app %>')]
        }
      },
      test: {
        options: {
          server: 'app.js',
          bases: ['<%%= yeoman.temp %>', path.resolve(__dirname, 'test')]
        }
      },
      dist: {
        options: {
          server: 'app.js',
          bases: path.resolve(__dirname, '<%= yeoman.dist %>')
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:3000'
      }
    },
    bower: {
      install: {
        options: {
          targetDir: '<%%= yeoman.client %>/requires',
          layout: 'byComponent'
        }
      }
    },
    clean: {
      dist: ['<%%= yeoman.temp %>', '<%%= yeoman.dist %>/*'],
      server: '<%%= yeoman.temp %>'
    },<% if (includeBrowserify) { %>
    browserify: {
      vendor: {
        src: ['<%%= yeoman.client %>/requires/**/*.js'],
        dest: '<%%= yeoman.temp %>/scripts/vendor.js',
        options: {
          transform: ['browserify-shim']
        }
      },
      app: {
        files: {
          '<%%= yeoman.temp %>/scripts/app.js': ['<%%= yeoman.client %>/scripts/main.js']
        },
        options: {
          transform: ['hbsfy'],
          external: ['jquery', 'underscore', 'backbone']
        }
      }
    },<% } %>
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%%= yeoman.app %>/**/*.js',
        '<%%= yeoman.client %>/src/**/*.js'
      ],
      test: [
        'test/spec/**/*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.client %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%%= yeoman.dist %>/images'
        }]
      }
    },
    less: {
      transpile: {
        files: {
          '<%%= yeoman.temp %>/styles/<%= pkg.name %>.css': [
            '<%%= yeoman.client %>/styles/less/main.less'
          ]
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%%= yeoman.dist %>/styles/<%= pkg.name %>.css': [
            '<%%= yeoman.temp %>/styles/{,*/}*.css',
            '<%%= yeoman.client %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.client %>',
          src: '*.html',
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: 'JST'
        },
        files: {
          '<%%= yeoman.temp %>/scripts/templates.js': ['<%%= yeoman.client %>/templates/*.handlebars']
        }
      }
    },
    concat: {
      '<%%= yeoman.temp %>/scripts/<%= pkg.name %>.js': [<%
        if (includeBrowserify) { %>
        '<%%= yeoman.temp %>/scripts/vendor.js', 
        '<%%= yeoman.temp %>/scripts/app.js',<%
        } else { %>
        '<%%= yeoman.client %>/scripts/**/*.js' <%
        } %>   
        '<%%= yeoman.temp %>/scripts/templates.js'
      ]
    },
    // Javascript minification.
    uglify: {
      compile: {
        options: {
          compress: true,
          verbose: true
        },
        files: [{
          src: '<%%= yeoman.temp %>/scripts/<%= pkg.name %>.js',
          dest: '<%%= yeoman.dist %>/scripts/<%= pkg.name %>.js'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.client %>',
          dest: '<%%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            'images/{,*/}*.{webp,gif}',
            'styles/fonts/{,*/}*.*'
          ]
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%%= yeoman.dist %>/styles/{,*/}*.css',
            '<%%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%%= yeoman.dist %>/styles/fonts/{,*/}*.*'
          ]
        }
      }
    }
  });

  grunt.registerTask('createDefaultTemplate', function () {
    grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve' + (target ? ':' + target : '')]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'express:dist', 'express-keepalive']);
    }
    if (target === 'test') {
      return grunt.task.run([
        'clean:server',
        'createDefaultTemplate',
        'handlebars',
        'express:test',
        'open',
        'watch'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'createDefaultTemplate',
      'handlebars',
      'express:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', function (isConnected) {
    isConnected = Boolean(isConnected);
    var testTasks = [
      'clean:server',
      'createDefaultTemplate',
      'handlebars',
      'express:test',
      'karma'
    ];

    if(!isConnected) {
      return grunt.task.run(testTasks);
    } else {
      // already connected so not going to connect again, remove the connect:test task
      testTasks.splice(testTasks.indexOf('express:test'), 1);
      return grunt.task.run(testTasks);
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'bower',
    'createDefaultTemplate',
    'handlebars',<% if (includeBrowserify) { %>
    'browserify:vendor',
    'browserify:app',<% } %>
    'less:transpile',
    'imagemin',
    'htmlmin',
    'cssmin',
    'concat',
    'uglify',
    'copy',
    'rev'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
