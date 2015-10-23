'use strict';

module.exports = function(config) {

  //Set configs
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine'],

    //Files
    files: [
      //Helper
      'test/helpers/util.js',

      //Lib
      'dist/followelement.js',

      //Tests
      'test/spec/*.js'
    ],

    runnerPort: 9876,
    browsers: ['PhantomJS', 'Chrome', 'Firefox'],
    reporters: ['dots'],



    colors: true
  });

};
