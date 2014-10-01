/*
  Visibility Observer library
 */
(function(root, undefined) {
  "use strict";

  function followElement(selector) {
    var currentInstance = this;

    if(!(currentInstance instanceof followElement)) {
      var o = Object.create(followElement.prototype);
      o.constructor.apply(o, arguments);
      return o;
    }

    this.selector = selector;
  }

  followElement.prototype = {
    constructor: followElement,

    connect: function (event, callback) {
      console.log(event, callback);
      return this;
    },

    disconnect: function () {
      console.log('disconnect');
    },

    insert: function (callback, context) {
      console.log(callback, context);
      return this;
    },

    remove: function (callback, context) {
      console.log(callback, context);
      return this;
    },

    appear: function (callback) {
      console.log(callback);
      return this;
    },

    disappear: function (callback) {
      console.log(callback);
      return this;
    },

    pause: function () {
      console.log('pause');
      return this;
    },

    resume: function () {
      console.log('resume');
      return this;
    },

    debug: function () {
      console.log('debug');
      return this;
    },

    setContext: function (context) {
      console.log(context);
      return this;
    }
  };

  // Version.
  followElement.version = '0.0.0';

  // Export to the root, which is probably `window`.
  root.followElement = followElement;

}(this));
