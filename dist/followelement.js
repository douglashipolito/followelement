/*
  Visibility Observer library
 */
(function(root, undefined) {
  "use strict";

  var //Mutation Observer
      MutationObserver = root.MutationObserver || root.WebKitMutationObserver || root.MozMutationObserver,

      //Flag for cssObserverStarted
      cssObserverStarted,

      //All instances of followElement
      instances = [],

      //Utils
      util = {
        find: function (selector) {
         return document.querySelector(selector);
        },
        findAll: function (selector) {
          return document.querySelectorAll(selector);
        },
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
   * @param  {String|ElementNode} selector Element selector or element node
   * @param  {Object|Function} selector Accepted an callback or object of options
   *
   * @return {followElement} it will be return a follow element instance
   */
  function followElement(selector, options) {
    var currentInstance = this;

    //If it is not be calling with the "new" keyword
    if(!(currentInstance instanceof followElement)) {
      var o = Object.create(followElement.prototype);
      o.constructor.apply(o, arguments);
      return o;
    }

    instances.push(currentInstance);
    currentInstance.instanceIndex = instances.length - 1;
    currentInstance.selector = selector;
    currentInstance.element = [];
    currentInstance._debug = false;
    currentInstance.currentVisibility = 'unknown';

    currentInstance.events = {
      appear: {
        fn: null,
        count: 0,
        action: 'appeared'
      },
      disappear: {
        fn: null,
        count: 0,
        action: 'disappeared'
      },
      insert: {
        fn: null,
        count: 0,
        action: 'inserted'
      },
      remove: {
        fn: null,
        count: 0,
        action: 'removed'
      }
    };

    currentInstance.observer = getObserver.call(currentInstance, selector);

    //it will be treated as callback of appear observer if the second param is a function
    if(options && typeof options === 'function') {
      currentInstance.observer.observe('appear', options);
    }

    //Check if there are options
    if(Object.prototype.toString.call(options) === '[object Object]') {

      //Set debug option
      if(options.debug) {
        currentInstance._debug = options.debug;
      }

      //Set the context to find, Insert and Remove Observer
      if(options.context) {
        checkContext.call(currentInstance, options.context);
      }

      //Loop through events and attach all which have been defined
      util.forEach.call(Object.keys(currentInstance.events), function (eventKey) {
        if(typeof options[eventKey] === 'function') {
          currentInstance.observer.observe(eventKey, options[eventKey]);
        }
      });
    }
  }

  //FollowElement prototype
  followElement.prototype = {
    constructor: followElement,

    /**
     * with this method is possible to listen all
     * methods which are possible to be observed
     *
     * @param  {String}   event    Event it is necessary to be observed
     * @param  {Function} callback Function to call when this event is triggered
     *
     * @return {followElement} returns this current instance
     */
    connect: function (event, callback) {
      if(!this.events[event]) {
        return false;
      }

      this.observer.observe(event, callback);
      return this;
    },

    /**
     * remove all observers
     *
     * @return {followElement} returns this current instance
     */
    disconnect: function () {
      disconnectObservers.call(this);
      return this;
    },

    /**
     * Allows observing when the element of this instance is inserted on DOM.
     * When this element is inserted or the element is present in the DOM,
     * the callback function will be called.
     *
     * @param  {Function} callback Function to call when this event is triggered
     * @param  {String|ElementNode} context The context to start searching the element
     *
     * @return {followElement} returns this current instance
     */
    insert: function (callback, context) {
      this.observer.observe('insert', callback, context);
      return this;
    },

    /**
     * Allows observing when the element of this instance is removed from DOM.
     * The callback function will be called when this element is removed.
     *
     * @param  {Function} callback  Function to call when this event is triggered
     * @param  {String|ElementNode} context The context to start searching the element
     *
     * @return {followElement} returns this current instance
     */
    remove: function (callback, context) {
      this.observer.observe('remove', callback, context);
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
      this.observer.observe('appear', callback);
      return this;
    },

    /**
     * Observe when an element is hidden, that means, if it is display: none,
     * doesn't have content or width and height.
     *
     * @param  {Function} callback Function to call when this event is triggered
     *
     * @return {followElement} returns this current instance
     */
    disappear: function (callback) {
      this.observer.observe('disappear', callback);
      return this;
    },

    /**
     * Allows to pause all the current instance observers
     *
     * @return {followElement} returns this current instance
     */
    pause: function () {
      this.observer.paused = true;
      return this;
    },

    /**
     * Allows to resume all the current instance observers
     *
     * @return {followElement} returns this current instance
     */
    resume: function () {
      this.observer.paused = false;
      return this;
    },

    /**
     * Enable or disable the debug
     *
     * @return {followElement} returns this current instance
     */
    debug: function () {
      this._debug = !this._debug;
      return this;
    },

    /**
     * Set the main context to start searching an element
     * It will be used when an element is inserted or removed
     *
     * @param  {String|ElementNode} context The context to start the search for the element
     * @param  {String} type Type of context, like appear, disappear, inserted and removed
     *
     * @return {followElement} returns this current instance
     */
    setContext: function (context, type) {
      checkContext.call(this, context, type, true);
      return this;
    }
  };

  /**
   * validation for selector's context
   * it will validate if there is a context
   *
   * @param  {String|ElementNode} context context The context to start the search for the element
   * @param  {String} type Type of context, like appear, disappear, inserted and removed
   * @param  {Boolean} force Force a new context assigment
   *
   * @return {ElementNode} the current context
   */
  function checkContext(context, type, force) {
    var currentInstance = this;

    if(!context && !currentInstance.context) {
      throw new Error('You must define the "context" param');
    }

    if(typeof context !== 'undefined' && typeof type !== 'undefined' && force) {
      currentInstance.context = context;
    }

    if(context && context.nodeType !== 1) {
      context = util.find(context);
    }

    if(!currentInstance.context && context) {
      currentInstance.context = context;
    }

    return currentInstance.context;
  }

  /**
   * Disconnect all observers from this instance
   *
   */
  function disconnectObservers() {
    var currentInstance = this,
        styleElement = util.findAll('style.' + getStylesClass.call(currentInstance, currentInstance.selector));

    //disconnect the mutation observer
    if(currentInstance.observer._MutationObserverInstance) {
      currentInstance.observer._MutationObserverInstance.disconnect();
    }

    util.forEach.call(styleElement, function (element) {
      element.parentElement.removeChild(element);
    });

    currentInstance.observer.disconnected = true;
  }

  /**
   * Set a new observer and the properly methods and status
   *
   * @param  {String} selector Element selector
   *
   * @return {Object} Observer methods and status
   */
  function getObserver(selector) {
    var currentInstance = this,
        _observer;

    _observer = {
      appear: function () {
        appearedObserver.call(this, selector);
      },

      disappear: function () {
        checkDisappear.call(currentInstance);
      },

      insert: function (context) {
        context = checkContext.call(currentInstance, context, 'insert');
        insertObserver.call(currentInstance, context);
      },

      remove: function (context) {
        context = checkContext.call(currentInstance, context, 'remove');
        checkRemove.call(currentInstance, context);
      }
    };

    return {
      paused: false,

      observe: function (event, callback, context) {
        if(currentInstance.events[event]) {
          currentInstance.events[event].fn = callback;

          if(_observer[event]) {
            _observer[event].call(currentInstance, context);
          }
        }
      }

    };
  }

  /**
   * Verify if this element matches this current selector instance
   * and call the properly callback function using its type
   *
   * @param  {ElementNode} element Element to match
   * @param  {String} type Type of this request
   *
   * @return {Boolean} return true if element matches or false if doesn't
   */
  function elementMatch(element, type) {
    var currentInstance = this,
        currentType;

    if(currentInstance.observer.paused) {
      return false;
    }

    if (util.matches.call(element, currentInstance.selector)) {
      currentType = currentInstance.events[type];

      if(typeof currentType.fn === 'function') {

        if(!element.__followElement) {
          currentInstance.element.push(element);
          element.__followElement = true;
        }

        currentType.fn.call(currentInstance, element);
        currentType.count++;
        currentInstance.currentVisibility = type;

        if(currentInstance._debug) {
          console.log(logSignature(this.selector, type, 'this element has ' + currentType.action));
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Attaches a new instance of a dom mutation observer using fallbacks if it's necessary
   *
   * @param  {ElementNode} context context The context to start searching the element
   *
   */
  function insertObserver(context) {
    var currentInstance = this,
        currentElements = util.findAll(this.selector);

    util.forEach.call(currentElements, function (currentElement) {
      elementMatch.apply(currentInstance, [currentElement, 'insert']);
    });

    if(canIUseMutationObserver()) {
      currentInstance.observer._MutationObserverInstance = setMutationObserver.call(currentInstance, context);
    } else {
      currentInstance.observer._MutationObserverInstance = setMutationObserverFallback.call(currentInstance, context);
    }
  }

  /**
   * Create a new instance of dom mutation server
   *
   * @param {ElementNode} context context The context to start searching for the element
   *
   * @return {MutationObserver} New mutation observer instance
   */
  function setMutationObserver(context) {
    var currentInstance = this,
        MutationObserverInstance;

    MutationObserverInstance = new MutationObserver(function (mutations) {

      mutations.forEach(function(mutation) {
        util.forEach.call(mutation.addedNodes, function (node) {
          if(node.nodeType !== 1) {
            return;
          }

          elementMatch.apply(currentInstance, [node, 'insert']);
        });

        //On element removed
        util.forEach.call(mutation.removedNodes, function (node) {
          if(node.nodeType !== 1) {
            return;
          }

          if(currentInstance.observer._checkRemove) {
            elementMatch.apply(currentInstance, [node, 'remove']);
          }
        });
      });
    });

    MutationObserverInstance.observe(context, {
        childList: true
    });

    return MutationObserverInstance;
  }

  /**
   * Create a new instance of dom mutation observer using Mutation Events as fallback
   *
   * @param {ElementNode} context context The context to start searching for the element
   *
   * @return {MutationObserver} New mutation observer fallback instance
   */
  function setMutationObserverFallback(context) {
    var currentInstance = this,
        insertedListener = function (event) {
          var target = event.target;
          elementMatch.apply(currentInstance, [target, 'insert']);
        },
        removedListener = function (event) {
          var target = event.target;

          if(currentInstance.observer._checkRemove) {
            elementMatch.apply(currentInstance, [target, 'remove']);
          }
        };

    if(!currentInstance.observer._listeningDOMNodeInserted) {
      context.addEventListener('DOMNodeInserted', insertedListener);
      currentInstance.observer._listeningDOMNodeInserted = true;
    }

    if(!currentInstance.observer._listeningDOMNodeRemoved) {
      context.addEventListener('DOMNodeRemoved', removedListener);
      currentInstance.observer._listeningDOMNodeRemoved = true;
    }

    return {
      disconnect: function () {
        context.removeEventListener('DOMNodeInserted', insertedListener, false);
        context.removeEventListener('DOMNodeRemoved', removedListener, false);
      }
    };
  }

  /**
   * Check if MutationObserver exists in this browser
   *
   * @return {Boolean} Returns true if this browser supports this feature or false if it doesn't
   */
  function canIUseMutationObserver() {
    var canIUse = !!MutationObserver;

    //There is a issue with childList on iOS 6
    if(/(iPhone|iPad|iPod)\sOS\s6/.test(root.navigator.userAgent)) {
        canIUse = false;
    }

    return canIUse;
  }

  /**
   * It is a simple way to check whether an element has been appeared or not
   * using keyframes of css3.
   *
   * This technique was first outlined at [Back Alley Coder](http://www.backalleycoder.com/2012/04/25/i-want-a-damnodeinserted/)
   * and it has a better performance than using MutationEvents
   *
   * @param  {String} selector Element selector
   */
  function appearedObserver(selector) {
    var events = ['animationstart', 'webkitAnimationStart', 'oanimationstart', 'MSAnimationStart'],
        options = {
          keyframes: getKeyframeString(),
          selector: selector,
          stylesClass: getStylesClass.call(this, selector),
          styles: getAnimationNameString(selector)
        },
        head = util.find('head'),
        createElement = function (elementName, options) {
          var element = document.createElement(elementName);

          if(options) {

            if(options.className) {
              element.className += ' ' + options.className;
            }

            if(options.content) {
              element.innerText = options.content;
            }
          }

          return element;
        };

    // if the keyframes aren't present, add them in a style element
    if(!util.findAll("style.domnodeappear-keyframes").length) {
      head.appendChild(
          createElement('style', {
            className: 'domnodeappear-keyframes',
            content: options.keyframes
          })
      );
    }

    if(!util.findAll('style.' + options.stylesClass).length) {
      // add animation to selected element
      head.appendChild(
        createElement('style', {
          className: options.stylesClass,
          content: options.styles
        })
      );
    }

    if(!cssObserverStarted) {
      util.forEach.call(events, function (eventName) {

        // on animation start, execute the callback
        document.addEventListener(eventName, function (event) {
          var element = event.target;

          if(event.animationName !== 'elementAppeared') {
            return;
          }

          util.forEach.call(instances, function (instance) {
            if(!elementIsHidden(element)) {
              elementMatch.apply(instance, [element, 'appear']);
            }

            //This is the element that we want
            if(util.matches.call(element, instance.selector)) {

              //Only start the disappear observer if this element has appeared
              //and this instance wants to be notified when this element disappear
              if(instance.observer._checkDisappear && instance.events.appear.count) {
                disappearedObserver.call(instance, element);
              }
            }
          });

        }, false);
      });

      cssObserverStarted = true;
    }
  }

   /**
   * Ccheck if the element of this instance has been removed
   *
   */
  function checkRemove() {
    var instance = this;

    instance.observer._checkRemove = true;
  }

  /**
   * Check if the element of this instance has been disappeared
   */
  function checkDisappear() {
    var instance = this;

    instance.observer._checkDisappear = true;
  }

  /**
   * Check if the element of this instance is still visible
   *
   * @param  {ElementNode} element Element to check
   */
  function disappearedObserver(element) {
    var instance = this,
        timeoutId,
        timeoutTime = 160;

    timeoutId = setTimeout(function checkVisibility() {
      if(elementIsHidden(element)) {
        clearTimeout(timeoutId);

        elementMatch.apply(instance, [element, 'disappear']);
        return;
      }

      setTimeout(checkVisibility, timeoutTime);
    }, timeoutTime);
  }

  /**
   * Check if this element is not visible
   *
   * @param  {ElementNode} element Element to check
   * @return {Boolean}  returns true or false depending of its visibility
   */
  function elementIsHidden(element) {
    return element !== null
          && (element.offsetWidth === 0 && element.offsetHeight === 0)
          || element.offsetParent === null;
  }

  /**
   * css3 keyframe string
   *
   * It's for the appeared observer
   *
   * @return {String} new keyframe string
   */
  function getKeyframeString() {
    var baseKeyframe = ' elementAppeared { from { outline: 1px solid transparent; }' +
                                        '  to { outline: 0px solid transparent; } }',
        keyframeString = '';

    util.forEach.call(['@keyframes', '@-moz-keyframes', '@-webkit-keyframes', '@-ms-keyframes', '@-o-keyframes'],
      function (prefix) {
        keyframeString += prefix + baseKeyframe + ' ';
      });

    return keyframeString;
  }

  /**
   * Class for style element
   *
   * @param  {String} selector Selector of the element
   *
   * @return {String} new class of element selector
   */
  function getStylesClass(selector) {
    return selector.replace(".", "") + '-animation-' + this.instanceIndex;
  }

  /**
   * Css3 animation string
   *
   * @param  {String} selector Selector of the element
   *
   * @return {String} new css3 animation string
   */
  function getAnimationNameString(selector) {
    return selector + ' { animation-name: elementAppeared;' +
             '-webkit-animation-name: elementAppeared;' +
             'animation-duration: 0.001s;' +
             '-webkit-animation-duration: 0.001s; }';
  }

  /**
   * Simple signature for logs
   *
   * @param  {String} selector The selector
   * @param  {String} type     The type of this log, like appear or inserted
   * @param  {String} message  The message of this log
   *
   * @return {String}          Returns a new formatted log string
   */
  function logSignature(selector, type, message) {
    return '##VisibilityObserver##\n\n'
         + 'Selector = ' + selector + '\n'
         + 'Action = ' + type + ' \n\n'
         + 'Message = '  + message;
  }

  // Version
  followElement.version = '0.0.0';

  // Export to the root, which is probably `window`
  root.followElement = followElement;

}(this));
