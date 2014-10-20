'use strict';

module.exports = function(config) {
  var grunt = require('grunt');

  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine'],

    //Files
    files: [
      //Helper
      'demo/assets/util.js',

      //Lib
      'dist/followelement.js',

      //Tests
      'test/spec/*.js'
    ],

    reporters: ['dots', 'saucelabs'],
    port: 9876,

    htmlReporter: {
      outputDir: 'test/html/ci'
    },

    sauceLabs: {
      testName: 'Follow Element - tests',
      recordScreenshots: false
    },

    captureTimeout: 120000,
    browserDisconnectTimeout: 10000,
    browserNoActivityTimeout: 30000,
    singleRun: true
  });
};
