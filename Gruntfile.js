module.exports = function(grunt) {
  var jade = require('jade');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n"
      },
      dist: {
        src: [
          'src/_intro.js',
          'src/main.js',
          'src/_outro.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    karma: {

      sl_windows_7_ie : { configFile : 'test/karma/saucelabs/windows.7.ie.js' },
      sl_windows_8_ie : { configFile : 'test/karma/saucelabs/windows.8.ie.js' },
      sl_firefox : { configFile : 'test/karma/saucelabs/firefox.js' },
      sl_safari : { configFile : 'test/karma/saucelabs/safari.js' },
      sl_ios : { configFile : 'test/karma/saucelabs/ios.js' },
      sl_android : { configFile : 'test/karma/saucelabs/android.js' },
      sl_chrome: { configFile : 'test/karma/saucelabs/chrome.js' },

      unit: {
        configFile: 'karma.conf.js',
        browsers: ['PhantomJS'],
        singleRun: true
      },

      dev: {
        configFile: 'karma.conf.js',
        singleRun: false
      }
    },

    wiredep: {
      defaultBower: {
        src: [
          'demo/*.html',
          'test/*.jade'
        ]
      }
    },

    jsdoc : {
        dist : {
            src: ['src/main.js', 'test/*.js'],
            options: {
                destination: 'docs'
            }
        }
    },

    jshint: {
      files: ['dist/followelement.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      test: {
        files: ['Gruntfile.js', '<%= concat.dist.src %>', 'test/**/*.js'],
        tasks: ['test-dev']
      },

      compile: {
        files: ['Gruntfile.js', '<%= concat.dist.src %>'],
        tasks: ['compile']
      }
    }

  });

  //Load tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-wiredep');

  //Generate doc
  grunt.registerTask('docs', ['jsdoc']);

  //Compile
  grunt.registerTask('compile', ['concat', 'jshint', 'uglify']);

  //Bower install
  grunt.registerTask('bower', ['wiredep']);

  //Create a index of tests
  grunt.registerTask('tests-index', 'Create a simple index of tests', function () {
    var testsDirMapping = {
          ci: [],
          dev: []
        },
        html;

    //Parse html folder
    grunt.file.recurse('test/html', function (abspath, rootdir, subdir, filename) {
      var type,
          browser;

      subdir = subdir.split('/');

      //Type of test(CI or DEV)
      type = subdir[0];

      //Browser
      browser = subdir[1];

      testsDirMapping[type].push(browser);
    });

    //Run get bower_assets
    grunt.task.run('wiredep:defaultBower');

    html = jade.renderFile('test/_jade_template.jade', {
      testsDirMapping: testsDirMapping
    });

    grunt.file.write('test/index.html', html);
  });

  grunt.registerTask('test-saucelabs', [
    'karma:sl_windows_7_ie',
    'karma:sl_windows_8_ie',
    'karma:sl_firefox',
    'karma:sl_safari',
    'karma:sl_chrome',
    'karma:sl_ios',
    'karma:sl_android'
  ]);

  //Tests tasks
  var testSubTasks = ['compile'];

  if(typeof process.env.SAUCE_USERNAME  !== 'undefined'
  && typeof process.env.SAUCE_ACCESS_KEY !== 'undefined') {
    testSubTasks.push('test-saucelabs');
  } else {
    testSubTasks.push('karma:unit');
  }

  testSubTasks.push('tests-index');

  grunt.registerTask('test', testSubTasks);
  grunt.registerTask('test-dev', ['compile', 'karma:unit', 'tests-index']);
  grunt.registerTask('test-ci', ['compile', 'test-saucelabs', 'tests-index']);

  //Build tasks
  grunt.registerTask('build-dev', ['test-dev', 'docs']);
  grunt.registerTask('build-prod', ['test-ci']);

  //Default
  grunt.registerTask('default', ['build-dev']);

};
