  var //Mutation Observer
      MutationObserver = root.MutationObserver || root.WebKitMutationObserver || root.MozMutationObserver,

      //Flag for cssObserverStarted
      cssObserverStarted,

      //All instances of followElement
      instances = [],

      //Utils
      util = {
        find: document.querySelector.bind(document),
        findAll: document.querySelectorAll.bind(document),
        forEach: Array.prototype.forEach,

        /* global Element */
        matches: function (selector) {
          var ElementPrototype = Element.prototype,

              elementMatches =
                ElementPrototype.matches ||
                ElementPrototype.matchesSelector ||
                ElementPrototype.mozMatchesSelector ||
                ElementPrototype.msMatchesSelector ||
                ElementPrototype.oMatchesSelector ||
                ElementPrototype.webkitMatchesSelector ||
                function (selector) {
                  var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;

                  while (nodes[++i] && nodes[i] != node) {}

                  return !!nodes[i];
                };

          return elementMatches.call(this, selector);
        }
      };

  /**
   * Follow Element constructor
   *
   * @param  {String} selector Element selector
   * @param  {Object|Function} selector Accepted an callback or object of options
   *
   * @return {followElement} it will be return a follow element instance
   */
  function followElement(selector, options) {
    var currentInstance = this;

    //If it is not calling with the "new" keyword
    if(!(currentInstance instanceof followElement)) {
      var o = Object.create(followElement.prototype);
      o.constructor.apply(o, arguments);
      return o;
    }

    this.selector = selector;
  }

  //FollowElement prototype
  followElement.prototype = {
    constructor: followElement,

    /**
     * with this method is possible to listen all
     * methods those are possible to be observed
     *
     * @param  {String}   event    Event that is necessary to be observed
     * @param  {Function} callback Function to call when this event is triggered
     *
     * @return {followElement} returns this current instance
     */
    connect: function (event, callback) {
      console.log(event, callback);
      return this;
    },

    /**
     * remove all observers
     *
     * @return {followElement} returns this current instance
     */
    disconnect: function () {
      console.log('disconnect');
      return this;
    },

    /**
     * Allows observing when the element of this instance is inserted on DOM.
     * When this element is inserted or the element has already been present on DOM,
     * the callback function will be called.
     *
     * @param  {Function} callback Function to call when this event is triggered
     * @param  {String|ElementNode} context The context to start the search for the element
     *
     * @return {followElement} returns this current instance
     */
    insert: function (callback, context) {
      console.log(callback, context);
      return this;
    },

    /**
     * Allows observing when the element of this instance is removed from DOM.
     * The callback function will be called when this element is removed.
     *
     * @param  {Function} callback  Function to call when this event is triggered
     * @param  {String|ElementNode} context The context to start the search for the element
     *
     * @return {followElement} returns this current instance
     */
    remove: function (callback, context) {
      console.log(callback, context);
      return this;
    },

    /**
     * Observe when an element is shown, that means, if it is not display: none,
     * has content, doesn't have content but has width and height..
     *
     * @param  {Function} callback Function to call when this event is triggered
     *
     * @return {followElement} returns this current instance
     */
    appear: function (callback) {
      console.log(callback);
      return this;
    },

    /**
     * Observe when an element is hidden, that means, if it is display: none,
     * hasn't content or width and height.
     *
     * @param  {Function} callback Function to call when this event is triggered
     *
     * @return {followElement} returns this current instance
     */
    disappear: function (callback) {
      console.log(callback);
      return this;
    },

    /**
     * Allows to pause all the current instance observers
     *
     * @return {followElement} returns this current instance
     */
    pause: function () {
      console.log('pause');
      return this;
    },

    /**
     * Allows to resume all the current instance observers
     *
     * @return {followElement} returns this current instance
     */
    resume: function () {
      console.log('resume');
      return this;
    },

    /**
     * Enable or disable the debug
     *
     * @return {followElement} returns this current instance
     */
    debug: function () {
      console.log('debug');
      return this;
    },

    /**
     * Set the main context to start the search for an element
     * It will be used when an element is inserted or removed
     *
     * @param  {String|ElementNode} context The context to start the search for the element
     *
     * @return {followElement} returns this current instance
     */
    setContext: function (context) {
      console.log(context);
      return this;
    }
  };

  /**
   * Simple signature for logs
   *
   * @param  {String} selector The selector
   * @param  {String} type     The type of this log, like appear or inserted
   * @param  {String} message  The message of this log
   * @return {String}          Returns a new formatted log string
   */
  function logSignature(selector, type, message) {
    return '##VisibilityObserver##\n\n'
         + 'Selector = ' + selector + '\n'
         + 'Action = ' + type + ' \n\n'
         + 'Message = '  + message;
  }

  // Version.
  followElement.version = '0.0.0';

  // Export to the root, which is probably `window`.
  root.followElement = followElement;
